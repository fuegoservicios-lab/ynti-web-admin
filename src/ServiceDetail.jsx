// src/ServiceDetail.jsx
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { SERVICES } from "./data/services"; // Asegúrate de que la ruta sea correcta

export default function ServiceDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Buscar el servicio correspondiente al slug
    const service = SERVICES.find(s => s.slug === slug);

    // Si no se encuentra el servicio, redirigir a Home (o a una página 404)
    if (!service) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans">
            {/* Navbar Simple */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-16 flex items-center">
                <div className="max-w-4xl mx-auto px-4 w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Volver</span>
                    </Link>

                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                {/* Header del Servicio */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden mb-10">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-brand-100 text-brand-600 flex items-center justify-center shadow-inner shrink-0">
                            {/* Renderizamos el icono pasando props de tamaño si es necesario, aunque ya vienen con clase w-8 h-8 del data, aquí podemos forzar más tamaño con clonado o envoltorio */}
                            <div className="transform scale-150">
                                {service.icon}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                                {service.title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido Detallado */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div
                        className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-brand-700 max-w-none"
                        dangerouslySetInnerHTML={{ __html: service.content }}
                    />

                    {/* CTA en el detalle */}
                    <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center text-center">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">
                            ¿Es este el tratamiento adecuado para ti?
                        </h3>
                        <a
                            href="https://wa.me/18093993181"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand-600 text-white font-bold text-lg shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:-translate-y-1 transition-all"
                        >
                            <CalendarCheck className="w-6 h-6" />
                            Agendar Valoración
                        </a>
                        <p className="mt-4 text-sm text-slate-400">
                            Consulta disponible presencial o virtual.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
