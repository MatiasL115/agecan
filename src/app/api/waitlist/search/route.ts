// src/app/api/waitlist/search/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Extraemos los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url)
    
    // Construimos los filtros de manera dinámica
    const filters = {
      // Si existe status en los parámetros, lo incluimos en el filtro
      ...(searchParams.get('status') && {
        status: searchParams.get('status')
      }),
      // Filtramos por nivel de urgencia si se especifica
      ...(searchParams.get('urgencyLevel') && {
        urgencyLevel: searchParams.get('urgencyLevel')
      }),
      // Búsqueda por nombre de paciente usando 'contains' para búsqueda parcial
      ...(searchParams.get('patientName') && {
        patientName: {
          contains: searchParams.get('patientName'),
          mode: 'insensitive' // Hace la búsqueda sin distinguir mayúsculas/minúsculas
        }
      })
    }

    // Realizamos la búsqueda en la base de datos con los filtros construidos
    const entries = await prisma.waitlistEntry.findMany({
      where: filters,
      // Ordenamos los resultados por fecha y nivel de urgencia
      orderBy: [
        { urgencyLevel: 'desc' }, // Primero los más urgentes
        { requestDate: 'asc' }    // Luego los más antiguos
      ],
      // Incluimos un límite por seguridad y rendimiento
      take: 50
    })

    // Obtenemos también el total de registros para paginación
    const total = await prisma.waitlistEntry.count({
      where: filters
    })

    // Retornamos tanto los resultados como el total
    return NextResponse.json({
      entries,
      total,
      // Incluimos metadatos útiles para el frontend
      metadata: {
        filters: Object.keys(filters).length > 0 ? filters : 'none',
        resultCount: entries.length,
      }
    })

  } catch (error) {
    console.error('Error en la búsqueda:', error)
    return NextResponse.json(
      { error: 'Error al procesar la búsqueda' },
      { status: 500 }
    )
  }
}