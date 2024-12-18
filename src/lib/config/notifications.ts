export const NOTIFICATION_CONFIG = {
    statusChanges: {
      'contacted': {
        message: "Un representante ha intentado contactarte. Por favor, espera su llamada.",
        priority: 'normal' as const,
        delayMinutes: 15
      },
      'scheduled': {
        message: "¡Buenas noticias! Se ha liberado un turno que coincide con tus preferencias.",
        priority: 'high' as const,
        delayMinutes: 0
      },
      'cancelled': {
        message: "Tu solicitud en la lista de espera ha sido cancelada.",
        priority: 'high' as const,
        delayMinutes: 0
      },
      'expired': {
        message: "Tu solicitud en la lista de espera ha expirado. Por favor, crea una nueva solicitud si aún necesitas una cita.",
        priority: 'normal' as const,
        delayMinutes: 0
      }
    },
    retryAttempts: 3,
    retryDelayMinutes: 5,
    defaultExpirationDays: 30
  }
  
 