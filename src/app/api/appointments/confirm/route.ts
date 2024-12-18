// src/app/api/appointments/confirm/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // Extraemos los datos de la solicitud
    const data = await request.json()
    
    // Verificamos que tengamos todos los datos necesarios
    if (!data.slotId || !data.reason) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Utilizamos una transacción para asegurar la integridad de los datos
    // Esto es importante porque necesitamos realizar varias operaciones que deben ser atómicas
    const result = await prisma.$transaction(async (prisma) => {
      // Primero, verificamos que el horario siga disponible
      const slot = await prisma.timeSlot.findUnique({
        where: {
          id: data.slotId,
          available: true
        },
        include: {
          doctor: true
        }
      })

      // Si el horario no existe o ya no está disponible, lanzamos un error
      if (!slot) {
        throw new Error('El horario seleccionado ya no está disponible')
      }

      // Creamos la cita en la base de datos
      const appointment = await prisma.appointment.create({
        data: {
          slotId: data.slotId,
          // En una implementación real, obtendríamos el userId del sistema de autenticación
          patientId: 'user-id',
          reason: data.reason,
          isFirstVisit: data.isFirstVisit,
          status: 'scheduled',
          emergencyContact: {
            create: {
              name: data.emergencyContact.name,
              phone: data.emergencyContact.phone
            }
          },
          additionalDetails: {
            hasRecentStudies: data.hasRecentStudies,
            studiesDescription: data.studiesDescription,
            specialRequirements: data.specialRequirements
          }
        }
      })

      // Marcamos el horario como no disponible
      await prisma.timeSlot.update({
        where: { id: data.slotId },
        data: { available: false }
      })

      // Creamos una notificación de confirmación
      await prisma.notification.create({
        data: {
          type: 'appointment_confirmation',
          recipientId: 'user-id',
          title: 'Cita confirmada',
          message: `Tu cita con ${slot.doctor.name} ha sido confirmada para el ${
            new Date(slot.date).toLocaleDateString()
          } a las ${slot.startTime}`,
          metadata: {
            appointmentId: appointment.id,
            doctorName: slot.doctor.name,
            date: slot.date,
            time: slot.startTime
          }
        }
      })

      // También creamos un recordatorio programado
      await prisma.notification.create({
        data: {
          type: 'appointment_reminder',
          recipientId: 'user-id',
          title: 'Recordatorio de cita',
          message: `Recuerda tu cita con ${slot.doctor.name} mañana a las ${slot.startTime}`,
          scheduledFor: new Date(new Date(slot.date).getTime() - 24 * 60 * 60 * 1000), // 24 horas antes
          metadata: {
            appointmentId: appointment.id,
            doctorName: slot.doctor.name,
            date: slot.date,
            time: slot.startTime
          }
        }
      })

      return {
        appointment,
        doctorName: slot.doctor.name,
        date: slot.date,
        time: slot.startTime
      }
    })

    // Enviamos la confirmación al cliente
    return NextResponse.json({
      success: true,
      message: 'Cita confirmada exitosamente',
      data: result
    })

  } catch (error) {
    console.error('Error en la confirmación de cita:', error)
    
    // Manejamos diferentes tipos de errores
    if (error instanceof Error) {
      if (error.message === 'El horario seleccionado ya no está disponible') {
        return NextResponse.json(
          { 
            error: error.message,
            code: 'SLOT_UNAVAILABLE'
          },
          { status: 409 } // Conflict
        )
      }
    }

    // Error genérico para cualquier otro caso
    return NextResponse.json(
      { 
        error: 'Error al procesar la confirmación',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}