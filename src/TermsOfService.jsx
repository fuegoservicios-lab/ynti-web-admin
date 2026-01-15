import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50">
                <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="w-5 h-5" /> Volver al Inicio
                </Link>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Términos y Condiciones</h1>
                <p className="text-slate-400 mb-8">Última actualización: {new Date().getFullYear()}</p>

                <div className="prose prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 max-w-none text-justify">
                    <p>
                        Bienvenido al portal oficial de <strong>Prometheus Regenerative Lab</strong>, dirigido por el <strong>Dr. Ynti Eusebio</strong>,
                        médico certificado y especialista en Medicina Regenerativa. Al acceder y utilizar este sitio web, usted acepta cumplir con los
                        siguientes términos y condiciones, los cuales rigen la relación entre el paciente/usuario y nuestra práctica médica.
                    </p>

                    <h3>1. Naturaleza del Servicio Médico</h3>
                    <p>
                        Prometheus Regenerative Lab es una práctica médica especializada debidamente acreditada. Los servicios y tratamientos descritos en este sitio
                        se realizan bajo estrictos protocolos médicos y éticos. El Dr. Ynti Eusebio cuenta con las credenciales y licencias necesarias para ejercer
                        la medicina y aplicar terapias regenerativas en la República Dominicana.
                    </p>

                    <h3>2. Carácter Informativo del Sitio Web</h3>
                    <p>
                        El contenido de este sitio web (textos, gráficos, imágenes y otros materiales) tiene fines exclusivamente informativos y educativos.
                        <strong>No sustituye en ningún caso el consejo, diagnóstico o tratamiento médico profesional directo.</strong>
                        Aunque la información es provista por un profesional certificado, cada caso clínico es único. Nunca debe ignorar el consejo médico profesional
                        ni demorar su búsqueda debido a algo que haya leído en este sitio.
                    </p>

                    <h3>3. Consentimiento y Procedimientos</h3>
                    <p>
                        La mención de tratamientos específicos (como terapia celular, exosomas, etc.) no garantiza su idoneidad para todos los pacientes.
                        La elegibilidad para cualquier procedimiento se determina única y exclusivamente tras una valoración médica presencial, donde se discutirán
                        los beneficios, riesgos y alternativas, formalizándose a través del Consentimiento Informado correspondiente.
                    </p>

                    <h3>4. Propiedad Intelectual</h3>
                    <p>
                        Todo el contenido, incluyendo la marca "Prometheus Regenerative Lab", logotipos, textos científicos y material gráfico, es propiedad intelectual
                        del Dr. Ynti Eusebio o cuenta con las licencias de uso pertinentes. Queda estrictamente prohibida su reproducción, distribución o uso comercial
                        sin la autorización expresa y por escrito del titular.
                    </p>

                    <h3>5. Privacidad y Confidencialidad</h3>
                    <p>
                        Nos comprometemos a proteger la privacidad de sus datos personales y médicos conforme a las leyes de protección de datos vigentes y
                        a los principios de confidencialidad médico-paciente. Cualquier información proporcionada a través de formularios de contacto será tratada
                        con la máxima reserva.
                    </p>

                    <h3>6. Agendamiento y Cancelaciones</h3>
                    <p>
                        El sistema de citas en línea es una herramienta facilitadora. Prometheus Regenerative Lab se reserva el derecho de reprogramar citas por motivos
                        de fuerza mayor o emergencias médicas, notificando al paciente a la brevedad posible.
                    </p>

                    <h3>7. Modificaciones</h3>
                    <p>
                        Nos reservamos el derecho de actualizar estos términos para reflejar cambios en nuestra práctica médica o en la legislación aplicable.
                        Le recomendamos revisar esta página periódicamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
