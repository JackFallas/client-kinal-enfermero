import { api } from './api'

export interface AuthUser {
  id: number
  carnet?: string
  primerNombre: string
  primerApellido: string
  email: string
  role: 'ENFERMERO'
}

export const loginApi = (email: string, password: string) =>
  api.post<{ access_token: string; usuario: AuthUser }>('/auth/login', { email, password })

export const logoutApi = () => api.post('/auth/logout')

export const getMeApi = () => api.get<AuthUser>('/auth/me')
