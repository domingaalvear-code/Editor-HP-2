
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Mirada del Depredador",
    description: "La presencia Veela de Aries causa un silencio incómodo en el Gran Comedor.",
    prompt: `
      Aries camina hacia la mesa de Gryffindor para hablar con Harry. 
      Narra cómo los estudiantes a su alrededor se apartan, no por admiración, sino por un instinto primordial de peligro. 
      Describe cómo Aries nota los susurros y las miradas de desconfianza. 
      Ella se sienta y le dice a Harry con un sarcasmo gélido: 'Parece que hoy el 84% de la sala cree que voy a devorar sus hígados. ¿Podemos proceder con el análisis del mapa?'. 
      Muestra su soledad y cómo solo Harry parece inmune a esa atmósfera inquietante.
    `
  },
  {
    title: "El Peso de Grimmauld Place",
    description: "Aries tiene que frenar una idea imprudente de Sirius mientras gestiona las cuentas de la casa.",
    prompt: `
      Sirius quiere organizar una incursión arriesgada o una fiesta ruidosa para 'celebrar la libertad'. 
      Aries está rodeada de libros contables y planes de seguridad. 
      Narra la discusión: Aries siendo la voz de la razón, fría y técnica, mientras Sirius la acusa de ser 'demasiado Mauvignier'. 
      Muestra el cansancio de Aries al tener que ser la adulta de la relación y cómo, tras la discusión, se encierra a escuchar 'Wish You Were Here' para lidiar con la envidia de no poder ser tan libre como él.
    `
  },
  {
    title: "Cuando el Dique Rompe",
    description: "Un error humano trivial arruina un experimento perfecto y Aries explota.",
    prompt: `
      Aries ha pasado semanas en un experimento de alquimia rúnica. Alguien (quizás un compañero distraído) comete un error ilógico que lo arruina todo. 
      No narres una Aries indiferente. Narra cómo su necesidad de control se quiebra. 
      Su reacción es una explosión de sarcasmo violento seguido de una ansiedad paralizante donde comienza a hiperventilar porque 'el mundo no tiene sentido si la gente no sigue las reglas'. 
      Harry tiene que intervenir para recordarle que el caos es parte de la Variable Humana.
    `
  },
  {
    title: "El Glamour Desconfiado",
    description: "Un chico intenta invitar a Aries a salir y ella analiza sus niveles de dopamina con desprecio.",
    prompt: `
      Un estudiante valiente intenta invitar a Aries a Hogsmeade. 
      Narra cómo Aries lo mira fijamente, buscando señales de que su interés es real y no una reacción a su sangre Veela. 
      Ella responde con un cuestionario técnico sobre sus intenciones y termina rechazándolo de forma condescendiente, convencida de que solo es un títere de sus propios instintos biológicos. 
      Luego, ella se pregunta si alguna vez alguien la verá sin el filtro de su linaje.
    `
  }
];