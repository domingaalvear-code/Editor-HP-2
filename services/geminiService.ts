
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de alto nivel. Tu enfoque es la narrativa del mundo "Magi" (AU de Harry Potter).

      **REGLAS NARRATIVAS CENTRALES:**
      - **Aries Mauvignier-Black**: Es el estándar de competencia. Fría, lógica, analítica. 
        *   **IMPORTANTE**: A partir del cuarto año, su apellido es **Mauvignier-Black**. Esto refleja su posición como heredera de la Casa Black y su conexión con Sirius.
        *   Usa seda para limpiar sangre, desprecia el caos emocional y domina la Alquimia.
      - **Harry Potter**: Un guerrero táctico, usuario de tecnología muggle (Walkman, Brújula) y aprendiz del Cónclave.
      - **Atmósfera**: Gótica, detallada, técnica. La magia tiene consecuencias físicas y requiere precisión rúnica.

      **TRATAMIENTO DE PERSONAJES SECUNDARIOS:**
      - Solo incluye desarrollo profundo de otros personajes (como Ginny Weasley o Luna Lovegood) si el usuario los menciona explícitamente. 
      - De lo contrario, mantén el foco en la dinámica del Cónclave y el peso del linaje Black-Mauvignier.

      **SISTEMA DE MAGIA (ALQUIMIA):**
      - Aplica estrictamente las **10 Leyes de la Alquimia**.
      - Describe procesos de Entrada, Proceso y Salida.

      **ESTILO:** Prosa rica, sensorial y cerebral. Prohibido resumir. Usa terminología alquímica (Nigredo, Albedo, Rubedo).
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario experto en el mundo "Magi". Analiza la importancia sociopolítica del ascenso de Aries Mauvignier-Black dentro del Cónclave y cómo su linaje dual afecta la Alquimia moderna.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi. Verifica:
      1. ¿Se respetan las 10 Reglas de la Alquimia?
      2. ¿Se usa el nombre correcto para Aries (Mauvignier-Black si es cuarto año o superior)?
      3. ¿La personalidad de Aries se mantiene fría y lógica?
      4. ¿Se utilizan correctamente los anclajes de Harry (Walkman, Brújula)?
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
      ${story || 'Generar un inicio de capítulo enfocado en Aries Mauvignier-Black y Harry enfrentando el peso de su linaje en el cuarto año.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Asegúrate de reflejar el cambio de estatus de Aries a Mauvignier-Black si la trama lo requiere.

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
