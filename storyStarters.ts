
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Taxonomía de las Sombras",
    description: "Luna Lovegood encuentra a Ginny en un rincón de la biblioteca. En lugar de consolarla, le pide ayuda para clasificar los 'ecos' de Ryddle como si fueran criaturas mágicas.",
    prompt: `
      Ginny está escondida tras una pila de libros de Historia de la Magia, sintiendo que la tinta de sus dedos es sangre de basilisco.
      Luna aparece con un ejemplar de El Quisquilloso y le dice: "Tienes un Wrackspurt de memoria muy grande, Ginny. Se parece un poco a un joven Tom Ryddle, pero más pálido".
      Escribe la conversación donde Luna desmitifica el terror de Ginny tratándolo como un fenómeno natural, y cómo esto permite a Ginny, por primera vez, respirar sin sentir el peso del diario. 
      Usa la "Triada Operativa" para describir cómo Ginny realiza su primera chispa de magia voluntaria en meses.
    `
  },
  {
    title: "El Verano de Cristal (Egipto)",
    description: "Ginny Weasley lucha con las sombras de Ryddle mientras su familia celebra en Egipto. Su inseguridad frente a la 'perfección' de Aries Mauvignier comienza a calcificarse.",
    prompt: `
      Es una noche calurosa en una tienda mágica cerca de las pirámides de Giza. Ginny no puede dormir; la arena se siente como escamas de basilisco y el viento silba con la voz de Tom.
      Mira una foto de Harry y Aries en la biblioteca que Ron dejó sobre la mesa. Siente que ellos son luz y ella es solo una mancha de tinta.
      Escribe una escena donde Ginny intenta realizar un hechizo simple de protección y falla porque su "Resonancia Emocional" está contaminada por el miedo, mientras recuerda la oferta de Aries de llevarla a Beauxbatons como si fuera una caridad.
    `
  },
  {
    title: "El Colapso de la Estratega",
    description: "Tras la batalla en el Ministerio, Aries se derrumba por el miedo a perder a Sirius. Harry debe consolar a la chica que siempre fue intocable.",
    prompt: `
      La batalla en el Departamento de Misterios ha terminado. Sirius está herido.
      En una sala de espera vacía, Harry encuentra a Aries teniendo un ataque de pánico, con su armadura de indiferencia destrozada.
      Harry toma el control, usando la propia técnica de ella: "Cuatro adentro, cuatro afuera". 
      Muestra cómo Harry descubre la humanidad tras la genio de Ravenclaw.
    `
  }
];
