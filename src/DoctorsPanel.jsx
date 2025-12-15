// src/DoctorsPanel.jsx
import React, { useEffect, useState } from 'react';
import { X, Power, User, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function DoctorsPanel({ onClose }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // --- 1. CARGAR DOCTORES ---
  const fetchDoctors = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('doctors_config')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error cargando doctores:', error);
      setErrorMsg('No se pudo cargar la lista de especialistas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // --- 2. CAMBIAR ESTADO (ON/OFF) ---
  const toggleDoctor = async (id, currentStatus) => {
    const previousDoctors = [...doctors];
    const newStatus = !currentStatus;

    setDoctors(prev => prev.map(d => d.id === id ? { ...d, is_active: newStatus } : d));

    try {
      const { error } = await supabase
        .from('doctors_config')
        .update({ is_active: newStatus })
        .eq('id', id);

      if (error) throw error;
      console.log(`Doctor ${id} actualizado a ${newStatus}`);

    } catch (error) {
      console.error('Error actualizando:', error);
      setDoctors(previousDoctors);
      alert("Error de conexión: No se pudo cambiar el estado.");
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100 font-sans">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Equipo Médico</h2>
            <p className="text-slate-500 text-sm mt-0.5">Disponibilidad para citas IA</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F7FB]">
          
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{errorMsg}</span>
                <button onClick={fetchDoctors} className="ml-auto p-1 hover:bg-rose-100 rounded">
                    <RefreshCw size={16} />
                </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
               <RefreshCw size={30} className="animate-spin text-purple-400" />
               <p className="text-sm">Cargando especialistas...</p>
            </div>
          ) : doctors.length === 0 && !errorMsg ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <p>No hay doctores registrados.</p>
            </div>
          ) : (
            doctors.map((doc) => (
              <div 
                key={doc.id} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  doc.is_active 
                    ? 'bg-white border-purple-100 shadow-sm shadow-purple-100/50' 
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* CORRECCIÓN AQUÍ: bg-linear-to-br */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm transition-all duration-300 ${
                    doc.is_active 
                      ? 'bg-linear-to-br from-[#FF3EA5] to-[#7B61FF] text-white scale-100' 
                      : 'bg-slate-200 text-slate-400 grayscale scale-95'
                  }`}>
                    {doc.name ? doc.name.charAt(0).toUpperCase() : <User size={20}/>}
                  </div>
                  
                  <div>
                    <h3 className={`font-bold transition-colors ${doc.is_active ? 'text-slate-800' : 'text-slate-500'}`}>
                        {doc.name || "Doctor sin nombre"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${doc.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        <span className={`text-xs font-medium ${doc.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {doc.is_active ? 'Disponible' : 'No disponible'}
                        </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleDoctor(doc.id, doc.is_active)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-200 ${
                    doc.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  title={doc.is_active ? "Desactivar disponibilidad" : "Activar disponibilidad"}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                      doc.is_active ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    <Power size={14} className={doc.is_active ? "text-emerald-500" : "text-slate-400"} />
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white text-center shrink-0">
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Al desactivar un especialista, el Asistente de IA dejará de ofrecer sus horarios a los pacientes inmediatamente.
            </p>
        </div>

      </div>
    </div>
  );
}