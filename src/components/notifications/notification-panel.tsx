import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: 'waitlist_update' | 'appointment_available' | 'contact_reminder'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar notificaciones del usuario
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/notifications')
        if (!response.ok) throw new Error('Error cargando notificaciones')
        const data = await response.json()
        setNotifications(data.notifications)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [])

  // Marcar una notificación como leída
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })

      if (!response.ok) throw new Error('Error actualizando notificación')

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Agrupar notificaciones por día
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
    return groups
  }, {} as Record<string, Notification[]>)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Cargando notificaciones...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notificaciones</CardTitle>
          <Button 
            variant="outline"
            onClick={() => {
              // Marcar todas como leídas
              notifications
                .filter(n => !n.read)
                .forEach(n => markAsRead(n.id))
            }}
          >
            Marcar todas como leídas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-white border-l-4'
                    } ${
                      notification.priority === 'high' ? 'border-red-500' :
                      notification.priority === 'medium' ? 'border-yellow-500' :
                      'border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marcar como leída
                        </Button>
                      )}
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = notification.actionUrl!}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay notificaciones nuevas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}