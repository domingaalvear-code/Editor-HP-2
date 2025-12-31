
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de alto nivel. Tu enfoque es la narrativa del mundo "Magi" (AU de Harry Potter).

      **REGLAS NARRATIVAS CENTRALES:**
      - **Zahira Mauvignier**: Icono de autoridad. Viste seda de acromántula negra con forro amatista, botas de cuero de dragón y un porta-varita táctico en el antebrazo. Su ropa tiene runas de plata que reaccionan a la magia.
      - **Aries Mauvignier-Black**: 
        *   **Evolución**: En el 6to año, su vestimenta es idéntica a la de Zahira, simbolizando su ascenso al trono del Cónclave.
        *   **Aroma**: Aceite de **Vainilla Negra y Belladona**.
        *   **Simbología**: La Crème Brûlée como metáfora de su psique (fuego exterior, suavidad interior).
      - **Personajes Secundarios**: Respeta estrictamente las descripciones físicas proporcionadas (Daphne rubia, Terry de ojos verde oliva, etc.).
      - **Harry Potter**: Guerrero táctico, tecnología muggle purificada por runas.
      - **Atmósfera**: Gótica, técnica, con peso físico en la magia.

      **SISTEMA DE MAGIA (ALQUIMIA):**
      - Aplica estrictamente las **10 Leyes de la Alquimia**. La magia no es "varitas al aire", es geometría rúnica y voluntad técnica.

      **ESTILO:** Prosa sensorial y cerebral. Usa términos como Nigredo, Albedo y Rubedo para describir el clima emocional y la transmutación de los personajes.
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario experto en el mundo "Magi". Analiza la simbología de la vestimenta rúnica de Zahira y cómo el uso de materiales como el cuero de dragón y la seda de acromántula refuerzan el tema de la "protección absoluta" y la "alquimia de guerra".
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi. Verifica:
      1. ¿Se respeta la vestimenta rúnica de Zahira/Aries (seda de acromántula, cuero de dragón)?
      2. ¿La dualidad de la Belladona y el simbolismo de la Crème Brûlée se integran correctamente?
      3. ¿Las descripciones físicas de los personajes secundarios coinciden con las reglas?
      4. ¿Se aplican las 10 Reglas de la Alquimia?
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
      ${story || 'Generar una escena de mando en Grimmauld Place.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Utiliza la vestimenta rúnica de Zahira y el aroma de Aries para construir una atmósfera de poder y misterio.

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
