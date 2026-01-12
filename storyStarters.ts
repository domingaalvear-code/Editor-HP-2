
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "El Asedio de la Rata",
    description: "Operación táctica en la Sala Común de Gryffindor usando a Eros, Crookshanks y Hermes.",
    prompt: `
      Narra la 'Fase uno de la operación de contención' en la Torre de Gryffindor. 
      Aries entra en la sala común con Eros y Hermes (el cuervo). Describe la atmósfera de depredación coordinada. 
      Scabbers (Pettigrew) está en el bolsillo de Ron, sintiendo que el perímetro se cierra. 
      Enfócate en la mirada clínica de Aries y cómo Harry vigila las salidas de ventilación, sabiendo que la rata no tiene escapatoria bajo la 'Ley de la Contingencia'.
    `
  },
  {
    title: "Natura Ardet, Mens Gubernat",
    description: "Zahira revela a Harry la verdadera herencia de Aries y la conexión con Grindelwald.",
    prompt: `
      Escena en el salón de Grimmauld Place. Zahira Mauvignier abre la caja de Jean-Luc que contiene las esencias de la Veela de los Cárpatos. 
      Describe el momento en que se revela que Aries es bisnieta de Gellert Grindelwald. 
      Explora la reacción de Harry ante esta 'variable' oscura y cómo la filosofía de 'La Mente Gobierna' es lo único que mantiene a Aries a salvo de su propia sangre. 
      El ambiente debe oler a ozono y a historia antigua.
    `
  },
  {
    title: "Vuelo en el Ojo de la Tormenta",
    description: "El partido contra Ravenclaw. Harry en la Saeta de Fuego contra la balística de Aries.",
    prompt: `
      Campo de Quidditch bajo una tormenta escocesa. Harry está sobre su Saeta de Fuego, pero Aries no juega; ella aplica balística como Golpeadora. 
      Narra el duelo aéreo: Aries desviando Bludgers con precisión de Aritmante para negar el espacio de vuelo de Harry. 
      Describe la 'Rubedo' de Harry al realizar la maniobra vertical de 90 grados para esquivar el ataque de Aries. 
      Termina con el reconocimiento mutuo de fuerza al aterrizar en el barro.
    `
  },
  {
    title: "La Auditoría del Oro",
    description: "Zahira Mauvignier se enfrenta al Ministro Fudge en el tribunal del Nivel 10.",
    prompt: `
      Nivel 10 del Ministerio de Magia. Zahira Mauvignier se pone de pie frente al Wizengamot. 
      Describe cómo ella 'transmuta' la justicia en una transacción comercial, derramando una cascada de un millón de galeones sobre la mesa del escriba. 
      Narra el miedo visceral de Fudge al saber que Zahira tiene sus libros de contabilidad. 
      Es la victoria de la 'Variable Mauvignier' sobre la burocracia corrupta.
    `
  }
];