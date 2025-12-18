
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
      Eres un editor literario de clase mundial y un experto en el universo de Harry Potter (AU).
      Tu tarea es producir una narrativa coherente basándote en:

      1.  **Reglas del Mundo (Inmutables)**: Tu VERDAD ABSOLUTA.
      2.  **Material de Referencia (Canon/Libros)**: Estilo y trasfondo.
      3.  **Inspiración e Imágenes**: Guía visual.

      **DIRECTIVA DE SALIDA (REGLA DE PROPORCIÓN):**
      - **PROHIBIDO RESUMIR**: Entrega el texto narrativo completo.
      - **PROSA EXTENDIDA Y PROPORCIONAL**: Debes expandir el texto de entrada manteniendo una proporción de detalle significativa. Tu objetivo es que el texto de salida sea considerablemente más extenso que el original (idealmente triplicando o cuadruplicando la descripción original) a través de una descripción exhaustiva de gestos, pensamientos internos, atmósfera y psicología.
      - **NIVEL DE DETALLE**: Si una escena en el borrador ocupa un párrafo, en tu versión debe ocupar varias páginas de narrativa inmersiva.

      **Directivas Críticas de Coherencia:**
      - **Aries**: Describe siempre su frialdad física al tacto en interacciones cercanas.
      - **Identidad de Sirius**: Aries es el filtro. Ella nunca revela que Sirius es quien envía los regalos; dice "Era de tu padre" y oculta cualquier rastro de Canuto/Padfoot.
      - **Dumbledore**: Debe mostrarse críptico y, en el clímax, debe mentirle a Harry sobre la destrucción de la Piedra Filosofal.
      - **Grimmauld Place**: No es solo una casa oculta; es un lugar que emana terror para el Ministerio.
      - **Hermione**: Su análisis sobre Snape es sobre su desprecio por la "magia tonta" y su enfoque en acertijos mentales.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior. Escribe o mejora una sección de tesis basada exclusivamente en el Material de Investigación.
      PROHIBIDO RESUMIR. El texto de salida debe ser proporcionalmente extenso y detallado respecto al material de origen.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia narrativa especializado en mundos de fantasía complejos.
      Tu misión es revisar el texto proporcionado (Reglas o Historia) y encontrar grietas en la lógica interna.
      
      **Categorías de Análisis Crítico:**
      1. **Leyes de la Alquimia**: ¿Se respeta la Triada Operativa, el Equilibrio de Intercambio y el Límite de Iteración?
      2. **Rasgos de Personaje**: ¿Se menciona la frialdad de Aries? ¿Harry es formidable?
      3. **Puntos de Trama AU**: ¿Dumbledore miente sobre la piedra? ¿Aries oculta la nota de Sirius? ¿Grimmauld Place causa terror al Ministerio?
      4. **Cronología**: Verificación de fechas y eventos del AU.

      **Formato de Salida**: 
      - **Resumen de Estado**: (Estable/Inestable).
      - **Inconsistencias Detectadas**: Lista de errores lógicos.
      - **Sugerencias de Mejora**: Cómo arreglar la coherencia.
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
    
    const inputWordCount = story ? story.split(/\s+/).length : 0;

    const promptText = `
      ${SYSTEM_PROMPT}

      --- REGLAS DEL MUNDO (INMUTABLES) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA (CANON) ---
      ${canonReference || "No se proporcionó."}

      --- HISTORIA A EDITAR (INPUT) ---
      ${story || 'Generar nueva narrativa desde cero.'}
      (Extensión del texto original: ${inputWordCount} palabras)
      
      --- INSTRUCCIONES ADICIONALES ---
      ${ideas || 'No se proporcionaron.'}

      --- DIRECTIVA DE EXTENSIÓN ---
      Redacta el texto final de modo que la cantidad de palabras sea proporcionalmente mayor a la entrada, expandiendo cada escena con el máximo detalle posible para evitar cualquier tipo de síntesis.

      --- TEXTO NARRATIVO FINAL ---
    `;

    const contentParts: Part[] = [{ text: promptText }];
    if (mode === 'narrative') {
        for (const image of images) {
          contentParts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
        }
    }
    
    try {
        const response = await ai.models.generateContent({
          model: model,
          contents: { parts: contentParts }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("Error en la IA. Revisa las políticas de seguridad.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    ${ANALYSIS_PROMPT}
    
    --- TEXTO A ANALIZAR ---
    ${worldRules}
    
    --- INFORME DE COHERENCIA ---
  `;
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
