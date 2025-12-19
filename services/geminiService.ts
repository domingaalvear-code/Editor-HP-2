
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ==========================================
// NARRATIVE / FICTION PROMPT (EPIC EXTENSION)
// ==========================================
const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de clase mundial. Tu objetivo es expandir la historia a capítulos de **5000 PALABRAS**.

      **DINÁMICA DE PERSONAJES SEGÚN EL AÑO:**
      - Debes identificar el año escolar en el que transcurre la escena.
      - **Años 1-3**: Harry es el niño valiente, impulsivo, sarcástico e ingenuo del canon, pero con destellos de su potencial técnico (especialmente en el 3er año con el Patronus).
      - **Año 4+**: Cambia radicalmente al modo **Líder Formidable**. Harry debe ser audaz, intimidante, técnicamente perfecto con la magia y estratégico. Elimina cualquier dependencia de la "suerte".

      **USO DE HERMES (EL CUERVO):**
      - Hermes es una herramienta de espionaje. Úsalo para interceptar correspondencia, imitar voces para crear confusión o como observador silencioso en las sombras. Su lealtad es para Zahira Mauvignier.

      **ESTILO NARRATIVO:**
      - **PROSA HIPER-DETALLADA**: Expande cada gesto, pensamiento y atmósfera. Si Aries está presente, resalta su **frialdad gélida**.
      - **LENTITUD ESTRATÉGICA**: Las escenas deben tener profundidad psicológica. PROHIBIDO RESUMIR. Describe el terror ministerial de Grimmauld Place y la precisión de las leyes alquímicas.

      **DIRECTIVAS DE COHERENCIA:**
      1. Aries filtra la información sobre Sirius (Brújula de James).
      2. Dumbledore es un manipulador bienintencionado que miente sobre la Piedra Filosofal.
      3. Hermione valora la lógica y el intelecto de Snape.
`;

const ACADEMIC_PROMPT = `
      Actúa como un investigador académico senior especializado en análisis literario y estructural. Transforma el material en un tratado detallado que analice la evolución de los personajes y las leyes mágicas.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia narrativa. Verifica estrictamente:
      1. ¿La personalidad de Harry Potter coincide con el año cronológico de la escena (Ingenuo vs Líder Formidable)?
      2. ¿Se respeta la competencia técnica de Harry en los años superiores?
      3. ¿Hermes actúa según sus rasgos de inteligencia, mimetismo y sigilo?
      4. ¿Se mantiene el aura de terror en Grimmauld Place y la frialdad de Aries?
      5. ¿La extensión se acerca al objetivo de 5000 palabras?
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
    
    const inputWordCount = story ? story.split(/\s+/).length : 0;

    const promptText = `
      ${SYSTEM_PROMPT}

      --- REGLAS DEL MUNDO (INMUTABLES) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA (CONTEXTO CANON) ---
      ${canonReference || "No se proporcionó."}

      --- HISTORIA A EXPANDIR ---
      ${story || 'Generar nuevo capítulo desde cero.'}
      (Extensión original: ${inputWordCount} palabras)
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Redacta el manuscrito final (aproximadamente 5000 palabras). Asegúrate de que si es a partir del cuarto año, Harry Potter sea el líder formidable descrito, sin rastro de la "suerte del héroe". Si aparece Hermes, usa su habilidad para imitar voces e interceptar información.

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
          config: {
            temperature: 0.85,
            topP: 0.95,
          }
        });
        return response.text;
    } catch(error) {
        console.error("API Error:", error);
        throw new Error("La magia de la IA ha fallado. Verifica la conexión con el Ministerio.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    ${ANALYSIS_PROMPT}
    --- TEXTO A ANALIZAR ---
    ${worldRules}
  `;
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando las reglas de coherencia.");
  }
}
