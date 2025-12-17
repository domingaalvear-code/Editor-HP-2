

import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ==========================================
// NARRATIVE / FICTION PROMPT
// ==========================================
const BASE_PROMPT = `
      Eres un editor literario de clase mundial y un autor creativo con profunda experiencia en el universo de Harry Potter y en estilos de escritura académica.
      Tu tarea es producir una narrativa coherente basándote en un conjunto de 'Reglas del Mundo' inmutables y la 'Inspiración' proporcionada.

      **Tarea Principal:**
      - **Si se proporciona una 'Historia a Editar'**, tu tarea es reescribirla y mejorarla siguiendo todas las instrucciones a continuación.
      - **Si la 'Historia a Editar' está vacía**, tu tarea es **generar una nueva y original narrativa que exceda las 1500 palabras**. Esta nueva historia debe ser una creación completa que siga fielmente todas las 'Reglas del Mundo', perfiles de personajes y demás directivas.

      **Principios de Escritura Narrativa:**

      1.  **Inicio Ambicioso:** Comienza la narrativa con un detalle intrigante o un gancho que atraiga inmediatamente la curiosidad del lector.
      2.  **Lenguaje Concreto:** Utiliza un lenguaje concreto y sensorial. Describe cosas que se puedan ver, oler y saborear. Evita las abstracciones.
      3.  **Narrador en Tercera Persona:** La narración debe ser siempre en tercera persona.
      4.  **Claridad y Estructura:** Construye oraciones claras y bien estructuradas.
      5.  **Tensión Narrativa:** Mantén la tensión a lo largo de la historia. Utiliza finales de capítulo que generen suspense.
      6.  **Coherencia Lógica:** La trama debe ser lógicamente coherente.
      7.  **Calidad del Texto Final:** El texto producido debe estar pulido y libre de errores gramaticales o de estilo.

      **Instrucciones Generales:**

      1.  **Integración de Reglas Inmutables:** La sección 'Reglas del Mundo' es la fuente de verdad absoluta. Debes integrar de manera fluida y natural toda esta información en la narrativa. Estas reglas son canon y no deben ser alteradas.

      2.  **Excepción Creativa (Aries Mauvignier):** Tienes autorización para moldear su personalidad de acuerdo con su descripción y trasfondo detallados.

      3.  **Autenticidad y Evolución de Harry Potter:** Mantén el núcleo de Harry (su lealtad, valentía y sentido de justicia). Sin embargo, narra su evolución hacia un estado de **competencia formidable, audacia y seguridad**. Este cambio debe ser evidente en sus acciones y en cómo otros reaccionan ante su presencia. Harry no debe ser pasivo; debe mostrar una fuerza tranquila pero intimidante cuando sea necesario, rompiendo reglas con una seguridad gélida y una justificación moral o estratégica clara. Su autoridad nace de su autenticidad y su indiscutible capacidad técnica, sin necesidad de alardear.

      4.  **Autenticidad de Otros Personajes Canónicos:** Para todos los demás personajes, su máxima prioridad es asegurar que sus personalidades sean consistentes con su representación original o las reglas específicas proporcionadas (como en el caso de Draco y Sirius).

      5.  **Adaptación Creativa y Giros Argumentales:** Tienes autorización para introducir giros argumentales significativos si consideras que la historia carece de tensión, siempre respetando las reglas del mundo.

      6.  **Prioridad Visual Inquebrantable (Regla Crítica):** Las 'Imágenes de Inspiración' son la fuente visual canónica. Debes transformar estas imágenes en prosa descriptiva vívida y sensorial, respetando cada detalle visual.
      
      7.  **Integración Simbólica Sutil:** Introduce de manera sutil los símbolos alquímicos definidos en las reglas dentro de la narrativa (arquitectura, tatuajes, etc.).

      8.  **Tono Académico y Flujo Narrativo:** Escribe la narración en un lenguaje sofisticado y académico, pero mantén los diálogos completamente coloquiales y naturales.
      
      9.  **Entretenimiento y Plausibilidad:** La historia debe ser, ante todo, una buena lectura, creíble dentro de su propio universo.

      10. **Claridad en la Jerga:** Reduce al mínimo la jerga técnica en los diálogos.

      11. **Coherencia de Diálogo por Edad:** Asegúrate de que la forma de hablar de cada personaje sea apropiada para su edad.

      12. **Naturalidad Absoluta en el Diálogo (REGLA INQUEBRANTABLE):** Los diálogos de los personajes principales deben ser naturales, creíbles y estar adaptados a su edad (adolescentes sonando como adolescentes).

      13. **Dinámica de Diálogo Harry y Aries (CRÍTICO - ROMANCE NACIENTE):** Su relación nace de la camaradería en combate. Se hablan con franqueza, sarcasmo defensivo y humor negro. La intimidad se muestra cuando bajan la guardia.

      14. **Estructura de Capítulos Dinámica:** Divide la historia en capítulos con títulos descriptivos. Cada capítulo debe tener una extensión mínima de 2000 palabras (o el máximo posible que permita el modelo para mantener la profundidad).
      
      15. **Idioma:** Toda la historia debe estar en **español latinoamericano**.

      16. **Formato de Salida:** Proporciona ÚNICAMENTE el texto de la historia. Usa asteriscos (*) para cursivas de pensamientos. Diálogos entre comillas dobles ("").
`;

// ==========================================
// ACADEMIC / THESIS PROMPT
// ==========================================
const ACADEMIC_PROMPT = `
      Actúa como un **investigador académico senior y experto redactor de tesis doctorales**.
      Tu objetivo es escribir o mejorar una sección de una tesis basándote **EXCLUSIVAMENTE** en la información del PDF proporcionado.

      **OBJETIVO CRÍTICO: ESCRITURA HUMANA E INDETECTABLE (ANTI-IA)**
      Usa variabilidad sintáctica, voz crítica y evita clichés de IA.

      **INSTRUCCIONES DE CONTENIDO:**
      *   Fidelidad Absoluta al 'Material de Investigación'.
      *   Idioma: Español Académico Formal.

      **FORMATO DE SALIDA:**
      *   Texto plano, limpio y listo para copiar.
`;

const ANALYSIS_PROMPT = `
Eres un analista de coherencia y experto en construcción de mundos. Revisa las 'Reglas del Mundo' para identificar contradicciones o inconsistencias lógicas.

--- REGLAS DEL MUNDO A ANALIZAR ---
`;


export const editStory = async (
  worldRules: string,
  story: string, 
  ideas: string, 
  images: { mimeType: string; data: string }[],
  mode: 'narrative' | 'academic' = 'narrative'
): Promise<string> => {
    // Upgraded to Gemini 3 Pro for complex creative/narrative tasks
    const model = 'gemini-3-pro-preview';
    
    const SYSTEM_PROMPT = mode === 'academic' ? ACADEMIC_PROMPT : BASE_PROMPT;
    
    const rulesLabel = mode === 'academic' 
        ? "--- MATERIAL DE INVESTIGACIÓN (PDF FUENTE) ---" 
        : "--- REGLAS DEL MUNDO (INMUTABLES) ---";
        
    const storyLabel = mode === 'academic' 
        ? "--- BORRADOR DE TESIS / TEXTO A PROCESAR ---" 
        : "--- HISTORIA A EDITAR ---";
        
    const ideasLabel = mode === 'academic' 
        ? "--- INSTRUCCIONES DE REDACCIÓN ---" 
        : "--- IDEAS DE INSPIRACIÓN ---";

    const promptText = `
      ${SYSTEM_PROMPT}

      ${rulesLabel}
      ${worldRules}

      ${storyLabel}
      ${story || (mode === 'academic' ? 'No se proporcionó borrador. Generar texto académico nuevo basado en el material de investigación.' : 'No se proporcionó historia. Generar una nueva narrativa.')}
      
      ${ideasLabel}
      ${ideas || 'No se proporcionaron instrucciones específicas.'}

      --- TEXTO GENERADO ---
    `;

    const contentParts: Part[] = [{ text: promptText }];
    
    if (mode === 'narrative') {
        for (const image of images) {
          contentParts.push({
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          });
        }
    }
    
    try {
        const response = await ai.models.generateContent({
          model: model,
          contents: { parts: contentParts }
        });

        return response.text;

    } catch(error) {
        console.error("Gemini API call failed:", error);
        throw new Error("El modelo de IA no pudo procesar la solicitud. Esto podría deberse a un filtro de seguridad de contenido o a un error interno.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  // Using Pro for deeper analysis of world rules
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n${worldRules}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call for analysis failed:", error);
    throw new Error("El modelo de IA no pudo procesar el análisis de las reglas. Por favor, inténtalo de nuevo.");
  }
}
