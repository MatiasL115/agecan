// src/app/doctor/waitlist/new/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BaseWaitlistForm, BaseWaitlistFormData } from '@/components/waitlist/base-form'
import { useToast } from "@/components/ui/toast"

// Extendemos la interfaz base para incluir campos adicionales que solo maneja el personal
interface AdminWaitlistFormData extends BaseWaitlistFormData {
  urgencyLevel: 'high' | 'medium' | 'low'
  specialInstructions: string
  internalNotes: string
  assignedTo?: string
  priorityOverride: boolean
  estimatedWaitTime?: number
}

export default function AdminWaitlistRegistration() {
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<AdminWaitlistFormData>({
    patientName: '',
    contactInfo: {},
    preferredTimeRanges: [{ startTime: '', endTime: '' }],
    notes: '',
    urgencyLevel: 'medium',
    specialInstructions: '',
    internalNotes: '',
    priorityOverride: false
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      // Aquí iría la lógica de envío a la API
      
      showToast({
        title: "Paciente registrado",
        message: "El paciente ha sido agregado a la lista de espera",
        type: "success"
      })
      
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo registrar al paciente. Por favor intenta nuevamente",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Registrar nuevo paciente en lista de espera</h1>
        <p className="text-gray-600">
          Complete la información del paciente y configure las preferencias de la lista de espera.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BaseWaitlistForm
            data={formData}
            onChange={(newData) => setFormData(prev => ({
              ...prev,
              ...newData
            }))}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>

        <div className="space-y-6">
          {/* Configuración administrativa adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración administrativa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nivel de urgencia
                </label>
                <div className="flex space-x-2 mt-1">
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
                <label className="block text-sm font-medium text-gray-700">
                  Instrucciones especiales
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    specialInstructions: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notas internas
                </label>
                <textarea
                  value={formData.internalNotes}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    internalNotes: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Prioridad especial
                </span>
                <Button
                  type="button"
                  variant={formData.priorityOverride ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    priorityOverride: !prev.priorityOverride
                  }))}
                >
                  {formData.priorityOverride ? 'Activada' : 'Desactivada'}
                </Button>
              </div>

              {formData.priorityOverride && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tiempo estimado de espera (días)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedWaitTime || ''}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      estimatedWaitTime: parseInt(e.target.value)
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    min="1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}