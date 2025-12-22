
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
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
    title: "El Colapso de la Estratega (Romance)",
    description: "Tras la batalla en el Ministerio, Aries se derrumba por el miedo a perder a Sirius. Harry debe consolar a la chica que siempre fue intocable, invirtiendo los papeles.",
    prompt: `
      La batalla en el Departamento de Misterios ha terminado. Sirius está herido de gravedad, pero vivo, siendo atendido en San Mungo.
      En una sala de espera vacía y oscura, Harry encuentra a Aries. La siempre fría estratega está teniendo un ataque de pánico, temblando incontrolablemente, con su armadura de indiferencia totalmente destrozada.
      Harry se acerca. En lugar de que ella lo guíe como siempre, es él quien toma el control. La abraza para detener sus temblores y le susurra su propia técnica de respiración: "Cuatro adentro, cuatro afuera".
      En este momento de vulnerabilidad compartida, Harry se da cuenta de que ya no la ve solo como una aliada brillante, sino como alguien a quien ama profundamente por su humanidad, no por su fuerza.
    `
  },
  {
    title: "El Objeto Maldito",
    description: "Un regalo de Sirius ha sido interceptado y maldecido. Cuando Aries lo toca, no solo desata celos, sino que también despierta un peligroso poder latente.",
    prompt: `
      Sirius Black envía un regalo anónimo a Harry: una brújula mágica que perteneció a James. Sin embargo, el paquete es interceptado por un enemigo que le aplica una sutil maldición de rastreo. Por error, el regalo llega a Aries.
      Al tocarlo, la magia oscura le causa un dolor agudo y activa por primera vez su 'Sensibilidad Reactiva', permitiéndole percibir el aura corrupta del objeto.
      Ahora, la brújula no solo apunta a Harry, sino que también emite un 'eco' oscuro que solo ella puede sentir, convirtiendo un objeto de afecto en una amenaza directa para su familia.
    `
  }
];
