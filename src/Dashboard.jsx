// src/Dashboard.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import DoctorsPanel from "./DoctorsPanel";
import SessionsPanel from "./SessionsPanel"; // <--- NUEVO COMPONENTE IMPORTADO
import { Bot, User } from "lucide-react";

// --- CONFIGURACIÓN VISUAL (Prometheus / Ynti Brand) ---
const BRAND = {
  name: "Prometheus Regenerative Lab",
  colors: {
    bg: "bg-space-900", // Dark Space Background
    primary: "bg-cyan-neon text-space-900",
    textMain: "text-white",
    textLight: "text-slate-400",
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
  "Terapia Celular Placentaria",
  "Inmunoterapia & Células NK",
  "Matriz Regenerativa Articular",
  "Exosomas Bioactivos",
  "Ozonoterapia Biológica",
  "Sueroterapia IV & Detox",
  "Rejuvenecimiento Bio-Facial",
  "Clínica del Dolor Regenerativa"
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

// --- COMPONENTES UI ---

function StatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-300";

  if (["AGENDADA", "CONFIRMADA"].includes(s)) {
    return <span className={`${baseClasses} bg-bio-500/10 text-bio-400 border-bio-500/20 shadow-[0_0_10px_rgba(0,255,136,0.1)]`}>{status}</span>;
  }
  if (["PENDIENTE", "REPROGRAMADA"].includes(s)) {
    return <span className={`${baseClasses} bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]`}>{status}</span>;
  }
  if (["CANCELADA", "NO ASISTIÓ"].includes(s)) {
    return <span className={`${baseClasses} bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]`}>{status}</span>;
  }
  if (["COMPLETADA", "FINALIZADA"].includes(s)) {
    return <span className={`${baseClasses} bg-cyan-neon/10 text-cyan-neon border-cyan-neon/20 shadow-[0_0_10px_rgba(0,217,255,0.1)]`}>{status}</span>;
  }

  return <span className={`${baseClasses} bg-slate-800 text-slate-400 border-slate-700`}>{status || "Pendiente"}</span>;
}

function OriginIcon({ origin }) {
  const isAI = ["ai", "ia", "bot"].includes(String(origin || "").toLowerCase());
  if (isAI) {
    return (
      <div className="w-10 h-10 rounded-xl bg-quantum-500/10 flex items-center justify-center border border-quantum-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:bg-quantum-500/20 transition-all duration-300" title="Agendado por IA">
        <Bot className="w-5 h-5 text-quantum-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 border border-slate-700/50 shadow-inner group-hover:border-slate-500 transition-all duration-300" title="Agendado Manualmente">
      <User className="w-4 h-4" />
    </div>
  );
}

function SpecialistBadge({ name }) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <div className="w-7 h-7 rounded-full bg-plasma-600/20 text-plasma-500 flex items-center justify-center border border-plasma-500/20">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}

function PrimaryButton({ children, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-bold font-heading tracking-wide shadow-lg shadow-cyan-500/20 active:scale-95 transition-all hover:shadow-cyan-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${BRAND.colors.primary} ${className}`}
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

  // ESTADOS DE LOS PANELES LATERALES
  const [isDoctorsOpen, setIsDoctorsOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false); // <--- ESTADO NUEVO

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

  // --- EFECTO: REALTIME BOT STATE ---
  useEffect(() => {
    const fetchBotState = async () => {
      try {
        const { data, error } = await supabase
          .from('global_config')
          .select('is_active')
          .eq('key', 'bot_master_switch')
          .maybeSingle();

        if (error) console.error("Error fetching bot state:", error);

        if (data) {
          setBotIsOn(data.is_active);
        } else {
          console.warn("Configuración no encontrada, creando default...");
          await supabase.from('global_config').insert([{ key: 'bot_master_switch', is_active: false }]);
        }
      } catch (err) {
        console.error("Error inicializando bot state:", err);
      }
    };
    fetchBotState();

    const channel = supabase
      .channel('global_bot_config')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'global_config',
          filter: "key=eq.bot_master_switch"
        },
        (payload) => {
          if (payload.new && typeof payload.new.is_active === 'boolean') {
            setBotIsOn(payload.new.is_active);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleBot = async () => {
    const newState = !botIsOn;
    setBotIsOn(newState);

    try {
      const { error } = await supabase
        .from('global_config')
        .update({ is_active: newState })
        .eq('key', 'bot_master_switch');

      if (error) throw error;

      fetch(API.toggleBot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newState })
      }).catch(err => console.error("Error notificando webhook n8n:", err));

    } catch (e) {
      console.error("Error actualizando estado IA:", e);
      setBotIsOn(!newState);
      alert("No se pudo sincronizar el estado. Revisa tu conexión.");
    }
  };

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

  const handleSave = () => {
    const action = editing ? "update" : "create";
    const startDate = new Date(form.datetime);
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    let cleanStatus = form.status;
    const statusMap = {
      "AGENDADA": "Agendada",
      "REPROGRAMADA": "Reprogramada",
      "CANCELADA": "Cancelada",
      "PENDIENTE": "Pendiente",
      "COMPLETADA": "Completada"
    };

    if (statusMap[String(cleanStatus).toUpperCase()]) {
      cleanStatus = statusMap[String(cleanStatus).toUpperCase()];
    }

    if (editing && (String(editing.status).toUpperCase() === 'AGENDADA')) {
      cleanStatus = "Reprogramada";
    }

    const payload = {
      data: {
        id: editing?.id,
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

  const handleCancel = (id) => {
    handleAction("delete", {
      data: { id, eventId: appointments.find(a => a.id === id)?.raw?.resource?.eventId }
    });
  };

  const handleDelete = (id) => {
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

  const openModal = (apt = null) => {
    if (apt) {
      setEditing(apt);
      setForm({
        patient: apt.patient, phone: apt.phone,
        datetime: apt.datetime ? new Date(apt.datetime).toISOString().slice(0, 16) : "",
        service: apt.service, specialist: apt.specialist,
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
    <div className={`min-h-screen ${BRAND.colors.bg} font-sans pb-24 md:pb-0 text-slate-300 selection:bg-cyan-neon selection:text-space-950`}>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 glass-panel border-b-0 px-6 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-4" title="Ir al Inicio">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight">
              <span className="md:hidden">PANEL_ADMIN</span>
              <span className="hidden md:inline">Panel Administrativo</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {/* Reset Button */}
            <button
              onClick={handleResetMemory}
              disabled={resettingMemory}
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 border border-white/5
                ${resettingMemory
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-space-800 hover:bg-space-700 text-slate-400 hover:text-cyan-neon hover:border-cyan-neon/30 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                }
              `}
              title="Reset Memoria IA"
            >
              {resettingMemory ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              )}
            </button>

            {/* AI Toggle */}
            <button
              onClick={handleToggleBot}
              className={`
                h-10 px-3 md:px-4 rounded-xl flex items-center gap-2 md:gap-3 text-sm font-semibold transition-all active:scale-95 border
                ${botIsOn
                  ? 'bg-cyan-neon/10 border-cyan-neon/50 text-cyan-neon shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                  : 'bg-space-800 border-white/5 text-slate-500 hover:border-white/20'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full transition-all ${botIsOn ? 'bg-cyan-neon animate-pulse-glow shadow-[0_0_8px_cyan]' : 'bg-slate-600'}`}></div>
              <span className="font-mono tracking-wider hidden xs:inline">AI_AGENT</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${botIsOn ? 'bg-cyan-neon text-space-950' : 'bg-slate-700 text-slate-500'}`}>
                {botIsOn ? "ON" : "OFF"}
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-space-800 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 active:scale-90 transition-all"
              title="Cerrar Sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>

          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">

        {/* Toolbar */}
        <div className="flex flex-col gap-4 glass-panel p-4 md:p-6 rounded-3xl border border-white/5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-neon transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-space-950/50 border border-white/10 text-white text-sm placeholder:text-slate-600 outline-none focus:border-cyan-neon/50 transition-all"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="w-full md:w-48 pl-4 pr-10 py-3 rounded-2xl bg-space-950/50 border border-white/10 text-slate-300 text-sm outline-none cursor-pointer font-medium focus:border-cyan-neon/50 transition-all appearance-none"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Status: ALL</option>
                <option value="AGENDADA">Agendada</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex md:justify-end gap-3 pt-2 border-t border-white/5">

            {/* NUEVO BOTÓN: CHATS ACTIVOS */}
            <button
              onClick={() => setIsSessionsOpen(true)}
              className="flex-1 md:flex-none flex justify-center items-center gap-2.5 px-6 py-2.5 rounded-xl bg-space-800 border border-white/10 hover:bg-space-700 hover:border-cyan-neon/30 hover:text-cyan-neon transition-all active:scale-[0.98] text-slate-300 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Chats Activos
            </button>

            <button onClick={() => setIsDoctorsOpen(true)} className="flex-1 md:flex-none flex justify-center items-center gap-2.5 px-6 py-2.5 rounded-xl bg-space-800 border border-white/10 hover:bg-space-700 hover:border-white/20 transition-all active:scale-[0.98] text-slate-300 font-medium text-sm">
              <svg className="w-4 h-4 text-bio-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Directorio Médico
            </button>
            <PrimaryButton onClick={() => openModal()} className="hidden md:flex justify-center items-center gap-2 w-full md:w-auto text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Nueva Cita
            </PrimaryButton>
          </div>
        </div>

        {/* LISTADO */}
        {loading && appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 gap-4">
            <div className="w-12 h-12 border-4 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin"></div>
            <span className="font-mono text-xs tracking-widest animate-pulse">CARGANDO_DATA_STREAM...</span>
          </div>
        ) : (
          <>
            <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-white/5">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0b101b] border-b border-white/5 text-[10px] uppercase text-slate-500 font-mono tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Paciente</th>
                    <th className="px-6 py-4">Fecha y Hora</th>
                    <th className="px-6 py-4">Servicio</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-center">Origen</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAppointments.length > 0 ? filteredAppointments.map(apt => (
                    <tr key={apt.id || Math.random()} className="group hover:bg-white/[0.02] transition-colors relative">
                      <td className="px-8 py-5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-neon transform scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-space-800 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 border border-white/5 group-hover:border-cyan-neon/30 group-hover:text-cyan-neon transition-all">
                            {initials(apt.patient)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 text-[14px] group-hover:text-white transition-colors tracking-wide">{apt.patient}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1 font-mono">
                              <span className="text-cyan-neon">ID:</span> {formatPhone(apt.phone)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-300 text-sm capitalize">{formatDateTime(apt.datetime).date}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">{formatDateTime(apt.datetime).time}</div>
                      </td>
                      <td className="px-6 py-5"><span className="inline-block px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] border border-white/10 tracking-tight">{apt.service?.substring(0, 25)}{apt.service?.length > 25 && '...'}</span></td>
                      <td className="px-6 py-5"><SpecialistBadge name={apt.specialist} /></td>
                      <td className="px-6 py-5"><StatusBadge status={apt.status} /></td>
                      <td className="px-6 py-5 text-center"><OriginIcon origin={apt.origin} /></td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(apt)} title="Editar" className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-neon hover:bg-cyan-neon/10 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                          {['CANCELADA', 'Cancelada'].includes(apt.status) ? (
                            <button onClick={() => setConfirmModal({ isOpen: true, title: "Eliminar Registro", message: `¿Eliminar la cita de ${apt.patient} de la base de datos?`, onConfirm: () => handleDelete(apt.id), isDanger: true })} title="Eliminar" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                          ) : (
                            <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancelar Cita", message: `¿Confirmar cancelación para ${apt.patient}?`, onConfirm: () => handleCancel(apt.id), isDanger: true })} title="Cancelar" className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="py-20 text-center text-slate-500 font-mono text-sm">No hay citas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}
            <div className="md:hidden space-y-4 pb-28">
              {filteredAppointments.map(apt => (
                <div key={apt.id || Math.random()} className="glass-panel p-5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-neon/5 blur-2xl rounded-full"></div>

                  <div className="flex justify-between items-start mb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-space-950 text-cyan-neon border border-white/10 flex items-center justify-center font-bold font-heading text-sm shadow-inner group-hover:border-cyan-neon/30 transition-colors">
                        {initials(apt.patient)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-[15px] leading-snug truncate max-w-[150px]">{apt.patient}</h3>
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>
                    <OriginIcon origin={apt.origin} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Fecha y Hora</span>
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <svg className="w-3.5 h-3.5 text-cyan-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-medium">{formatDateTime(apt.datetime).date}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono ml-5">{formatDateTime(apt.datetime).time}</span>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Servicio</span>
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <svg className="w-3.5 h-3.5 text-bio-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        <span className="text-xs font-medium truncate">{apt.service}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <button onClick={() => openModal(apt)} className="flex-1 py-3 rounded-xl bg-space-800 text-slate-300 font-bold text-[11px] uppercase tracking-widest border border-white/5 hover:bg-space-700 active:scale-95 transition-all">
                      Detalles
                    </button>
                    {['CANCELADA', 'Cancelada'].includes(apt.status) ? (
                      <button onClick={() => setConfirmModal({ isOpen: true, title: "Eliminar", message: "¿Eliminar?", onConfirm: () => handleDelete(apt.id), isDanger: true })} className="px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 active:scale-95 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    ) : (
                      <button onClick={() => setConfirmModal({ isOpen: true, title: "Cancelar", message: "¿Cancelar?", onConfirm: () => handleCancel(apt.id), isDanger: true })} className="px-4 py-3 rounded-xl bg-space-800 text-slate-500 border border-white/5 active:scale-95 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 bg-space-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-900 w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center shrink-0 bg-space-950/50">
              <h3 className="text-lg font-bold font-heading text-white">{editing ? 'EDITAR CITA' : 'NUEVA CITA'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Nombre Paciente</label>
                <input type="text" className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all" value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Teléfono</label>
                  <input type="tel" className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Estado</label>
                  <select className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all appearance-none" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
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
                  <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Fecha</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all [color-scheme:dark]"
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
                  <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Hora</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all appearance-none"
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
                <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Protocolo / Servicio</label>
                <select className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all appearance-none" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                  {YNTI_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest mb-1.5">Especialista</label>
                <select className="w-full p-3 rounded-lg bg-space-950 border border-white/10 text-white focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/20 outline-none transition-all appearance-none" value={form.specialist} onChange={e => setForm({ ...form, specialist: e.target.value })}>
                  <option value="">-- Asignación Automática (AI) --</option>
                  {doctorsList.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5 bg-black/20 border-t border-white/5 flex gap-3 shrink-0">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 font-bold text-slate-400 hover:bg-white/5 transition">Cancelar</button>
              <PrimaryButton onClick={handleSave} className="flex-1" disabled={loading}>
                {loading ? "Procesando..." : (editing ? "Guardar Cambios" : "Crear Cita")}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-space-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 animate-in zoom-in duration-200">
            <h3 className={`text-xl font-bold font-heading mb-2 ${confirmModal.isDanger ? 'text-rose-500' : 'text-white'}`}>{confirmModal.title}</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-2.5 rounded-xl border border-white/10 font-bold text-slate-400 hover:bg-white/5 transition">Cancelar</button>
              <button onClick={confirmModal.onConfirm} className={`flex-1 py-2.5 rounded-xl font-bold text-white shadow-lg ${confirmModal.isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' : 'bg-cyan-neon text-space-950 hover:bg-cyan-400'}`}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DOCTORES */}
      {isDoctorsOpen && (
        <DoctorsPanel onClose={() => setIsDoctorsOpen(false)} />
      )}

      {/* MODAL GESTIÓN DE SESIONES (NUEVO) */}
      {isSessionsOpen && (
        <SessionsPanel onClose={() => setIsSessionsOpen(false)} />
      )}

      {/* Floating Action Button for Mobile - Premium */}
      <button
        onClick={() => openModal()}
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-cyan-neon text-space-950 rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.4)] backdrop-blur-md flex items-center justify-center z-40 active:scale-90 transition-all border border-white/20 animate-float"
        title="Nueva Cita"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>

    </div>
  );
}