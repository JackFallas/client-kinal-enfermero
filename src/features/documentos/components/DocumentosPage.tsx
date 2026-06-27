import { useState } from 'react'
import { FiSearch, FiFolder, FiCheckCircle, FiClock } from 'react-icons/fi'
import { getDocumentosEstudiante, verificarDocumento, type Documento } from '../../../shared/api/documentos'
import toast from 'react-hot-toast'

const TIPO_LABEL: Record<string, string> = {
  CARTA_ALERGIA: 'Carta de Alergia',
  CARTA_MEDICA:  'Carta Médica',
  OTRO:          'Otro',
}

export const DocumentosPage = () => {
  const [carnet, setCarnet]       = useState('')
  const [docs, setDocs]           = useState<Documento[]>([])
  const [searched, setSearched]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [verifying, setVerifying] = useState<number | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carnet.trim()) return
    setLoading(true)
    try {
      const { data } = await getDocumentosEstudiante(carnet.trim())
      setDocs(data)
      setSearched(true)
    } catch {
      toast.error('Estudiante no encontrado o sin documentos')
      setDocs([])
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificar = async (id: number) => {
    setVerifying(id)
    try {
      await verificarDocumento(id)
      setDocs((prev) => prev.map((d) => d.id === id ? { ...d, verificado: true } : d))
      toast.success('Documento verificado')
    } catch {
      toast.error('Error al verificar')
    } finally {
      setVerifying(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#0A2647]">Documentos Médicos</h1>
        <p className="text-sm text-slate-400 mt-0.5">Busca y verifica documentos de estudiantes por carnet</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text" value={carnet} onChange={(e) => setCarnet(e.target.value.replace(/\D/g, '').slice(0, 7))}
            placeholder="Ingresa el carnet (7 dígitos)"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACC1]"
          />
        </div>
        <button type="submit" disabled={loading}
          className="bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-[#144272] hover:to-[#00ACC1] transition-all disabled:opacity-60">
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {searched && docs.length === 0 && (
        <div className="text-center py-12">
          <FiFolder size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Sin documentos para este estudiante</p>
        </div>
      )}

      {docs.length > 0 && (
        <div className="space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-[#0A2647]">{d.nombreArchivo}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{TIPO_LABEL[d.tipo]}</span>
                  {d.verificado
                    ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><FiCheckCircle size={10} /> Verificado</span>
                    : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1"><FiClock size={10} /> Pendiente</span>
                  }
                </div>
                {d.descripcion && <p className="text-xs text-slate-500">{d.descripcion}</p>}
                <p className="text-xs text-slate-400 mt-0.5">{new Date(d.subidoEn).toLocaleDateString('es-GT')}</p>
              </div>
              {!d.verificado && (
                <button onClick={() => handleVerificar(d.id)} disabled={verifying === d.id}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60 shrink-0">
                  {verifying === d.id ? 'Verificando...' : 'Verificar'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
