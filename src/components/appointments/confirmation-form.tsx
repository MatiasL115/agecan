import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

interface AppointmentDetails {
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  startTime: string
  endTime: string
}

interface ConfirmationFormProps {
  appointmentDetails: AppointmentDetails
  onConfirm: () => void
  onCancel: () => void
}

export default function AppointmentConfirmation({ 
  appointmentDetails,
  onConfirm,
  onCancel
}: ConfirmationFormProps) {
  const [additionalInfo, setAdditionalInfo] = useState({
    reason: '',
    isFirstVisit: false,
    hasRecentStudies: false,
    studiesDescription: '',
    specialRequirements: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointmentDetails,
          ...additionalInfo
        })
      })

      if (!response.ok) throw new Error('Error al agendar la cita')

      showToast({
        title: "Cita confirmada",
        message: "Tu cita ha sido agendada exitosamente",
        type: "success"
      })

      onConfirm()

    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudo agendar la cita. Por favor, intenta nuevamente.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmar Cita Médica</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen de la cita */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Detalles de la cita</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Médico</p>
                <p className="font-medium">{appointmentDetails.doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Especialidad</p>
                <p className="font-medium">{appointmentDetails.specialty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-medium">{formatDate(appointmentDetails.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hora</p>
                <p className="font-medium">
                  {formatTime(appointmentDetails.startTime)} - 
                  {formatTime(appointmentDetails.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motivo de la consulta
              </label>
              <textarea
                value={additionalInfo.reason}
                onChange={(e) => setAdditionalInfo(prev => ({
                  ...prev,
                  reason: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFirstVisit"
                checked={additionalInfo.isFirstVisit}
                onChange={(e) => setAdditionalInfo(prev => ({
                  ...prev,
                  isFirstVisit: e.target.checked
                }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isFirstVisit" className="text-sm text-gray-700">
                Esta es mi primera consulta con este especialista
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasRecentStudies"
                  checked={additionalInfo.hasRecentStudies}
                  onChange={(e) => setAdditionalInfo(prev => ({
                    ...prev,
                    hasRecentStudies: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasRecentStudies" className="text-sm text-gray-700">
                  Tengo estudios o análisis recientes
                </label>
              </div>
              
              {additionalInfo.hasRecentStudies && (
                <textarea
                  value={additionalInfo.studiesDescription}
                  onChange={(e) => setAdditionalInfo(prev => ({
                    ...prev,
                    studiesDescription: e.target.value
                  }))}
                  placeholder="Describe brevemente qué estudios tienes..."
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={2}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requerimientos especiales (opcional)
              </label>
              <textarea
                value={additionalInfo.specialRequirements}
                onChange={(e) => setAdditionalInfo(prev => ({
                  ...prev,
                  specialRequirements: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={2}
                placeholder="Ej: necesito intérprete, tengo movilidad reducida, etc."
              />
            </div>
          </div>

          {/* Recordatorios importantes */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Recordatorios importantes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Llega 15 minutos antes de tu cita</li>
              <li>• Trae tu documento de identidad</li>
              {additionalInfo.hasRecentStudies && (
                <li>• No olvides traer tus estudios recientes</li>
              )}
              <li>• Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar cita'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}