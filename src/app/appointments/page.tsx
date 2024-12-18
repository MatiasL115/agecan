// src/app/appointments/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import Link from 'next/link'  // Añadimos esta importación

// Definimos las interfaces para nuestros datos
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
  doctorId: string
  doctorName: string
}

interface DateSlots {
  date: string
  slots: TimeSlot[]
}

export default function AppointmentsPage() {
  // Estados para manejar la selección del usuario
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<DateSlots[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  // Cargamos los horarios disponibles cuando cambia la fecha seleccionada
  useEffect(() => {
    loadAvailableSlots()
  }, [selectedDate])

  const loadAvailableSlots = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/appointments/availability?date=${selectedDate}`)
      
      if (!response.ok) {
        throw new Error('Error cargando horarios disponibles')
      }

      const data = await response.json()
      setAvailableSlots(data.slots)
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar los horarios disponibles",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar la selección de un horario
  const handleSlotSelection = async (slot: TimeSlot) => {
    setSelectedSlot(slot)
    
    // Aquí podríamos mostrar un modal de confirmación o navegar a la página de confirmación
    // Por ahora, mostraremos un toast de ejemplo
    showToast({
      title: "Horario seleccionado",
      message: `Has seleccionado una cita con ${slot.doctorName} a las ${slot.startTime}`,
      type: "info"
    })
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

  // Función para formatear horas
  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para obtener las próximas fechas disponibles
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) { // Mostramos 2 semanas
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    
    return dates
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agendar Cita</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Selector de fecha */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una fecha
            </label>
            <div className="flex flex-wrap gap-2">
              {getAvailableDates().map(date => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(date)}
                >
                  {formatDate(date)}
                </Button>
              ))}
            </div>
          </div>

          {/* Horarios disponibles */}
          {isLoading ? (
            <div className="text-center py-8">
              <p>Cargando horarios disponibles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSlots.length > 0 ? (
                availableSlots.map(dateSlot => (
                  dateSlot.slots.map(slot => (
                    <Button
                      key={slot.id}
                      variant="outline"
                      className={`h-auto py-4 ${
                        selectedSlot?.id === slot.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleSlotSelection(slot)}
                      disabled={!slot.available}
                    >
                      <div className="text-left">
                        <p className="font-medium">
                          {formatTime(slot.startTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dr. {slot.doctorName}
                        </p>
                      </div>
                    </Button>
                  ))
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">
                    No hay horarios disponibles para esta fecha
                  </p>
                  <Link href="/waitlist">
                    <Button className="mt-4">
                      Unirse a lista de espera
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información importante</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Llega 15 minutos antes de tu cita</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Trae tu documento de identidad</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Si necesitas cancelar, hazlo con 24 horas de anticipación</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿No encuentras un horario?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Únete a nuestra lista de espera y te notificaremos cuando haya un horario disponible
            </p>
            <Link href="/waitlist">
              <Button variant="outline" className="w-full">
                Ver lista de espera
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}