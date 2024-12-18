import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

interface DoctorAppointment {
  id: string
  patientName: string
  patientId: string
  scheduledTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  type: 'first-time' | 'follow-up'
  reason: string
  waitingTime?: number
}

interface DashboardStats {
  todayTotal: number
  completed: number
  pending: number
  averageWaitTime: number
  nextPatient: string | null
}

export default function DoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<DoctorAppointment[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    todayTotal: 0,
    completed: 0,
    pending: 0,
    averageWaitTime: 0,
    nextPatient: null
  })
  const [currentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadDashboardData()
    // Actualizamos los datos cada 5 minutos
    const interval = setInterval(loadDashboardData, 300000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/doctor/dashboard')
      if (!response.ok) throw new Error('Error cargando datos del dashboard')
      
      const data = await response.json()
      setTodayAppointments(data.appointments)
      setStats(data.stats)
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar los datos del dashboard",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/start`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Error al iniciar la consulta')

      showToast({
        title: "Consulta iniciada",
        message: "La consulta ha comenzado exitosamente",
        type: "success"
      })

      loadDashboardData()
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo iniciar la consulta",
        type: "error"
      })
    }
  }

  const completeAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Error al finalizar la consulta')

      showToast({
        title: "Consulta completada",
        message: "La consulta ha sido finalizada exitosamente",
        type: "success"
      })

      loadDashboardData()
    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo finalizar la consulta",
        type: "error"
      })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutos`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Citas Totales Hoy</p>
              <p className="text-3xl font-bold">{stats.todayTotal}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tiempo de espera promedio</p>
              <p className="text-3xl font-bold">
                {formatWaitTime(stats.averageWaitTime)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximo paciente y consulta actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximo Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.nextPatient ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{stats.nextPatient}</h3>
                    <p className="text-sm text-gray-600">
                      Hora programada: {formatTime(currentTime.toISOString())}
                    </p>
                  </div>
                  <Button onClick={() => {/* Iniciar siguiente consulta */}}>
                    Llamar paciente
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay pacientes en espera
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consulta Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.find(a => a.status === 'in-progress') ? (
              <div className="space-y-4">
                {/* Detalles de la consulta en curso */}
                <div>
                  <h3 className="font-medium">
                    {todayAppointments.find(a => a.status === 'in-progress')?.patientName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Inicio: {formatTime(currentTime.toISOString())}
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    const currentAppointment = todayAppointments.find(
                      a => a.status === 'in-progress'
                    )
                    if (currentAppointment) {
                      completeAppointment(currentAppointment.id)
                    }
                  }}
                >
                  Finalizar consulta
                </Button>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay consulta en curso
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de citas del día */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={`p-4 border rounded-lg ${
                  appointment.status === 'in-progress' ? 'bg-blue-50' :
                  appointment.status === 'completed' ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{appointment.patientName}</h3>
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>
                        {formatTime(appointment.scheduledTime)}
                      </span>
                      <span>
                        {appointment.type === 'first-time' ? 
                          'Primera visita' : 'Seguimiento'}
                      </span>
                    </div>
                    {appointment.waitingTime && appointment.status !== 'completed' && (
                      <p className="text-sm text-yellow-600 mt-1">
                        Esperando: {formatWaitTime(appointment.waitingTime)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {appointment.status === 'scheduled' && (
                      <Button
                        onClick={() => startAppointment(appointment.id)}
                      >
                        Iniciar consulta
                      </Button>
                    )}
                    {appointment.status === 'in-progress' && (
                      <Button
                        onClick={() => completeAppointment(appointment.id)}
                      >
                        Finalizar consulta
                      </Button>
                    )}
                  </div>
                </div>
                {appointment.reason && (
                  <p className="text-sm text-gray-600 mt-2">
                    Motivo: {appointment.reason}
                  </p>
                )}
              </div>
            ))}

            {todayAppointments.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No hay citas programadas para hoy
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}