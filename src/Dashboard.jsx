// src/Dashboard.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import DoctorsPanel from "./DoctorsPanel";

// --- CONFIGURACIÓN VISUAL (Ynti Brand) ---
const BRAND = {
  name: "Ynti Eusebio",
  colors: {
    bg: "bg-[#F8F9FC]",
    primary: "bg-brand-600",
    textMain: "text-slate-800",
    textLight: "text-slate-500",
  },
};

// --- ENDPOINTS N8N ---
const API = {
  getAppointments: "https://agente-de-citas-dental-space-n8n.ofcrls.easypanel.host/webhook/get-appointments-ynti",
  toggleBot: "https://agente-de-citas-dental-space-n8n.ofcrls.easypanel.host/webhook/toggle-bot-ynti",
  dashboardAction: "https://agente-de-citas-dental-space-n8n.ofcrls.easypanel.host/webhook/dashboard-action-Ynti",
};

// --- SERVICIOS MÉDICOS ---
const YNTI_SERVICES = [
  "Consulta de Valoración / Primera Vez",
  "Terapia Celular (Células Madre)",
  "Plasma Rico en Plaquetas (PRP)",
  "Sueroterapia Biológica",
  "Exosomas",
  "Tratamiento de Dolor Articular",
  "Rejuvenecimiento Facial"
];

// --- UTILIDADES ---
function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Y";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatPhone(phone) {
  if (!phone) return "";
  return String(phone).replace(/[^\d+]/g, "");
}

function formatDateTime(value) {
  if (!value) return { date: "—", time: "" };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { date: String(value), time: "" };

  const optionsDate = { weekday: "short", day: "numeric", month: "short" };
  const dateStr = d.toLocaleDateString("es-DO", optionsDate);
  const cleanDate = dateStr.replace('.', '');

  const timeStr = d.toLocaleTimeString("es-DO", { hour: "numeric", minute: "2-digit", hour12: true });

  return {
    date: cleanDate.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    time: timeStr.toLowerCase().replace(' ', '')
  };
}

function normalizeAppointment(a) {
  const id = a?.id ?? a?.appointment_id ?? a?.uuid ?? a?._id;
  const patient = a?.title ?? a?.patient ?? a?.nombre ?? a?.full_name ?? "Sin Nombre";

  const resource = a?.resource || {};
  const phone = resource.phone ?? a?.phone ?? a?.telefono ?? "";
  const dt = a?.start ?? a?.datetime ?? a?.fecha_hora ?? "";
  const service = resource.service ?? a?.service ?? a?.servicio ?? "Consulta";
  const specialist = resource.doctor ?? a?.specialist ?? a?.doctor ?? "Sin asignar";
  const status = resource.status ?? a?.status ?? a?.estado ?? "Agendada";
  const origin = resource.source ?? a?.origin ?? a?.origen ?? "manual";
  const notes = a?.notes ?? resource.notes ?? "";

  return { id, patient, phone, datetime: dt, service, specialist, status, origin, notes, raw: a };
}

function getStatusBorderColor(status) {
  const s = String(status || "").toUpperCase();
  if (["AGENDADA", "CONFIRMADA"].includes(s)) return "bg-[#00695C]";
  if (["PENDIENTE", "REPROGRAMADA"].includes(s)) return "bg-amber-500";
  if (["CANCELADA", "NO ASISTIÓ"].includes(s)) return "bg-rose-500";
  if (["COMPLETADA", "FINALIZADA"].includes(s)) return "bg-blue-500";
  return "bg-slate-400";
}

// --- COMPONENTES UI ---

function StatusBadge({ status }) {
  const s = String(status || "").toUpperCase();

  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide border";


  if (["AGENDADA", "CONFIRMADA"].includes(s)) {
    return <span className={`${baseClasses} bg-teal-50 text-teal-700 border-teal-200`}>{status}</span>;
  }
  if (["PENDIENTE", "REPROGRAMADA"].includes(s)) {
    return <span className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-200/60`}>{status}</span>;
  }
  if (["CANCELADA", "NO ASISTIÓ"].includes(s)) {
    return <span className={`${baseClasses} bg-rose-50 text-rose-700 border-rose-200/60`}>{status}</span>;
  }
  if (["COMPLETADA", "FINALIZADA"].includes(s)) {
    return <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200/60`}>{status}</span>;
  }

  return <span className={`${baseClasses} bg-slate-100 text-slate-600 border-slate-200`}>{status || "Pendiente"}</span>;
}

function OriginIcon({ origin }) {
  const isAI = ["ai", "ia", "bot"].includes(String(origin || "").toLowerCase());
  if (isAI) {
    return (
      <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center shadow-sm shadow-purple-200" title="Agendado por IA">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8.01" y2="16" />
          <line x1="16" y1="16" x2="16.01" y2="16" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100" title="Agendado Manualmente">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
}

function SpecialistBadge({ name }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}

function MobileInfoRow({ icon, text, subtext }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 shrink-0">
        {icon}
      </div>
      <div className="text-sm font-medium text-slate-700">
        {text}
        {subtext && <span className="block text-xs text-slate-400 font-normal">{subtext}</span>}
      </div>
    </div>
  )
}

function IconButton({ title, onClick, children, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-xl border transition-all active:scale-95 ${danger ? 'border-rose-200 hover:bg-rose-50 text-rose-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-md shadow-purple-500/20 active:scale-95 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${BRAND.colors.primary} ${className}`}
    >
      {children}
    </button>
  );
}

function generateTimeOptions() {
  const options = [];
  const startHour = 8;
  const endHour = 17;

  for (let h = startHour; h <= endHour; h++) {
    for (let m of [0, 30]) {
      const d = new Date();
      d.setHours(h);
      d.setMinutes(m);
      const timeStr = d.toLocaleTimeString("es-DO", { hour: "numeric", minute: "2-digit", hour12: true });
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      options.push({ value, label: timeStr });
    }
  }
  return options;
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const onLogout = async () => {
    await supabase.auth.signOut();
  };

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [botIsOn, setBotIsOn] = useState(false);

  const [isDoctorsOpen, setIsDoctorsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDanger: false });
  const [resettingMemory, setResettingMemory] = useState(false);

  const [form, setForm] = useState({
    patient: "", phone: "", datetime: "", service: YNTI_SERVICES[0],
    specialist: "", status: "Agendada", origin: "manual", notes: ""
  });

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch(API.getAppointments);
      if (!res.ok) return;

      const text = await res.text();
      if (!text || text.trim() === "") return;

      const json = JSON.parse(text);
      const rawList = Array.isArray(json) ? json : (json.data || []);
      const normalized = rawList.map(normalizeAppointment);
      normalized.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

      setAppointments(normalized);
      if (json.botActive !== undefined) setBotIsOn(json.botActive);
    } catch (error) {
      console.debug("Polling silencioso:", error.message);
    }
  }, []);

  const fetchDoctorsList = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("doctors_config")
        .select("id, name, is_active")
        .eq("is_active", true);
      if (error) throw error;
      setDoctorsList(data || []);
    } catch (e) {
      console.error("Error cargando doctores:", e.message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAppointments(), fetchDoctorsList()]).finally(() => setLoading(false));

    const interval = setInterval(fetchAppointments, 15000);
    return () => clearInterval(interval);
  }, [fetchAppointments, fetchDoctorsList]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const q = query.toLowerCase();
      const matchSearch = String(apt.patient || "").toLowerCase().includes(q) || String(apt.phone || "").includes(q);
      const matchStatus = statusFilter === "ALL" || String(apt.status).toUpperCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [appointments, query, statusFilter]);

  const handleAction = async (actionType, payloadData = {}) => {
    setLoading(true);
    try {
      console.log("Enviando acción:", actionType, payloadData);
      const res = await fetch(API.dashboardAction, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType, ...payloadData })
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      setModalOpen(false);
      setConfirmModal({ ...confirmModal, isOpen: false });
      await fetchAppointments();

    } catch (e) {
      alert("Error ejecutando acción: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN DE GUARDADO (CORREGIDA: ID EN DATA & FORMATO STATUS) ---
  const handleSave = () => {
    const action = editing ? "update" : "create";

    // 1. Calcular hora fin (30 mins después)
    const startDate = new Date(form.datetime);
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    // 2. Sanitizar estado para Airtable (Title Case obligatorio)
    let cleanStatus = form.status;
    const statusMap = {
      "AGENDADA": "Agendada",
      "REPROGRAMADA": "Reprogramada",
      "CANCELADA": "Cancelada",
      "PENDIENTE": "Pendiente",
      "COMPLETADA": "Completada"
    };

    // Convertir mayúsculas a TitleCase
    if (statusMap[String(cleanStatus).toUpperCase()]) {
      cleanStatus = statusMap[String(cleanStatus).toUpperCase()];
    }

    // Si estamos editando una cita que estaba "Agendada" y guardamos cambios, pasa a "Reprogramada"
    if (editing && (String(editing.status).toUpperCase() === 'AGENDADA')) {
      cleanStatus = "Reprogramada";
    }

    // 3. Empaquetar datos (ID va DENTRO de data)
    const payload = {
      data: {
        id: editing?.id, // <--- ID AQUÍ PARA QUE n8n LO LEA
        title: form.patient,
        phone: form.phone,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        service: form.service,
        doctor: form.specialist,
        status: cleanStatus,
        source: form.origin || "manual",
        eventId: editing?.raw?.resource?.eventId
      }
    };

    handleAction(action, payload);
  };

  // --- FUNCIÓN CANCELAR ---
  const handleCancel = (id) => {
    // ID dentro de data también aquí
    handleAction("delete", {
      data: { id, eventId: appointments.find(a => a.id === id)?.raw?.resource?.eventId }
    });
  };

  // --- FUNCIÓN ELIMINAR ---
  const handleDelete = (id) => {
    // ID dentro de data también aquí
    handleAction("hard_delete", {
      data: { id }
    });
  };

  const handleResetMemory = async () => {
    setResettingMemory(true);
    try {
      await handleAction("reset_memory", {});
    } finally {
      setResettingMemory(false);
    }
  };

  const handleToggleBot = async () => {
    const previousState = botIsOn;
    const newState = !previousState;
    setBotIsOn(newState);
    try {
      const res = await fetch(API.toggleBot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newState })
      });
      if (!res.ok) throw new Error("Error de conexión");
    } catch (e) {
      alert("No se pudo conectar con el servidor. Verifica n8n.");
      setBotIsOn(previousState);
    }
  };

  const openModal = (apt = null) => {
    if (apt) {
      setEditing(apt);
      setForm({
        patient: apt.patient, phone: apt.phone,
        datetime: apt.datetime ? new Date(apt.datetime).toISOString().slice(0, 16) : "",
        service: apt.service, specialist: apt.specialist,
        // Status inicial (se limpiará al guardar)
        status: apt.status || "Agendada",
        origin: apt.origin, notes: apt.notes || ""
      });
    } else {
      setEditing(null);
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setForm({
        patient: "", phone: "", datetime: now.toISOString().slice(0, 16),
        service: YNTI_SERVICES[0], specialist: "", status: "Agendada", origin: "manual", notes: ""
      });
    }
    setModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${BRAND.colors.bg} font-sans pb-24 md:pb-0`}>

      {/* --- HEADER --- */}
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-4">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" title="Ir al Inicio">
            <img src="/logo-ynti.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <div className="leading-none">
              <h1 className="text-[19px] md:text-2xl font-bold text-slate-900 tracking-tight">Panel Admin</h1>
            </div>
          </Link>

          {/* Actions Area */}
          <div className="flex items-center gap-3">

            {/* Reset Button */}
            <button
              onClick={handleResetMemory}
              disabled={resettingMemory}
              className={`
                relative flex items-center justify-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl 
                border transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                ${resettingMemory
                  ? 'bg-rose-50 border-rose-100 text-rose-500' // Loading state style
                  : 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100 hover:border-rose-200' // Idel style
                }
              `}
            >
              <div className="flex items-center gap-1.5">
                {resettingMemory ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                )}
                {/* Text: Hidden on very small screens if needed, or shown as requested. Screenshot shows text "Reset" */}
                <span className="text-xs md:text-sm font-bold">{resettingMemory ? '...' : 'Reset'}</span>
              </div>
            </button>

            {/* AI Toggle Button */}
            <button
              onClick={handleToggleBot}
              className={`
                flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border text-xs md:text-sm font-bold transition-all active:scale-95
                ${botIsOn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${botIsOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              {botIsOn ? "IA ON" : "IA OFF"}
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
              title="Cerrar Sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>

          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8">

        {/* Toolbar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Buscar por paciente..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 focus:ring-4 focus:ring-slate-100 focus:border-brand-500 outline-none transition-all shadow-sm" value={query} onChange={e => setQuery(e.target.value)} />
            </div>

            <select className="px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 outline-none hover:border-slate-300 focus:ring-4 focus:ring-slate-100 focus:border-brand-500 cursor-pointer shadow-sm md:w-56 font-medium" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">Todos los estados</option>
              {/* Opción 'Agendada' y otras... */}
              <option value="AGENDADA">Agendada</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:flex md:justify-end gap-3">
            <button onClick={() => setIsDoctorsOpen(true)} className="flex justify-center items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Equipo
            </button>
            <PrimaryButton onClick={() => openModal()} className="flex justify-center items-center gap-2 w-full md:w-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Nueva Cita
            </PrimaryButton>
          </div>
        </div>

        {/* LISTADO */}
        {loading && appointments.length === 0 ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Cargando citas...</div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] uppercase text-slate-400 font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Paciente</th>
                    <th className="px-6 py-5">Fecha</th>
                    <th className="px-6 py-5">Servicio</th>
                    <th className="px-6 py-5">Especialista</th>
                    <th className="px-6 py-5">Estado</th>
                    <th className="px-6 py-5 text-center">Origen</th>
                    <th className="px-6 py-5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAppointments.length > 0 ? filteredAppointments.map(apt => (
                    <tr key={apt.id || Math.random()} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                            {initials(apt.patient)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-[15px] group-hover:text-brand-600 transition-colors">{apt.patient}</div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                              {formatPhone(apt.phone)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-700 text-sm capitalize">{formatDateTime(apt.datetime).date}</div>
                        <div className="text-xs text-slate-400 mt-1 font-medium">{formatDateTime(apt.datetime).time}</div>
                      </td>
                      <td className="px-6 py-6"><span className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-bold border border-slate-100 uppercase tracking-tight">{apt.service}</span></td>
                      <td className="px-6 py-6"><SpecialistBadge name={apt.specialist} /></td>
                      <td className="px-6 py-6"><StatusBadge status={apt.status} /></td>
                      <td className="px-6 py-6 text-center"><OriginIcon origin={apt.origin} /></td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openModal(apt)} title="Editar" className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                          {['CANCELADA', 'Cancelada'].includes(apt.status) ? (
                            <button onClick={() => setConfirmModal({ isOpen: true, title: "Eliminar Cita", message: `¿Eliminar la cita de ${apt.patient}? Esta acción no se puede deshacer.`, onConfirm: () => handleDelete(apt.id), isDanger: true })} title="Eliminar Permanentemente" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                          ) : (
                            <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancelar Cita", message: `¿Seguro que deseas cancelar la cita de ${apt.patient}?`, onConfirm: () => handleCancel(apt.id), isDanger: true })} title="Cancelar" className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="py-12 text-center text-slate-400">No se encontraron resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {filteredAppointments.map(apt => (
                <div key={apt.id || Math.random()} className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusBorderColor(apt.status)}`}></div>
                  <div className="p-5 pl-7">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">{initials(apt.patient)}</div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{apt.patient}</h3>
                          <StatusBadge status={apt.status} />
                        </div>
                      </div>
                      <OriginIcon origin={apt.origin} />
                    </div>
                    <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-3 mb-5 border border-slate-100">
                      <MobileInfoRow icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} text={formatDateTime(apt.datetime).date} />
                      <MobileInfoRow icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} text={formatDateTime(apt.datetime).time} />
                      <MobileInfoRow icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} text={apt.service} />
                      <MobileInfoRow icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} text={apt.specialist} subtext="Especialista" />
                      <MobileInfoRow icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} text={formatPhone(apt.phone)} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => openModal(apt)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Editar</button>
                      {['CANCELADA', 'Cancelada'].includes(apt.status) ? (
                        <button onClick={() => handleDelete(apt.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Eliminar
                        </button>
                      ) : (
                        <button onClick={() => handleCancel(apt.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-400 text-amber-600 font-bold hover:bg-amber-50 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg> Cancelar</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">{editing ? 'Editar Cita' : 'Nueva Cita'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Paciente</label>
                <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                  <input type="tel" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
                  <select className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="Agendada">Agendada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Reprogramada">Reprogramada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Completada">Completada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    value={form.datetime ? form.datetime.slice(0, 10) : ""}
                    onChange={e => {
                      const newDate = e.target.value;
                      const currentTime = form.datetime ? form.datetime.slice(11, 16) : "09:00";
                      const newDateTime = `${newDate}T${currentTime}`;
                      let newStatus = form.status;
                      if (editing && (editing.status === 'AGENDADA' || editing.status?.toUpperCase() === 'AGENDADA')) {
                        newStatus = "Reprogramada";
                      }
                      setForm({ ...form, datetime: newDateTime, status: newStatus });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none"
                      value={form.datetime ? form.datetime.slice(11, 16) : ""}
                      onChange={e => {
                        const newTime = e.target.value;
                        const currentDate = form.datetime ? form.datetime.slice(0, 10) : new Date().toISOString().slice(0, 10);
                        const newDateTime = `${currentDate}T${newTime}`;
                        let newStatus = form.status;
                        if (editing && (editing.status === 'AGENDADA' || editing.status?.toUpperCase() === 'AGENDADA')) {
                          newStatus = "Reprogramada";
                        }
                        setForm({ ...form, datetime: newDateTime, status: newStatus });
                      }}
                    >
                      {generateTimeOptions().map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Servicio</label>
                <select className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                  {YNTI_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Especialista Asignado</label>
                <select className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" value={form.specialist} onChange={e => setForm({ ...form, specialist: e.target.value })}>
                  <option value="">-- Sin asignar / Automático --</option>
                  {doctorsList.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition">Cancelar</button>
              <PrimaryButton onClick={handleSave} className="flex-1" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cita"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className={`text-xl font-bold mb-2 ${confirmModal.isDanger ? 'text-rose-600' : 'text-slate-800'}`}>{confirmModal.title}</h3>
            <p className="text-slate-600 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={confirmModal.onConfirm} className={`flex-1 py-2.5 rounded-xl font-bold text-white shadow-lg ${confirmModal.isDanger ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' : 'bg-purple-600 hover:bg-purple-700'}`}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {isDoctorsOpen && (
        <DoctorsPanel onClose={() => setIsDoctorsOpen(false)} />
      )}

    </div>
  );
}