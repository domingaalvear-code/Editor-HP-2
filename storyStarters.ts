
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Sombra de Zahira",
    description: "Aries proyecta la autoridad de Zahira. Su aroma a Vainilla Negra y Belladona es un bálsamo para Harry, pero un presagio de muerte para sus enemigos.",
    prompt: `
      Es una tarde lluviosa en Grimmauld Place. Aries Mauvignier-Black está de pie en el centro del salón rúnico. Harry entra y el aroma lo golpea de inmediato: Vainilla Negra y Belladona.
      Para Harry, ese olor es sinónimo de seguridad, el recordatorio de que Aries está al mando. Pero cuando un intruso es arrastrado al salón, Harry nota cómo el mismo aroma parece volverse gélido, casi asfixiante, como si la toxicidad de la Belladona se manifestara físicamente.
      Describe la transición de Aries de la calma medicinal a la letalidad absoluta mientras interroga al prisionero con la voz de Zahira.
    `
  },
  {
    title: "El Despertar de la Rubedo",
    description: "En el cuarto año, Aries acepta su destino. El aceite esencial de Zahira es el catalizador de su nueva identidad.",
    prompt: `
      Aries Mauvignier-Black sostiene el pequeño frasco de cristal tallado que Zahira le dio en agosto. Al destaparlo, el aroma a Vainilla Negra inunda la habitación, seguido por el matiz terroso y peligroso de la Belladona.
      Reflexiona sobre cómo esta esencia no es un perfume, sino una declaración de guerra. Describe el momento en que se aplica el aceite en las muñecas, sintiendo cómo la toxicidad controlada de la planta alinea sus centros de magia. 
      Ya no es una niña jugando con runas; es una Mauvignier-Black preparándose para la Rubedo.
    `
  },
  {
    title: "El Peso del Cónclave",
    description: "Harry entrena bajo la supervisión de Aries, cuya presencia es ahora un recordatorio constante de su linaje.",
    prompt: `
      Harry está exhausto en el gimnasio rúnico. Aries se acerca y el rastro de Belladona en el aire parece calmar sus nervios destrozados, actuando como el sedante que Zahira pretendía que fuera para sus aliados.
      "Un Black no duda. Un Mauvignier no falla", susurra ella, su voz cargada de una autoridad que Harry solo había escuchado antes en Zahira.
      Escribe sobre este momento de conexión sensorial y cómo Harry encuentra la fuerza para seguir adelante bajo la mirada amatista de Aries.
    `
  }
];
