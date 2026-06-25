import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute'
import { LoginForm } from '../../features/auth/components/LoginForm'
import { MainLayout } from '../../shared/components/layouts/MainLayout'
import { NuevaVisitaPage } from '../../features/visitas/components/NuevaVisitaPage'
import { HistorialPage } from '../../features/visitas/components/HistorialPage'
import { AlertasPage } from '../../features/alertas/components/AlertasPage'
import { DocumentosPage } from '../../features/documentos/components/DocumentosPage'

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/portal" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route index element={<NuevaVisitaPage />} />
      <Route path="visitas" element={<HistorialPage />} />
      <Route path="alertas" element={<AlertasPage />} />
      <Route path="documentos" element={<DocumentosPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/portal" replace />} />
  </Routes>
)
