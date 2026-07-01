import { api } from './api'

export interface Alerta {
  id: number
  mensaje: string
  leida: boolean
  creadaEn: string
  destino: 'COORDINADOR_SECCION' | 'ENFERMERO'
  estudiante: { carnet?: string; primerNombre: string; primerApellido: string }
  origenUsuario: { primerNombre: string; primerApellido: string; role: string }
  seccion?: { codigo: string; nombre: string } | null
  visita?: { motivo: string; fechaHora: string } | null
}

export const getAlertas = (leida?: boolean) =>
  api.get<Alerta[]>('/alertas', { params: leida !== undefined ? { leida } : {} })

export const marcarLeida = (id: number) => api.patch(`/alertas/${id}/leer`)
