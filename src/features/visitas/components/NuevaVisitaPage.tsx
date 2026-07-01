import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiUser, FiFileText, FiPhone, FiCheckCircle, FiX } from 'react-icons/fi'
import { createVisita } from '../../../shared/api/visitas'
import { getEstudiantePorCarnet, type EstudiantePerfil } from '../../../shared/api/estudiantes'
import { getDocumentosEstudiante, type Documento } from '../../../shared/api/documentos'
import { getContactosDeEstudiante, type ContactoEmergencia } from '../../../shared/api/contactosEmergencia'
import toast from 'react-hot-toast'

const inputCls = "w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent shadow-sm bg-white"

const Field = ({ label, value, onChange, type = 'text', placeholder = '', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean
}) => (
  <div>
    <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">{label}</label>
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      className={inputCls}
    />
  </div>
)

const SiNoToggle = ({ value, onChange, siLabel = 'Sí', noLabel = 'No' }: {
  value: boolean | null; onChange: (v: boolean) => void; siLabel?: string; noLabel?: string
}) => (
  <div className="flex gap-2">
    <button type="button" onClick={() => onChange(true)}
      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
        value === true ? 'bg-[#0E6BA8] text-white border-[#0E6BA8]' : 'bg-white text-slate-500 border-blue-200 hover:bg-blue-50'
      }`}>
      {siLabel}
    </button>
    <button type="button" onClick={() => onChange(false)}
      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
        value === false ? 'bg-slate-500 text-white border-slate-500' : 'bg-white text-slate-500 border-blue-200 hover:bg-blue-50'
      }`}>
      {noLabel}
    </button>
  </div>
)

const EMPTY_FORM = { motivo: '', descripcion: '', temperatura: '', tratamiento: '', observaciones: '', mensajeAlerta: '' }

export const NuevaVisitaPage = () => {
  const navigate = useNavigate()

  // Búsqueda de estudiante
  const [carnetBusqueda, setCarnetBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [estudiante, setEstudiante] = useState<EstudiantePerfil | null>(null)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [contactos, setContactos] = useState<ContactoEmergencia[]>([])

  // Formulario de visita
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [seMidioTemperatura, setSeMidioTemperatura] = useState<boolean | null>(null)
  const [requiereRetirarse, setRequiereRetirarse] = useState<boolean | null>(null)
  const [emitirAlerta, setEmitirAlerta] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: keyof typeof EMPTY_FORM, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carnetBusqueda.trim()) return
    setBuscando(true)
    try {
      const [{ data: perfil }, docsRes, contactosRes] = await Promise.all([
        getEstudiantePorCarnet(carnetBusqueda.trim()),
        getDocumentosEstudiante(carnetBusqueda.trim()).catch(() => ({ data: [] })),
        getContactosDeEstudiante(carnetBusqueda.trim()).catch(() => ({ data: [] })),
      ])
      setEstudiante(perfil)
      setDocumentos(docsRes.data)
      setContactos(contactosRes.data)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Estudiante no encontrado')
      setEstudiante(null)
    } finally {
      setBuscando(false)
    }
  }

  const cambiarEstudiante = () => {
    setEstudiante(null)
    setDocumentos([])
    setContactos([])
    setCarnetBusqueda('')
    setForm({ ...EMPTY_FORM })
    setSeMidioTemperatura(null)
    setRequiereRetirarse(null)
    setEmitirAlerta(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estudiante) return
    setLoading(true)
    try {
      await createVisita({
        estudianteCarnet: estudiante.carnet,
        motivo: form.motivo,
        descripcion: form.descripcion || undefined,
        temperatura: seMidioTemperatura && form.temperatura ? Number(form.temperatura) : undefined,
        tratamiento: form.tratamiento || undefined,
        observaciones: form.observaciones || undefined,
        requiereRetirarse: requiereRetirarse ?? false,
        emitirAlerta,
        mensajeAlerta: form.mensajeAlerta || undefined,
      })
      toast.success('Visita registrada')
      navigate('/portal/visitas')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al registrar la visita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#0A2647]">Registrar Visita</h1>
        <p className="text-sm text-slate-400 mt-0.5">Ingresa el carnet del estudiante para empezar</p>
      </div>

      {/* Búsqueda por carnet */}
      {!estudiante && (
        <form onSubmit={handleBuscar} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 sm:p-6">
          <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Carnet del estudiante *</label>
          <div className="flex gap-2">
            <input
              type="text" value={carnetBusqueda} onChange={(e) => setCarnetBusqueda(e.target.value)}
              placeholder="2023001" required autoFocus className={inputCls}
            />
            <button type="submit" disabled={buscando}
              className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60">
              <FiSearch size={15} /> {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      )}

      {/* Ficha del estudiante encontrado */}
      {estudiante && (
        <>
          <div className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white font-bold shrink-0">
                  {estudiante.primerNombre[0]}{estudiante.primerApellido[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#0A2647]">{estudiante.primerNombre} {estudiante.primerApellido}</p>
                  <p className="text-xs text-slate-400 font-mono">{estudiante.carnet}{estudiante.seccion && ` · ${estudiante.seccion.codigo} — ${estudiante.seccion.nombre}`}</p>
                </div>
              </div>
              <button onClick={cambiarEstudiante} type="button"
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 shrink-0">
                <FiX size={14} /> Cambiar
              </button>
            </div>

            {/* Documentos */}
            <div className="mt-4 pt-3 border-t border-blue-50">
              <p className="text-xs font-bold text-[#144272] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiFileText size={12} /> Documentos ({documentos.length})
              </p>
              {documentos.length === 0 ? (
                <p className="text-xs text-slate-400">Sin documentos registrados</p>
              ) : (
                <div className="space-y-1.5">
                  {documentos.map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-2.5 py-1.5">
                      <span className="text-slate-600">{d.tipo === 'CARTA_ALERGIA' ? 'Carta de alergia' : d.tipo === 'CARTA_MEDICA' ? 'Carta médica' : 'Otro'}{d.descripcion ? ` — ${d.descripcion}` : ''}</span>
                      {d.verificado && <FiCheckCircle className="text-emerald-500 shrink-0" size={13} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contactos de emergencia */}
            <div className="mt-3 pt-3 border-t border-blue-50">
              <p className="text-xs font-bold text-[#144272] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiPhone size={12} /> Contactos de emergencia ({contactos.length})
              </p>
              {contactos.length === 0 ? (
                <p className="text-xs text-slate-400">Sin contactos registrados</p>
              ) : (
                <div className="space-y-1.5">
                  {contactos.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-2.5 py-1.5">
                      <span className="text-slate-600"><span className="font-medium text-[#0A2647]">{c.nombre}</span> · {c.parentesco}</span>
                      <span className="font-mono text-slate-500">{c.telefono}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0A2647]">
              <FiUser className="text-[#0E6BA8]" /> Datos de la visita
            </div>

            <Field label="Motivo *" value={form.motivo} onChange={(v) => set('motivo', v)} placeholder="Dolor de cabeza, fiebre..." required />

            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Descripción</label>
              <textarea
                value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)}
                rows={3} placeholder="Descripción detallada del motivo de visita..."
                className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent resize-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">¿Se midió la temperatura?</label>
              <SiNoToggle value={seMidioTemperatura} onChange={setSeMidioTemperatura} />
              {seMidioTemperatura && (
                <div className="mt-3">
                  <Field label="¿Cuánto fue? (°C)" value={form.temperatura} onChange={(v) => set('temperatura', v)} type="number" placeholder="37.0" />
                </div>
              )}
            </div>

            <Field label="Tratamiento" value={form.tratamiento} onChange={(v) => set('tratamiento', v)} placeholder="Paracetamol 500mg, reposo..." />

            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Observaciones</label>
              <textarea
                value={form.observaciones} onChange={(e) => set('observaciones', e.target.value)}
                rows={2}
                className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent resize-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">¿El alumno requiere retirarse?</label>
              <SiNoToggle value={requiereRetirarse} onChange={setRequiereRetirarse} />
            </div>

            <div className="border-t border-blue-50 pt-4 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={emitirAlerta} onChange={(e) => setEmitirAlerta(e.target.checked)} className="w-4 h-4 accent-[#0E6BA8]" />
                <span className="text-sm font-medium text-[#0A2647]">Emitir alerta al coordinador de sección</span>
              </label>
              {emitirAlerta && (
                <div>
                  <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Mensaje de la alerta</label>
                  <textarea
                    value={form.mensajeAlerta} onChange={(e) => set('mensajeAlerta', e.target.value)}
                    rows={2} placeholder="Describe la situación para el coordinador..."
                    className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent resize-none shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="button" onClick={cambiarEstudiante}
                className="flex-1 border border-blue-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60">
                {loading ? 'Guardando...' : 'Registrar visita'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
