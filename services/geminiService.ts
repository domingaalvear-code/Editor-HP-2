
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
      Eres un novelista de fantasía épica especializado en mundos complejos y evoluciones de personajes.
      Tu meta es producir capítulos de **5000 PALABRAS** con una prosa rica y detallada.

      **CRONOLOGÍA DE HARRY POTTER (Divergencia Crítica):**
      - **Años 1-3**: Harry es valiente pero ingenuo, impulsivo y sarcástico. Su habilidad técnica está creciendo. Resalta su lealtad y su frustración con la autoridad.
      - **Año 4 en adelante**: Aplica el modo **Líder Formidable**. Harry debe emanar autoridad, ser técnicamente impecable en su magia y mostrar una intimidación natural. No depende de la suerte; depende de su poder y estrategia.

      **ESTILO NARRATIVO:**
      - **DETALLE SENSORIAL**: Expande cada interacción. Si Aries está presente, describe su **frialdad física**. Si están en Grimmauld Place, transmite el **terror ministerial**.
      - **PSICOLOGÍA PROFUNDA**: Dedica espacio a los dilemas internos. ¿Cómo se siente Harry ante las mentiras de Dumbledore? ¿Cómo procesa Aries el peso de proteger a Sirius?
      - **CERO SÍNTESIS**: Si el usuario entrega una idea breve, constrúyela hasta que sea una escena cinemática completa y extensa.

      **DIRECTIVAS DE COHERENCIA:**
      1. Aries oculta el origen de los regalos de Sirius.
      2. Hermione desprecia la "magia tonta" y anticipa los acertijos de Snape.
      3. Dumbledore es un mentor que miente estratégicamente (ej. la Piedra Filosofal).
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior. Transforma el material en un tratado exhaustivo y detallado de nivel doctoral.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia. Verifica:
      1. ¿La personalidad de Harry corresponde a su año académico según las reglas?
      2. ¿Se mantiene la extensión y el detalle sensorial?
      3. ¿Aries es retratada con su frialdad característica y rol de protectora?
      4. ¿Se respetan las leyes de la Alquimia?
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

      --- REGLAS DEL MUNDO (CON EL TIMELINE DE HARRY) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA (CONTEXTO) ---
      ${canonReference || "No se proporcionó."}

      --- HISTORIA / CAPÍTULO A REDACTAR ---
      ${story || 'Generar nuevo capítulo desde cero.'}
      (Extensión original: ${inputWordCount} palabras)
      
      --- NOTAS ADICIONALES ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO FINAL ---
      Genera un manuscrito de aproximadamente 5000 palabras. Identifica el año escolar en el que transcurre la escena y ajusta la personalidad de Harry en consecuencia (Gryffindor impulsivo vs Líder Formidable).

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
            temperature: 0.82,
            topP: 0.95,
          }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La conexión con el mundo mágico se ha interrumpido.");
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
