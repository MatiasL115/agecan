// src/app/appointments/schedule/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"

// Definimos interfaces claras para manejar los datos del agendamiento
interface Specialty {
  id: string
  name: string
  description: string
  averageConsultTime: number
}

interface Doctor {
  id: string
  name: string
  specialty: string
  availability: TimeSlot[]
  rating: number
  consultCount: number
}

interface TimeSlot {
  date: string
  time: string
  isAvailable: boolean
}

interface AppointmentDetails {
  patientName: string
  patientId: string
  reason: string
  isFirstVisit: boolean
  requiresSpecialAccommodation: boolean
  accommodationDetails?: string
  familyMemberId?: string
}

export default function ScheduleAppointmentPage() {
  // Estados para manejar el flujo de agendamiento
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    patientName: '',
    patientId: '',
    reason: '',
    isFirstVisit: false,
    requiresSpecialAccommodation: false
  })

  const { showToast } = useToast()

  // Datos de ejemplo para especialidades médicas
  const specialties: Specialty[] = [
    {
      id: '1',
      name: 'Cardiología',
      description: 'Especialistas en el sistema cardiovascular',
      averageConsultTime: 30
    },
    {
      id: '2',
      name: 'Pediatría',
      description: 'Atención médica para niños y adolescentes',
      averageConsultTime: 25
    }
  ]

  // Función para agrupar horarios disponibles por fecha
  const groupTimeSlotsByDate = (slots: TimeSlot[]) => {
    return slots.reduce((groups, slot) => {
      const date = slot.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(slot)
      return groups
    }, {} as Record<string, TimeSlot[]>)
  }

  // Función para formatear fechas
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Función para validar el paso actual antes de avanzar
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!selectedSpecialty) {
          showToast({
            title: "Error",
            message: "Por favor selecciona una especialidad",
            type: "error"
          })
          return false
        }
        break
      case 2:
        if (!selectedDoctor) {
          showToast({
            title: "Error",
            message: "Por favor selecciona un doctor",
            type: "error"
          })
          return false
        }
        break
      case 3:
        if (!selectedSlot) {
          showToast({
            title: "Error",
            message: "Por favor selecciona un horario",
            type: "error"
          })
          return false
        }
        break
      case 4:
        if (!appointmentDetails.reason) {
          showToast({
            title: "Error",
            message: "Por favor indica el motivo de la consulta",
            type: "error"
          })
          return false
        }
        break
    }
    return true
  }

  // Función para manejar el avance de pasos
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Función para confirmar la cita
  const handleConfirmAppointment = async () => {
    try {
      // Aquí iría la lógica de confirmación con el backend
      showToast({
        title: "¡Cita agendada!",
        message: "Tu cita ha sido confirmada. Recibirás un correo con los detalles.",
        type: "success"
      })

      // Enviamos notificación al sistema de recordatorios
      scheduleReminders()

    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo agendar la cita. Por favor intenta nuevamente.",
        type: "error"
      })
    }
  }

  // Función para programar recordatorios
  const scheduleReminders = () => {
    if (selectedSlot) {
      const appointmentDate = new Date(selectedSlot.date)
      const now = new Date()
      
      // Recordatorio 24 horas antes
      const dayBefore = new Date(appointmentDate)
      dayBefore.setDate(dayBefore.getDate() - 1)
      
      if (dayBefore > now) {
        // Aquí programaríamos el recordatorio en el sistema
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicador de progreso */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['Especialidad', 'Doctor', 'Horario', 'Detalles', 'Confirmación'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${currentStep > index + 1 ? 'bg-green-500' : 
                  currentStep === index + 1 ? 'bg-blue-500' : 'bg-gray-200'} 
                text-white`}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <span className="text-sm mt-2">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Selecciona la especialidad"}
            {currentStep === 2 && "Elige tu médico"}
            {currentStep === 3 && "Selecciona el horario"}
            {currentStep === 4 && "Completa los detalles"}
            {currentStep === 5 && "Confirma tu cita"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Paso 1: Selección de especialidad */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map(specialty => (
                <div
                  key={specialty.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors
                    ${selectedSpecialty?.id === specialty.id ? 
                      'border-blue-500 bg-blue-50' : 
                      'hover:bg-gray-50'}`}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  <h3 className="font-medium">{specialty.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{specialty.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Duración aproximada: {specialty.averageConsultTime} minutos
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Controles de navegación */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Anterior
              </Button>
            )}
            {currentStep < 5 && (
              <Button
                className="ml-auto"
                onClick={handleNextStep}
              >
                Siguiente
              </Button>
            )}
            {currentStep === 5 && (
              <Button
                className="ml-auto"
                onClick={handleConfirmAppointment}
              >
                Confirmar Cita
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}