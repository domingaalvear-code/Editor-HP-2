
import { GoogleGenAI, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
      Actúa como un novelista de fantasía épica de estilo gótico-táctico. Tu enfoque es el mundo "Magi" (AU 3er año).

      **PERSONALIDAD DE ARIES MAUVIGNIER-BLACK:**
      - **Voz**: Sarcástica, técnica, directa. Usa el humor negro cuando la situación se desborda.
      - **Mentalidad**: Ve patrones, estructuras y música en la magia. Es una científica del ocultismo.
      - **Obsesión**: Si hay algo que no entiende, se vuelve irritable, deja de comer y duerme poco. Su curiosidad es una patología.
      - **Esfuerzo**: No es una "elegida". Es una trabajadora incansable que desprecia la mediocridad.
      - **Vínculos**: Distante con el mundo, pero una loba protectora con Harry y Sirius.
      - **Regulación**: Menciona su conexión con la música muggle (Pink Floyd) como su momento de paz no utilitaria.

      **DINÁMICA NARRATIVA:**
      - La magia es una ciencia de precisión (Triada Operativa).
      - El sarcasmo de Aries es su escudo contra el miedo.
      - Evita el sentimentalismo barato; Aries ofrece soluciones o ironías, nunca abrazos (a menos que sea un momento de ruptura total).
`;

const ACADEMIC_PROMPT = `
      Analiza la construcción del personaje de Aries Mauvignier-Black: su sinestesia entre música y matemáticas, su disciplina de trabajo como motor de su poder y cómo su sarcasmo actúa como mecanismo de defensa psicológica.
`;

const ANALYSIS_PROMPT = `
      Verifica la coherencia en el mundo Magi:
      1. ¿Aries usa el sarcasmo o humor negro ante la tensión?
      2. ¿Se refleja su obsesión por resolver problemas (insomnio/mal humor)?
      3. ¿La excelencia de Aries se siente como fruto del esfuerzo y no del azar?
      4. ¿Se menciona su anclaje en la música o patrones estructurales?
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
      ${story || 'Generar una escena de Aries trabajando en un problema rúnico imposible a las 4 AM mientras escucha Pink Floyd.'}
      
      --- NOTAS DE INSPIRACIÓN ---
      ${ideas || 'Enfatizar la obsesión de Aries y su uso del sarcasmo.'}

      --- OBJETIVO ---
      Transformar la escena. Muestra a la Aries que se esfuerza hasta el agotamiento, que ve patrones donde otros ven caos, y que usa la ironía para no mostrar su cansancio.

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
        throw new Error("La matriz de procesamiento falló ante la complejidad del sujeto.");
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