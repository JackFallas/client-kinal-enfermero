import { api } from './api'

export interface Alerta {
  id: number
  mensaje: string
  leida: boolean
  creadaEn: string
  estudiante: { carnet?: string; primerNombre: string; primerApellido: string }
  seccion: { codigo: string; nombre: string }
  visita: { motivo: string; fechaHora: string }
}

export const getAlertas = (leida?: boolean) =>
  api.get<Alerta[]>('/alertas', { params: leida !== undefined ? { leida } : {} })

export const marcarLeida = (id: number) => api.patch(`/alertas/${id}/leer`)
