import { useState, useEffect } from 'react'
import { FiActivity, FiBell, FiSearch, FiCalendar } from 'react-icons/fi'
import { getVisitas, type Visita } from '../../../shared/api/visitas'
import toast from 'react-hot-toast'

const TIPO_LABEL: Record<string, string> = {
  CARTA_ALERGIA: 'Alergia',
  CARTA_MEDICA:  'Médica',
  OTRO:          'Otro',
}

export const HistorialPage = () => {
  const [visitas, setVisitas]   = useState<Visita[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [desde, setDesde]       = useState('')
  const [hasta, setHasta]       = useState('')

  const fetchVisitas = async () => {
    setLoading(true)
    try {
      const { data } = await getVisitas({ desde: desde || undefined, hasta: hasta || undefined })
      setVisitas(data)
    } catch {
      toast.error('Error al cargar visitas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVisitas() }, [desde, hasta])

  const filtered = visitas.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (v.estudiante?.carnet ?? '').includes(q) ||
      v.estudiante?.primerNombre.toLowerCase().includes(q) ||
      v.motivo.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0A2647]">Historial de Visitas</h1>
          <p className="text-sm text-slate-400 mt-0.5">{filtered.length} visita{filtered.length !== 1 ? 's' : ''} registrada{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-blue-50 shadow-sm p-3 sm:p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por carnet, nombre o motivo..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACC1] bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar size={14} className="text-slate-400 shrink-0" />
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)}
            className="text-xs border border-blue-100 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ACC1]" />
          <span className="text-slate-400 text-xs">—</span>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)}
            className="text-xs border border-blue-100 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ACC1]" />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Cargando visitas...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14">
          <FiActivity size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">Sin visitas registradas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${v.alerta ? 'bg-red-400' : 'bg-emerald-400'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-[#0A2647]">
                      {v.estudiante.primerNombre} {v.estudiante.primerApellido}
                    </span>
                    {v.estudiante.carnet && (
                      <span className="text-xs text-slate-400 font-mono">{v.estudiante.carnet}</span>
                    )}
                    {v.estudiante.seccion && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {v.estudiante.seccion.codigo}
                      </span>
                    )}
                    {v.alerta && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <FiBell size={10} /> Alerta emitida
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{v.motivo}</p>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-400">
                    <span>{new Date(v.fechaHora).toLocaleString('es-GT')}</span>
                    {v.temperatura && <span>🌡 {v.temperatura}°C</span>}
                    {v.requiereRetirarse && <span className="text-amber-600 font-medium">🚸 Requirió retirarse</span>}
                  </div>
                  {v.tratamiento && (
                    <p className="text-xs text-slate-500 mt-1.5">
                      <span className="font-medium">Tratamiento:</span> {v.tratamiento}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default { TIPO_LABEL }
