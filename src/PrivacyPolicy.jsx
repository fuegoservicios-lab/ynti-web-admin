import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50">
                <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="w-5 h-5" /> Volver al Inicio
                </Link>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Política de Privacidad</h1>
                <p className="text-slate-400 mb-8">Última actualización: {new Date().getFullYear()}</p>

                <div className="prose prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 max-w-none">
                    <p>En <strong>Prometheus Regenerative Lab</strong>, la confidencialidad y "seguridad" de tus datos personales son una prioridad absoluta. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información que nos proporcionas.</p>

                    <h3>1. Información que Recopilamos</h3>
                    <p>Podemos recopilar información personal que nos proporcionas voluntariamente al agendar una cita, suscribirte a nuestro boletín o completar formularios en nuestro sitio web. Esto puede incluir:</p>
                    <ul>
                        <li>Nombre completo.</li>
                        <li>Información de contacto (correo electrónico, número de teléfono).</li>
                        <li>Información demográfica básica.</li>
                        <li>Datos médicos relevantes para tu consulta (estrictamente confidenciales).</li>
                    </ul>

                    <h3>2. Uso de la Información</h3>
                    <p>La información recopilada se utiliza exclusivamente para:</p>
                    <ul>
                        <li>Proporcionarte los servicios médicos y de consultoría solicitados.</li>
                        <li>Contactarte para confirmar citas o hacer seguimiento a tu tratamiento.</li>
                        <li>Enviarte información relevante sobre salud y bienestar (si has aceptado recibirla).</li>
                        <li>Mejorar la experiencia de usuario en nuestro sitio web.</li>
                    </ul>

                    <h3>3. Protección de Datos</h3>
                    <p>Implementamos medidas de seguridad técnicas y organizativas rigurosas para proteger tus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción.</p>

                    <h3>4. Confidencialidad Médica</h3>
                    <p>Toda la información relacionada con tu estado de salud, diagnósticos y tratamientos se maneja con el más estricto secreto profesional, cumpliendo con todas las normativas éticas y legales vigentes en la República Dominicana.</p>

                    <h3>5. Uso de Cookies</h3>
                    <p>Nuestro sitio web puede utilizar cookies para mejorar la funcionalidad y analizar el tráfico. Puedes configurar tu navegador para rechazar las cookies si así lo prefieres.</p>

                    <h3>6. Contacto</h3>
                    <p>Si tienes preguntas sobre esta política o el manejo de tus datos, por favor contáctanos a través de los canales oficiales disponibles en este sitio web.</p>
                </div>
            </div>
        </div>
    );
}
