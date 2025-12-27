import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50">
                <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="w-5 h-5" /> Volver al Inicio
                </Link>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Términos y Condiciones</h1>
                <p className="text-slate-400 mb-8">Última actualización: {new Date().getFullYear()}</p>

                <div className="prose prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 max-w-none">
                    <p>Bienvenido al sitio web de <strong>Prometheus Regenerative Lab</strong>. Al acceder y utilizar este sitio, aceptas cumplir con los siguientes términos y condiciones.</p>

                    <h3>1. Uso del Sitio Web</h3>
                    <p>El contenido de este sitio web tiene fines informativos y educativos. No sustituye en ningún caso el consejo, diagnóstico o tratamiento médico profesional. Siempre debes consultar a un médico calificado para cualquier duda sobre tu salud.</p>

                    <h3>2. Propiedad Intelectual</h3>
                    <p>Todo el contenido, diseños, logotipos y materiales presentados en este sitio son propiedad de Prometheus Regenerative Lab o cuentan con las licencias correspondientes. Queda prohibida su reproducción sin autorización expresa.</p>

                    <h3>3. Servicios Médicos</h3>
                    <p>La información sobre tratamientos y procedimientos es general. Los resultados pueden variar de un paciente a otro. La elegibilidad para ciertos tratamientos se determinará exclusivamente mediante una consulta médica personalizada.</p>

                    <h3>4. Limitación de Responsabilidad</h3>
                    <p>No nos hacemos responsables por el uso indebido de la información contenida en este sitio web. Nos esforzamos por mantener la información actualizada, pero no garantizamos que esté libre de errores u omisiones.</p>

                    <h3>5. Enlaces Externos</h3>
                    <p>Este sitio puede contener enlaces a sitios web de terceros. No tenemos control sobre el contenido o las prácticas de privacidad de dichos sitios y no asumimos responsabilidad por ellos.</p>

                    <h3>6. Modificaciones</h3>
                    <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuo del sitio después de cualquier cambio constituirá tu aceptación de dichos cambios.</p>
                </div>
            </div>
        </div>
    );
}
