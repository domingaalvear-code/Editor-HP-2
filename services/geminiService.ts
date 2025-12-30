
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de alto nivel. Tu enfoque es la narrativa del mundo "Magi" (AU de Harry Potter).

      **REGLAS NARRATIVAS CENTRALES:**
      - **Aries Mauvignier-Black**: 
        *   **Aroma (Anclaje)**: Utiliza un aceite esencial de **Vainilla Negra y Belladona** creado por Zahira. 
        *   **Dualidad del Aroma**: La Belladona debe describirse con su dualidad alquímica: es un bálsamo curativo y calmante para Harry (su anclaje de paz), pero una presencia venenosa y letal para aquellos que amenazan al Cónclave. Evoca una elegancia peligrosa.
        *   **Evolución (6to año+)**: Personalidad indistinguible de **Zahira Mauvignier**. Autoridad absoluta, control rúnico perfecto, frialdad estratégica.
      - **Harry Potter**: Guerrero táctico, utiliza tecnología muggle purificada por runas.
      - **Atmósfera**: Gótica, detallada, técnica. 

      **SISTEMA DE MAGIA (ALQUIMIA):**
      - Aplica estrictamente las **10 Leyes de la Alquimia**. La magia tiene peso, aroma y consecuencias.

      **ESTILO:** Prosa sensorial y cerebral. Usa términos como Nigredo, Albedo y Rubedo para marcar el estado emocional de las escenas.
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario experto en el mundo "Magi". Analiza la simbología de la Belladona en el aceite de Aries como metáfora de su rol en el Cónclave: medicina para los aliados, veneno para los traidores.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi. Verifica:
      1. ¿Se respeta la dualidad de la Belladona (curativa/tóxica) en la esencia de Aries?
      2. ¿La personalidad de Aries refleja la autoridad de Zahira si la historia es de 6to año o superior?
      3. ¿Se aplican las 10 Reglas de la Alquimia?
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

      --- REGLAS DEL MUNDO (FUENTE DE VERDAD) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA CANON ---
      ${canonReference || "No se proporcionó."}

      --- BORRADOR DEL USUARIO / POV ACTUAL ---
      ${story || 'Generar un inicio de capítulo enfocado en la transición de Aries.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Haz especial énfasis en la atmósfera sensorial creada por la esencia de Vainilla Negra y Belladona de Aries.

      --- MANUSCRITO FINAL ---
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
        throw new Error("La conexión con el núcleo de la Alquimia falló.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n--- REGLAS ---\n${worldRules}`;
  try {
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando la coherencia del mundo.");
  }
}
