// src/app/appointments/new/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/toast"

// Creamos interfaces para manejar los diferentes tipos de datos que necesitaremos
interface Doctor {
  id: string
  name: string
  specialty: string
  availability: {
    date: string
    slots: string[]
  }[]
}

// Datos de ejemplo de doctores y sus disponibilidades
const sampleDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dra. María González',
    specialty: 'Cardiología',
    availability: [
      {
        date: '2024-12-10',
        slots: ['09:00', '09:30', '10:00', '10:30']
      },
      {
        date: '2024-12-11',
        slots: ['14:00', '14:30', '15:00', '15:30']
      }
    ]
  },
  {
    id: '2',
    name: 'Dr. Juan Pérez',
    specialty: 'Traumatología',
    availability: [
      {
        date: '2024-12-10',
        slots: ['11:00', '11:30', '12:00']
      }
    ]
  }
]

// Creamos un tipo para los diferentes pasos del proceso
type BookingStep = 'specialty' | 'doctor' | 'date' | 'confirmation'

export default function NewAppointmentPage() {
  // Estado para manejar el paso actual del proceso
  const [currentStep, setCurrentStep] = useState<BookingStep>('specialty')
  // Estado para almacenar los datos seleccionados
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  const { showToast } = useToast()

  // Lista de especialidades disponibles
  const specialties = ['Cardiología', 'Traumatología', 'Medicina General', 'Pediatría']

  // Función para manejar la finalización del proceso
  const handleConfirmAppointment = () => {
    // En una implementación real, aquí se haría la llamada a la API
    showToast({
      title: "Cita agendada",
      message: "Tu cita ha sido agendada exitosamente",
      type: "success"
    })
    // Redirección a la página de citas
    // En una implementación real usaríamos next/navigation
  }

  // Función para obtener el título del paso actual
  const getStepTitle = (step: BookingStep) => {
    const titles = {
      specialty: 'Selecciona la especialidad',
      doctor: 'Elige tu médico',
      date: 'Selecciona fecha y hora',
      confirmation: 'Confirma tu cita'
    }
    return titles[step]
  }

  // Función para renderizar el contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 'specialty':
        return (
          <div className="grid grid-cols-2 gap-4">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                className="h-24 text-lg"
                onClick={() => {
                  setSelectedSpecialty(specialty)
                  setCurrentStep('doctor')
                }}
              >
                {specialty}
              </Button>
            ))}
          </div>
        )

      case 'doctor':
        return (
          <div className="space-y-4">
            {sampleDoctors
              .filter(doctor => doctor.specialty === selectedSpecialty)
              .map(doctor => (
                <div
                  key={doctor.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedDoctor(doctor)
                    setCurrentStep('date')
                  }}
                >
                  <h3 className="font-medium">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              ))}
          </div>
        )

      case 'date':
        return (
          <div className="space-y-6">
            {selectedDoctor?.availability.map(day => (
              <div key={day.date} className="space-y-2">
                <h3 className="font-medium">
                  {new Date(day.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {day.slots.map(time => (
                    <Button
                      key={`${day.date}-${time}`}
                      variant={
                        selectedDate === day.date && selectedTime === time
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => {
                        setSelectedDate(day.date)
                        setSelectedTime(time)
                        setCurrentStep('confirmation')
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium mb-4">Resumen de tu cita</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Especialidad</p>
                  <p className="font-medium">{selectedSpecialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{selectedDoctor?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y hora</p>
                  <p className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} - {selectedTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('date')}
              >
                Volver
              </Button>
              <Button onClick={handleConfirmAppointment}>
                Confirmar cita
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle(currentStep)}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Indicador de progreso */}
      <div className="mt-8">
        <div className="flex justify-between">
          {['specialty', 'doctor', 'date', 'confirmation'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['specialty', 'doctor', 'date', 'confirmation'].indexOf(currentStep) >= index
                    ? 'bg-primary text-white'
                    : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}