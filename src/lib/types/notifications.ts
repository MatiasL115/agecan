export interface Notification {
    id: string
    type: NotificationType
    recipientId: string
    message: string
    priority: NotificationPriority
    metadata: Record<string, any>
    status: NotificationStatus
    createdAt: Date
    scheduledFor: Date | null
    sentAt: Date | null
  }
  
  export type NotificationType =
    | 'waitlist_update'
    | 'appointment_available'
    | 'contact_reminder'
    | 'status_change'
  
  export type NotificationPriority = 'low' | 'normal' | 'high'
  
  export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'cancelled'