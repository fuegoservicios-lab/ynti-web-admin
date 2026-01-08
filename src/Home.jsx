import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { ArrowRight, MapPin, Phone, Sparkles, Activity, ShieldCheck, Microscope, Dna, Zap } from "lucide-react";
import { SERVICES } from "./data/services";
import BioNetworkBackground from "./components/BioNetworkBackground";

export default function Home() {
    const [session, setSession] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen bg-space-900 text-slate-200 selection:bg-cyan-neon selection:text-space-950 overflow-x-hidden">
            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-space-950/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold font-heading tracking-tighter text-white transition-colors duration-300">Prometheus</span>
                                <span className="text-[10px] font-mono font-medium text-cyan-neon tracking-[0.3em] uppercase opacity-80">Regenerative Lab</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <a href="https://wa.me/18093993181" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                <Phone className="w-4 h-4 text-bio-500" />
                                +1 (809) 399-3181
                            </a>
                            {session ? (
                                <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-slate-800/50 border border-white/10 hover:border-cyan-neon/50 text-cyan-neon text-xs font-bold font-mono tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]">
                                    <span className="w-2 h-2 rounded-full bg-bio-500 animate-pulse"></span>
                                    <span>Panel</span>
                                </Link>
                            ) : (
                                <Link to="/login" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm backdrop-blur-sm hover:bg-white/10 transition-all">
                                    Acceso
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <BioNetworkBackground />
                </div>


                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-space-800/50 border border-cyan-neon/30 text-cyan-neon text-xs font-mono tracking-widest uppercase mb-10 backdrop-blur-md animate-float">
                        <Sparkles className="w-3 h-3" />
                        <span>Innovación Médica</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tighter leading-tight md:leading-[0.9] mb-6 text-white">
                        MEDICINA <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-plasma-600 to-quantum-500 animate-pulse-glow break-words inline-block mt-2 md:mt-0">
                            REGENERATIVA
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                        Recupera tu vitalidad con protocolos biológicos avanzados. <br />
                        <span className="text-white font-medium">Sin cirugía. Sin dolor. Resultados exponenciales.</span>
                    </p>

                    <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
                        <a
                            href="https://wa.me/18093993181"
                            target="_blank"
                            rel="noreferrer"
                            className="group relative w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-cyan-neon text-space-950 font-bold text-base md:text-lg tracking-wide rounded-xl overflow-hidden transition-transform hover:scale-105 text-center"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                AGENDAR CONSULTA
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </a>
                        <a
                            href="#servicios"
                            className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all text-base md:text-lg text-center"
                        >
                            Ver Tratamientos
                        </a>
                    </div>
                </div>

                {/* Hero Footer Stats */}
                <div className="absolute bottom-6 md:bottom-10 inset-x-0 w-full">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:justify-between items-center gap-4 border-t border-white/5 pt-4 md:pt-6">
                        <div className="hidden md:block text-slate-500 text-xs font-mono">
                            SYSTEM_STATUS: <span className="text-bio-500">OPTIMAL</span>
                        </div>
                        <div className="flex justify-center gap-6 md:gap-8 w-full md:w-auto">
                            {[
                                { number: "15+", label: "Años Exp." },
                                { number: "2k+", label: "Pacientes" },
                                { number: "98%", label: "Éxito" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-xl md:text-2xl font-bold font-heading text-white">{stat.number}</div>
                                    <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- REGENERATIVE MEDICINE INFO --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="relative z-10 space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-xs font-bold uppercase tracking-wider">
                                    <Dna className="w-4 h-4" />
                                    <span>Ciencia Avanzada</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
                                    ¿Qué es la <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-blue-500">Medicina Regenerativa?</span>
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Es la rama de la medicina enfocada en <span className="text-white font-medium">reemplazar, diseñar o regenerar</span> células, tejidos u órganos humanos para restaurar una función normal.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    A diferencia de los tratamientos tradicionales que solo gestionan los síntomas, nuestras terapias estimulan los mecanismos de auto-sanación del cuerpo a nivel molecular.
                                </p>

                                <div className="grid gap-6 pt-4">
                                    {[
                                        { title: "Terapia Celular", desc: "Uso de células madre y exosomas para reparación tisular.", icon: <Microscope className="w-5 h-5" /> },
                                        { title: "Bio-Longevidad", desc: "Optimización de la edad biológica y vitalidad celular.", icon: <Activity className="w-5 h-5" /> },
                                        { title: "Recuperación Acelerada", desc: "Reducción drástica de tiempos de sanación en lesiones.", icon: <Zap className="w-5 h-5" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-neon/30 transition-colors">
                                            <div className="shrink-0 w-10 h-10 rounded-full bg-space-950 flex items-center justify-center text-cyan-neon border border-white/10">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative h-[400px] md:h-[600px] w-full block">
                            {/* Images Composition */}
                            <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-cyan-neon/10 z-10 hover:scale-[1.02] transition-transform duration-500">
                                <img src="/images/regen_2.png" alt="Human Bio-Interface" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-space-900/80 to-transparent"></div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 z-20 hover:scale-[1.02] transition-transform duration-500">
                                <img src="/images/regen_1.png" alt="Cellular Regeneration" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-space-900/80 to-transparent"></div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-neon/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SERVICES GRID --- */}
            <section id="servicios" className="py-32 relative">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-neon/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                                Protocolos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-bio-500">Avanzados</span>
                            </h2>
                            <p className="text-slate-400 max-w-md text-lg">
                                Terapias regenerativas diseñadas molecularmente para restaurar tejidos y funciones vitales.
                            </p>
                        </div>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-neon/50 to-transparent mx-8 hidden md:block"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {SERVICES.map((service, index) => (
                            <Link
                                to={`/servicios/${service.slug}`}
                                key={index}
                                className="group relative bg-space-900/60 backdrop-blur-md border border-white/5 hover:border-cyan-neon/50 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.1)] hover:-translate-y-2"
                            >
                                {/* Card Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-space-950 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-neon/50 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all duration-300">
                                        <div className="text-cyan-neon group-hover:text-white transition-colors duration-300">
                                            {service.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4 font-heading group-hover:text-cyan-neon transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 border-l-2 border-white/10 pl-4 group-hover:border-cyan-neon/50 transition-colors">
                                        {service.description.substring(0, 90)}...
                                    </p>

                                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-neon font-bold tracking-widest uppercase">
                                        <span>EXPLORAR_DATA</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- DOCTOR PROFILE / TRUST --- */}
            <section className="py-32 relative bg-space-950 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 flex flex-col-reverse md:flex-row items-center gap-12 relative overflow-hidden group hover:border-cyan-neon/20 transition-colors duration-500">

                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-neon/5 rounded-full blur-[100px] pointer-events-none -mr-32 -mt-32"></div>

                        <div className="flex-1 space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-quantum-500/10 border border-quantum-500/30 text-quantum-500 text-xs font-bold uppercase tracking-wider">
                                <Microscope className="w-4 h-4" />
                                <span>Director Médico</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white leading-[1.1]">
                                Ciencia aplicada a tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-400 to-bio-600">Bienestar</span>.
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed font-light">
                                "El futuro de la medicina no está en tratar la enfermedad, sino en potenciar la salud desde el nivel celular. En Prometheus, utilizamos bio-tecnología de vanguardia para activar tus propios mecanismos de reparación."
                            </p>

                            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                                <div>
                                    <div className="text-2xl font-bold text-white font-heading">Dr. Ynti Eusebio</div>
                                    <div className="text-xs text-cyan-neon uppercase tracking-[0.2em] font-mono mt-1">MD, Regenerative Specialist</div>
                                </div>
                                <div className="h-12 w-[1px] bg-white/10"></div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-space-950 flex items-center justify-center border border-white/10 text-slate-400 hover:text-cyan-neon hover:border-cyan-neon/50 transition-all">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-space-950 flex items-center justify-center border border-white/10 text-slate-400 hover:text-bio-500 hover:border-bio-500/50 transition-all">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="relative w-full md:w-[400px] aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group-hover:scale-[1.02] transition-transform duration-700">
                            <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent z-10"></div>
                            <img
                                src="/dr-ynti-profile-new.jpg"
                                alt="Dr. Ynti Eusebio"
                                className="w-full h-full object-cover object-top scale-105"
                            />

                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-space-900/80 backdrop-blur-md border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-cyan-neon/20 flex items-center justify-center text-cyan-neon shrink-0 animate-pulse">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Visionario Médico</div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">Top 1% Regenerative Medicine</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-20 border-t border-white/5 bg-space-950 text-center relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold font-heading text-white tracking-tight mb-2">Prometheus</h2>
                    <p className="text-xs font-mono text-cyan-neon tracking-[0.3em] uppercase mb-8">Regenerative Lab &copy; {new Date().getFullYear()}</p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 text-slate-400">
                        <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-neon/20 transition-colors">
                                <MapPin className="w-4 h-4 group-hover:text-cyan-neon" />
                            </div>
                            <span className="text-sm">San Pedro de Macorís, RD</span>
                        </div>
                        <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-bio-500/20 transition-colors">
                                <Phone className="w-4 h-4 group-hover:text-bio-500" />
                            </div>
                            <span className="text-sm">+1 (809) 399-3181</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-8 text-xs font-bold tracking-widest text-slate-600 uppercase">
                        <Link to="/privacidad" className="hover:text-cyan-neon transition-colors">Privacidad</Link>
                        <Link to="/terminos" className="hover:text-cyan-neon transition-colors">Términos</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
