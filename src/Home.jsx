import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { CheckCircle2, ArrowRight, MapPin, Phone, MessageCircle } from "lucide-react";
import { SERVICES } from "./data/services";



export default function Home() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans selection:bg-brand-200 selection:text-brand-900">
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 md:h-24">
                        {/* Logo más grande aún, responsive */}
                        <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                            <img src="/logo-ynti.png" alt="Ynti Eusebio" className="h-24 md:h-32 w-auto transform transition-transform duration-500 group-hover:scale-105" />
                            <div className="flex flex-col">
                                <span className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-brand-700 transition-colors">Prometheus</span>
                                <span className="hidden sm:block text-[10px] md:text-xs font-semibold text-brand-600 tracking-[0.2em] uppercase mt-0.5">Regenerative Lab</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href="https://wa.me/18093993181"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all active:scale-95 group"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                <span>Agendar Cita</span>
                            </a>
                            {session ? (
                                <Link
                                    to="/dashboard"
                                    className="px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 hover:border-brand-300 transition-all text-[11px] md:text-sm active:scale-95 flex items-center gap-1 md:gap-2 shadow-sm order-first sm:order-none"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                    </span>
                                    Panel Admin
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm active:scale-95"
                                >
                                    Acceso
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION REIMAGINED --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden items-center flex flex-col justify-center min-h-[85vh]">
                {/* Background Decoration */}
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-bg.png"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-[#F8F9FC] mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        Innovación Médica
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Medicina <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">Regenerativa</span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-slate-500 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Recupera tu vitalidad con protocolos biológicos avanzados.
                        <span className="block mt-2 text-slate-400 text-lg">Sin cirugía. Sin dolor. Resultados reales.</span>
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                        <a
                            href="https://wa.me/18093993181"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white text-lg font-bold shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] transition-all transform active:scale-95"
                        >
                            <svg className="w-6 h-6 text-brand-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Agendar Consulta
                        </a>
                        <a
                            href="#servicios"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 text-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                        >
                            Conocer Tratamientos
                        </a>
                    </div>
                </div>
            </section>

            {/* --- SERVICES GRID --- */}
            <section id="servicios" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Servicios
                        </h2>
                        <div className="w-24 h-1.5 bg-brand-500 mx-auto mt-6 rounded-full opacity-80"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {SERVICES.map((service, index) => (
                            <Link
                                to={`/servicios/${service.slug}`}
                                key={index}
                                className="group relative bg-[#F8FAFC] rounded-[2rem] p-8 border border-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-accent-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 text-brand-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    {service.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-700 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-sm flex-grow">
                                    {service.description}
                                </p>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-brand-600 font-bold text-sm transition-all duration-300 opacity-100 translate-x-0 md:opacity-0 md:-translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                                    Saber más <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- DOCTOR PROFILE / TRUST SECTION --- */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px]"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                                Experiencia y Tecnología <br />
                                <span className="text-brand-400">al Servicio de tu Salud</span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
                                En Prometheus Regenerative Lab combinamos la ciencia médica más avanzada con un enfoque profundamente humano. Cada tratamiento es único, diseñado específicamente para optimizar la capacidad regenerativa de tu propio cuerpo.
                            </p>
                            <ul className="space-y-4 text-left inline-block">
                                {[
                                    "Protocolos personalizados y seguimiento continuo",
                                    "Tecnología de última generación certificada",
                                    "Enfoque holístico para resultados duraderos",
                                    "Atención exclusiva y confidencial"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-200">
                                        <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-3xl transform rotate-3 opacity-30 blur-lg"></div>
                            <div className="relative bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl">👨‍⚕️</div>
                                    <div>
                                        <h4 className="font-bold text-xl">Dr. Ynti Eusebio</h4>
                                        <p className="text-brand-400 text-sm">Director Médico</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 italic">
                                    "Nuestro objetivo no es solo tratar síntomas, sino restaurar la funcionalidad y vitalidad desde el origen celular."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- FOOTER --- */}
            <footer className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">


                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Prometheus Regenerative Lab</h2>
                    <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
                        Medicina regenerativa de precisión y terapias biológicas avanzadas para recuperar tu vitalidad desde el origen.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10 text-slate-600 font-medium">
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-brand-600 transition-colors">
                            <div className="p-2 bg-slate-50 rounded-full group-hover:bg-brand-50 transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="text-sm">C. Toledo 2, San Pedro de Macorís 21000</span>
                        </div>

                        <a href="https://wa.me/18093993181" className="flex items-center gap-2 group cursor-pointer hover:text-brand-600 transition-colors">
                            <div className="p-2 bg-slate-50 rounded-full group-hover:bg-brand-50 transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <span className="text-sm">+1 (809) 399-3181</span>
                        </a>
                    </div>

                    <div className="flex items-center justify-center gap-8 border-t border-slate-100 pt-8">
                        <Link to="/privacidad" className="text-xs text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-wider font-semibold">Privacidad</Link>
                        <Link to="/terminos" className="text-xs text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-wider font-semibold">Términos</Link>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">© {new Date().getFullYear()} Prometheus</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
