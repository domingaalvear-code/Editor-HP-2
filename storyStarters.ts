
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Variable del Afecto",
    description: "Harry intenta agradecer a Aries por el equipo táctico y ella entra en bucle lógico.",
    prompt: `
      Harry detiene a Aries en el pasillo para agradecerle la chaqueta de piel de basilisco. 
      Narra el proceso interno de Aries: ella analiza la dilatación de las pupilas de Harry y el tono de su voz. 
      En lugar de decir 'De nada', Aries comienza una disertación sobre la resistencia a la tracción del cuero mágico. 
      Describe la frustración de Aries al darse cuenta, demasiado tarde, de que debería haber sonreído.
    `
  },
  {
    title: "Geometría del Vals",
    description: "Aries es obligada a asistir a una reunión social y trata de bailar usando matemáticas.",
    prompt: `
      En una recepción en Grimmauld Place, Aries debe bailar con un joven heredero de una casa sangre pura. 
      Narra cómo ella cuenta los pasos en voz baja ('Un cuarto de giro, 45 grados, eje de rotación constante'). 
      Su pareja está aterrorizada por su intensidad. 
      Harry la observa desde lejos, sabiendo que Aries no está siendo arrogante, sino que está luchando por no pisar a nadie mientras calcula la trayectoria de la falda.
    `
  },
  {
    title: "El Error del Consuelo",
    description: "Hermione está llorando en la biblioteca y Aries intenta ayudar... a su manera.",
    prompt: `
      Hermione está abrumada por los exámenes. Aries se acerca. 
      Describe cómo Aries saca un pergamino y comienza a graficar las probabilidades de éxito de Hermione basándose en sus notas anteriores. 
      Aries dice algo como: 'Tus glándulas lacrimales están desperdiciando recursos hídricos innecesarios para un examen de Transformaciones'. 
      Al ver la cara de Hermione, Aries se da cuenta de que su 'diagnóstico' no era lo que se necesitaba.
    `
  }
];