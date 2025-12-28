
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "El Espejo de Amatista",
    description: "Ginny decide dejar de odiar la perfección de Aries y empieza a estudiarla como un manual de supervivencia. La envidia se transmuta en la voluntad de ser una guerrera.",
    prompt: `
      En el caluroso Egipto, Ginny encuentra un recorte de periódico donde aparece Aries Mauvignier tras la Cámara de los Secretos. 
      En lugar de apartar la vista con dolor, Ginny saca una libreta y empieza a anotar: "Postura. Control rúnico. Mirada analítica". 
      Escribe una escena donde Ginny practica la técnica de respiración de Aries para silenciar los susurros de Tom Ryddle, dándose cuenta de que la fuerza no es un don, sino una variable que ella puede controlar.
    `
  },
  {
    title: "La Taxonomía de las Sombras",
    description: "Luna Lovegood ayuda a Ginny a clasificar los 'ecos' de Ryddle como si fueran criaturas mágicas, quitándoles el poder del terror.",
    prompt: `
      Ginny está escondida, sintiendo que la tinta de sus dedos es sangre de basilisco.
      Luna aparece y le dice: "Tienes un Wrackspurt de memoria muy grande, Ginny. Se parece un poco a un joven Tom Ryddle, pero más pálido".
      Muestra cómo Luna desmitifica el terror de Ginny tratándolo como un fenómeno natural, permitiéndole realizar su primera chispa de magia voluntaria mediante la "Triada Operativa".
    `
  },
  {
    title: "El Verano de Cristal (Egipto)",
    description: "Ginny lucha con las sombras de Ryddle mientras su familia la trata como a una 'muñeca de porcelana'.",
    prompt: `
      Es una noche calurosa en una tienda mágica cerca de las pirámides de Giza. Ginny no puede dormir.
      Escribe la lucha interna de Ginny contra la condescendencia amorosa de sus padres y su sensación de ser una carga para Harry Potter, mientras la voz de Tom se ríe de su debilidad.
    `
  }
];
