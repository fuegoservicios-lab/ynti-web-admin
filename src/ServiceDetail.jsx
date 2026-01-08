// src/ServiceDetail.jsx
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { SERVICES } from "./data/services";
import { useEffect } from "react";

export default function ServiceDetail() {
    const { slug } = useParams();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Buscar el servicio correspondiente al slug
    const service = SERVICES.find(s => s.slug === slug);

    // Si no se encuentra el servicio, redirigir a Home
    if (!service) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen font-sans selection:bg-cyan-neon selection:text-space-950 pb-20">

            {/* --- NAVBAR FLOTANTE --- */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-space-950/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                    <Link
                        to="/"
                        className="group flex items-center gap-3 text-slate-400 hover:text-cyan-neon transition-colors font-medium"
                    >
                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-cyan-neon/10 group-hover:border-cyan-neon/30 transition-all">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span className="tracking-wide">Volver al Inicio</span>
                    </Link>

                    <Link to="/" className="hidden sm:flex flex-col items-end">
                        <span className="text-lg font-bold font-heading text-white tracking-tight">Prometheus</span>
                        <span className="text-[10px] font-mono text-cyan-neon tracking-[0.3em] uppercase opacity-80">Regenerative Lab</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-32 md:pt-40">

                {/* --- HEADER HERO --- */}
                <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 border-white/10 group hover:border-cyan-neon/20 transition-colors">

                    {/* Background Decorative Glows */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-neon/10 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-bio-500/5 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-space-950 border border-white/10 text-cyan-neon flex items-center justify-center shadow-[0_0_30px_rgba(0,217,255,0.15)] shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            {/* Icon Glow */}
                            <div className="absolute inset-0 bg-cyan-neon/10 blur-xl"></div>
                            <div className="transform scale-150 relative z-10 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">
                                {service.icon}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-neon/5 border border-cyan-neon/20 text-cyan-neon text-xs font-mono font-bold uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                <span>Protocolo Clínico Avanzado</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white leading-tight tracking-tight drop-shadow-lg">
                                {service.title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light border-l-2 border-cyan-neon/30 pl-5">
                                {service.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- CONTENIDO DETALLADO --- */}
                <div className="glass-panel p-8 md:p-16 rounded-[2.5rem] border border-white/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                    {/* 
                        CUSTOM PROSE STYLE FOR DARK MODE 
                        Optimized for readability on dark backgrounds with neon accents 
                    */}
                    <div
                        className="
                            prose prose-lg prose-invert max-w-none
                            
                            /* Headings */
                            prose-headings:font-heading prose-headings:font-bold prose-headings:text-white
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-transparent prose-h3:bg-clip-text prose-h3:bg-gradient-to-r prose-h3:from-cyan-neon prose-h3:to-white
                            
                            /* Paragraphs */
                            prose-p:text-slate-300 prose-p:leading-loose prose-p:font-light
                            
                            /* Lists */
                            prose-ul:my-8 prose-li:my-3 prose-li:text-slate-300
                            prose-li:marker:text-cyan-neon
                            
                            /* Strong/Bold */
                            prose-strong:text-cyan-neon prose-strong:font-bold prose-strong:tracking-wide
                            
                            /* Blockquotes / Highlights specifically for 'lead' class */
                            [&_.lead]:text-xl [&_.lead]:text-white [&_.lead]:font-medium [&_.lead]:leading-9 [&_.lead]:mb-10 
                            [&_.bg-blue-50]:bg-space-950/50 [&_.bg-blue-50]:border-cyan-neon/50 [&_.bg-blue-50]:text-slate-200 [&_.bg-blue-50]:rounded-2xl [&_.bg-blue-50]:p-8
                        "
                        dangerouslySetInnerHTML={{ __html: service.content }}
                    />

                    {/* --- CTA SECTION --- */}
                    <div className="mt-20 pt-16 border-t border-white/10 flex flex-col items-center text-center relative">
                        {/* Background glow for CTA */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-32 bg-cyan-neon/5 blur-[60px] pointer-events-none"></div>

                        <h3 className="text-3xl font-bold font-heading text-white mb-6">
                            ¿Es este el tratamiento ideal para ti?
                        </h3>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                            Cada organismo es único. Nuestro equipo médico evaluará tu caso para personalizar este protocolo a tu perfil biológico.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
                            <a
                                href="https://wa.me/18093993181"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-cyan-neon text-space-950 font-bold text-lg tracking-wide hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:scale-105 transition-all duration-300 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <CalendarCheck className="w-6 h-6" />
                                <span className="relative">Solicitar Valoración</span>
                            </a>
                        </div>

                        <div className="mt-8 flex items-center gap-6 text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-bio-500" />
                                Presencial
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-quantum-500" />
                                Telemedicina
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}