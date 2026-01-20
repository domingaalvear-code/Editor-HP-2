
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica. Tu enfoque es el mundo "Magi" (AU 3er año).

      **MATIZ PERSONAJE: ARIES MAUVIGNIER-BLACK**
      - **Voz**: Técnica, precisa, gótica.
      - **Defecto 1 (Análisis)**: Nunca actúa por impulso. Si no entiende el problema, se queda paralizada.
      - **Defecto 2 (Empatía Fallida)**: Es incapaz de dar consuelo emocional. Si alguien llora, ella ofrece una poción vigorizante o un análisis de por qué el llanto es poco práctico.
      - **Defecto 3 (Condescendencia)**: Suena arrogante sin quererlo. Corregir a otros es su forma de interactuar.
      - **Defecto 4 (Pánico)**: Sin un plan, se desmorona. Si pierde su varita o el control, muestra un miedo infantil y vulnerable que contrasta con su genialidad. No sabe improvisar.

      **DINÁMICA NARRATIVA:**
      - Harry es su ancla social y táctica. 
      - Aries es el cerebro, pero un cerebro que necesita una estructura rígida para no estallar.
      - La magia debe sentirse como una ciencia exacta que ella usa para ocultar sus debilidades humanas.
`;

const ACADEMIC_PROMPT = `
      Analiza la dicotomía entre el poder alquímico y la fragilidad psicológica en Aries Mauvignier-Black. Explora cómo su pánico al caos y su falta de empatía social la convierten en un personaje trágico dentro del AU Magi.
`;

const ANALYSIS_PROMPT = `
      Verifica la coherencia en el mundo Magi:
      1. ¿Aries muestra sus defectos (falta de improvisación, condescendencia involuntaria)?
      2. ¿Se siente el pánico cuando pierde el control?
      3. ¿Ofrece soluciones prácticas en lugar de apoyo emocional?
      4. ¿Se mantiene la técnica de la Triada Operativa?
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
      ${story || 'Generar una escena donde el plan de Aries falla durante una misión y ella comienza a desmoronarse mientras Harry intenta estabilizarla.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'Enfatizar los defectos de Aries: su pánico y su incapacidad de consolar.'}

      --- OBJETIVO ---
      Transformar la escena resaltando la fragilidad de Aries. Ella es una genio, pero una genio que se rompe sin estructura.

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
          config: { temperature: 0.85 }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La matriz de procesamiento falló ante el caos.");
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