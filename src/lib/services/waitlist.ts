import { WaitlistEntry, TimeRange } from '../types/waitlist'
  import { NotificationService } from './notifications'
  import prisma from '../prisma'
  
  export class WaitlistService {
    private static instance: WaitlistService
    private notificationService: NotificationService
  
    private constructor() {
      this.notificationService = NotificationService.getInstance()
    }
  
    static getInstance(): WaitlistService {
      if (!WaitlistService.instance) {
        WaitlistService.instance = new WaitlistService()
      }
      return WaitlistService.instance
    }
  
    async createEntry(data: Omit<WaitlistEntry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'contactAttempts'>) {
      return await prisma.$transaction(async (prisma) => {
        const entry = await prisma.waitlistEntry.create({
          data: {
            ...data,
            status: 'waiting',
            contactAttempts: 0
          }
        })
  
        await this.notificationService.createNotification({
          type: 'waitlist_update',
          recipientId: entry.id,
          message: 'Tu solicitud ha sido registrada exitosamente en nuestra lista de espera.',
          priority: 'normal',
          metadata: {
            patientName: entry.patientName,
            requestDate: entry.requestDate
          },
          scheduledFor: new Date()
        })
  
        return entry
      })
    }
  
    async updateEntry(id: string, data: Partial<WaitlistEntry>) {
      return await prisma.$transaction(async (prisma) => {
        const existingEntry = await prisma.waitlistEntry.findUnique({
          where: { id }
        })
  
        if (!existingEntry) {
          throw new Error('Entry not found')
        }
  
        const updatedEntry = await prisma.waitlistEntry.update({
          where: { id },
          data: {
            ...data,
            ...(data.status && {
              statusChangedAt: new Date(),
              lastContactAttempt: data.status === 'contacted' ? new Date() : undefined,
              contactAttempts: data.status === 'contacted' ? {
                increment: 1
              } : undefined
            })
          }
        })
  
        if (data.status && data.status !== existingEntry.status) {
          const config = NOTIFICATION_CONFIG.statusChanges[data.status]
          if (config) {
            await this.notificationService.createNotification({
              type: 'status_change',
              recipientId: id,
              message: config.message,
              priority: config.priority,
              metadata: {
                previousStatus: existingEntry.status,
                newStatus: data.status,
                patientName: updatedEntry.patientName,
                statusChangedAt: new Date()
              },
              scheduledFor: config.delayMinutes 
                ? new Date(Date.now() + config.delayMinutes * 60 * 1000)
                : new Date()
            })
          }
        }
  
        return updatedEntry
      })
    }
  
    async findMatchingEntries(availableTimeRanges: TimeRange[]) {
      // Implementación de la búsqueda de coincidencias
      const matches = await prisma.waitlistEntry.findMany({
        where: {
          status: 'waiting',
          // Aquí implementaríamos la lógica para verificar coincidencias de horarios
        },
        take: 5
      })
  
      for (const match of matches) {
        await this.notificationService.createNotification({
          type: 'appointment_available',
          recipientId: match.id,
          message: 'Se ha liberado un horario que coincide con tus preferencias.',
          priority: 'high',
          metadata: {
            patientName: match.patientName,
            availableTimeRanges
          },
          scheduledFor: new Date()
        })
      }
  
      return matches
    }
  
    async searchEntries(filters: {
      status?: string
      urgencyLevel?: string
      patientName?: string
    }) {
      return await prisma.waitlistEntry.findMany({
        where: {
          ...filters,
          ...(filters.patientName && {
            patientName: {
              contains: filters.patientName,
              mode: 'insensitive'
            }
          })
        },
        orderBy: [
          { urgencyLevel: 'desc' },
          { requestDate: 'asc' }
        ]
      })
    }
  }
  


 