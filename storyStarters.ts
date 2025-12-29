
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Ecuación de Mauvignier-Black",
    description: "En el cuarto año, Aries debe equilibrar su herencia alquímica francesa con la oscuridad intrínseca del linaje Black. Un dilema de identidad y control.",
    prompt: `
      Aries Mauvignier-Black se encuentra frente al tapiz de la familia Black en Grimmauld Place. Su nuevo nombre pesa tanto como el colgante de plata en su cuello.
      Usa la "Triada Operativa" para describir cómo intenta purificar una maldición familiar usando lógica Mauvignier. 
      Reflexiona sobre cómo el apellido Black ha cambiado la percepción que el Cónclave tiene de ella, mientras Harry observa la tensión en sus hombros, usualmente inmóviles.
    `
  },
  {
    title: "El Peso del Cónclave",
    description: "Harry Potter debe lidiar con la 'Resonancia' de su fama mientras entrena bajo el sistema táctico de Aries, ahora más estricta que nunca tras asumir el nombre Black.",
    prompt: `
      Harry está entrenando en el gimnasio rúnico. Aries Mauvignier-Black le exige una precisión absoluta: "Un Black no duda. Un Mauvignier no falla. Tú no harás ninguna de las dos".
      Lleva sus botas de cuero de dragón y su porta-varita táctico. Su Walkman emite un ruido blanco constante.
      Escribe una escena de entrenamiento donde Harry debe integrar la frialdad de Aries con su propia intuición para superar una prueba de duelo de nivel Cónclave.
    `
  },
  {
    title: "Leyes de Intercambio Equivalente",
    description: "Una exploración de las 10 Reglas de la Alquimia. Aries Mauvignier-Black demuestra por qué es la alumna más brillante de su generación.",
    prompt: `
      Un accidente alquímico ha ocurrido. Aries interviene con una calma que hiela la sangre. Ya no es solo la genio Mauvignier; ahora tiene la autoridad de un Black.
      Describe cómo aplica las Reglas 3 y 9 para contener el desastre, usando su varita con una elegancia que Harry reconoce como puramente aristocrática y peligrosa.
    `
  }
];
