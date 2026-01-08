import {
    Dna,
    Activity,
    ShieldCheck,
    Zap,
    HeartPulse,
    Sparkles,
    Droplet,
    Layers
} from "lucide-react";

export const SERVICES = [
    {
        slug: "terapia-celular-placentaria",
        title: "Terapia Celular Placentaria",
        description: "El poder regenerativo del origen. Células derivadas de placenta posparto con máxima potencia biológica.",
        icon: <Dna size={32} />,
        content: `
            <p class="lead">Accede a la fuente más potente de regeneración humana. Utilizamos células derivadas de tejido placentario posparto, éticamente obtenidas y procesadas bajo estándares biotecnológicos de grado farmacéutico.</p>
            
            <h3>¿Por qué Placenta?</h3>
            <p>A diferencia de las células madre adultas (obtenidas de grasa o médula ósea), las células de origen placentario poseen una "juventud biológica" superior. Tienen mayor capacidad de proliferación, plasticidad y potencia para reparar tejidos dañados.</p>
            
            <div class="bg-blue-50 p-6 rounded-2xl my-6 border-l-4 border-brand-500">
                <strong>La ventaja inmunológica:</strong> Estas células tienen propiedades inmunomoduladoras naturales (similares a cómo la madre tolera al bebé), lo que las hace seguras y altamente efectivas para reducir la inflamación sistémica sin riesgo de rechazo.
            </div>

            <h3>Aplicaciones Clínicas</h3>
            <ul>
                <li>Regeneración de tejidos desgastados por la edad (artrosis, degeneración).</li>
                <li>Modulación del sistema inmunológico en enfermedades autoinmunes.</li>
                <li>Revitalización sistémica y protocolos de longevidad avanzados.</li>
            </ul>
        `
    },
    {
        slug: "inmunoterapia-natural-killer",
        title: "Inmunoterapia & Células NK",
        description: "Fortalece tu primera línea de defensa. Potenciación del sistema inmune para combatir patógenos y células senescentes.",
        icon: <ShieldCheck size={32} />,
        content: `
            <p>Basado en los avances científicos sobre células <strong>Natural Killer (NK)</strong> placentarias. Este protocolo está diseñado para optimizar la capacidad de tu cuerpo para detectar, atacar y eliminar amenazas biológicas.</p>

            <h3>Defensa Celular Activa</h3>
            <p>Las células NK son los "centinelas" de élite del sistema inmune. Con la edad, su actividad disminuye. Nuestro protocolo busca restaurar esta vigilancia inmunológica, ayudando a:</p>
            <ul>
                <li><strong>Eliminar células senescentes:</strong> Conocidas como células "zombies", estas acumulan daño y aceleran el envejecimiento sistémico.</li>
                <li><strong>Combatir infecciones virales latentes:</strong> Refuerza la respuesta ante virus que se esconden en el organismo.</li>
                <li><strong>Vigilancia inmunológica:</strong> Mejora la capacidad del cuerpo para detectar células anómalas en etapas tempranas.</li>
            </ul>
        `
    },
    {
        slug: "matriz-regenerativa-articular",
        title: "Matriz Regenerativa Articular",
        description: "Biomateriales avanzados (Scaffolds) derivados de membrana amniótica para reparar articulaciones y tendones.",
        icon: <Layers size={32} />,
        content: `
            <p>Inspirado en tecnologías de ingeniería de tejidos (como <em>Biovance®</em> o <em>Interfyl®</em>), utilizamos matrices de tejido conectivo placentario descelularizado para salvar tus articulaciones.</p>

            <h3>Más allá de la lubricación simple</h3>
            <p>No solo lubricamos la articulación; proveemos un "andamiaje" (scaffold) biológico rico en colágeno, elastina, fibronectina y factores de crecimiento. Esto crea el entorno estructural necesario para que tu cuerpo repare:</p>
            
            <ul>
                <li>Defectos del cartílago y osteoartritis avanzada.</li>
                <li>Lesiones tendinosas crónicas (tendinosis).</li>
                <li>Fascitis plantar rebelde y desgarros musculares.</li>
            </ul>

            <p>Este biomaterial actúa como una base estructural inteligente que guía a tus propias células para cerrar heridas y reparar tejidos dañados, reduciendo drásticamente la fibrosis (cicatrices internas).</p>
        `
    },
    {
        slug: "exosomas-bioactivos",
        title: "Exosomas Bioactivos",
        description: "Mensajería celular de alta precisión. Nanovesículas que reprograman tus células para sanar.",
        icon: <Zap size={32} />,
        content: `
            <p>La próxima frontera de la medicina regenerativa. Los exosomas no son células, son las "cartas" (vesículas) que las células jóvenes envían para instruir a otras células a regenerarse y desinflamarse.</p>

            <h3>Señalización Pura sin Células</h3>
            <p>Utilizamos exosomas purificados de origen placentario cargados de:</p>
            <ul>
                <li><strong>miARN (Micro ARN):</strong> Instrucciones genéticas para apagar genes inflamatorios.</li>
                <li><strong>Factores de Crecimiento:</strong> Señales potentes para estimular la angiogénesis (nuevos vasos sanguíneos) y la producción de colágeno.</li>
            </ul>

            <p>Es el tratamiento ideal para rejuvenecimiento facial sin cirugía, recuperación deportiva acelerada y tratamiento de neuropatías periféricas.</p>
        `
    },
    {
        slug: "ozonoterapia-biologica",
        title: "Ozonoterapia Biológica",
        description: "Oxigenación mitocondrial y optimización del metabolismo celular.",
        icon: <Activity size={32} />,
        content: `
            <p>La energía de la vida depende del oxígeno. Potenciamos la capacidad de tus mitocondrias para producir energía (ATP) mediante la administración controlada de ozono médico.</p>
            
            <h3>Beneficios Clave</h3>
            <ul>
                <li><strong>Efecto Germicida:</strong> Elimina bacterias, virus y hongos resistentes.</li>
                <li><strong>Antiinflamatorio Sistémico:</strong> Modula la cascada inflamatoria crónica.</li>
                <li><strong>Mejora Reológica:</strong> Hace que la sangre fluya mejor, oxigenando tejidos isquémicos o dañados.</li>
            </ul>
            <p>Funciona en sinergia perfecta con terapias celulares, preparando el "terreno" para maximizar la supervivencia de las células implantadas.</p>
        `
    },
    {
        slug: "sueroterapia-intravenosa",
        title: "Sueroterapia IV & Detox",
        description: "Nutrición celular directa. Cócteles biológicos para energía, inmunidad y detoxificación.",
        icon: <Droplet size={32} />,
        content: `
            <p>Restablece el equilibrio bioquímico de tu cuerpo. Diseñamos formulaciones intravenosas personalizadas para evitar la barrera digestiva y nutrir tus células al 100% de biodisponibilidad.</p>
            
            <h3>Protocolos Disponibles</h3>
            <ul>
                <li><strong>Protocolo Myers Plus:</strong> Energía y vitalidad inmediata para fatiga crónica.</li>
                <li><strong>Quelación Biológica:</strong> Eliminación segura de metales pesados y toxinas acumuladas.</li>
                <li><strong>Mega-Dosis Vitamina C:</strong> Potenciador inmune y efecto pro-oxidante selectivo contra células anómalas.</li>
                <li><strong>Glutatión:</strong> El antioxidante maestro para limpieza hepática y luminosidad de la piel.</li>
            </ul>
        `
    },
    {
        slug: "rejuvenecimiento-facial",
        title: "Rejuvenecimiento Bio-Facial",
        description: "Belleza desde el ADN. Regeneración de piel mediante factores de crecimiento autólogos y alogénicos.",
        icon: <Sparkles size={32} />,
        content: `
            <p>Olvída los rellenos artificiales que solo "tapan" el problema. Utilizamos la biología avanzada para revertir el envejecimiento cutáneo desde adentro hacia afuera.</p>
            
            <h3>El enfoque Prometheus</h3>
            <p>Combinamos <strong>Microneedling médico</strong> con la aplicación tópica e intradérmica de exosomas y plasma rico en plaquetas (PRP) de alta concentración.</p>
            
            <ul>
                <li>Estimulación masiva de colágeno tipo I y III (el colágeno de la juventud).</li>
                <li>Mejora visible de la densidad, textura y luminosidad de la piel.</li>
                <li>Tratamiento efectivo para cicatrices de acné, poros dilatados y manchas solares.</li>
            </ul>
        `
    },
    {
        slug: "tratamiento-dolor-cronico",
        title: "Clínica del Dolor Regenerativa",
        description: "Abordaje integral para dolor de espalda, neuropatías y lesiones deportivas.",
        icon: <HeartPulse size={32} />,
        content: `
            <p>Un enfoque multidisciplinario para el dolor que no responde a tratamientos convencionales. No solo enmascaramos el dolor; buscamos reparar el tejido que lo causa.</p>
            
            <h3>Ortobiología Intervencionista</h3>
            <p>Utilizamos guía ecográfica (ultrasonido) para depositar los biológicos exactamente donde se necesitan:</p>
            <ul>
                <li>Bloqueos nerviosos regenerativos (hidrodisección).</li>
                <li>Inyecciones intra-articulares e intra-tendinosas.</li>
                <li>Tratamiento de hernias discales sin cirugía abierta.</li>
            </ul>
            <p>Permite a los pacientes recuperar su movilidad y reducir significativamente la dependencia de analgésicos y opioides.</p>
        `
    }
];