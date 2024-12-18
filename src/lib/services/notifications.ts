import { Notification, NotificationStatus } from '../types/notification'
  import prisma from '../prisma'
  import { NOTIFICATION_CONFIG } from '../config/notifications'
  
  export class NotificationService {
    private static instance: NotificationService
    
    private constructor() {}
  
    static getInstance(): NotificationService {
      if (!NotificationService.instance) {
        NotificationService.instance = new NotificationService()
      }
      return NotificationService.instance
    }
  
    async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'status' | 'sentAt'>) {
      const notification = await prisma.notification.create({
        data: {
          ...data,
          status: 'pending'
        }
      })
  
      if (data.priority === 'high') {
        await this.sendNotification(notification.id)
      }
  
      return notification
    }
  
    async sendNotification(notificationId: string) {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
      })
  
      if (!notification || notification.status === 'sent') {
        return
      }
  
      try {
        // Intentamos enviar la notificación
        await this.sendToAppropriateChannel(notification)
  
        // Actualizamos el estado
        await prisma.notification.update({
          where: { id: notificationId },
          data: {
            status: 'sent',
            sentAt: new Date()
          }
        })
      } catch (error) {
        console.error('Error sending notification:', error)
  
        const failedAttempts = notification.metadata?.attempts || 0
        
        if (failedAttempts < NOTIFICATION_CONFIG.retryAttempts) {
          // Programamos un reintento
          await prisma.notification.update({
            where: { id: notificationId },
            data: {
              status: 'pending',
              scheduledFor: new Date(Date.now() + NOTIFICATION_CONFIG.retryDelayMinutes * 60 * 1000),
              metadata: {
                ...notification.metadata,
                attempts: failedAttempts + 1,
                lastError: error.message
              }
            }
          })
        } else {
          // Marcamos como fallida después de varios intentos
          await prisma.notification.update({
            where: { id: notificationId },
            data: {
              status: 'failed',
              error: error.message
            }
          })
        }
      }
    }
  
    private async sendToAppropriateChannel(notification: Notification) {
      // Aquí implementaríamos la lógica para diferentes canales
      switch (notification.type) {
        case 'waitlist_update':
          await this.sendEmail(notification)
          break
        case 'appointment_available':
          await Promise.all([
            this.sendEmail(notification),
            this.sendSMS(notification)
          ])
          break
        case 'contact_reminder':
          await this.sendInternalNotification(notification)
          break
        default:
          await this.sendEmail(notification)
      }
    }
  
    private async sendEmail(notification: Notification) {
      // Implementación del envío de email
      console.log('Sending email:', notification)
    }
  
    private async sendSMS(notification: Notification) {
      // Implementación del envío de SMS
      console.log('Sending SMS:', notification)
    }
  
    private async sendInternalNotification(notification: Notification) {
      // Implementación de notificaciones internas
      console.log('Sending internal notification:', notification)
    }
  }
  
