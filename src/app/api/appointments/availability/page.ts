// src/app/api/appointments/availability/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Fecha requerida' },
        { status: 400 }
      )
    }

    // Buscamos los horarios disponibles para la fecha seleccionada
    const slots = await prisma.timeSlot.findMany({
      where: {
        date: new Date(date),
        available: true
      },
      include: {
        doctor: true
      }
    })

    // Organizamos los slots por fecha
    const organizedSlots = [{
      date,
      slots: slots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: slot.available,
        doctorId: slot.doctorId,
        doctorName: slot.doctor.name
      }))
    }]

    return NextResponse.json({ slots: organizedSlots })

  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}