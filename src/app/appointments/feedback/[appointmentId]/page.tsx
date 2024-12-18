// src/app/appointments/feedback/[appointmentId]/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"

// Definimos la estructura de los datos de retroalimentación
interface AppointmentFeedback {
  appointmentId: string
  overallRating: number
  waitingTime: number
  doctorRating: number
  facilityRating: number
  wouldRecommend: boolean
  comments: string
  followUpNeeded: boolean
  symptoms: {
    improved: boolean
    unchanged: boolean
    worsened: boolean
  }
  experienceDetails: {
    doctorExplanation: number
    staffCourtesy: number
    cleanliness: number
    easeOfScheduling: number
  }
}

// Esta interfaz representa los datos de la cita que estamos evaluando
interface AppointmentDetails {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
}

export default function AppointmentFeedbackPage({
  params: { appointmentId }
}: {
  params: { appointmentId: string }
}) {
  // Estado inicial para el formulario de retroalimentación
  const [feedback, setFeedback] = useState<AppointmentFeedback>({
    appointmentId,
    overallRating: 0,
    waitingTime: 0,
    doctorRating: 0,
    facilityRating: 0,
    wouldRecommend: true,
    comments: '',
    followUpNeeded: false,
    symptoms: {
      improved: false,
      unchanged: false,
      worsened: false
    },
    experienceDetails: {
      doctorExplanation: 0,
      staffCourtesy: 0,
      cleanliness: 0,
      easeOfScheduling: 0
    }
  })

  const { showToast } = useToast()

  // Simulamos obtener los detalles de la cita (en una implementación real vendría del backend)
  const appointmentDetails: AppointmentDetails = {
    id: appointmentId,
    doctorName: "Dra. María González",
    specialty: "Cardiología",
    date: "2024-12-05",
    time: "14:30"
  }

  // Función para manejar cambios en las calificaciones por estrellas
  const handleRatingChange = (
    category: keyof AppointmentFeedback | keyof AppointmentFeedback['experienceDetails'],
    value: number
  ) => {
    if (category in feedback.experienceDetails) {
      setFeedback(prev => ({
        ...prev,
        experienceDetails: {
          ...prev.experienceDetails,
          [category]: value
        }
      }))
    } else {
      setFeedback(prev => ({
        ...prev,
        [category]: value
      }))
    }
  }

  // Componente reutilizable para calificación por estrellas
  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number, 
    onChange: (value: number) => void,
    label: string
  }) => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )

  // Función para enviar la retroalimentación
  const handleSubmit = async () => {
    try {
      // Aquí iría la lógica de envío al backend
      showToast({
        title: "¡Gracias por tu retroalimentación!",
        message: "Tu opinión nos ayuda a mejorar nuestros servicios.",
        type: "success"
      })

      // En una implementación real, aquí redirigirías al usuario
      
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo enviar la retroalimentación. Por favor intenta nuevamente.",
        type: "error"
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Detalles de la cita */}
      <Card>
        <CardHeader>
          <CardTitle>Evalúa tu consulta médica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-medium">Doctor:</span> {appointmentDetails.doctorName}</p>
            <p><span className="font-medium">Especialidad:</span> {appointmentDetails.specialty}</p>
            <p><span className="font-medium">Fecha y hora:</span> {appointmentDetails.date} - {appointmentDetails.time}</p>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de retroalimentación */}
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }} className="space-y-6">
        {/* Evaluación general */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluación General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <StarRating
              value={feedback.overallRating}
              onChange={(value) => handleRatingChange('overallRating', value)}
              label="¿Cómo calificarías tu experiencia general?"
            />

            <StarRating
              value={feedback.doctorRating}
              onChange={(value) => handleRatingChange('doctorRating', value)}
              label="¿Cómo calificarías la atención del doctor?"
            />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Tiempo de espera aproximado
              </p>
              <div className="flex space-x-2">
                {[15, 30, 45, 60].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={`px-4 py-2 rounded-md ${
                      feedback.waitingTime === minutes
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => handleRatingChange('waitingTime', minutes)}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la experiencia */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Experiencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <StarRating
              value={feedback.experienceDetails.doctorExplanation}
              onChange={(value) => handleRatingChange('doctorExplanation', value)}
              label="Claridad en las explicaciones del doctor"
            />

            <StarRating
              value={feedback.experienceDetails.staffCourtesy}
              onChange={(value) => handleRatingChange('staffCourtesy', value)}
              label="Amabilidad del personal"
            />

            <StarRating
              value={feedback.experienceDetails.cleanliness}
              onChange={(value) => handleRatingChange('cleanliness', value)}
              label="Limpieza de las instalaciones"
            />

            <StarRating
              value={feedback.experienceDetails.easeOfScheduling}
              onChange={(value) => handleRatingChange('easeOfScheduling', value)}
              label="Facilidad para agendar la cita"
            />
          </CardContent>
        </Card>

        {/* Resultados y seguimiento */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados y Seguimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Estado de los síntomas después de la consulta
              </p>
              <div className="flex space-x-2">
                {[
                  { key: 'improved', label: 'Mejoraron' },
                  { key: 'unchanged', label: 'Sin cambios' },
                  { key: 'worsened', label: 'Empeoraron' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={`px-4 py-2 rounded-md ${
                      feedback.symptoms[key as keyof typeof feedback.symptoms]
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setFeedback(prev => ({
                      ...prev,
                      symptoms: {
                        improved: false,
                        unchanged: false,
                        worsened: false,
                        [key]: true
                      }
                    }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                ¿Necesitas programar una consulta de seguimiento?
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    feedback.followUpNeeded
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setFeedback(prev => ({
                    ...prev,
                    followUpNeeded: !prev.followUpNeeded
                  }))}
                >
                  Sí, necesito seguimiento
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios adicionales
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                value={feedback.comments}
                onChange={(e) => setFeedback(prev => ({
                  ...prev,
                  comments: e.target.value
                }))}
                placeholder="Comparte tu experiencia o sugerencias para mejorar..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">
            Enviar retroalimentación
          </Button>
        </div>
      </form>
    </div>
  )
}