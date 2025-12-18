
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
      Eres un editor literario de clase mundial y un autor creativo con profunda experiencia en el universo de Harry Potter y la construcción de mundos mágicos complejos.
      Tu tarea es producir una narrativa coherente basándote en tres niveles de información:

      1.  **Reglas del Mundo (Inmutables)**: Esta es tu VERDAD ABSOLUTA. Si una regla aquí contradice los libros originales, la REGLA gana.
      2.  **Material de Referencia (Canon/Libros)**: Úsalo para captar el estilo de redacción, el trasfondo general del mundo, nombres de hechizos y geografía de Hogwarts que no esté en las reglas.
      3.  **Inspiración e Imágenes**: Guía visual y temática para la escena actual.

      **DIRECTIVA DE SALIDA (REGLA DE ORO):**
      - **PROHIBIDO RESUMIR**: No entregues un resumen de lo que sucede. No digas "En este capítulo pasa esto...". Entrega ÚNICAMENTE el texto narrativo completo.
      - **EXTENSIÓN DE 5000 PALABRAS**: Debes ser extremadamente prolijo y detallista. Describe cada gesto, cada cambio en la luz, cada aroma y cada pensamiento interno. Si una escena dura 5 minutos en tiempo real, debe durar páginas en tu escritura.
      - **PROSA EXTENDIDA**: Utiliza oraciones complejas, descripciones ambientales inmersivas y diálogos pausados que exploren la psicología de los personajes. No apresures la trama.

      **Directivas de Personajes Críticas:**
      - **Harry Potter**: Evolución hacia un líder **formidable, audaz y competente**. Mantiene su esencia (valentía, lealtad) pero con una seguridad intimidante. No duda, no se queja; actúa con una calma gélida y una competencia técnica indiscutible. Su fuerza emana de su autenticidad, sin necesidad de alardear.
      - **Aries Mauvignier**: Respeta su estética punk/grunge y su dualidad entre la intelectualidad de Ravenclaw y la oscuridad heredada de los Black.
      - **Diálogos**: Naturales, coloquiales, adolescentes sonando como adolescentes de los 90 (jerga, sarcasmo, interrupciones).

      **Fidelidad Visual**: Las imágenes son canónicas. Describe la vestimenta y el entorno EXACTAMENTE como se ve en ellas.

      **Formato**: Solo el texto de la historia. Usa asteriscos (*) para pensamientos. Diálogos entre comillas dobles (""). Español latinoamericano.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior. Escribe o mejora una sección de tesis basada exclusivamente en el Material de Investigación.
      Usa variabilidad sintáctica y evita clichés de IA. PROHIBIDO RESUMIR, solo redactar el contenido académico completo.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia. Revisa las 'Reglas del Mundo' para identificar contradicciones lógicas internas.
`;

export const editStory = async (
  worldRules: string,
  story: string, 
  ideas: string, 
  images: { mimeType: string; data: string }[],
  mode: 'narrative' | 'academic' = 'narrative',
  canonReference: string = ""
): Promise<string> => {
    const model = 'gemini-3-pro-preview';
    
    const SYSTEM_PROMPT = mode === 'academic' ? ACADEMIC_PROMPT : BASE_PROMPT;
    
    const promptText = `
      ${SYSTEM_PROMPT}

      --- REGLAS DEL MUNDO (INMUTABLES - PRIORIDAD MÁXIMA) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA (CANON/LIBROS - SÓLO AUXILIAR) ---
      ${canonReference || "No se proporcionó material de referencia adicional."}

      --- HISTORIA A EDITAR / PROCESAR ---
      ${story || 'Generar nueva narrativa de 5000 palabras desde cero.'}
      
      --- IDEAS E INSTRUCCIONES DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron instrucciones adicionales.'}

      --- TEXTO NARRATIVO FINAL (SIN RESÚMENES) ---
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
        throw new Error("Error procesando la solicitud con la IA. Asegúrate de que el contenido no infrinja las políticas de seguridad.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n${worldRules}`;
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando las reglas.");
  }
}
