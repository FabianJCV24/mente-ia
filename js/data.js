/* ==========================================================================
   data.js — Contenido editable de la página
   --------------------------------------------------------------------------
   Aquí están los textos de las tarjetas "La IA en tu día a día" y de la
   "Línea de tiempo". Para agregar, quitar o cambiar elementos, solo edita
   estos arreglos de objetos: la página se actualiza sola.
   ========================================================================== */

/**
 * Tarjetas giratorias de la sección "La IA en tu día a día".
 * - icono:       emoji que aparece en el frente.
 * - titulo:      nombre del ejemplo.
 * - pregunta:    texto corto del frente (despierta la curiosidad).
 * - explicacion: texto del reverso (cómo funciona, en lenguaje sencillo).
 * - tecnica:     etiqueta con la técnica de IA que se usa.
 */
const TARJETAS_IA = [
  {
    icono: '🎬',
    titulo: 'Recomendaciones de Netflix',
    pregunta: '¿Cómo sabe qué serie te va a gustar?',
    explicacion:
      'Analiza lo que ves, cuánto tiempo lo ves y qué abandonas, y lo compara con millones de personas con gustos parecidos. Si a quienes se parecen a ti les encantó una serie, probablemente a ti también.',
    tecnica: 'Sistemas de recomendación'
  },
  {
    icono: '🎙️',
    titulo: 'Asistentes de voz',
    pregunta: '¿Cómo entienden Siri o Alexa lo que dices?',
    explicacion:
      'Primero convierten tu voz en texto, luego interpretan la intención de la frase y por último generan una respuesta hablada. Cada paso usa redes neuronales entrenadas con miles de horas de audio.',
    tecnica: 'Procesamiento del lenguaje natural'
  },
  {
    icono: '📧',
    titulo: 'Filtros de spam',
    pregunta: '¿Cómo sabe tu correo qué es basura?',
    explicacion:
      'Aprendió de millones de correos marcados como spam o legítimos. Detecta patrones: palabras sospechosas, remitentes raros, enlaces extraños. Cada vez que marcas un correo como spam, le ayudas a aprender.',
    tecnica: 'Clasificación supervisada'
  },
  {
    icono: '🚗',
    titulo: 'Autos autónomos',
    pregunta: '¿Cómo “ve” la calle un auto sin conductor?',
    explicacion:
      'Combina cámaras, radares y sensores láser (LiDAR). Redes neuronales reconocen peatones, señales y otros autos, y otros sistemas predicen sus movimientos para decidir cuándo frenar, girar o acelerar.',
    tecnica: 'Visión por computadora'
  },
  {
    icono: '🩺',
    titulo: 'Diagnóstico médico',
    pregunta: '¿Puede una IA ayudar a detectar enfermedades?',
    explicacion:
      'Entrenadas con miles de radiografías o imágenes de la retina revisadas por especialistas, algunas IA detectan señales tempranas de enfermedades. No reemplazan al médico: son una segunda opinión que le ayuda a decidir.',
    tecnica: 'Deep Learning en imágenes'
  },
  {
    icono: '📱',
    titulo: 'Desbloqueo facial',
    pregunta: '¿Cómo te reconoce tu teléfono?',
    explicacion:
      'Convierte tu rostro en una especie de “huella numérica” y la compara con la que guardó al configurarlo. Una red neuronal aprendió qué rasgos importan para distinguir caras, incluso con lentes o poca luz.',
    tecnica: 'Reconocimiento facial'
  }
];

/**
 * Hitos de la "Línea de tiempo" de la IA.
 * - anio:        año o periodo (texto libre).
 * - titulo:      nombre del hito.
 * - descripcion: explicación breve.
 * - etiqueta:    categoría corta que aparece como "chip".
 */
const LINEA_TIEMPO = [
  {
    anio: '1950',
    titulo: 'Alan Turing: “¿Pueden pensar las máquinas?”',
    descripcion:
      'Turing publica “Computing Machinery and Intelligence” y propone el famoso Test de Turing: si no puedes distinguir a una máquina de una persona en una conversación, ¿podemos decir que piensa?',
    etiqueta: 'Los orígenes'
  },
  {
    anio: '1956',
    titulo: 'Nace el término “Inteligencia Artificial”',
    descripcion:
      'En la conferencia de Dartmouth, John McCarthy, Marvin Minsky, Claude Shannon y Nathaniel Rochester reúnen a investigadores para estudiar cómo hacer que las máquinas aprendan.',
    etiqueta: 'Fundación'
  },
  {
    anio: '1958',
    titulo: 'El Perceptrón',
    descripcion:
      'Frank Rosenblatt crea una de las primeras neuronas artificiales capaces de aprender de ejemplos. ¡Es el mismo modelo que puedes entrenar en la demo de esta página!',
    etiqueta: 'Redes neuronales'
  },
  {
    anio: '1966',
    titulo: 'ELIZA, el primer chatbot famoso',
    descripcion:
      'Joseph Weizenbaum crea en el MIT un programa que simulaba ser un psicoterapeuta. Usaba reglas simples, pero mucha gente sintió que realmente la entendía.',
    etiqueta: 'Lenguaje'
  },
  {
    anio: '1974–1980',
    titulo: 'El primer “invierno de la IA”',
    descripcion:
      'Las promesas eran enormes y los resultados, modestos. Los computadores eran lentos y los datos escasos, así que la financiación y el entusiasmo cayeron durante años.',
    etiqueta: 'Crisis'
  },
  {
    anio: '1986',
    titulo: 'La retropropagación',
    descripcion:
      'Rumelhart, Hinton y Williams popularizan el algoritmo que permite entrenar redes con varias capas ajustando los errores de atrás hacia adelante. Es la base del Deep Learning actual.',
    etiqueta: 'Algoritmos'
  },
  {
    anio: '1997',
    titulo: 'Deep Blue vence a Kaspárov',
    descripcion:
      'La supercomputadora de IBM derrota al campeón mundial de ajedrez Garri Kaspárov. Lo lograba calculando millones de jugadas por segundo, no “entendiendo” el juego.',
    etiqueta: 'Juegos'
  },
  {
    anio: '2012',
    titulo: 'AlexNet y la revolución del Deep Learning',
    descripcion:
      'Una red neuronal profunda entrenada con tarjetas gráficas (GPU) arrasa en la competencia de reconocimiento de imágenes ImageNet. Desde entonces, el Deep Learning domina el campo.',
    etiqueta: 'Visión'
  },
  {
    anio: '2016',
    titulo: 'AlphaGo vence a Lee Sedol',
    descripcion:
      'La IA de DeepMind gana al campeón de Go, un juego con más posiciones posibles que átomos en el universo observable. Aprendió jugando millones de partidas contra sí misma.',
    etiqueta: 'Juegos'
  },
  {
    anio: '2017',
    titulo: 'Llegan los Transformers',
    descripcion:
      'Investigadores de Google publican “Attention Is All You Need”, una arquitectura que aprende qué palabras de un texto son importantes entre sí. Es el motor de los modelos de lenguaje actuales.',
    etiqueta: 'Arquitecturas'
  },
  {
    anio: '2020',
    titulo: 'GPT-3 y AlphaFold',
    descripcion:
      'GPT-3 sorprende escribiendo textos casi humanos. Ese mismo año, AlphaFold predice con enorme precisión la forma 3D de las proteínas, un problema que la biología llevaba 50 años intentando resolver.',
    etiqueta: 'Ciencia y lenguaje'
  },
  {
    anio: '2022',
    titulo: 'ChatGPT llega al gran público',
    descripcion:
      'Por primera vez, cualquier persona puede conversar con un modelo de lenguaje desde el navegador. Según estimaciones, alcanzó unos 100 millones de usuarios en apenas dos meses.',
    etiqueta: 'Popularización'
  },
  {
    anio: '2023–hoy',
    titulo: 'Modelos multimodales y agentes',
    descripcion:
      'Modelos como GPT-4, Claude, Gemini o Llama entienden texto, imágenes y audio, razonan paso a paso y pueden usar herramientas. A la vez, surgen leyes como la Ley de IA de la Unión Europea para regular su uso.',
    etiqueta: 'Presente'
  }
];
