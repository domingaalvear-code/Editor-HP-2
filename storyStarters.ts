
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "El Colapso de la Estructura",
    description: "Un encuentro imprevisto con un Boggart o una emboscada deja a Aries sin plan y sin varita.",
    prompt: `
      Durante una exploración en los terrenos, algo sale mal y Aries pierde su varita. 
      Narra cómo su mente intenta desesperadamente calcular una salida, pero la falta de herramientas y de un plan previo la paraliza. 
      Describe su desmoronamiento: el temblor en sus manos, la respiración errática y cómo Harry tiene que sacarla físicamente del lugar mientras ella repite que 'esto no estaba en la matriz'. 
      Muestra la vulnerabilidad absoluta de la genio sin su armadura lógica.
    `
  },
  {
    title: "Soluciones para un Corazón Roto",
    description: "Ginny está sufriendo por las secuelas del diario y Aries intenta 'repararla' con lógica.",
    prompt: `
      Aries encuentra a Ginny Weasley llorando en un rincón. 
      En lugar de un abrazo, Aries saca un vial de poción y una lista de ejercicios de Aritmancia para 'redirigir el flujo sináptico del trauma'. 
      Narra el diálogo donde Aries suena condescendiente sin darse cuenta, diciendo que 'llorar es una pérdida de electrolitos ineficiente'. 
      Muestra cómo Aries cree sinceramente que está ayudando, mientras Ginny la mira con una mezcla de confusión y dolor.
    `
  },
  {
    title: "La Corrección Inoportuna",
    description: "En una reunión del Cónclave bajo alta tensión, Aries interrumpe a Sirius para corregir un tecnicismo.",
    prompt: `
      Sirius Black está explicando un plan peligroso para capturar a Pettigrew. La tensión es máxima. 
      Aries interrumpe para corregir la pronunciación de Sirius sobre un antiguo hechizo Black o para señalar un error de 0.5% en su cálculo de tiempo. 
      Narra la reacción de la sala: el silencio pesado, la irritación de Sirius y cómo Aries no entiende por qué todos la miran mal si ella solo 'quería que la información fuera correcta'.
    `
  }
];