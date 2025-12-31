
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Sombra de Zahira",
    description: "Aries ya no es solo una estudiante; es la heredera del Cónclave. Su abrigo de seda de acromántula y sus botas de cuero de dragón marcan su ascenso.",
    prompt: `
      Es una tarde lluviosa en Grimmauld Place. Aries Mauvignier-Black está de pie en el centro del salón rúnico. Harry entra y por un momento cree ver a Zahira: el mismo abrigo de seda de acromántula negra con el cuello alto, el mismo cinturón táctico de cuero de dragón con viales plateados.
      Describe cómo las runas de plata bordadas en los hombros de Aries brillan con una luz amatista cuando Harry se acerca. El aroma a Vainilla Negra y Belladona completa la transformación.
      Aries no dice nada, simplemente ajusta su porta-varita táctico en el antebrazo. Escribe una escena donde la autoridad visual de Aries sea tan pesada como el aire de la habitación.
    `
  },
  {
    title: "El Rompimiento del Azúcar",
    description: "Un momento de quietud. La rigidez de la seda de acromántula contrastada con la fragilidad de una Crème Brûlée.",
    prompt: `
      Aries está en la cocina, su abrigo rúnico desabrochado, revelando el forro de seda púrpura. Sobre la mesa, una Crème Brûlée.
      Describe el contraste entre sus manos enguantadas en cuero de dragón fino y la delicadeza de la cuchara de plata. Harry la observa desde la sombra. 
      Rompimiento de la capa de azúcar: una metáfora de cómo Aries se quita la armadura de Zahira por unos minutos antes de volver a la guerra.
    `
  },
  {
    title: "El Despertar de la Rubedo",
    description: "El momento en que Aries recibe su primer equipo táctico de manos de Zahira.",
    prompt: `
      Agosto de 1994. Zahira Mauvignier entrega a Aries una caja de madera de ébano. Dentro, el abrigo de seda de acromántula y el aceite de Belladona.
      "Esto no es ropa, Aries. Es un anclaje. Es tu piel en el campo de batalla".
      Describe la primera vez que Aries se pone el equipo, sintiendo el peso de la responsabilidad y la toxicidad controlada del aceite en sus muñecas.
    `
  }
];
