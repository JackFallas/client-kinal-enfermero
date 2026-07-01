import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../../features/auth/store/authStore'

interface AlertaPayload {
  destino: 'COORDINADOR_SECCION' | 'ENFERMERO'
  mensaje: string
  origenNombre: string
}

export const useAlertNotifications = () => {
  const { token, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !token || !user) return

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const socket = io(window.location.origin + '/sesiones', {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
      path: '/admin-ws',
    })

    socket.on('alerta:nueva', (payload: AlertaPayload) => {
      if (payload.destino !== 'ENFERMERO') return
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Nueva alerta', { body: `${payload.origenNombre}: ${payload.mensaje}` })
      }
    })

    return () => { socket.disconnect() }
  }, [isAuthenticated, token, user])
}
