// src/data/services.jsx
import { Stethoscope, Dna, Droplet, FlaskConical, Atom, Activity, Sparkles } from "lucide-react";

export const SERVICES = [
    {
        slug: "consulta-valoracion",
        title: "Consulta de Valoración",
        description: "Diagnóstico médico de precisión para identificar el origen de tu condición y diseñar un protocolo regenerativo a tu medida.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed">La <strong class="text-brand-700">Consulta de Valoración</strong> es el primer paso fundamental en tu camino hacia la recuperación y el bienestar integral.</p>
            <p class="mb-6 text-slate-600 text-lg leading-relaxed">En Ynti Eusebio Medicina Regenerativa, no nos limitamos a tratar los síntomas. Nuestro enfoque se centra en identificar la <strong class="text-slate-800">causa raíz</strong> de tu condición mediante una evaluación médica exhaustiva que incluye:</p>
            
            <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                <ul class="space-y-4">
                    <li class="flex items-start gap-3 text-slate-700">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">1</span>
                        <span>Revisión detallada de tu historial médico y antecedentes.</span>
                    </li>
                    <li class="flex items-start gap-3 text-slate-700">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">2</span>
                        <span>Exploración física especializada.</span>
                    </li>
                    <li class="flex items-start gap-3 text-slate-700">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">3</span>
                        <span>Análisis de estudios de imagen y laboratorio.</span>
                    </li>
                    <li class="flex items-start gap-3 text-slate-700">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">4</span>
                        <span>Evaluación de tu estado metabólico y celular.</span>
                    </li>
                </ul>
            </div>

            <p class="text-slate-600 text-lg leading-relaxed">Con esta información, diseñamos un <strong class="text-brand-700">protocolo de tratamiento 100% personalizado</strong>, combinando las terapias biológicas más adecuadas para tu organismo (Terapia Celular, Exosomas, PRP, etc.) con el objetivo de maximizar tu capacidad de autocuración.</p>
        `,
        icon: <Stethoscope className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
    {
        slug: "terapia-celular",
        title: "Terapia Celular",
        description: "Implantes de células madre mesenquimales para reparar tejidos dañados, modular la inflamación y potenciar la sanación natural.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed">La <strong class="text-brand-700">Terapia Celular con Células Madre Mesenquimales</strong> representa la vanguardia de la medicina regenerativa.</p>
            <p class="mb-8 text-slate-600 text-lg leading-relaxed">Estas células "maestras" tienen la capacidad única de transformarse en diferentes tipos de tejidos (hueso, cartílago, músculo, tendón) y, lo que es aún más importante, de orquestar el proceso de reparación del cuerpo mediante la liberación de potentes factores de crecimiento.</p>
            
            <h3 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span class="w-1.5 h-8 bg-brand-500 rounded-full"></span>
                Beneficios Principales
            </h3>
            
            <div class="grid gap-4 md:grid-cols-1 mb-8">
                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start">
                    <div class="p-2 bg-brand-50 rounded-lg text-brand-600 mt-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 mb-1">Regeneración Tisular</h4>
                        <p class="text-slate-600 text-sm">Ayudan a reparar tejidos dañados por lesiones o degeneración (artrosis, lesiones deportivas).</p>
                    </div>
                </div>
                
                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start">
                    <div class="p-2 bg-blue-50 text-blue-600 mt-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 mb-1">Potente Antiinflamatorio</h4>
                        <p class="text-slate-600 text-sm">Reducen drásticamente la inflamación crónica sistémica y local.</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start">
                    <div class="p-2 bg-purple-50 text-purple-600 mt-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 mb-1">Inmunomodulación</h4>
                        <p class="text-slate-600 text-sm">Regulan el sistema inmunológico, siendo útiles en enfermedades autoinmunes.</p>
                    </div>
                </div>
            </div>

            <p class="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl border-l-4 border-brand-300">
                Utilizamos células madre de la más alta calidad y viabilidad, aplicadas mediante protocolos seguros y mínimamente invasivos.
            </p>
        `,
        icon: <Dna className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
    {
        slug: "plasma-rico-plaquetas",
        title: "Plasma Rico en Plaquetas (PRP)",
        description: "Concentrado autólogo de factores de crecimiento para acelerar la regeneración de lesiones musculares, tendinosas y articulares.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed">El <strong class="text-brand-700">Plasma Rico en Plaquetas (PRP)</strong> es un tratamiento autólogo, lo que significa que se obtiene de tu propia sangre, eliminando cualquier riesgo de rechazo.</p>
            <p class="mb-8 text-slate-600 text-lg leading-relaxed">Consiste en extraer una pequeña muestra de sangre, que luego se centrifuga para concentrar las plaquetas. Estas plaquetas son ricas en <strong class="text-slate-800">factores de crecimiento</strong>, proteínas clave que actúan como "señalizadores" para iniciar y acelerar el proceso de reparación de los tejidos.</p>
            
            <h3 class="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Indicaciones Comunes</h3>
            
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                    <span class="text-slate-700 font-medium">Tendinitis y tendinosis</span>
                </li>
                <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                    <span class="text-slate-700 font-medium">Lesiones musculares y desgarros</span>
                </li>
                <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                    <span class="text-slate-700 font-medium">Artrosis leve a moderada</span>
                </li>
                <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span class="text-slate-700 font-medium">Rejuvenecimiento facial</span>
                </li>
                                <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-slate-800"></span>
                    <span class="text-slate-700 font-medium">Alopecia (caída del cabello)</span>
                </li>
            </ul>
        `,
        icon: <Droplet className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
    {
        slug: "sueroterapia-biologica",
        title: "Sueroterapia Biológica",
        description: "Infusiones intravenosas de biorreguladores y nutrientes para potenciar tu sistema inmune, desintoxicar y revitalizar tu organismo.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed">La <strong class="text-brand-700">Sueroterapia Biológica</strong> es la forma más rápida y eficiente de nutrir tus células.</p>
            <p class="mb-8 text-slate-600 text-lg leading-relaxed">A diferencia de los suplementos orales, que deben pasar por el sistema digestivo (perdiendo gran parte de su potencia), los sueros intravenosos entregan vitaminas, minerales, antioxidantes y aminoácidos <strong class="text-slate-800">directamente al torrente sanguíneo</strong>, garantizando una absorción del 100%.</p>
            
            <h3 class="text-2xl font-bold text-slate-800 mb-6">Nuestros Cocteles Exclusivos</h3>
            
            <div class="space-y-4">
                <div class="flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                    <div class="text-2xl">🛡️</div>
                    <div>
                        <h4 class="font-bold text-slate-800">Inmuno Boost</h4>
                        <p class="text-slate-600 text-sm">Vitamina C en altas dosis, Zinc y complejos para blindar tus defensas.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4 p-4 rounded-xl bg-green-50/50 border border-green-100">
                    <div class="text-2xl">🌿</div>
                    <div>
                        <h4 class="font-bold text-slate-800">Detox & Cleanse</h4>
                        <p class="text-slate-600 text-sm">Glutatión y quelantes para eliminar toxinas, metales pesados y radicales libres.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4 p-4 rounded-xl bg-yellow-50/50 border border-yellow-100">
                    <div class="text-2xl">⚡</div>
                    <div>
                        <h4 class="font-bold text-slate-800">Energy Revive</h4>
                        <p class="text-slate-600 text-sm">Vitaminas del complejo B y magnesio para combatir la fatiga crónica y el estrés.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                    <div class="text-2xl">✨</div>
                    <div>
                        <h4 class="font-bold text-slate-800">Anti-Aging Glow</h4>
                        <p class="text-slate-600 text-sm">Potentes antioxidantes para frenar el envejecimiento celular y mejorar la piel.</p>
                    </div>
                </div>
            </div>
        `,
        icon: <FlaskConical className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
    {
        slug: "exosomas",
        title: "Exosomas",
        description: "La medicina del futuro: nanovesículas cargadas de información regenerativa para restaurar la comunicación celular y tejidos envejecidos.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed">Los <strong class="text-brand-600">Exosomas</strong> representan la evolución de la terapia celular.</p>
             <p class="mb-6 text-slate-600 text-lg leading-relaxed">Son nanovesículas (pequeñas burbujas) liberadas por las células madre que contienen la "fórmula" de la regeneración: ARN mensajero, microARN, proteínas y factores de crecimiento.</p>
            <div class="bg-indigo-900 text-white p-6 rounded-2xl mb-8 shadow-lg shadow-indigo-200">
                <p class="font-medium text-lg italic">"Imagina que las células madre son las fábricas y los exosomas son los paquetes urgentes que envían con las instrucciones precisas para reparar."</p>
            </div>
            
            <h3 class="text-2xl font-bold text-slate-800 mb-6">Ventajas Superiores</h3>
            <ul class="space-y-4">
                 <li class="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">1</span>
                    <span class="font-medium text-slate-700">Potencia regenerativa concentrada.</span>
                </li>
                 <li class="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">2</span>
                    <span class="font-medium text-slate-700">Sin células vivas ni ADN celular (Mayor seguridad).</span>
                </li>
                 <li class="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">3</span>
                    <span class="font-medium text-slate-700">Ideal para rejuvenecimiento facial y sistémico.</span>
                </li>
            </ul>
        `,
        icon: <Atom className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
    {
        slug: "manejo-dolor",
        title: "Manejo del Dolor",
        description: "Tratamientos mínimamente invasivos para recuperar tu movilidad sin dolor.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed"><strong class="text-red-500">Vivir con dolor no es normal.</strong></p>
            <p class="mb-8 text-slate-600 text-lg leading-relaxed">Nuestra unidad de Manejo del Dolor Intervencionista utiliza tecnología de punta para tratar el dolor desde su origen, evitando en lo posible la cirugía mayor.</p>
            
            <div class="flex flex-col md:flex-row gap-6 mb-8">
                <div class="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                         <span class="text-2xl">🎯</span> Precisión Ecográfica
                    </h4>
                    <p class="text-slate-600 text-sm">Utilizamos <strong>ultrasonido de alta resolución</strong> en tiempo real para asegurar que el tratamiento llegue exactamente al punto de la lesión, maximizando la efectividad.</p>
                </div>
                 <div class="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                         <span class="text-2xl">🚫</span> Sin Cirugía
                    </h4>
                    <p class="text-slate-600 text-sm">Procedimientos ambulatorios, mínimamente invasivos y con una recuperación mucho más rápida que las intervenciones tradicionales.</p>
                </div>
            </div>

            <h3 class="text-xl font-bold text-slate-800 mb-4">Tratamientos Disponibles:</h3>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
                <li class="flex items-center gap-2"><span class="text-brand-500">✓</span> Bloqueos nerviosos</li>
                <li class="flex items-center gap-2"><span class="text-brand-500">✓</span> Hidrodisección de nervios</li>
                <li class="flex items-center gap-2"><span class="text-brand-500">✓</span> Proloterapia</li>
                <li class="flex items-center gap-2"><span class="text-brand-500">✓</span> Radiofrecuencia</li>
            </ul>
        `,
        icon: <Activity className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
    {
        slug: "rejuvenecimiento-facial",
        title: "Rejuvenecimiento Facial",
        description: "Bioestimulación profunda para restaurar la firmeza y luminosidad de la piel, logrando un aspecto joven sin perder naturalidad.",
        content: `
            <p class="mb-4 text-slate-600 text-lg leading-relaxed">Nuestro enfoque de <strong class="text-brand-600">Rejuvenecimiento Facial</strong> se aleja de los "rellenos" artificiales excesivos.</p>
            <p class="mb-8 text-slate-600 text-lg leading-relaxed">Buscamos la <strong class="text-slate-800">bioestimulación</strong>: hacer que tu propia piel vuelva a producir colágeno y elastina de calidad. Combinamos ciencia y arte para lograr una "belleza biológica" que respeta tus facciones.</p>
            
            <h3 class="text-2xl font-bold text-slate-800 mb-6 text-center">Protocolos Estrella</h3>
            
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                    <div class="text-3xl mb-2">🧖‍♀️</div>
                    <h4 class="font-bold text-slate-700 text-sm">Nanopore</h4>
                    <p class="text-xs text-slate-400 mt-1">Inducción de colágeno</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                    <div class="text-3xl mb-2">🧛</div>
                    <h4 class="font-bold text-slate-700 text-sm">Vampire Facelift</h4>
                    <p class="text-xs text-slate-400 mt-1">PRP + Volumen</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                    <div class="text-3xl mb-2">🧬</div>
                    <h4 class="font-bold text-slate-700 text-sm">Exosomas</h4>
                    <p class="text-xs text-slate-400 mt-1">Anti-aging supremo</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                    <div class="text-3xl mb-2">✨</div>
                    <h4 class="font-bold text-slate-700 text-sm">Peeling Bio</h4>
                    <p class="text-xs text-slate-400 mt-1">Renovación suave</p>
                </div>
            </div>
        `,
        icon: <Sparkles className="w-8 h-8" sx={{ strokeWidth: 1.5 }} />,
    },
];
