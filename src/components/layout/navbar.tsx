// src/components/layout/navbar.tsx
import React from 'react';
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* El logo de la aplicación */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Agecan</h1>
        </div>

        {/* Navegación principal */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/dashboard" className="text-sm font-medium hover:text-primary">
            Inicio
          </a>
          <a href="/appointments" className="text-sm font-medium hover:text-primary">
            Agendar Cita
          </a>
          <a href="/medications" className="text-sm font-medium hover:text-primary">
            Medicamentos
          </a>
          <a href="/family" className="text-sm font-medium hover:text-primary">
            Familia
          </a>
        </nav>

        {/* Menú de usuario */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Notificaciones
          </Button>
          <Button variant="outline" size="sm">
            Mi Perfil
          </Button>
        </div>
      </div>
    </header>
  );
}