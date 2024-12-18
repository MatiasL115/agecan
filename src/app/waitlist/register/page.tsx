// src/app/waitlist/register/page.tsx
"use client"

import React, { useState } from 'react'
import { BaseWaitlistForm, BaseWaitlistFormData } from '@/components/waitlist/base-form'
import { useToast } from "@/components/ui/toast"

export default function PatientWaitlistRegistration() {
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BaseWaitlistFormData>({
    patientName: '',
    contactInfo: {},
    preferredTimeRanges: [{ startTime: '', endTime: '' }],
    notes: ''
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      // Aquí iría la lógica de envío a la API
      
      showToast({
        title: "Solicitud enviada",
        message: "Te contactaremos cuando haya un espacio disponible",
        type: "success"
      })
      
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo enviar la solicitud. Por favor intenta nuevamente",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Lista de espera</h1>
        <p className="text-gray-600">
          Completa el formulario para ser agregado a nuestra lista de espera.
          Te contactaremos tan pronto como haya un espacio disponible que coincida
          con tus preferencias de horario.
        </p>
      </div>

      <BaseWaitlistForm
        data={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  )
}