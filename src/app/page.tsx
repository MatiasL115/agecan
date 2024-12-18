// src/app/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Sección de héroe */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Agenda tu cita médica de manera fácil y rápida
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sistema de agendamiento hospitalario diseñado para hacer tu experiencia
          más simple y eficiente
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/appointments">
            <Button size="lg">
              Agendar Cita
            </Button>
          </Link>
          <Link href="/waitlist">
            <Button variant="outline" size="lg">
              Unirse a Lista de Espera
            </Button>
          </Link>
        </div>
      </section>

      {/* Características principales */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">
              Agendamiento Simple
            </h3>
            <p className="text-gray-600">
              Agenda tu cita en pocos pasos y recibe confirmación inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">
              Lista de Espera Inteligente
            </h3>
            <p className="text-gray-600">
              Si no hay horarios disponibles, únete a la lista de espera y te
              notificaremos cuando haya un espacio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">
              Recordatorios Automáticos
            </h3>
            <p className="text-gray-600">
              Recibe recordatorios de tus citas por email o SMS
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Sección de ayuda rápida */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">1</div>
            <h3 className="font-medium mb-2">Busca un horario</h3>
            <p className="text-sm text-gray-600">
              Explora los horarios disponibles para tu especialidad
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">2</div>
            <h3 className="font-medium mb-2">Selecciona tu cita</h3>
            <p className="text-sm text-gray-600">
              Elige el horario que mejor se adapte a ti
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">3</div>
            <h3 className="font-medium mb-2">Confirma los detalles</h3>
            <p className="text-sm text-gray-600">
              Verifica la información y confirma tu cita
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">4</div>
            <h3 className="font-medium mb-2">¡Listo!</h3>
            <p className="text-sm text-gray-600">
              Recibe la confirmación y recordatorios
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}