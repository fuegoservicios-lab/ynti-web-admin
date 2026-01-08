// src/SessionsPanel.jsx
import React, { useEffect, useState } from 'react';
import { X, MessageSquare, User, Bot, RefreshCw, Smartphone } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function SessionsPanel({ onClose }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para limpiar el ID de WhatsApp y dejar solo el número
    const cleanPhone = (id) => {
        if (!id) return 'N/A';
        return id
            .replace(/@s\.whatsapp\.net/g, '')
            .replace(/s\.whatsapp\.net/g, '')
            .replace(/swhatsappnet/g, '')
            .replace(/@lid/g, '')
            .replace(/lid/g, '')
            .replace(/@g\.us/g, '')
            .replace(/g\.us/g, '')
            .trim();
    };

    // Función para formatear la fecha de última interacción
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('es-DO', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
    };

    // 1. Cargar sesiones iniciales
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('session_states')
                .select('*')
                .order('updated_at', { ascending: false }); // Los más recientes primero

            if (error) throw error;
            setSessions(data || []);
        } catch (error) {
            console.error('Error cargando sesiones:', error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Alternar Pausa (El interruptor mágico)
    const togglePause = async (sessionId, currentStatus) => {
        const newStatus = !currentStatus;

        // Actualización optimista (para que se sienta instantáneo)
        setSessions(prev => prev.map(s => s.session_id === sessionId ? { ...s, is_paused: newStatus } : s));

        try {
            const { error } = await supabase
                .from('session_states')
                .update({ is_paused: newStatus, updated_at: new Date().toISOString() })
                .eq('session_id', sessionId);

            if (error) throw error;
        } catch (error) {
            console.error('Error actualizando estado:', error);
            fetchSessions(); // Revertir si falla
        }
    };

    // 3. Suscripción Realtime (Para ver si entra alguien nuevo o cambia estado solo)
    useEffect(() => {
        fetchSessions();

        const channel = supabase
            .channel('realtime_sessions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'session_states' }, (payload) => {
                // Simplemente recargamos la lista para mantener el orden correcto por fecha
                fetchSessions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-[6px] animate-in fade-in duration-300">
            <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

            <div className="relative w-full max-w-[380px] sm:max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/40 font-sans">

                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-indigo-600"></div>

                {/* Header */}
                <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-cyan-600 shadow-sm border border-cyan-100/50">
                            <Smartphone size={24} className="drop-shadow-sm" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-800 leading-tight">
                                Chats Activos
                            </h2>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-0.5 opacity-80">
                                Intervención Humana
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all active:scale-90 hover:rotate-90 duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 bg-slate-50/30 scroll-smooth">
                    {loading && sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                            <div className="relative">
                                <RefreshCw className="animate-spin w-10 h-10 text-cyan-500" />
                                <div className="absolute inset-0 blur-lg bg-cyan-400/20 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-sm font-semibold tracking-wide text-slate-400">Sincronizando chats...</span>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.session_id}
                                className={`group relative flex flex-col items-stretch p-5 rounded-[24px] border transition-all duration-500 hover:translate-y-[-2px] ${session.is_paused
                                    ? 'bg-amber-50/40 border-amber-200/50 shadow-[0_8px_30px_-12px_rgba(245,158,11,0.15)]'
                                    : 'bg-white border-slate-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-12px_rgba(34,211,238,0.15)]'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-5">
                                    <div className={`shrink-0 w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl shadow-inner relative overflow-hidden ${session.is_paused
                                        ? 'bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600 border border-amber-200/50'
                                        : 'bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600 border border-cyan-100/50'
                                        }`}>
                                        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/40 blur-2xl rounded-full"></div>
                                        {session.is_paused ? <User size={26} /> : <Bot size={26} />}
                                    </div>

                                    <div className="min-w-0 flex-1 pt-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h3 className="font-bold text-slate-800 font-mono text-base tracking-tight leading-none">
                                                {cleanPhone(session.session_id)}
                                            </h3>
                                            {!session.is_paused && (
                                                <div className="flex gap-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce duration-700"></span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce duration-700 delay-150"></span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce duration-700 delay-300"></span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                                {formatDate(session.updated_at)}
                                            </span>
                                            {session.is_processing && (
                                                <span className="text-[10px] text-cyan-600 font-black italic animate-pulse tracking-wide">
                                                    TYPING...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => togglePause(session.session_id, session.is_paused)}
                                    className={`relative w-full py-3.5 rounded-[18px] text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-300 active:scale-[0.97] overflow-hidden group/btn ${session.is_paused
                                        ? 'bg-white text-amber-600 border-2 border-amber-100 hover:bg-amber-50 hover:border-amber-200 shadow-sm'
                                        : 'bg-[#0f172a] text-cyan-400 border border-slate-700 shadow-[0_10px_20px_-10px_rgba(15,23,42,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(34,211,238,0.2)]'
                                        }`}
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-10 pointer-events-none transition-opacity duration-300 ${session.is_paused ? 'bg-amber-400' : 'bg-cyan-400'}`}></div>

                                    <span className="relative flex items-center justify-center gap-2.5">
                                        {session.is_paused ? (
                                            <>REACTIVAR BOT</>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
                                                PAUSAR <span className="opacity-40 font-normal tracking-normal text-[10px]">(HUMANO)</span>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        ))
                    )}

                    {!loading && sessions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-6">
                            <div className="w-20 h-20 rounded-[30px] bg-slate-100/50 flex items-center justify-center border-2 border-dashed border-slate-200/50 animate-pulse">
                                <MessageSquare size={36} className="text-slate-300" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-slate-500">Sin actividad reciente</p>
                                <p className="text-xs text-slate-400 mt-1">Los nuevos chats aparecerán aquí</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="p-5 bg-white/80 backdrop-blur-xl border-t border-slate-100/50">
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 flex items-start gap-3 border border-slate-100/50">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                            <span className="text-[10px] font-bold text-slate-500">i</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                            <strong className="text-slate-700">Control Inteligente:</strong> Pausar detiene la automatización para permitir soporte humano manual directo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}