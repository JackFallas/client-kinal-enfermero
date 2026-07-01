import { api } from './api'

export interface AuthUser {
  id: number
  carnet?: string
  primerNombre: string
  primerApellido: string
  email: string
  role: 'ENFERMERO'
  fotoPerfil?: string | null
}

export const loginApi = (email: string, password: string) =>
  api.post<{ access_token: string; usuario: AuthUser }>('/auth/login', { email, password })

export const logoutApi = () => api.post('/auth/logout')

export const getMeApi = () => api.get<AuthUser>('/auth/me')

export const cambiarFotoPerfilApi = (formData: FormData) =>
  api.post<{ fotoPerfil: string }>('/usuarios/foto-perfil', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const eliminarFotoPerfilApi = () => api.delete('/usuarios/foto-perfil')

export const olvidePasswordApi = (email: string) =>
  api.post<{ message: string }>('/auth/olvide-password', { email })

export const restablecerPasswordApi = (data: { codigo: string; token?: string; email?: string; password: string }) =>
  api.post<{ message: string }>('/auth/restablecer-password', data)
