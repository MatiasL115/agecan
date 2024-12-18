// src/app/waitlist/add/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"

interface WaitlistFormData {
  patientName: string
  contactInfo: {
    phone?: string
    email?: string
  }
  preferredTimeRanges: {
    startTime: string
    endTime: string
  }[]
  urgencyLevel: 'high' | 'medium' | 'low'
  contactPreference: 'phone' | 'email' | 'both'
  notes: string
  maxWaitDays: number
  notificationPreferences: {
    sms: boolean
    email: boolean
    instantAlert: boolean
  }
}

export default function AddToWaitlistPage() {
  const { showToast } = useToast()

  const [formData, setFormData] = useState<WaitlistFormData>({
    patientName: '',
    contactInfo: {},
    preferredTimeRanges: [{ startTime: '', endTime: '' }],
    urgencyLevel: 'medium',
    contactPreference: 'both',
    notes: '',
    maxWaitDays: 30,
    notificationPreferences: {
      sms: true,
      email: true,
      instantAlert: false
    }
  })

  // Esta función maneja la validación completa del formulario
  const validateForm = (): boolean => {
    if (!formData.patientName.trim()) {
      showToast({
        title: "Error de validación",
        message: "El nombre del paciente es obligatorio",
        type: "error"
      })
      return false
    }

    // Validamos que haya al menos un método de contacto según la preferencia
    if (formData.contactPreference === 'phone' && !formData.contactInfo.phone) {
      showToast({
        title: "Error de validación",
        message: "El teléfono es obligatorio con la preferencia seleccionada",
        type: "error"
      })
      return false
    }

    if (formData.contactPreference === 'email' && !formData.contactInfo.email) {
      showToast({
        title: "Error de validación",
        message: "El email es obligatorio con la preferencia seleccionada",
        type: "error"
      })
      return false
    }

    // Validamos que los rangos de tiempo sean coherentes
    for (const range of formData.preferredTimeRanges) {
      if (!range.startTime || !range.endTime) {
        showToast({
          title: "Error de validación",
          message: "Todos los rangos de tiempo deben estar completos",
          type: "error"
        })
        return false
      }
      
      if (range.startTime >= range.endTime) {
        showToast({
          title: "Error de validación",
          message: "La hora de inicio debe ser anterior a la hora de fin",
          type: "error"
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Aquí iría la llamada a la API para guardar los datos
      showToast({
        title: "Solicitud registrada",
        message: "El paciente ha sido agregado a la lista de espera exitosamente",
        type: "success"
      })

      // En una implementación real, aquí redirigirías al usuario a la lista de espera
      
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo registrar la solicitud. Por favor intente nuevamente",
        type: "error"
      })
    }
  }

  // Función para agregar un nuevo rango de tiempo
  const addTimeRange = () => {
    setFormData(prev => ({
      ...prev,
      preferredTimeRanges: [
        ...prev.preferredTimeRanges,
        { startTime: '', endTime: '' }
      ]
    }))
  }

  // Función para eliminar un rango de tiempo
  const removeTimeRange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferredTimeRanges: prev.preferredTimeRanges.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica del paciente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField>
              <label className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patientName: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: {
                      ...prev.contactInfo,
                      phone: e.target.value
                    }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </FormField>

              <FormField>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.email || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: {
                      ...prev.contactInfo,
                      email: e.target.value
                    }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Preferencias de horario */}
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Horario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.preferredTimeRanges.map((range, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <FormField>
                  <label className="block text-sm font-medium text-gray-700">
                    Hora inicio
                  </label>
                  <input
                    type="time"
                    value={range.startTime}
                    onChange={(e) => {
                      const newRanges = [...formData.preferredTimeRanges]
                      newRanges[index].startTime = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        preferredTimeRanges: newRanges
                      }))
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </FormField>

                <div className="flex items-center space-x-2">
                  <FormField className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Hora fin
                    </label>
                    <input
                      type="time"
                      value={range.endTime}
                      onChange={(e) => {
                        const newRanges = [...formData.preferredTimeRanges]
                        newRanges[index].endTime = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          preferredTimeRanges: newRanges
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </FormField>

                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeTimeRange(index)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addTimeRange}
              className="w-full"
            >
              Agregar otro horario
            </Button>
          </CardContent>
        </Card>

        {/* Nivel de urgencia y preferencias */}
        <Card>
          <CardHeader>
            <CardTitle>Urgencia y Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de urgencia
              </label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={formData.urgencyLevel === level ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      urgencyLevel: level
                    }))}
                  >
                    {level === 'low' ? 'Baja' :
                     level === 'medium' ? 'Media' : 'Alta'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferencia de contacto
              </label>
              <div className="flex space-x-2">
                {(['phone', 'email', 'both'] as const).map((pref) => (
                  <Button
                    key={pref}
                    type="button"
                    variant={formData.contactPreference === pref ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      contactPreference: pref
                    }))}
                  >
                    {pref === 'phone' ? 'Teléfono' :
                     pref === 'email' ? 'Email' : 'Ambos'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo máximo de espera
              </label>
              <select
                value={formData.maxWaitDays}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  maxWaitDays: parseInt(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value={7}>1 semana</option>
                <option value={14}>2 semanas</option>
                <option value={30}>1 mes</option>
                <option value={60}>2 meses</option>
                <option value={90}>3 meses</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Preferencias de notificación */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Notificaciones por SMS
                </span>
                <Button
                  type="button"
                  variant={formData.notificationPreferences.sms ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      sms: !prev.notificationPreferences.sms
                    }
                  }))}
                >
                  {formData.notificationPreferences.sms ? 'Activadas' : 'Desactivadas'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Notificaciones por email
                </span>
                <Button
                  type="button"
                  variant={formData.notificationPreferences.email ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      email: !prev.notificationPreferences.email
                    }
                  }))}
                >
                  {formData.notificationPreferences.email ? 'Activadas' : 'Desactivadas'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Alertas instantáneas de disponibilidad
                </span>
                <Button
                  type="button"
                  variant={formData.notificationPreferences.instantAlert ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      instantAlert: !prev.notificationPreferences.instantAlert
                    }
                  }))}
                >
                  {formData.notificationPreferences.instantAlert ? 'Activadas' : 'Desactivadas'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas adicionales */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Agregue cualquier información adicional relevante..."
            />
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">
            Agregar a lista de espera
          </Button>
        </div>
      </form>
    </div>
  )
}