import { api } from './api'

export interface EstudiantePerfil {
  id: number
  carnet: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  seccion?: { id: number; codigo: string; nombre: string; turno: string } | null
  _count?: { visitas: number; documentos: number }
}

export const getEstudiantePorCarnet = (carnet: string) =>
  api.get<EstudiantePerfil>(`/usuarios/${carnet}`)
