
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
        *   **Años 1-5**: Fría, lógica, analítica. Heredera de la Casa Black y Mauvignier.
        *   **Sexto Año en adelante (Evolución Zahira)**: Su personalidad se vuelve indistinguible de la de **Zahira Mauvignier**. Es una figura de autoridad absoluta, elegancia aristocrática y un control mágico que no admite disidencia. Su presencia es imponente y su voz tiene el peso de siglos de dominio rúnico.
        *   Usa seda para limpiar sangre, desprecia el caos emocional y domina la Alquimia con una maestría que asusta incluso a sus aliados.
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
      Actúa como un analista literario experto en el mundo "Magi". Analiza la transmutación de Aries Mauvignier-Black hacia el arquetipo de Zahira Mauvignier a partir del sexto año y su impacto en la jerarquía del Cónclave.
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia del mundo Magi. Verifica:
      1. ¿Se respetan las 10 Reglas de la Alquimia?
      2. ¿Si la historia es del 6to año o superior, Aries muestra la personalidad de Zahira?
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
      ${story || 'Generar un inicio de capítulo enfocado en la evolución de Aries hacia la autoridad de Zahira en el sexto año.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande el material a una prosa narrativa de alta calidad. Refleja la transición de personalidad de Aries si la cronología lo indica.

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
