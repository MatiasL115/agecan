// src/app/reports/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos las interfaces para nuestras estadísticas
interface WaitlistStats {
  totalEntries: number
  activeEntries: number
  averageWaitTime: number
  completionRate: number
  contactRate: number
  statusDistribution: {
    waiting: number
    contacted: number
    scheduled: number
    cancelled: number
  }
  urgencyDistribution: {
    high: number
    medium: number
    low: number
  }
  timeRangePreferences: {
    morning: number
    afternoon: number
    evening: number
  }
  weeklyTrends: {
    week: string
    newEntries: number
    completed: number
  }[]
}

// Definimos el tipo para nuestros períodos de reporte
type ReportPeriod = 'week' | 'month' | '3months' | '6months' | 'year'

export default function ReportsPage() {
  // Estados para manejar nuestros datos y filtros
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month')
  const { showToast } = useToast()

  // Función para cargar las estadísticas
  const loadStatistics = async (period: ReportPeriod) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/reports/statistics?period=${period}`)
      
      if (!response.ok) {
        throw new Error('Error cargando estadísticas')
      }

      const data = await response.json()
      setStats(data)

    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar las estadísticas. Por favor, intente nuevamente.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cargamos las estadísticas cuando cambia el período seleccionado
  useEffect(() => {
    loadStatistics(selectedPeriod)
  }, [selectedPeriod])

  // Función para formatear números como porcentajes
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  // Función para formatear tiempos promedio
  const formatAverageTime = (days: number) => {
    if (days < 1) {
      return `${Math.round(days * 24)} horas`
    }
    return `${Math.round(days)} días`
  }

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Selector de período */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'week', label: 'Última semana' },
              { value: 'month', label: 'Último mes' },
              { value: '3months', label: 'Últimos 3 meses' },
              { value: '6months', label: 'Últimos 6 meses' },
              { value: 'year', label: 'Último año' }
            ].map(period => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period.value as ReportPeriod)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total en lista de espera</p>
              <p className="text-3xl font-bold">{stats.activeEntries}</p>
              <p className="text-sm text-gray-500">
                De {stats.totalEntries} totales
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tiempo promedio de espera</p>
              <p className="text-3xl font-bold">
                {formatAverageTime(stats.averageWaitTime)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tasa de finalización</p>
              <p className="text-3xl font-bold text-green-600">
                {formatPercentage(stats.completionRate)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tasa de contacto</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatPercentage(stats.contactRate)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de estados y urgencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.statusDistribution).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'waiting' ? 'bg-yellow-500' :
                        status === 'contacted' ? 'bg-blue-500' :
                        status === 'scheduled' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}
                      style={{
                        width: `${(count / stats.totalEntries) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por urgencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.urgencyDistribution).map(([level, count]) => (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{level}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        level === 'high' ? 'bg-red-500' :
                        level === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{
                        width: `${(count / stats.totalEntries) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferencias de horario */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de horario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.timeRangePreferences).map(([timeRange, count]) => (
              <div key={timeRange} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize">
                    {timeRange === 'morning' ? 'Mañana (8:00 - 12:00)' :
                     timeRange === 'afternoon' ? 'Tarde (12:00 - 17:00)' :
                     'Noche (17:00 - 21:00)'}
                  </span>
                  <span className="font-medium">
                    {formatPercentage(count / stats.totalEntries)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(count / stats.totalEntries) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencias semanales */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias semanales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.weeklyTrends.map((week, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-medium mb-2">Semana del {week.week}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nuevas solicitudes</p>
                    <p className="text-lg font-medium">{week.newEntries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-lg font-medium">{week.completed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botones de exportación */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Exportar a Excel
        </Button>
        <Button variant="outline">
          Generar PDF
        </Button>
      </div>
    </div>
  )
}