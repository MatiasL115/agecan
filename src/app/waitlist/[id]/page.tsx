// src/app/waitlist/[id]/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos una interfaz detallada para una entrada de la lista de espera
interface DetailedWaitlistEntry {
  id: string
  patientName: string
  contactEmail: string | null
  contactPhone: string | null
  status: string
  urgencyLevel: string
  requestDate: string
  preferredTimeRanges: {
    startTime: string
    endTime: string
  }[]
  lastContactAttempt: string | null
  contactAttempts: number
  notes: string | null
  internalNotes: string | null
  statusHistory: {
    status: string
    timestamp: string
    notes?: string
  }[]
}

export default function WaitlistEntryDetail({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Estados para manejar los datos y la edición
  const [entry, setEntry] = useState<DetailedWaitlistEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState('')
  const { showToast } = useToast()

  // Cargamos los datos de la entrada específica
  useEffect(() => {
    loadEntryDetails()
  }, [params.id])

  const loadEntryDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/waitlist/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Error cargando los detalles')
      }

      const data = await response.json()
      setEntry(data.entry)
      setEditedNotes(data.entry.internalNotes || '')
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar los detalles. Por favor, intente nuevamente.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para actualizar el estado de la entrada
  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/waitlist/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: editedNotes
        })
      })

      if (!response.ok) {
        throw new Error('Error actualizando el estado')
      }

      showToast({
        title: "Éxito",
        message: "Estado actualizado correctamente",
        type: "success"
      })

      // Recargamos los detalles para mostrar los cambios
      loadEntryDetails()
      setIsEditing(false)
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo actualizar el estado",
        type: "error"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando detalles...</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              No se encontró la entrada solicitada
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formateamos la fecha para mostrarla de manera amigable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Encabezado con información principal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{entry.patientName}</CardTitle>
              <p className="text-sm text-gray-600">
                En lista desde: {formatDate(entry.requestDate)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              entry.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
              entry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
              entry.status === 'scheduled' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {entry.status}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Detalles de contacto */}
      <Card>
        <CardHeader>
          <CardTitle>Información de contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entry.contactEmail && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{entry.contactEmail}</p>
              </div>
            )}
            {entry.contactPhone && (
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{entry.contactPhone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Horarios preferidos */}
      <Card>
        <CardHeader>
          <CardTitle>Horarios preferidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {entry.preferredTimeRanges.map((range, index) => (
              <div key={index} className="flex space-x-4">
                <span className="font-medium">{range.startTime}</span>
                <span>a</span>
                <span className="font-medium">{range.endTime}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historial de contactos y notas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial y notas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Intentos de contacto */}
            <div>
              <p className="text-sm text-gray-600">Intentos de contacto</p>
              <p className="font-medium">
                {entry.contactAttempts} intentos
                {entry.lastContactAttempt && 
                  ` (Último: ${formatDate(entry.lastContactAttempt)})`
                }
              </p>
            </div>

            {/* Notas públicas */}
            {entry.notes && (
              <div>
                <p className="text-sm text-gray-600">Notas del paciente</p>
                <p className="mt-1">{entry.notes}</p>
              </div>
            )}

            {/* Notas internas */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">Notas internas</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
              {isEditing ? (
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p className="mt-1">{entry.internalNotes || 'Sin notas internas'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones disponibles */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="font-medium mb-2">Acciones disponibles</p>
            <div className="flex flex-wrap gap-2">
              {entry.status === 'waiting' && (
                <Button
                  onClick={() => updateStatus('contacted')}
                >
                  Marcar como contactado
                </Button>
              )}
              {entry.status === 'contacted' && (
                <Button
                  onClick={() => updateStatus('scheduled')}
                >
                  Marcar como agendado
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => updateStatus('cancelled')}
              >
                Cancelar entrada
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entry.statusHistory.map((history, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
                <div>
                  <p className="font-medium">{history.status}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(history.timestamp)}
                  </p>
                  {history.notes && (
                    <p className="text-sm mt-1">{history.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}