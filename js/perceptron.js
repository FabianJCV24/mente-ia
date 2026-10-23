/* ==========================================================================
   perceptron.js — Demo interactiva: un perceptrón que aprende en vivo
   --------------------------------------------------------------------------
   1. Clase Perceptron: el "cerebro" (dos pesos y un sesgo).
   2. Demo: dibuja el plano, recibe los clics y entrena el perceptrón.

   Depende de utilidades definidas en main.js (leerColores, ajustarCanvas,
   observarVisibilidad, alRedimensionar), por eso se carga después.
   Los puntos viven solo en memoria: no se guardan ni se envían.
   ========================================================================== */

'use strict';

/* ---------- 1. El perceptrón ---------- */
class Perceptron {
  /**
   * @param {number} tasa Tasa de aprendizaje: cuánto se corrige en cada error.
   */
  constructor(tasa = 0.1) {
    this.tasa = tasa;
    this.reiniciar();
  }

  /** Pesos aleatorios: al principio la IA "adivina" al azar. */
  reiniciar() {
    this.w1 = Math.random() * 2 - 1;
    this.w2 = Math.random() * 2 - 1;
    this.b = Math.random() * 2 - 1;
    this.epoca = 0;
  }

  /** Suma ponderada: w1·x + w2·y + b */
  suma(x, y) {
    return this.w1 * x + this.w2 * y + this.b;
  }

  /** Predicción: 1 (grupo cian) o -1 (grupo magenta). */
  predecir(x, y) {
    return this.suma(x, y) >= 0 ? 1 : -1;
  }

  /** Cuántos puntos clasifica mal en este momento. */
  contarErrores(puntos) {
    return puntos.reduce((total, p) => total + (this.predecir(p.x, p.y) !== p.etiqueta ? 1 : 0), 0);
  }

  /**
   * Una época = revisar todos los puntos una vez.
   * Regla del perceptrón: si se equivoca, mueve los pesos hacia la respuesta correcta.
   */
  entrenarEpoca(puntos) {
    // Barajar los puntos ayuda a que aprenda de forma más estable
    const mezclados = [...puntos].sort(() => Math.random() - 0.5);
    for (const p of mezclados) {
      const error = p.etiqueta - this.predecir(p.x, p.y); // 0 si acierta, ±2 si falla
      if (error !== 0) {
        this.w1 += this.tasa * error * p.x;
        this.w2 += this.tasa * error * p.y;
        this.b += this.tasa * error;
      }
    }
    this.epoca++;
  }
}

/* ---------- 2. La demo ---------- */
(function iniciarDemoPerceptron() {
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const el = {
    claseA: document.getElementById('btn-clase-a'),
    claseB: document.getElementById('btn-clase-b'),
    entrenar: document.getElementById('btn-entrenar'),
    ejemplo: document.getElementById('btn-ejemplo'),
    reiniciar: document.getElementById('btn-reiniciar'),
    limpiar: document.getElementById('btn-limpiar'),
    tasa: document.getElementById('rango-tasa'),
    valorTasa: document.getElementById('valor-tasa'),
    epoca: document.getElementById('demo-epoca'),
    puntos: document.getElementById('demo-puntos'),
    errores: document.getElementById('demo-errores'),
    precision: document.getElementById('demo-precision'),
    ecuacion: document.getElementById('demo-ecuacion'),
    estado: document.getElementById('demo-estado')
  };

  const INTERVALO_EPOCA = 220;   // Milisegundos entre épocas (para verlo aprender)
  const EPOCAS_LIMITE = 150;     // Si no converge en este tiempo, probablemente no es separable
  const TAMANO_CELDA = 14;       // Resolución del sombreado de fondo

  const perceptron = new Perceptron(parseFloat(el.tasa.value));
  const estado = {
    puntos: [],                  // { x, y, etiqueta } con x, y entre -1 y 1
    clase: 1,                    // 1 = cian, -1 = magenta
    entrenando: true,
    epocasSinConverger: 0,
    cursor: { x: 0, y: 0, activo: false },
    visible: false,
    ultimoPaso: 0
  };
  let dims = { ancho: 0, alto: 0 };
  let colores = leerColores();

  /* --- Conversión entre coordenadas del plano (-1..1) y píxeles --- */
  const aPixelX = (x) => ((x + 1) / 2) * dims.ancho;
  const aPixelY = (y) => ((1 - y) / 2) * dims.alto;   // El eje Y crece hacia arriba
  const aPlanoX = (px) => (px / dims.ancho) * 2 - 1;
  const aPlanoY = (py) => 1 - (py / dims.alto) * 2;
  const limitar = (v) => Math.max(-1, Math.min(1, v));

  const colorClase = (etiqueta) => (etiqueta === 1 ? colores.cian : colores.magenta);
  const hayDosClases = () =>
    estado.puntos.some((p) => p.etiqueta === 1) && estado.puntos.some((p) => p.etiqueta === -1);

  /* --- Acciones --- */
  function agregarPunto(x, y, etiqueta) {
    estado.puntos.push({ x: limitar(x), y: limitar(y), etiqueta });
    estado.epocasSinConverger = 0;
    actualizarPanel();
  }

  function elegirClase(clase) {
    estado.clase = clase;
    el.claseA.setAttribute('aria-pressed', String(clase === 1));
    el.claseB.setAttribute('aria-pressed', String(clase === -1));
  }

  /** Crea un conjunto de puntos separable por una línea aleatoria. */
  function generarEjemplo() {
    estado.puntos = [];
    const angulo = Math.random() * Math.PI * 2;
    const nx = Math.cos(angulo);
    const ny = Math.sin(angulo);
    const desplazamiento = (Math.random() - 0.5) * 0.6;

    while (estado.puntos.length < 26) {
      const x = Math.random() * 1.8 - 0.9;
      const y = Math.random() * 1.8 - 0.9;
      const distancia = nx * x + ny * y - desplazamiento;
      if (Math.abs(distancia) < 0.12) continue; // Deja un "pasillo" entre grupos
      estado.puntos.push({ x, y, etiqueta: distancia > 0 ? 1 : -1 });
    }
    if (!hayDosClases()) return generarEjemplo();

    perceptron.reiniciar();
    estado.epocasSinConverger = 0;
    actualizarPanel();
  }

  /** Una época de entrenamiento (solo si hay algo que aprender). */
  function paso() {
    if (!hayDosClases()) return;
    if (perceptron.contarErrores(estado.puntos) === 0) return;
    perceptron.entrenarEpoca(estado.puntos);
    estado.epocasSinConverger++;
    actualizarPanel();
  }

  /* --- Panel de estadísticas y mensajes --- */
  function mensajeEstado(errores) {
    if (estado.puntos.length === 0) return 'Coloca puntos de los dos colores para empezar.';
    if (!hayDosClases()) return 'Ahora agrega puntos del otro color: la IA necesita ejemplos de ambos grupos.';
    if (errores === 0) return '¡Lo logró! La línea separa perfectamente los dos grupos. Prueba a poner un punto “difícil”.';
    if (estado.epocasSinConverger > EPOCAS_LIMITE) {
      return 'Mmm… parece que estos puntos no se pueden separar con una sola línea recta. Ese es el límite de un perceptrón: para casos así se usan redes con capas ocultas.';
    }
    if (!estado.entrenando) return 'Aprendizaje en pausa. Pulsa “Reanudar” para continuar.';
    return 'Aprendiendo… cada vez que se equivoca, ajusta un poco la línea.';
  }

  function formatear(n) {
    return n.toFixed(2);
  }

  function actualizarPanel() {
    const total = estado.puntos.length;
    const errores = perceptron.contarErrores(estado.puntos);

    el.epoca.textContent = perceptron.epoca;
    el.puntos.textContent = total;
    el.errores.textContent = total ? errores : 0;
    el.precision.textContent = total ? `${Math.round(((total - errores) / total) * 100)}%` : '—';

    const { w1, w2, b } = perceptron;
    const signo = (v) => (v >= 0 ? '+' : '−');
    el.ecuacion.textContent =
      `${w1 < 0 ? '−' : ''}${formatear(Math.abs(w1))}·x ${signo(w2)} ${formatear(Math.abs(w2))}·y ${signo(b)} ${formatear(Math.abs(b))} = 0`;

    // Solo se cambia el texto si el mensaje es distinto (evita repetir avisos al lector de pantalla)
    const mensaje = mensajeEstado(errores);
    if (el.estado.textContent !== mensaje) el.estado.textContent = mensaje;
  }

  /* --- Dibujo --- */
  function dibujar() {
    const { ancho, alto } = dims;
    ctx.clearRect(0, 0, ancho, alto);

    // 1) Sombreado de fondo: lo que el perceptrón "cree" en cada zona
    ctx.globalAlpha = 0.13;
    for (let px = 0; px < ancho; px += TAMANO_CELDA) {
      for (let py = 0; py < alto; py += TAMANO_CELDA) {
        const clase = perceptron.predecir(aPlanoX(px + TAMANO_CELDA / 2), aPlanoY(py + TAMANO_CELDA / 2));
        ctx.fillStyle = colorClase(clase);
        ctx.fillRect(px, py, TAMANO_CELDA, TAMANO_CELDA);
      }
    }

    // 2) Ejes
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = colores.suave;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ancho / 2, 0);
    ctx.lineTo(ancho / 2, alto);
    ctx.moveTo(0, alto / 2);
    ctx.lineTo(ancho, alto / 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 3) Línea de decisión: w1·x + w2·y + b = 0
    const { w1, w2, b } = perceptron;
    let inicio = null;
    let fin = null;
    if (Math.abs(w2) > 1e-6) {
      const yEn = (x) => -(w1 * x + b) / w2;
      inicio = [-1.5, yEn(-1.5)];
      fin = [1.5, yEn(1.5)];
    } else if (Math.abs(w1) > 1e-6) {
      const x = -b / w1;
      inicio = [x, -1.5];
      fin = [x, 1.5];
    }
    if (inicio) {
      ctx.strokeStyle = colores.texto;
      ctx.lineWidth = 3;
      ctx.shadowColor = colores.cian;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(aPixelX(inicio[0]), aPixelY(inicio[1]));
      ctx.lineTo(aPixelX(fin[0]), aPixelY(fin[1]));
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4) Puntos (los mal clasificados llevan un anillo de aviso)
    for (const p of estado.puntos) {
      const px = aPixelX(p.x);
      const py = aPixelY(p.y);

      if (perceptron.predecir(p.x, p.y) !== p.etiqueta) {
        ctx.strokeStyle = colores.aviso;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = colorClase(p.etiqueta);
      ctx.strokeStyle = colores.fondo;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 5) Cursor para usar la demo con teclado
    if (estado.cursor.activo) {
      const cx = aPixelX(estado.cursor.x);
      const cy = aPixelY(estado.cursor.y);
      ctx.strokeStyle = colorClase(estado.clase);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.moveTo(cx - 16, cy);
      ctx.lineTo(cx + 16, cy);
      ctx.moveTo(cx, cy - 16);
      ctx.lineTo(cx, cy + 16);
      ctx.stroke();
    }

    // 6) Indicación inicial si está vacío
    if (estado.puntos.length === 0) {
      ctx.fillStyle = colores.texto;
      ctx.font = `600 ${ancho < 400 ? 14 : 16}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Haz clic aquí para colocar puntos', ancho / 2, alto / 2 - 14);
      ctx.fillStyle = colores.suave;
      ctx.font = `${ancho < 400 ? 12 : 14}px Inter, sans-serif`;
      ctx.fillText('o pulsa “Generar ejemplo”', ancho / 2, alto / 2 + 12);
    }
  }

  /* --- Bucle principal: entrena cada cierto tiempo y redibuja --- */
  function bucle(tiempo) {
    if (estado.visible && !document.hidden) {
      if (estado.entrenando && tiempo - estado.ultimoPaso > INTERVALO_EPOCA) {
        estado.ultimoPaso = tiempo;
        paso();
      }
      dibujar();
    }
    requestAnimationFrame(bucle);
  }

  /* --- Eventos --- */
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = aPlanoX(e.clientX - rect.left);
    const y = aPlanoY(e.clientY - rect.top);
    // Shift + clic coloca el color contrario
    agregarPunto(x, y, e.shiftKey ? -estado.clase : estado.clase);
    estado.cursor.activo = false;
  });

  // Control con teclado: flechas mueven el cursor, Enter/Espacio colocan
  canvas.addEventListener('keydown', (e) => {
    const salto = e.shiftKey ? 0.2 : 0.05;
    const c = estado.cursor;
    const acciones = {
      ArrowUp: () => (c.y = limitar(c.y + salto)),
      ArrowDown: () => (c.y = limitar(c.y - salto)),
      ArrowLeft: () => (c.x = limitar(c.x - salto)),
      ArrowRight: () => (c.x = limitar(c.x + salto)),
      Enter: () => agregarPunto(c.x, c.y, estado.clase),
      ' ': () => agregarPunto(c.x, c.y, estado.clase),
      1: () => elegirClase(1),
      2: () => elegirClase(-1)
    };
    if (acciones[e.key]) {
      e.preventDefault();
      c.activo = true;
      acciones[e.key]();
    }
  });
  canvas.addEventListener('blur', () => (estado.cursor.activo = false));

  el.claseA.addEventListener('click', () => elegirClase(1));
  el.claseB.addEventListener('click', () => elegirClase(-1));

  el.entrenar.addEventListener('click', () => {
    estado.entrenando = !estado.entrenando;
    el.entrenar.textContent = estado.entrenando ? '⏸ Pausar' : '▶ Reanudar';
    el.entrenar.setAttribute('aria-pressed', String(!estado.entrenando));
    actualizarPanel();
  });

  el.ejemplo.addEventListener('click', generarEjemplo);

  el.reiniciar.addEventListener('click', () => {
    perceptron.reiniciar();
    estado.epocasSinConverger = 0;
    actualizarPanel();
  });

  el.limpiar.addEventListener('click', () => {
    estado.puntos = [];
    perceptron.reiniciar();
    estado.epocasSinConverger = 0;
    actualizarPanel();
  });

  el.tasa.addEventListener('input', () => {
    perceptron.tasa = parseFloat(el.tasa.value);
    el.valorTasa.textContent = perceptron.tasa.toFixed(2);
  });

  document.addEventListener('cambiotema', () => {
    colores = leerColores();
    dibujar();
  });

  alRedimensionar(canvas, () => {
    dims = ajustarCanvas(canvas, ctx);
    dibujar();
  });
  observarVisibilidad(canvas, (v) => (estado.visible = v));

  /* --- Arranque --- */
  dims = ajustarCanvas(canvas, ctx);
  actualizarPanel();
  dibujar();
  requestAnimationFrame(bucle);
})();
