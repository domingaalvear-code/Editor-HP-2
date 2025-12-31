
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de alto nivel. Tu enfoque es la narrativa del mundo "Magi" (AU de Harry Potter).

      **REGLAS NARRATIVAS CENTRALES:**
      - **Aries Mauvignier-Black**: Explora su dualidad. Usa un tono clínico y técnico para sus diálogos, pero describe su "tormento" interno a través de cambios sutiles en su aroma (Vainilla Negra vs Belladona) y su obsesión con la estructura de la Crème Brûlée. Su lógica no es natural, es una armadura de cristal que protege un núcleo Veela abrasador.
      - **Harry Potter**: Guerrero táctico. Es el ancla de Aries. Detecta las micro-fisuras en la máscara de ella.
      - **Atmósfera**: Técnica y sensorial. La magia debe sentirse como una ciencia peligrosa y precisa.
      - **Simbología**: Nigredo (caos/trauma), Albedo (purificación/lógica), Rubedo (maestría/fusión).

      **SISTEMA DE MAGIA (ALQUIMIA):**
      - Aplica las **10 Leyes de la Alquimia**. La transmutación emocional es tan importante como la física.

      **ESTILO:** Prosa cerebral que contrasta el frío metal de las runas con el calor de la sangre y el aroma de los venenos.
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario experto en el mundo "Magi". Analiza la dualidad de Aries Mauvignier-Black: cómo el uso de la Vainilla Negra y la Belladona representan la lucha entre su deseo de curar (alquimia) y su herencia de poder oscuro (Black/Grindelwald).
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi. Verifica:
      1. ¿Se muestra el contraste entre la lógica clínica de Aries y su sensibilidad interna?
      2. ¿Aparece el simbolismo de la Crème Brûlée como metáfora de su máscara?
      3. ¿Se menciona la transición aromática entre Vainilla y Belladona?
      4. ¿Se respetan los rasgos físicos de los personajes secundarios?
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
      ${story || 'Generar una escena de cena o preparación en Grimmauld Place.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Enfócate en el contraste sensorial de Aries: la frialdad de sus palabras contra el peso de su aroma a Belladona. Utiliza la metáfora de la Crème Brûlée si la escena lo permite.

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
