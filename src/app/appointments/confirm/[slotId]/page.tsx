// src/app/appointments/confirm/[slotId]/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation'

interface AppointmentDetails {
  slotId: string
  doctorName: string
  specialty: string
  date: string
  startTime: string
  endTime: string
}

interface ConfirmationForm {
  reason: string
  isFirstVisit: boolean
  hasRecentStudies: boolean
  studiesDescription?: string
  specialRequirements?: string
  emergencyContact: {
    name: string
    phone: string
  }
}

export default function AppointmentConfirmationPage({
  params
}: {
  params: { slotId: string }
}) {
  // Estados para manejar los datos y el proceso de confirmación
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null)
  const [formData, setFormData] = useState<ConfirmationForm>({
    reason: '',
    isFirstVisit: false,
    hasRecentStudies: false,
    emergencyContact: {
      name: '',
      phone: ''
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { showToast } = useToast()
  const router = useRouter()

  // Cargamos los detalles del horario seleccionado
  useEffect(() => {
    loadAppointmentDetails()
  }, [params.slotId])

  const loadAppointmentDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/appointments/slots/${params.slotId}`)
      
      if (!response.ok) {
        throw new Error('Error cargando detalles del horario')
      }

      const data = await response.json()
      setAppointmentDetails(data)
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar los detalles del horario",
        type: "error"
      })
      // Redirigimos al usuario de vuelta a la selección de horarios
      router.push('/appointments')
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar la confirmación de la cita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validamos que tengamos todos los datos necesarios
      if (!appointmentDetails) throw new Error('No hay detalles de la cita')
      if (!formData.reason.trim()) throw new Error('El motivo de la consulta es requerido')
      if (!formData.emergencyContact.name.trim() || !formData.emergencyContact.phone.trim()) {
        throw new Error('La información de contacto de emergencia es requerida')
      }

      // Enviamos la solicitud de confirmación
      const response = await fetch('/api/appointments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: appointmentDetails.slotId,
          ...formData
        })
      })

      if (!response.ok) {
        throw new Error('Error al confirmar la cita')
      }

      // Mostramos confirmación al usuario
      showToast({
        title: "¡Cita confirmada!",
        message: "Tu cita ha sido agendada exitosamente",
        type: "success"
      })

      // Redirigimos al usuario a la vista de sus citas
      router.push('/my-appointments')

    } catch (error) {
      showToast({
        title: "Error",
        message: error instanceof Error ? error.message : "No se pudo confirmar la cita",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Cargando detalles de la cita...</p>
      </div>
    )
  }

  if (!appointmentDetails) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No se encontró el horario seleccionado
          </p>
          <Button
            className="mt-4 mx-auto block"
            onClick={() => router.push('/appointments')}
          >
            Volver a horarios disponibles
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirmar Cita Médica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resumen de la cita */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Detalles de la cita</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{appointmentDetails.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Especialidad</p>
                  <p className="font-medium">{appointmentDetails.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-medium">
                    {new Date(appointmentDetails.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hora</p>
                  <p className="font-medium">
                    {appointmentDetails.startTime} - {appointmentDetails.endTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de la consulta */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Motivo de la consulta *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    reason: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                  required
                  placeholder="Describe brevemente el motivo de tu consulta"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFirstVisit"
                  checked={formData.isFirstVisit}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isFirstVisit: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isFirstVisit" className="text-sm text-gray-700">
                  Esta es mi primera consulta con este especialista
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasRecentStudies"
                    checked={formData.hasRecentStudies}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      hasRecentStudies: e.target.checked
                    }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="hasRecentStudies" className="text-sm text-gray-700">
                    Tengo estudios o análisis recientes relacionados
                  </label>
                </div>
                
                {formData.hasRecentStudies && (
                  <textarea
                    value={formData.studiesDescription}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      studiesDescription: e.target.value
                    }))}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                    rows={2}
                    placeholder="Describe brevemente qué estudios tienes..."
                  />
                )}
              </div>
            </div>

            {/* Contacto de emergencia */}
            <div className="space-y-4">
              <h3 className="font-medium">Contacto de emergencia</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      emergencyContact: {
                        ...prev.emergencyContact,
                        name: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      emergencyContact: {
                        ...prev.emergencyContact,
                        phone: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Requisitos especiales */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requerimientos especiales (opcional)
              </label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specialRequirements: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={2}
                placeholder="Ej: necesito intérprete, tengo movilidad reducida, etc."
              />
            </div>

            {/* Recordatorios importantes */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Recordatorios importantes
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Llega 15 minutos antes de tu cita</li>
                <li>• Trae tu documento de identidad</li>
                {formData.hasRecentStudies && (
                  <li>• No olvides traer tus estudios recientes</li>
                )}
                <li>• Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Confirmando...' : 'Confirmar cita'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}