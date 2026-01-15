// src/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, Home, Sparkles, Check } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-cyan-neon selection:text-space-950">

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-neon/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-quantum-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Login Card */}
      <div className="glass-panel w-full max-w-md rounded-[2.5rem] overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-500 relative z-10">

        {/* Header */}
        <div className="p-8 md:p-10 text-center relative">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-neon/10 blur-[80px] rounded-full pointer-events-none"></div>

          {/* Brand */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-[10px] font-mono tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Acceso Seguro</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight mb-2">
              PANEL_ADMIN
            </h1>
            <p className="text-slate-400 text-sm">
              Prometheus Regenerative Lab
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6" autoComplete="off">
          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 text-rose-400 p-4 rounded-2xl text-sm border border-rose-500/20 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest ml-1">Correo Electrónico</label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-neon transition-colors duration-200"
                size={20}
              />
              <input
                type="email"
                autoComplete="off"
                required
                className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl bg-space-950/50 focus:bg-space-950 focus:border-cyan-neon/50 outline-none transition-all duration-200 font-medium text-white placeholder:text-slate-600"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-cyan-neon uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-neon transition-colors duration-200"
                size={20}
              />
              <input
                type="password"
                autoComplete="new-password"
                required
                className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl bg-space-950/50 focus:bg-space-950 focus:border-cyan-neon/50 outline-none transition-all duration-200 font-medium text-white placeholder:text-slate-600"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-cyan-neon border-cyan-neon text-space-950' : 'border-white/20 bg-space-950/50 group-hover:border-cyan-neon/50'}`}>
              {rememberMe && <Check size={14} strokeWidth={3} />}
            </div>
            <span className={`text-sm font-medium transition-colors ${rememberMe ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
              Mantener sesión iniciada
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-neon hover:brightness-110 text-space-950 font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] flex items-center justify-center gap-2 active:scale-[0.98] text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-space-950 border-t-transparent"></div>
                Iniciando...
              </>
            ) : (
              <>
                Acceder <ArrowRight size={20} />
              </>
            )}
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-cyan-neon font-medium transition-colors pt-4 text-sm"
          >
            <Home size={16} />
            Volver al Inicio
          </Link>
        </form>
      </div>
    </div>
  );
}