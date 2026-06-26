import { useState, useEffect } from 'react'
import { FiBell, FiCheckCircle } from 'react-icons/fi'
import { getAlertas, marcarLeida, type Alerta } from '../../../shared/api/alertas'
import toast from 'react-hot-toast'

export const AlertasPage = () => {
  const [alertas, setAlertas]   = useState<Alerta[]>([])
  const [loading, setLoading]   = useState(true)
  const [soloNoLeidas, setSolo] = useState(false)
  const [marking, setMarking]   = useState<number | null>(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const { data } = await getAlertas(soloNoLeidas ? false : undefined)
      setAlertas(data)
    } catch {
      toast.error('Error al cargar alertas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [soloNoLeidas])

  const handleMarcar = async (id: number) => {
    setMarking(id)
    try {
      await marcarLeida(id)
      setAlertas((prev) => prev.map((a) => a.id === id ? { ...a, leida: true } : a))
      toast.success('Alerta marcada como leída')
    } catch {
      toast.error('Error al marcar alerta')
    } finally {
      setMarking(null)
    }
  }

  const noLeidas = alertas.filter((a) => !a.leida).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0A2647]">Alertas</h1>
          {noLeidas > 0 && (
            <p className="text-sm text-red-500 mt-0.5 font-medium">{noLeidas} alerta{noLeidas !== 1 ? 's' : ''} sin leer</p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input type="checkbox" checked={soloNoLeidas} onChange={(e) => setSolo(e.target.checked)} className="accent-[#0E6BA8]" />
          Solo sin leer
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Cargando alertas...</div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-14">
          <FiBell size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Sin alertas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alertas.map((a) => (
            <div key={a.id} className={`bg-white rounded-xl border shadow-sm p-4 transition-colors ${
              a.leida ? 'border-blue-50 opacity-70' : 'border-red-100'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!a.leida && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                    <span className="text-xs text-slate-400">{new Date(a.creadaEn).toLocaleString('es-GT')}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{a.seccion.codigo}</span>
                  </div>
                  <p className="font-semibold text-[#0A2647] text-sm">{a.mensaje}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-medium">{a.estudiante.primerNombre} {a.estudiante.primerApellido}</span>
                    {a.estudiante.carnet && <span className="text-slate-400 font-mono"> ({a.estudiante.carnet})</span>}
                    {' · '}{a.visita.motivo}
                  </p>
                </div>
                {!a.leida && (
                  <button onClick={() => handleMarcar(a.id)} disabled={marking === a.id}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60 shrink-0 flex items-center gap-1">
                    <FiCheckCircle size={12} />
                    {marking === a.id ? '...' : 'Leída'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
