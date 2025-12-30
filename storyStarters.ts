
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
    title: "El Rompimiento del Azúcar",
    description: "Un momento de quietud en la cocina de Grimmauld Place. La Crème Brûlée como metáfora de la máscara de Aries.",
    prompt: `
      Es medianoche. El silencio en Grimmauld Place es absoluto, roto solo por el clic de una cuchara de plata contra la superficie endurecida de una Crème Brûlée.
      Aries está sola en la cocina, la luz de una sola vela iluminando sus ojos amatistas. Harry aparece en el umbral. Describe este momento de vulnerabilidad controlada, donde el acto de romper la capa de azúcar caramelizada simboliza cómo Aries permite que Harry vea lo que hay debajo de su armadura de Mauvignier-Black.
      Reflexiona sobre cómo el fuego que endureció el dulce es el mismo que está forjando su destino en la Rubedo.
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
  }
];
