
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Sombra de Zahira",
    description: "En el sexto año, Aries Mauvignier-Black ya no es solo una estudiante brillante; es la heredera de una fortaleza. Su voz y presencia empiezan a reflejar la autoridad absoluta de Zahira.",
    prompt: `
      Es una tarde lluviosa en Grimmauld Place. Aries Mauvignier-Black está de pie en el centro del salón rúnico. Harry entra y, por un segundo, cree ver a Zahira Mauvignier.
      La postura de Aries es de una elegancia letal. Ya no hay rastro de la curiosidad académica de sus primeros años, solo una voluntad que parece doblar el aire a su alrededor.
      Describe cómo Aries ordena el despliegue de las defensas del Cónclave con una frialdad que hace que incluso los miembros más veteranos duden en replicar. 
      Explora la reacción de Harry ante esta nueva versión de su aliada: más poderosa, pero mucho más distante y peligrosa.
    `
  },
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
  }
];
