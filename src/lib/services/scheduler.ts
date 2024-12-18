export class SchedulerService {
    private static instance: SchedulerService
    private notificationService: NotificationService
  
    private constructor() {
      this.notificationService = NotificationService.getInstance()
      this.initializeScheduler()
    }
  
    static getInstance(): SchedulerService {
      if (!SchedulerService.instance) {
        SchedulerService.instance = new SchedulerService()
      }
      return SchedulerService.instance
    }
  
    private async initializeScheduler() {
      // Iniciamos los trabajos programados
      setInterval(async () => {
        await this.processPendingNotifications()
        await this.checkExpiredEntries()
      }, 60000) // Ejecutar cada minuto
    }
  
    private async processPendingNotifications() {
      try {
        const pendingNotifications = await prisma.notification.findMany({
          where: {
            status: 'pending',
            scheduledFor: {
              lte: new Date()
            }
          }
        })
  
        for (const notification of pendingNotifications) {
          await this.notificationService.sendNotification(notification.id)
        }
      } catch (error) {
        console.error('Error processing pending notifications:', error)
      }
    }
  
    private async checkExpiredEntries() {
      try {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() - NOTIFICATION_CONFIG.defaultExpirationDays)
  
        const expiredEntries = await prisma.waitlistEntry.findMany({
          where: {
            status: 'waiting',
            requestDate: {
              lt: expirationDate
            }
          }
        })
  
        for (const entry of expiredEntries) {
          await prisma.$transaction(async (prisma) => {
            // Actualizamos el estado de la entrada
            await prisma.waitlistEntry.update({
              where: { id: entry.id },
              data: {
                status: 'expired',
                statusChangedAt: new Date()
              }
            })
  
            // Creamos una notificación de expiración
            await prisma.notification.create({
              data: {
                type: 'status_change',
                recipientId: entry.id,
                message: NOTIFICATION_CONFIG.statusChanges.expired.message,
                priority: NOTIFICATION_CONFIG.statusChanges.expired.priority,
                scheduledFor: new Date(),
                metadata: {
                  patientName: entry.patientName,
                  requestDate: entry.requestDate,
                  expirationDate: new Date()
                }
              }
            })
          })
        }
      } catch (error) {
        console.error('Error checking expired entries:', error)
      }
    }
  }
  


  