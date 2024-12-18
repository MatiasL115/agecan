// src/app/doctor/dashboard/page.tsx
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos interfaces claras para nuestros datos
interface AppointmentMetrics {
  total: number
  attended: number
  missed: number
  cancelled: number
  rescheduled: number
  averageWaitTime: number // en minutos
}

interface TimeSlotPerformance {
  hour: string
  attendanceRate: number
  bookingRate: number
}

export default function DoctorDashboardPage() {
  const { showToast } = useToast()
  
  // En una implementación real, estos datos vendrían de una API
  const weeklyMetrics: AppointmentMetrics = {
    total: 45,
    attended: 38,
    missed: 3,
    cancelled: 2,
    rescheduled: 2,
    averageWaitTime: 12
  }

  // Datos de rendimiento por horario
  const timeSlotPerformance: TimeSlotPerformance[] = [
    { hour: '09:00', attendanceRate: 95, bookingRate: 98 },
    { hour: '10:00', attendanceRate: 92, bookingRate: 95 },
    { hour: '11:00', attendanceRate: 88, bookingRate: 90 },
    { hour: '15:00', attendanceRate: 85, bookingRate: 85 },
    { hour: '16:00', attendanceRate: 90, bookingRate: 88 }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Control de Agendamiento</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tasa de Asistencia</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-green-600">
                  {Math.round((weeklyMetrics.attended / weeklyMetrics.total) * 100)}%
                </span>
                <span className="text-sm text-gray-500">
                  Esta semana
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {weeklyMetrics.attended} de {weeklyMetrics.total} citas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tiempo Promedio de Espera</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {weeklyMetrics.averageWaitTime} min
                </span>
                <span className="text-sm text-gray-500">
                  Esta semana
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Meta: menos de 15 minutos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Citas Perdidas</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-red-600">
                  {weeklyMetrics.missed + weeklyMetrics.cancelled}
                </span>
                <span className="text-sm text-gray-500">
                  Esta semana
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {weeklyMetrics.missed} inasistencias, {weeklyMetrics.cancelled} cancelaciones
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de horarios */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Horario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeSlotPerformance.map(slot => (
              <div key={slot.hour} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{slot.hour}</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    slot.attendanceRate >= 90 ? 'bg-green-100 text-green-800' :
                    slot.attendanceRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {slot.attendanceRate}% asistencia
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${slot.bookingRate}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Tasa de reserva: {slot.bookingRate}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de la semana */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Horario más efectivo</p>
                <p className="font-medium">
                  {timeSlotPerformance.reduce((prev, current) => 
                    prev.attendanceRate > current.attendanceRate ? prev : current
                  ).hour}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Horario menos efectivo</p>
                <p className="font-medium">
                  {timeSlotPerformance.reduce((prev, current) => 
                    prev.attendanceRate < current.attendanceRate ? prev : current
                  ).hour}
                </p>
              </div>
            </div>

            {/* Sugerencias basadas en los datos */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Sugerencias de optimización</h4>
              <ul className="mt-2 space-y-2 text-sm text-blue-700">
                {timeSlotPerformance.some(slot => slot.attendanceRate < 85) && (
                  <li>
                    • Considere ajustar los horarios con menos del 85% de asistencia
                  </li>
                )}
                {weeklyMetrics.averageWaitTime > 10 && (
                  <li>
                    • El tiempo de espera promedio podría mejorarse ajustando la duración de las consultas
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}