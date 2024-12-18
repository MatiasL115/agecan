// src/lib/notifications.ts
// Esta será nuestra biblioteca central para manejar notificaciones
export type NotificationType = 
  | 'waitlist_update'    // Cuando cambia el estado en lista de espera
  | 'appointment_available' // Cuando se libera un turno
  | 'contact_reminder'    // Recordatorio para contactar al paciente
  | 'status_change'      // Cambios generales de estado

export interface Notification {
  id: string
  type: NotificationType
  recipientId: string
  message: string
  metadata: any
  status: 'pending' | 'sent' | 'failed'
  createdAt: Date
  scheduledFor?: Date
}

// Vamos a crear primero el schema en Prisma para las notificaciones
// src/prisma/schema.prisma (añadir al archivo existente)

model Notification {
  id          String   @id @default(cuid())
  type        String
  recipientId String
  message     String
  metadata    Json?
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  scheduledFor DateTime?
  sentAt      DateTime?

  @@map("notifications")
}

// src/app/api/notifications/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validamos los datos requeridos
    if (!data.recipientId || !data.message || !data.type) {
      return NextResponse.json({ 
        error: "Faltan datos requeridos" 
      }, { status: 400 })
    }

    // Creamos la notificación en la base de datos
    const notification = await prisma.notification.create({
      data: {
        type: data.type,
        recipientId: data.recipientId,
        message: data.message,
        metadata: data.metadata || {},
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null
      }
    })

    // Si la notificación debe enviarse inmediatamente
    if (!notification.scheduledFor) {
      await sendNotification(notification)
    }

    return NextResponse.json({ 
      success: true, 
      notification 
    })

  } catch (error) {
    console.error('Error al crear notificación:', error)
    return NextResponse.json({ 
      error: "Error al procesar la notificación" 
    }, { status: 500 })
  }
}

// src/lib/notifications/sender.ts
// Este es nuestro sistema para enviar notificaciones a través de diferentes canales
async function sendNotification(notification: Notification) {
  try {
    // Dependiendo del tipo de notificación, usamos diferentes canales
    switch (notification.type) {
      case 'waitlist_update':
        await sendEmailNotification(notification)
        break
      case 'appointment_available':
        // Para notificaciones urgentes usamos múltiples canales
        await Promise.all([
          sendEmailNotification(notification),
          sendSMSNotification(notification)
        ])
        break
      case 'contact_reminder':
        await sendInternalNotification(notification)
        break
    }

    // Actualizamos el estado de la notificación
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    })

  } catch (error) {
    console.error('Error enviando notificación:', error)
    // Marcamos la notificación como fallida pero la mantenemos para reintentos
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: 'failed'
      }
    })
    throw error
  }
}

// Funciones auxiliares para diferentes tipos de envío
async function sendEmailNotification(notification: Notification) {
  // Aquí implementaríamos la integración con un servicio de email como SendGrid
  console.log('Enviando email:', notification)
}

async function sendSMSNotification(notification: Notification) {
  // Aquí implementaríamos la integración con un servicio de SMS como Twilio
  console.log('Enviando SMS:', notification)
}

async function sendInternalNotification(notification: Notification) {
  // Notificaciones internas para el personal médico/administrativo
  console.log('Enviando notificación interna:', notification)
}