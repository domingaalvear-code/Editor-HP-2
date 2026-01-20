
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de estilo gótico-táctico. Tu enfoque es el mundo "Magi" (AU 3er año).

      **PERSONALIDAD DE ARIES MAUVIGNIER-BLACK:**
      - **Voz**: Sarcástica, técnica, cargada de una ironía defensiva.
      - **Linaje Veela**: Su belleza debe describirse como inquietante o depredadora. La gente se siente intimidada, no atraída de forma dulce. Ella odia que la miren por su "glamour".
      - **Carga de Responsabilidad**: Ella es la sensata en Grimmauld Place. Cuida de Sirius pero envidia su libertad. Se siente vieja para su edad.
      - **El Dique**: Su frialdad es un esfuerzo consciente por contener una ansiedad explosiva. Si algo no tiene lógica, Aries se irrita o entra en pánico interno.
      - **Música**: Su conexión con Pink Floyd es su único refugio donde no tiene que ser la "adulta" ni la "alquimista".
      - **Relaciones**: Con Harry es protectora y vulnerable a su manera técnica. Con los demás, es un muro de cristal.

      **DINÁMICA NARRATIVA:**
      - La magia es una arquitectura de precisión.
      - El sarcasmo es su armadura; cuanto más miedo tiene, más muerden sus palabras.
      - Evita convertirla en una Mary Sue; sus defectos (falta de empatía, pánico al caos, condescendencia) son reales y tienen consecuencias.
`;

const ACADEMIC_PROMPT = `
      Analiza la subversión del tropo Veela en Aries Mauvignier-Black: de la seducción a la depredación social. Explora su papel como "ancla de madurez" para Sirius Black y cómo su necesidad de control lógico es una respuesta al trauma y al miedo a su propia naturaleza caótica.
`;

const ANALYSIS_PROMPT = `
      Verifica la coherencia en el mundo Magi:
      1. ¿La belleza de Aries se siente inquietante/depredadora en lugar de solo atractiva?
      2. ¿Se muestra la carga de Aries siendo la "adulta" frente a la imprudencia de Sirius?
      3. ¿Aparece el sarcasmo como escudo ante el miedo o la falta de lógica?
      4. ¿Se mantiene la técnica de la Triada Operativa y su obsesión por los patrones?
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
      ${story || 'Generar una escena donde la presencia Veela de Aries incomoda a un grupo de estudiantes y ella se refugia en su sarcasmo mientras Harry observa.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'Enfatizar el matiz depredador del linaje Veela y la carga de responsabilidad de Aries.'}

      --- OBJETIVO ---
      Transformar la escena mostrando a una Aries compleja: poderosa pero socialmente aislada, responsable pero agotada, y siempre protegida por su lógica y su música.

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
        throw new Error("La matriz de procesamiento falló ante la complejidad emocional.");
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