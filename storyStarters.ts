
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
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
  },
  {
    title: "El Duelo Alquímico Contaminado",
    description: "Un duelo de pociones con Hermione es sabotado con una maldición. El resultado no solo hiere a Aries, sino que amplifica su habilidad para sentir la oscuridad en Hogwarts.",
    prompt: `
      Durante un avanzado duelo de pociones contra Hermione, un rival sabotea el caldero de Aries con un ingrediente imbuido en una maldición menor. La poción no solo se arruina, sino que explota, hiriendo a Aries.
      El contacto con la magia oscura amplifica su habilidad latente.
      Ahora, comienza a percibir 'cicatrices' mágicas en lugares de Hogwarts donde se han realizado actos oscuros, convirtiendo los pasillos del castillo en un mapa de secretos dolorosos que solo ella puede leer.
    `
  },
  {
    title: "La Cicatriz del Mediador",
    description: "Aries intenta detener una pelea entre casas y es alcanzada por un hechizo oscuro. La herida le otorga una nueva y aterradora perspectiva sobre sus compañeros.",
    prompt: `
      Un enfrentamiento entre Gryffindor y Slytherin escala a un intercambio de hechizos peligrosos. Aries interviene para proteger a un estudiante más joven y es alcanzada por una maldición oscura perdida.
      La herida activa su poder, y ahora puede sentir la 'resonancia' de la malicia en el aura del lanzador.
      Su habilidad para mediar se ve comprometida, ya que ahora no solo oye las discusiones, sino que *siente* la oscuridad latente en las intenciones de sus compañeros, obligándola a cuestionar en quién puede confiar realmente.
    `
  },
  {
    title: "El Eco del Legado Oscuro",
    description: "Un artefacto de Grindelwald es usado para atacar a la familia de Aries. La agresión, en lugar de intimidarla, agudiza su poder y la pone en el camino de su agresor.",
    prompt: `
      Para desacreditar a los Mauvignier, un rival político utiliza un artefacto que perteneció a Grindelwald para lanzar un ataque mágico a distancia sobre Grimmauld Place, hiriendo levemente a Aries en el proceso.
      El ataque tiene un efecto inesperado: agudiza la sensibilidad de Aries a niveles sin precedentes. Ahora puede rastrear el 'eco' del artefacto a través de la red mágica de Londres.
      Lo que comenzó como un chantaje político se convierte en una cacería, donde Aries, guiada por su dolorosa nueva habilidad, se convierte en la única que puede identificar al culpable.
    `
  }
];
