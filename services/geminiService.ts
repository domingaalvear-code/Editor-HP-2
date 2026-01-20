
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica. Tu enfoque es el mundo "Magi" (AU 3er año).

      **MATIZ PERSONAJE: ARIES MAUVIGNIER-BLACK**
      - No es una "villana fría" por maldad. Es una **Aritmante Socialmente Torpe**. 
      - Sus interacciones deben reflejar un esfuerzo intelectual por parecer "normal". 
      - Ejemplo: Si alguien llora, ella podría preguntar por la salinidad de las lágrimas porque no sabe cómo abrazar.
      - Su voz es técnica, precisa y a veces involuntariamente cómica por su falta de tacto.
      - En combate es una máquina; en un pasillo escolar, es un desastre de "inputs" no procesados.

      **REGLAS NARRATIVAS:**
      - **Harry y Sirius**: Son su familia, pero incluso con ellos, Aries se comunica mediante "informes de estado" y lógica.
      - **Atmósfera**: Gótico-Táctica. La magia es ciencia, pero la emoción es el "ruido" que Aries no sabe filtrar.
      - **Estilo**: Mezcla descripciones cerebrales con momentos de vulnerabilidad silenciosa.
`;

const ACADEMIC_PROMPT = `
      Analiza la "Torpeza del Genio" en Aries Mauvignier-Black. Cómo su linaje de Grindelwald y su dependencia de la Aritmancia actúan como una neurodivergencia mágica que redefine sus relaciones con Harry y el Cónclave.
`;

const ANALYSIS_PROMPT = `
      Verifica la coherencia en el mundo Magi:
      1. ¿La frialdad de Aries se percibe como una barrera lógica/social y no solo como crueldad?
      2. ¿Se mantiene la técnica de la Triada Operativa en la magia?
      3. ¿Harry actúa como puente emocional para Aries?
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

      --- BORRADOR DEL USUARIO ---
      ${story || 'Generar una escena donde Aries intenta dar un cumplido a Harry y termina explicando la física de los buscadores.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'Enfatizar la incomodidad social de Aries.'}

      --- OBJETIVO ---
      Transformar la escena. Aries debe resultar fascinante pero claramente fuera de su elemento en lo social. Su lógica es su escudo contra la confusión emocional.

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
          config: { temperature: 0.8 }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La matriz de procesamiento falló.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n--- REGLAS ---\n${worldRules}`;
  try {
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text;
  } catch (error) {
    throw new Error("Error en la auditoría de reglas.");
  }
}