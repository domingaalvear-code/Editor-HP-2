
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica y experto en psicología de personajes. 
      Tu objetivo es expandir la historia enfocándote en el **Crecimiento de Ginny Weasley**.

      **ARCO NARRATIVO PRIORITARIO:**
      - La amistad entre **Luna Lovegood** y **Ginny** es el catalizador que saca a Ginny de su "jaula de cristal".
      - Luna no trata a Ginny con lástima (a diferencia de los Weasley); la trata con una curiosidad científica y mística que permite a Ginny explorar su trauma sin vergüenza.
      - Describe cómo Luna ayuda a Ginny a "quemar" los restos de la voz de Tom Ryddle mediante la aceptación de su propia fuerza oculta.
      - Aries Mauvignier observa este proceso como una "alquimia del alma" necesaria para que Ginny se una al Cónclave como una igual, no como una carga.

      **ATMÓSFERA Y MAGIA:**
      - Usa la **Triada Operativa** para describir cómo la magia de Ginny, antes "calcificada" por el miedo, comienza a fluir con una violencia contenida y poderosa.
      - Contraste visual: La luz blanca/violeta de Aries frente a la calidez errática y ardiente que Ginny empieza a recuperar.

      **ESTILO:** Prosa hiper-detallada. Explora el monólogo interno de Ginny pasando de la envidia hacia Aries a la inspiración. PROHIBIDO RESUMIR.
`;

const ACADEMIC_PROMPT = `
      Actúa como un sociólogo mágico. Analiza el impacto de Luna Lovegood como "Variable Catalizadora" en la reconstrucción de la integridad mágica de Ginny Weasley tras una posesión de Clase X.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia narrativa. Verifica:
      1. ¿La amistad con Luna es el motor principal del cambio en Ginny?
      2. ¿Se evita tratar a Ginny como una víctima pasiva y se muestra su camino hacia la fuerza?
      3. ¿Se mantienen las **10 Reglas de la Alquimia**?
      4. ¿Se refleja el contraste entre el Albedo de Aries y la Rubedo naciente de Ginny?
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

      --- HISTORIA ACTUAL ---
      ${story || 'Generar capítulo sobre el primer encuentro significativo entre Luna y Ginny en la biblioteca o la torre.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Redacta el manuscrito final (5000 palabras). Asegúrate de que la voz de Luna sea el puente que lleva a Ginny de la oscuridad (Nigredo) a su fuerza final (Rubedo).

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
          config: { temperature: 0.82, topP: 0.95 }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La red Flu está caída. Revisa tu conexión con la API.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n--- REGLAS ---\n${worldRules}`;
  try {
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando coherencia mágica.");
  }
}
