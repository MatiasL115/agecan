// src/app/waitlist/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos los tipos que vamos a recibir del backend
interface WaitlistEntry {
  id: string
  patientName: string
  contactEmail: string | null
  contactPhone: string | null
  status: string
  requestDate: string
  urgencyLevel: string
  preferredTimeRanges: {
    startTime: string
    endTime: string
  }[]
  lastContactAttempt: string | null
  contactAttempts: number
  notes: string | null
  internalNotes: string | null
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  // Función para cargar los datos de la lista de espera
  const loadWaitlistEntries = async () => {
    try {
      const response = await fetch('/api/waitlist')
      if (!response.ok) {
        throw new Error('Error cargando la lista de espera')
      }
      const data = await response.json()
      setEntries(data.entries)
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar los datos. Por favor, intente nuevamente.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cargamos los datos cuando el componente se monta
  useEffect(() => {
    loadWaitlistEntries()
  }, [])

  // Función para actualizar el estado de una entrada
  const updateEntryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Error actualizando el estado')
      }

      // Recargamos la lista para mostrar los cambios
      loadWaitlistEntries()

      showToast({
        title: "Éxito",
        message: "Estado actualizado correctamente",
        type: "success"
      })
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo actualizar el estado. Por favor, intente nuevamente.",
        type: "error"
      })
    }
  }

  // Función para formatear fechas de manera legible
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando lista de espera...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Panel de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total en espera</p>
              <p className="text-3xl font-bold">
                {entries.filter(e => e.status === 'waiting').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Alta prioridad</p>
              <p className="text-3xl font-bold text-red-600">
                {entries.filter(e => e.urgencyLevel === 'high').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Contactados hoy</p>
              <p className="text-3xl font-bold text-blue-600">
                {entries.filter(e => {
                  if (!e.lastContactAttempt) return false
                  const today = new Date()
                  const contactDate = new Date(e.lastContactAttempt)
                  return contactDate.toDateString() === today.toDateString()
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de entradas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Espera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No hay pacientes en lista de espera
              </p>
            ) : (
              entries.map(entry => (
                <div
                  key={entry.id}
                  className={`p-4 border rounded-lg ${
                    entry.urgencyLevel === 'high' ? 'border-l-4 border-l-red-500' :
                    entry.urgencyLevel === 'medium' ? 'border-l-4 border-l-yellow-500' :
                    'border-l-4 border-l-blue-500'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">{entry.patientName}</h3>
                      <p className="text-sm text-gray-600">
                        En espera desde: {formatDate(entry.requestDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Contacto</p>
                      <p>{entry.contactPhone || entry.contactEmail}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                        entry.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                        entry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        entry.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="flex justify-end space-x-2">
                      {entry.status === 'waiting' && (
                        <Button
                          size="sm"
                          onClick={() => updateEntryStatus(entry.id, 'contacted')}
                        >
                          Marcar contactado
                        </Button>
                      )}
                      {entry.status === 'contacted' && (
                        <Button
                          size="sm"
                          onClick={() => updateEntryStatus(entry.id, 'scheduled')}
                        >
                          Marcar agendado
                        </Button>
                      )}
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Notas:</p>
                      <p>{entry.notes}</p>
                    </div>
                  )}

                  {entry.lastContactAttempt && (
                    <div className="mt-2 text-sm text-gray-500">
                      Último contacto: {formatDate(entry.lastContactAttempt)} 
                      ({entry.contactAttempts} intentos)
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}