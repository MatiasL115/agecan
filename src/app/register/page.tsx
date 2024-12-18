// src/app/waitlist/register/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos la estructura de los datos del formulario para mantener un tipado fuerte
interface RegistrationForm {
  patientName: string
  contactInfo: {
    email?: string
    phone?: string
  }
  preferredTimeRanges: {
    startTime: string
    endTime: string
  }[]
  notes: string
  urgencyLevel: 'low' | 'medium' | 'high'
}

export default function WaitlistRegistration() {
  // Inicializamos el estado del formulario con valores por defecto
  const [formData, setFormData] = useState<RegistrationForm>({
    patientName: '',
    contactInfo: {},
    preferredTimeRanges: [{ startTime: '', endTime: '' }],
    notes: '',
    urgencyLevel: 'medium'
  })

  // Estado para manejar el proceso de envío
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  // Esta función maneja la validación del formulario antes del envío
  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!formData.patientName.trim()) {
      errors.push('El nombre del paciente es obligatorio')
    }

    if (!formData.contactInfo.email && !formData.contactInfo.phone) {
      errors.push('Debe proporcionar al menos un método de contacto')
    }

    // Validamos que los rangos de tiempo estén completos y sean válidos
    formData.preferredTimeRanges.forEach((range, index) => {
      if (!range.startTime || !range.endTime) {
        errors.push(`El rango de tiempo #${index + 1} debe estar completo`)
      } else if (range.startTime >= range.endTime) {
        errors.push(`La hora de inicio debe ser anterior a la hora de fin en el rango #${index + 1}`)
      }
    })

    return errors
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validamos el formulario antes de enviar
    const errors = validateForm()
    if (errors.length > 0) {
      errors.forEach(error => {
        showToast({
          title: "Error de validación",
          message: error,
          type: "error"
        })
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Error al registrar en lista de espera')
      }

      const data = await response.json()

      showToast({
        title: "Registro exitoso",
        message: "Has sido agregado a la lista de espera. Te contactaremos pronto.",
        type: "success"
      })

      // Limpiamos el formulario después de un registro exitoso
      setFormData({
        patientName: '',
        contactInfo: {},
        preferredTimeRanges: [{ startTime: '', endTime: '' }],
        notes: '',
        urgencyLevel: 'medium'
      })

    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo completar el registro. Por favor, intente nuevamente.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
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
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Registro en Lista de Espera</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Rangos de tiempo preferidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horarios preferidos
              </label>
              {formData.preferredTimeRanges.map((range, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <div className="flex-1">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="flex-1">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
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
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTimeRange}
                className="mt-2"
              >
                Agregar otro horario
              </Button>
            </div>

            {/* Nivel de urgencia */}
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

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notas adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Información adicional que pueda ser relevante..."
              />
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar en lista de espera'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}