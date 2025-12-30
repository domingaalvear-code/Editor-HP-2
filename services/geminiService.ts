
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
        *   **Aroma (Anclaje)**: Aceite de **Vainilla Negra y Belladona**. Bálsamo curativo (aliados) / Presencia venenosa (enemigos).
        *   **Simbología del Postre**: Su debilidad por la **Crème Brûlée** refleja su dualidad. El azúcar quemado es su máscara de hierro y disciplina rúnica; el interior dulce es su lealtad profunda.
        *   **Evolución (6to año+)**: Identidad mimetizada con **Zahira Mauvignier**. Elegancia letal, autoridad absoluta, frialdad táctica.
      - **Harry Potter**: Guerrero táctico, tecnología muggle purificada.
      - **Atmósfera**: Gótica, técnica, con peso físico en la magia.

      **SISTEMA DE MAGIA (ALQUIMIA):**
      - Aplica estrictamente las **10 Leyes de la Alquimia**.

      **ESTILO:** Prosa sensorial. Usa términos como Nigredo, Albedo y Rubedo para describir el clima emocional.
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario experto en el mundo "Magi". Analiza la simbología de Aries Mauvignier-Black, desde su esencia de Belladona hasta el simbolismo de la Crème Brûlée como representación de su psique protegida por el fuego.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi. Verifica:
      1. ¿Se respeta la dualidad de la Belladona y el simbolismo de la Crème Brûlée si aparecen?
      2. ¿La personalidad de Aries refleja la autoridad de Zahira en contextos avanzados de la historia?
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
      ${story || 'Generar una escena de cena o pausa táctica en Grimmauld Place.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Utiliza los detalles sensoriales como el aroma de Belladona o el simbolismo del postre favorito de Aries para profundizar en el personaje.

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
