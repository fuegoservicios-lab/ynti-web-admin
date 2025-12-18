// src/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, CheckSquare, Home } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
  const [password, setPassword] = useState(import.meta.env.VITE_ADMIN_PASSWORD || '');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [logoOk, setLogoOk] = useState(true);
  const LOGO_SRC = "/logo-ynti.png"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // CORRECCIÓN 1: 'bg-gradient-to-br' -> 'bg-linear-to-br'
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-brand-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        {/* CORRECCIÓN 2: 'bg-gradient-to-r' -> 'bg-linear-to-r' */}
        <div className="bg-linear-to-r from-brand-600 to-brand-700 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-6 scale-150 origin-top-left"></div>

          {/* Logo Container */}
          <div className="bg-white/95 w-32 h-32 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm relative z-10 overflow-hidden p-2">
            {logoOk ? (
              <img
                src={LOGO_SRC}
                alt="Ynti Eusebio"
                className="w-full h-full object-contain scale-[1.75]"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-3xl tracking-tight">
                YE
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-white relative z-10 tracking-tight">Ynti Eusebio</h2>
          <p className="text-brand-100 text-sm font-medium relative z-10 mt-1">
            Panel de Administración
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico</label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors duration-200"
                size={20}
              />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-200 font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors duration-200"
                size={20}
              />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-200 font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setRememberMe(!rememberMe)}
          >
            <div
              className={`w-6 h-6 rounded-[0.4rem] border-2 flex items-center justify-center transition-all duration-200 ${rememberMe
                ? 'bg-brand-600 border-brand-600 shadow-sm shadow-brand-200'
                : 'bg-slate-50 border-slate-300 group-hover:border-brand-400'
                }`}
            >
              {rememberMe && <CheckSquare size={16} className="text-white" />}
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              Mantener sesión iniciada
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 flex items-center justify-center gap-2 active:scale-[0.98] text-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Iniciando...
              </>
            ) : (
              <>
                Entrar al Dashboard <ArrowRight size={20} />
              </>
            )}
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-brand-600 font-medium transition-colors mt-4"
          >
            <Home size={18} />
            Volver a la página principal
          </Link>
        </form>
      </div>
    </div>
  );
}