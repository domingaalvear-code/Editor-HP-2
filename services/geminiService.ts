
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
      Actúa como un novelista de fantasía épica de clase mundial. Tu objetivo es expandir la historia a capítulos extensos de aproximadamente **5000 PALABRAS**.

      **TRASFONDO HISTÓRICO OBLIGATORIO (EL PRIMER AÑO YA OCURRIÓ):**
      - Harry Potter es el líder de una alianza secreta que incluye a Aries (Ravenclaw) y Draco (Slytherin).
      - Harry usa su Walkman Sony negro como refugio psicológico y su Brújula de James para orientar su magia empática.
      - Aries Mauvignier es la mente maestra del grupo, #1 académica y conocedora del secreto de la Piedra Filosofal (está a salvo con Flamel).
      - Draco Malfoy está en fase de Albedo (purificación), respetando el código de honor que Aries le enseñó.

      **SISTEMA TÉCNICO DE MAGIA (10 LEYES DE LA ALQUIMIA):**
      - No describas magia genérica. Describe la **Triada Operativa** (Entrada-Proceso-Salida).
      - Menciona el **Equilibrio de Intercambio** (el coste de los hechizos).
      - Describe los **Anclajes Simbólicos** (runas, geometría) y la **Resonancia Emocional** (cómo el miedo de Harry o la frialdad de Aries afectan el flujo).
      - Aplica el **Límite de Iteración** para evitar que la magia parezca infinita o sin consecuencias.

      **ESTILO NARRATIVO:**
      - **PROSA HIPER-DETALLADA**: Describe el frío de Aries, el sonido metálico de Hermes y la atmósfera gótica de Hogwarts.
      - **PROFUNDIDAD PSICOLÓGICA**: Explora el peso de los secretos y la lealtad.
      - **PROHIBIDO RESUMIR**: Expande cada diálogo y pensamiento hasta alcanzar la profundidad cinemática requerida.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior especializado en análisis literario y estructural. Transforma el material en un tratado exhaustivo que analice la evolución de la alianza Harry-Aries-Draco y el cumplimiento de las 10 leyes de la alquimia tras el primer año.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia narrativa. Verifica estrictamente:
      1. ¿Se respeta que Harry ya tiene la Brújula Alquímica y el Walkman Negro?
      2. ¿Se mantiene la alianza secreta entre casas (Draco, Aries, Harry, Hermione, Ron)?
      3. ¿Se aplican las **10 Reglas de la Alquimia** detalladas (Intercambio, Temporalidad, Contaminación, etc.)?
      4. ¿Se menciona la frialdad de Aries y su estatus como #1 del año?
      5. ¿La extensión se acerca al objetivo de 5000 palabras?
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

      --- REGLAS DEL MUNDO Y CRONOLOGÍA (AU) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA (CONTEXTO CANON) ---
      ${canonReference || "No se proporcionó."}

      --- HISTORIA A EXPANDIR ---
      ${story || 'Generar nuevo capítulo desde cero.'}
      (Extensión original: ${inputWordCount} palabras)
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Redacta el manuscrito final (aproximadamente 5000 palabras). Asegúrate de que los hechos del primer año (la alianza, los objetos, el secreto de la Piedra, la rivalidad con Snape) se sientan como los cimientos históricos inamovibles.

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
            temperature: 0.85,
            topP: 0.95,
          }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La conexión con el mundo mágico se ha interrumpido. Verifica tu llave mágica (API_KEY).");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    ${ANALYSIS_PROMPT}
    --- TEXTO A ANALIZAR ---
    ${worldRules}
  `;
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando las reglas de coherencia.");
  }
}
