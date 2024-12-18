import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
  doctorId?: string
  doctorName?: string
}

interface DaySchedule {
  date: string
  slots: TimeSlot[]
}

export default function AppointmentsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Cargar horarios disponibles
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setIsLoading(true)
        const startOfWeek = getStartOfWeek(selectedDate)
        const endOfWeek = getEndOfWeek(selectedDate)
        
        const response = await fetch(
          `/api/appointments/availability?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`
        )
        
        if (!response.ok) throw new Error('Error cargando horarios')
        
        const data = await response.json()
        setSchedule(data.schedule)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSchedule()
  }, [selectedDate])

  // Helpers para manejo de fechas
  const getStartOfWeek = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    return start
  }

  const getEndOfWeek = (date: Date) => {
    const end = new Date(date)
    end.setDate(date.getDate() - date.getDay() + 6)
    return end
  }

  const getDaysInWeek = (date: Date) => {
    const start = getStartOfWeek(date)
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Cargando calendario...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Horarios Disponibles</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                const prevWeek = new Date(selectedDate)
                prevWeek.setDate(selectedDate.getDate() - 7)
                setSelectedDate(prevWeek)
              }}
            >
              Semana anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const nextWeek = new Date(selectedDate)
                nextWeek.setDate(selectedDate.getDate() + 7)
                setSelectedDate(nextWeek)
              }}
            >
              Siguiente semana
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {/* Encabezados de días */}
          {getDaysInWeek(selectedDate).map((day) => (
            <div
              key={day.toISOString()}
              className="text-center p-2 border-b"
            >
              <p className="font-medium">{formatDate(day)}</p>
            </div>
          ))}

          {/* Horarios para cada día */}
          {getDaysInWeek(selectedDate).map((day) => {
            const daySchedule = schedule.find(
              s => s.date === day.toISOString().split('T')[0]
            )

            return (
              <div key={day.toISOString()} className="space-y-2">
                {daySchedule?.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-2 rounded-lg text-center ${
                      slot.available
                        ? 'bg-green-50 hover:bg-green-100 cursor-pointer'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {formatTime(slot.startTime)}
                    </p>
                    {slot.doctorName && (
                      <p className="text-xs text-gray-600">
                        {slot.doctorName}
                      </p>
                    )}
                  </div>
                ))}
                {(!daySchedule || daySchedule.slots.length === 0) && (
                  <div className="p-2 text-center text-gray-500 text-sm">
                    No hay horarios disponibles
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}