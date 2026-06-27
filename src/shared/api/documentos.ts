import { api } from './api'

export interface Documento {
  id: number
  tipo: 'CARTA_ALERGIA' | 'CARTA_MEDICA' | 'OTRO'
  nombreArchivo: string
  descripcion?: string
  verificado: boolean
  subidoEn: string
  estudiante?: { primerNombre: string; primerApellido: string; carnet?: string }
}

export const getDocumentosEstudiante = (carnet: string) =>
  api.get<Documento[]>(`/documentos/estudiante/${carnet}`)

export const verificarDocumento = (id: number) =>
  api.patch(`/documentos/${id}/verificar`)
