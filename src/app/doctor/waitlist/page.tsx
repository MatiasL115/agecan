// src/app/doctor/waitlist/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos la estructura de los datos para la lista de espera
interface WaitlistEntry {
  id: string
  patientName: string
  requestDate: string
  preferredTimeRanges: {
    startTime: string
    endTime: string
  }[]
  urgency: 'high' | 'medium' | 'low'
  contactPreference: 'phone' | 'email' | 'both'
  contactInfo: {
    phone?: string
    email?: string
  }
  notes: string
  status: 'waiting' | 'contacted' | 'scheduled' | 'cancelled'
  lastContactAttempt?: string
}

export default function WaitlistPage() {
  const { showToast } = useToast()

  // Estado para la lista de espera
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([
    {
      id: '1',
      patientName: 'María García',
      requestDate: '2024-12-01',
      preferredTimeRanges: [
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '15:00', endTime: '17:00' }
      ],
      urgency: 'medium',
      contactPreference: 'both',
      contactInfo: {
        phone: '555-0123',
        email: 'maria@ejemplo.com'
      },
      notes: 'Prefiere horario matutino si es posible',
      status: 'waiting',
      lastContactAttempt: '2024-12-03'
    }
  ])

  // Función para manejar la asignación de citas desde la lista de espera
  const handleScheduleFromWaitlist = async (entryId: string) => {
    try {
      // En una implementación real, aquí se conectaría con el sistema de agendamiento
      showToast({
        title: "Cita agendada",
        message: "El paciente ha sido notificado de su nueva cita",
        type: "success"
      })
      
      // Actualizamos el estado local
      setWaitlistEntries(entries =>
        entries.map(entry =>
          entry.id === entryId
            ? { ...entry, status: 'scheduled' }
            : entry
        )
      )
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo agendar la cita. Por favor intente nuevamente",
        type: "error"
      })
    }
  }

  // Función para registrar un intento de contacto
  const recordContactAttempt = (entryId: string) => {
    setWaitlistEntries(entries =>
      entries.map(entry =>
        entry.id === entryId
          ? { 
              ...entry, 
              status: 'contacted',
              lastContactAttempt: new Date().toISOString().split('T')[0]
            }
          : entry
      )
    )

    showToast({
      title: "Contacto registrado",
      message: "El intento de contacto ha sido registrado exitosamente",
      type: "success"
    })
  }

  // Calculamos algunas estadísticas útiles para el resumen
  const waitlistStats = {
    total: waitlistEntries.length,
    highUrgency: waitlistEntries.filter(e => e.urgency === 'high').length,
    waiting: waitlistEntries.filter(e => e.status === 'waiting').length,
    contacted: waitlistEntries.filter(e => e.status === 'contacted').length
  }

  return (
    <div className="space-y-6">
      {/* Panel de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total en lista</p>
              <p className="text-3xl font-bold">{waitlistStats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Alta urgencia</p>
              <p className="text-3xl font-bold text-red-600">
                {waitlistStats.highUrgency}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">En espera</p>
              <p className="text-3xl font-bold text-yellow-600">
                {waitlistStats.waiting}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Contactados</p>
              <p className="text-3xl font-bold text-blue-600">
                {waitlistStats.contacted}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista principal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Espera</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                Exportar lista
              </Button>
              <Button>
                Agregar paciente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {waitlistEntries.map(entry => (
              <div
                key={entry.id}
                className={`p-4 border rounded-lg ${
                  entry.urgency === 'high' ? 'border-l-4 border-l-red-500' :
                  entry.urgency === 'medium' ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-blue-500'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium">{entry.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      En espera desde: {new Date(entry.requestDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Horarios preferidos:</p>
                    <div className="space-y-1">
                      {entry.preferredTimeRanges.map((range, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {range.startTime} - {range.endTime}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => recordContactAttempt(entry.id)}
                      disabled={entry.status === 'scheduled'}
                    >
                      Registrar contacto
                    </Button>
                    <Button
                      onClick={() => handleScheduleFromWaitlist(entry.id)}
                      disabled={entry.status === 'scheduled'}
                    >
                      Agendar cita
                    </Button>
                  </div>
                </div>

                {entry.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium">Notas:</p>
                    <p>{entry.notes}</p>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      entry.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      entry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      entry.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status === 'waiting' ? 'En espera' :
                       entry.status === 'contacted' ? 'Contactado' :
                       entry.status === 'scheduled' ? 'Agendado' :
                       'Cancelado'}
                    </span>
                    {entry.lastContactAttempt && (
                      <span className="text-sm text-gray-500">
                        Último contacto: {new Date(entry.lastContactAttempt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Contactar por: {
                      entry.contactPreference === 'both' ? 'Teléfono o Email' :
                      entry.contactPreference === 'phone' ? 'Teléfono' : 'Email'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}