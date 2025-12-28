
export interface StoryStarter {
  title: string;
  description: string;
  prompt: string;
}

export const storyStarters: StoryStarter[] = [
  {
    title: "La Ecuación de Mauvignier",
    description: "Aries enfrenta un dilema donde la lógica de la Alquimia choca con la imprevisibilidad humana. Un análisis sobre el control y la frialdad necesaria para sobrevivir.",
    prompt: `
      Aries Mauvignier se encuentra en su laboratorio privado en Grimmauld Place. Está analizando un residuo de magia oscura recuperado de una escena de duelo.
      Usa la "Triada Operativa" (Entrada, Proceso, Salida) para describir cómo descompone el hechizo. 
      Aries reflexiona sobre la debilidad de los sentimientos frente a la pureza de las runas, mientras Harry observa desde las sombras, cuestionando si ella es capaz de sentir el miedo que él siente constantemente.
    `
  },
  {
    title: "El Peso del Cónclave",
    description: "Harry Potter debe lidiar con la 'Resonancia' de su fama y el peso de las expectativas mientras entrena bajo el sistema táctico de Aries.",
    prompt: `
      Harry está entrenando en el gimnasio rúnico. Su Walkman emite un ruido blanco constante para bloquear el 'eco' de las voces del castillo. 
      Lleva sus botas de cuero de dragón y su porta-varita táctico. Aries le exige una precisión absoluta: "Si tu Resonancia Emocional fluctúa un 2%, el patrón se rompe".
      Escribe una escena de entrenamiento intenso donde Harry lucha por mantener su 'Anclaje Simbólico' (la Brújula de James) mientras intenta realizar un traslador de corto alcance bajo presión.
    `
  },
  {
    title: "Leyes de Intercambio Equivalente",
    description: "Una exploración de las 10 Reglas de la Alquimia en una situación de crisis real en el Callejón Diagon.",
    prompt: `
      Un accidente alquímico ha ocurrido en una botica. La Ley de Contaminación está causando una fuga de energía que calcifica el aire.
      Aries y Harry intervienen. Describe cómo aplican las Reglas 3 (Equilibrio de Intercambio) y 9 (Efectos Residuales) para contener el desastre.
      Enfócate en el estilo visual: luz violeta, patrones rúnicos en el suelo y el pragmatismo clínico de Aries ante el caos.
    `
  }
];
