
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de alto nivel. Tu enfoque es el desarrollo psicológico profundo y la narrativa de "coming of age" oscura.

      **FOCO NARRATIVO: LA TRASFORMACIÓN DE GINNY WEASLEY**
      - Explora la disonancia de Ginny en Egipto (Verano 1993): se siente una "muñeca de porcelana" rota mientras su familia celebra.
      - **Luna Lovegood** debe aparecer como la única voz que no la compadece. Luna desmitifica el horror de Tom Ryddle tratándolo como una curiosidad taxonómica.
      - **Arco de Aries**: Muestra la transición crítica donde Ginny deja de sentir envidia corrosiva por Aries Mauvignier y empieza a verla como un **faro de competencia**. Ginny decide que quiere esa fuerza mental para que nadie vuelva a entrar en su cabeza.
      - Aries no es cálida, es pragmática. Su "frialdad clínica" es lo que Ginny admira ahora porque es lo opuesto a la vulnerabilidad emocional que la llevó al diario.

      **SISTEMA DE MAGIA (ALQUIMIA):**
      - Aplica las **10 Leyes de la Alquimia**. Describe la magia de Ginny como algo que necesita "Albedo" (purificación de Luna) antes de llegar a la "Rubedo" (el fuego del canon).
      - La magia de Aries es el estándar de oro: silenciosa, rúnica y sin fisuras.

      **ESTILO:** Prosa rica, sensorial y gótica. No resumas escenas. Queremos sentir la arena de Egipto, el frío de la Cámara y el brillo amatista de los ojos de Aries en los recuerdos de Ginny.
`;

const ACADEMIC_PROMPT = `
      Actúa como un analista literario y psicólogo mágico. Analiza la transición del arquetipo de "Damisela en Apuros" a "Guerrera Estratega" en Ginny Weasley, usando a Luna Lovegood y Aries Mauvignier como polos de influencia (Empatía vs Competencia).
`;

const ANALYSIS_PROMPT = `
      Eres un analista de coherencia. Verifica:
      1. ¿Se refleja el paso de la envidia de Ginny hacia la admiración por Aries?
      2. ¿Luna actúa como catalizador de la verdad sin filtros?
      3. ¿Se menciona el trauma del "Anexo 1: Verano de Cristal" (muñeca de porcelana)?
      4. ¿Se respetan las leyes de la alquimia?
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

      --- REGLAS DEL MUNDO (AU) ---
      ${worldRules}

      --- MATERIAL DE REFERENCIA (PDFs/CANON) ---
      ${canonReference || "No se proporcionó."}

      --- MANUSCRITO ACTUAL / POV ---
      ${story || 'Generar una escena de Ginny en Egipto escribiendo una carta que nunca enviará a Aries, o hablando con Luna sobre los "Wrackspurts" de Tom.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'No se proporcionaron.'}

      --- OBJETIVO ---
      Expande la historia a un capítulo completo (mínimo 3000-5000 palabras si es posible). Prioriza el monólogo interno de Ginny y su decisión de volverse fuerte.

      --- MANUSCRITO FINAL EXPANDIDO ---
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
        throw new Error("La conexión con el Departamento de Misterios falló.");
    }
};

export const analyzeWorldRules = async (worldRules: string): Promise<string> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `${ANALYSIS_PROMPT}\n--- REGLAS ---\n${worldRules}`;
  try {
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text;
  } catch (error) {
    throw new Error("Error analizando la estructura del mundo.");
  }
}
