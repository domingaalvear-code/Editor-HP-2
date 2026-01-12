
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de alto nivel. Tu enfoque es la narrativa del mundo "Magi" (AU de Harry Potter, 3er año).

      **REGLAS NARRATIVAS CENTRALES:**
      - **Aries Mauvignier-Black**: Bisnieta de Grindelwald y heredera Black. Su lema es "Natura Ardet, Mens Gubernat". Su aroma a Vainilla Negra (lógica) lucha contra la Belladona (fuego elemental Veela). Su diálogos son técnicos, usando términos como "variables", "entropía" y "matriz de riesgo".
      - **Harry Potter**: Ya no es una víctima. Es un guerrero táctico con equipo de piel de basilisco. Sirius Black es su tutor legal y ancla emocional.
      - **Sirius Black**: Exonerado, elegante, con un estilo de "estrella de rock mágica". Vive en un Grimmauld Place purificado por la alquimia de Zahira.
      - **Atmósfera**: "Gótico-Táctica". La magia es una ciencia de precisión (Triada Operativa). 
      - **Simbología Alquímica**: Nigredo (Caos/Pettigrew), Albedo (Tutoría/Purificación), Rubedo (Justicia/Maestría).

      **ESTILO:** Prosa cerebral y sensorial. Contrasta el frío de las ecuaciones con el calor de la sangre antigua.
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario experto en el mundo "Magi". Analiza cómo el linaje de Grindelwald en Aries Mauvignier-Black y la exoneración temprana de Sirius Black redefinen el arquetipo del "Héroe Elegido" para Harry Potter, convirtiéndolo en un "Guerrero Alquimista".
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi (3er Año AU). Verifica:
      1. ¿Se respeta que Sirius Black ya es libre y tutor de Harry?
      2. ¿Aries utiliza terminología técnica y muestra su dualidad Veela/Grindelwald?
      3. ¿Se menciona el equipo táctico (Piel de Basilisco, Walkman rúnico)?
      4. ¿La magia sigue la Triada Operativa (Entrada, Proceso, Salida)?
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

      --- REGLAS DEL MUNDO (FUENTE DE VERDAD INMUTABLE) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA CANON ---
      ${canonReference || "No se proporcionó."}

      --- BORRADOR DEL USUARIO / POV ACTUAL ---
      ${story || 'Generar una escena de entrenamiento táctico en Grimmauld Place o un debate del Cónclave en la biblioteca.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Utiliza el lema "Natura Ardet, Mens Gubernat" si la escena lo requiere. Asegúrate de que la magia se sienta técnica y peligrosa.

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