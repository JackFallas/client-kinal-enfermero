import { api } from './api'

export interface ContactoEmergencia {
  id: number
  nombre: string
  parentesco: string
  telefono: string
}

export const getContactosDeEstudiante = (carnet: string) =>
  api.get<ContactoEmergencia[]>(`/contactos-emergencia/estudiante/${carnet}`)
