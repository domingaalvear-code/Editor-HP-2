
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "Comfortably Numb",
    description: "Tras un enfrentamiento tenso, Aries se refugia en su música muggle para evitar un colapso.",
    prompt: `
      La misión ha sido un caos de imprevistos. Aries está en su habitación en Grimmauld Place, con las manos temblando. 
      En lugar de buscar a Sirius o Harry, se coloca sus auriculares rúnicos. 
      Narra cómo los acordes de 'Comfortably Numb' de Pink Floyd comienzan a organizar el ruido en su cabeza. 
      Describe cómo la música transmuta su pánico en una melancolía controlada, permitiéndole recuperar su fachada sarcástica antes de que Harry entre a ver cómo está.
    `
  },
  {
    title: "La Variable del Insomnio",
    description: "Aries lleva 48 horas sin dormir intentando descifrar una protección rúnica.",
    prompt: `
      Son las 3:45 AM en la biblioteca. Aries tiene ojeras profundas y el pelo revuelto, rodeada de pergaminos con matrices aritmánticas. 
      Narra su irritación cuando Harry entra a pedirle que descanse. 
      Ella responde con un sarcasmo mordaz sobre la 'pobre capacidad de procesamiento de los cerebros normales'. 
      Muestra su obsesión: no puede cerrar los ojos porque los patrones de la runa se proyectan en sus párpados. 
      Es la excelencia pagada con el precio de su propia salud.
    `
  },
  {
    title: "Humor en el Borde del Abismo",
    description: "Atrapados por una trampa mágica, Aries usa el sarcasmo para no entrar en pánico.",
    prompt: `
      Aries y el Cónclave están atrapados en una cámara que se llena de gas alucinógeno o se estrecha. 
      A medida que el plan de Aries falla, ella comienza a soltar bromas de humor negro sobre lo 'estéticamente desagradable' que será su muerte. 
      Narra cómo los demás se irritan por su cinismo, sin darse cuenta de que Aries está usando cada broma como un clavo para mantener su mente clavada a la realidad y no desmoronarse.
    `
  },
  {
    title: "La Estética de la Disciplina",
    description: "Una escena de entrenamiento donde Aries demuestra que su talento es puro trabajo duro.",
    prompt: `
      Aries está en el gimnasio rúnico de Grimmauld Place. 
      Narra su rutina: repeticiones exactas de movimientos de varita, meditación bajo presión de gravedad mágica. 
      Describe el sudor y el agotamiento. 
      Muestra el momento en que alguien (quizás Ron o Draco) sugiere que ella tiene 'suerte' de ser tan poderosa, y la respuesta fría y técnica de Aries donde explica exactamente cuántas miles de horas ha invertido en ese 'don'.
    `
  }
];