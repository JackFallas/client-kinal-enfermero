import { api } from './api'

export interface Visita {
  id: number
  motivo: string
  descripcion?: string
  temperatura?: number
  tratamiento?: string
  observaciones?: string
  requiereRetirarse?: boolean
  fechaHora: string
  estudiante: { carnet?: string; primerNombre: string; primerApellido: string; seccion?: { codigo: string } }
  alerta?: { mensaje: string; leida: boolean } | null
}

export interface CreateVisitaDto {
  estudianteCarnet: string
  motivo: string
  descripcion?: string
  temperatura?: number
  tratamiento?: string
  observaciones?: string
  requiereRetirarse?: boolean
  emitirAlerta?: boolean
  mensajeAlerta?: string
}

export const getVisitas = (params?: { desde?: string; hasta?: string; estudianteCarnet?: string; page?: number }) =>
  api.get<Visita[]>('/visitas', { params })

export const createVisita = (dto: CreateVisitaDto) =>
  api.post<Visita>('/visitas', dto)
