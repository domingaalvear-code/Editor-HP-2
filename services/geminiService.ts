
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

      **TRASFONDO HISTÓRICO OBLIGATORIO (POST-SEGUNDO AÑO):**
      - Harry Potter ha sobrevivido al Basilisco y ha liberado a Dobby (el elfo de los Malfoy).
      - Draco Malfoy se sacrificó por Hermione y está en una tregua de respeto profundo con Harry. Narcissa Malfoy tiene una deuda de honor con Harry.
      - Harry posee la Brújula de James, el porta-varita de piel de dragón y el Walkman negro con cintas de Rush, Pink Floyd y Metallica.
      - Aries Mauvignier es la Golpeadora estrella de Ravenclaw y la estratega del "Cónclave" (Harry, Ron, Hermione, Draco, Daphne, Tracey, Luna).
      - Sirius Black vigila desde Grimmauld Place en su forma de Canuto. Harry pasa sus veranos allí.

      **SISTEMA TÉCNICO DE MAGIA (10 LEYES DE LA ALQUIMIA):**
      - Describe la magia mediante la **Triada Operativa** (Entrada-Proceso-Salida).
      - Usa conceptos como **Nigredo** (caos/oscuridad), **Albedo** (purificación/lógica) y **Rubedo** (culminación/vida).
      - Aplica el **Límite de Iteración** y el **Equilibrio de Intercambio** (el cansancio tras grandes hechizos).

      **ESTILO NARRATIVO:**
      - **PROSA HIPER-DETALLADA**: Describe las vibraciones de la brújula, el olor a ozono de la magia de Aries y la atmósfera opresiva del mundo mágico.
      - **PROHIBIDO RESUMIR**: Expande cada interacción, pensamiento y proceso alquímico de forma cinematográfica.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior. Transforma el material en un tratado detallado que analice la evolución de la alianza secreta Harry-Aries-Draco tras la crisis de la Cámara de los Secretos y la aplicación de las 10 leyes de la alquimia en la resolución del conflicto.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia narrativa. Verifica estrictamente:
      1. ¿Se respeta que Dobby es libre y Draco salvó a Hermione?
      2. ¿Harry usa sus objetos característicos (Brújula, Walkman)?
      3. ¿Se aplican las **10 Reglas de la Alquimia** (Intercambio, Resonancia, etc.)?
      4. ¿Se mantiene la jerarquía de Aries como la mente maestra?
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
      ${story || 'Generar nuevo capítulo del inicio del tercer año.'}
      (Extensión original: ${inputWordCount} palabras)
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Redacta el manuscrito final (aproximadamente 5000 palabras). Asegúrate de que los hechos del segundo año (Dobby libre, Draco redimido, el Basilisco) se sientan como los cimientos históricos inamovibles.

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
