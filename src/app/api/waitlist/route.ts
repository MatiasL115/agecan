// src/app/api/waitlist/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Creamos un nuevo registro en la lista de espera
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        patientName: data.patientName,
        contactEmail: data.contactInfo?.email,
        contactPhone: data.contactInfo?.phone,
        preferredTimeRanges: data.preferredTimeRanges,
        notes: data.notes
      }
    })

    return NextResponse.json({ 
      success: true,
      entry: waitlistEntry 
    })

  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Obtenemos todas las entradas de la lista de espera
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: {
        requestDate: 'desc'
      }
    })

    return NextResponse.json({ entries })
    
  } catch (error) {
    console.error('Error al obtener registros:', error)
    return NextResponse.json(
      { error: 'Error al obtener los datos' },
      { status: 500 }
    )
  }
}