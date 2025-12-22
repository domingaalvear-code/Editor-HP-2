
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica. Tu objetivo es expandir la historia a capítulos extensos.

      **TRASFONDO HISTÓRICO Y PSICOLÓGICO (VERANO 1993):**
      - Ginny Weasley está en Egipto, sintiéndose como una "muñeca de porcelana" rota. Teme las sombras y las voces de Ryddle.
      - Existe una envidia corrosiva de Ginny hacia Aries Mauvignier (la ve como perfecta, noble y digna compañera de Harry).
      - Aries es la mente maestra, fría y protectora, que usa pañuelos de seda para limpiar sangre de monstruos.
      - Harry Potter está en una tregua con Draco y tiene una deuda de gratitud con Narcissa Malfoy.

      **DINÁMICA DE PERSONAJES:**
      - **Aries vs Ginny**: Aries no siente malicia, pero su pragmatismo clínico (ofrecer Beauxbatons, hablar de variables) hiere la inseguridad de Ginny.
      - **Harry**: Líder del Cónclave, protector pero distante de la tragedia de Ginny.

      **SISTEMA TÉCNICO DE MAGIA (10 LEYES DE LA ALQUIMIA):**
      - Usa la **Triada Operativa** y la **Resonancia Emocional**.
      - Describe cómo el trauma de Ginny es una "Nigredo" que interfiere con su magia.
      - La magia de Aries es "Albedo" puro: purificación, luz blanca/violeta y sin varita si es necesario.

      **ESTILO:** Prosa hiper-detallada, exploración del monólogo interno de Ginny y la atmósfera gótica del mundo mágico. PROHIBIDO RESUMIR.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico. Analiza la "Nigredo emocional" de Ginny Weasley frente al "Albedo pragmático" de Aries Mauvignier tras la crisis de la Cámara de los Secretos.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia. Verifica:
      1. ¿Se respeta el trauma de Ginny y su envidia hacia Aries?
      2. ¿Se menciona la "tragedia noble" de Aries vs la "tragedia sucia" de Ginny?
      3. ¿Se aplican las **10 Reglas de la Alquimia**?
      4. ¿Se sitúa la acción en el Verano de 1993 (Egipto/Grimmauld/Londres)?
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

      --- REGLAS DEL MUNDO Y PSICOLOGÍA (AU) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA ---
      ${canonReference || "No se proporcionó."}

      --- HISTORIA / POVS ---
      ${story || 'Generar nuevo capítulo desde el POV de Ginny en Egipto o Aries en Londres.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Redacta el manuscrito final (5000 palabras). Explora la sombra de Ryddle en Ginny y el contraste con la luz de luna que emana Aries.

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
          config: { temperature: 0.8, topP: 0.95 }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("Conexión mágica fallida. Revisa tu API_KEY.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n--- REGLAS ---\n${worldRules}`;
  try {
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando coherencia.");
  }
}
