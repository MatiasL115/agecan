// src/app/waitlist/search/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

// Definimos la interfaz para los filtros que usaremos en la búsqueda
interface SearchFilters {
  status?: string
  urgencyLevel?: string
  patientName?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Definimos la interfaz para los resultados que esperamos del backend
interface WaitlistEntry {
  id: string
  patientName: string
  status: string
  urgencyLevel: string
  requestDate: string
  // ... otros campos que necesitemos mostrar
}

export default function WaitlistSearch() {
  // Estados para manejar los filtros y resultados
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<WaitlistEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const { showToast } = useToast()

  // Estado para manejar la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10

  // Esta función construye los parámetros de búsqueda para la URL
  const buildSearchParams = (filters: SearchFilters, page: number) => {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.urgencyLevel) params.append('urgencyLevel', filters.urgencyLevel)
    if (filters.patientName) params.append('patientName', filters.patientName)
    if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start)
    if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end)
    
    params.append('page', page.toString())
    params.append('limit', resultsPerPage.toString())
    
    return params.toString()
  }

  // Función para realizar la búsqueda
  const performSearch = async (page = currentPage) => {
    setIsLoading(true)
    try {
      const searchParams = buildSearchParams(filters, page)
      const response = await fetch(`/api/waitlist/search?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }

      const data = await response.json()
      setResults(data.entries)
      setTotalResults(data.total)
      setCurrentPage(page)

    } catch (error) {
      showToast({
        title: "Error",
        message: "No se pudieron cargar los resultados. Por favor, intente nuevamente.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función debounce para evitar demasiadas llamadas al servidor
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // Realizamos la búsqueda cuando cambian los filtros
  const debouncedSearch = React.useCallback(
    debounce(() => performSearch(1), 500),
    [filters]
  )

  useEffect(() => {
    debouncedSearch()
  }, [filters])

  // Calculamos el total de páginas para la paginación
  const totalPages = Math.ceil(totalResults / resultsPerPage)

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Panel de filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda por nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del paciente
              </label>
              <input
                type="text"
                value={filters.patientName || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  patientName: e.target.value
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Buscar por nombre..."
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: e.target.value || undefined
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Todos</option>
                <option value="waiting">En espera</option>
                <option value="contacted">Contactado</option>
                <option value="scheduled">Agendado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Filtro por urgencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de urgencia
              </label>
              <select
                value={filters.urgencyLevel || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  urgencyLevel: e.target.value || undefined
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Todos</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>

            {/* Rango de fechas */}
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      start: e.target.value
                    }
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      end: e.target.value
                    }
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Resultados ({totalResults})</CardTitle>
            {isLoading && <p className="text-sm text-gray-500">Cargando...</p>}
          </div>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontraron resultados
            </p>
          ) : (
            <div className="space-y-4">
              {results.map(entry => (
                <div
                  key={entry.id}
                  className={`p-4 border rounded-lg ${
                    entry.urgencyLevel === 'high' ? 'border-l-4 border-l-red-500' :
                    entry.urgencyLevel === 'medium' ? 'border-l-4 border-l-yellow-500' :
                    'border-l-4 border-l-blue-500'
                  }`}
                >
                  {/* Contenido similar al componente de lista pero más detallado */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium">{entry.patientName}</h3>
                      <p className="text-sm text-gray-600">
                        Solicitado: {new Date(entry.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                        entry.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                        entry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        entry.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => {/* Implementar vista detallada */}}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => performSearch(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Anterior
              </Button>
              <span className="px-4 py-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => performSearch(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}