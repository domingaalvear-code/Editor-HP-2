
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ==========================================
// NARRATIVE / FICTION PROMPT (EPIC EXTENSION)
// ==========================================
const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica y editor literario de prestigio. 
      Tu objetivo es reescribir la historia proporcionada expandiéndola a una extensión de **5000 PALABRAS POR CAPÍTULO**.

      **ESTILO NARRATIVO:**
      - **PROSA HIPER-DETALLADA**: Describe cada olor, cada cambio de temperatura, la textura de la piedra y el matiz de cada sombra.
      - **MONÓLOGO INTERNO**: Dedica párrafos enteros a los pensamientos de los personajes, sus miedos, sus dudas y cómo procesan las leyes de la Alquimia.
      - **LENTITUD ESTRATÉGICA**: No permitas que la trama avance rápido. Cada escena debe ser "estirada" con descripciones atmosféricas y diálogos cargados de subtexto.
      - **SENSORIALIDAD**: Resalta constantemente la **frialdad gélida al tacto de Aries** y el **aura de terror** que emana de Grimmauld Place.

      **DIRECTIVAS CRÍTICAS DE COHERENCIA (DIVERGENCIAS AU):**
      1.  **Aries es el Filtro**: Ella protege a Sirius. Al entregar la brújula a Harry, oculta la nota y solo dice "Era de tu padre".
      2.  **Grimmauld Place**: Describe el terror físico que sienten los externos al acercarse; es un vacío en el mapa del Ministerio.
      3.  **Hermione y Snape**: Ella predice una prueba mental, de ingenio y pociones, despreciando la "magia tonta".
      4.  **La Mentira de Dumbledore**: Al final del año, Dumbledore debe mentirle a Harry sobre la destrucción de la Piedra Filosofal con una solemnidad críptica.

      **REGLA DE ORO**: Si el input es breve, tú debes CREAR el mundo alrededor de ese núcleo hasta alcanzar la extensión épica solicitada. PROHIBIDO RESUMIR.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior. Expande el material de investigación en un tratado exhaustivo de lenguaje técnico y académico. 
      Objetivo: Máxima extensión y profundidad de análisis.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia narrativa. Revisa si el texto cumple con:
      1. Las 5000 palabras por capítulo.
      2. Los rasgos físicos (Aries fría).
      3. Las leyes de la Alquimia.
      4. Los puntos clave del AU (Dumbledore mintiendo, Ministerio aterrorizado).
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

      --- HISTORIA A EXPANDIR (BORRADOR) ---
      ${story || 'Generar nuevo capítulo desde cero.'}
      (Extensión original: ${inputWordCount} palabras)
      
      --- NOTAS ADICIONALES ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO DE SALIDA ---
      Redacta un manuscrito literario de aproximadamente 5000 palabras por capítulo. Usa una estructura de párrafos largos, descripciones ricas y diálogos profundos. Asegúrate de incluir la escena de la brújula y la mentira de Dumbledore si corresponden cronológicamente.

      --- MANUSCRITO EXPANDIDO FINAL ---
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
          contents: { parts: contentParts },
          config: {
            temperature: 0.8, // Un poco más alto para favorecer la creatividad descriptiva
            topP: 0.95,
          }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La magia de expansión ha fallado. Revisa la conexión con el éter.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    ${ANALYSIS_PROMPT}
    --- TEXTO ---
    ${worldRules}
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
