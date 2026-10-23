/* ==========================================================================
   main.js — Lógica general de la página
   --------------------------------------------------------------------------
   Contiene:
     1. Utilidades compartidas (también las usa perceptron.js)
     2. Modo claro / oscuro
     3. Barra de progreso de lectura y cabecera
     4. Menú de navegación
     5. Efecto de máquina de escribir del título
     6. Fondo animado de nodos (hero)
     7. Diagrama de círculos (¿Qué es la IA?)
     8. Animación de la red neuronal
     9. Tarjetas giratorias (desde data.js)
    10. Línea de tiempo (desde data.js)
    11. Animaciones al hacer scroll
    12. Formulario de suscripción (Formspree)

   Privacidad: este archivo no usa cookies, localStorage ni ningún tipo de
   almacenamiento. Nada de lo que hace el usuario se guarda.
   ========================================================================== */

'use strict';

/* ---------- 1. Utilidades compartidas ---------- */

/** Atajo para seleccionar un elemento. */
const $ = (selector, contexto = document) => contexto.querySelector(selector);

/** Atajo para seleccionar varios elementos como arreglo. */
const $$ = (selector, contexto = document) => Array.from(contexto.querySelectorAll(selector));

/** true si la persona pidió al sistema reducir las animaciones. */
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lee los colores actuales del tema desde las variables CSS. */
function leerColores() {
  const estilos = getComputedStyle(document.documentElement);
  const v = (nombre) => estilos.getPropertyValue(nombre).trim();
  return {
    cian: v('--neon-cian'),
    magenta: v('--neon-magenta'),
    violeta: v('--neon-violeta'),
    verde: v('--neon-verde'),
    texto: v('--texto'),
    suave: v('--texto-suave'),
    fondo: v('--superficie-solida'),
    aviso: v('--aviso')
  };
}

/**
 * Ajusta la resolución interna de un canvas a su tamaño en pantalla
 * (y a la densidad de píxeles) para que se vea nítido.
 * Devuelve el ancho y alto en píxeles CSS.
 */
function ajustarCanvas(canvas, ctx) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ancho: width, alto: height };
}

/** Avisa (callback) cuando un elemento entra o sale de la pantalla. */
function observarVisibilidad(elemento, callback) {
  if (!('IntersectionObserver' in window)) {
    callback(true);
    return;
  }
  new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => callback(entrada.isIntersecting));
  }).observe(elemento);
}

/** Ejecuta una función cuando cambia el tamaño de un elemento. */
function alRedimensionar(elemento, callback) {
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => callback()).observe(elemento);
  } else {
    window.addEventListener('resize', callback);
  }
}

/** Escapa texto para insertarlo de forma segura dentro de HTML. */
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = String(texto);
  return div.innerHTML;
}

/* ---------- 2. Modo claro / oscuro ---------- */
function iniciarTema() {
  const boton = $('#btn-tema');
  const raiz = document.documentElement;
  const consultaClaro = window.matchMedia('(prefers-color-scheme: light)');
  const metaColor = $('meta[name="theme-color"]');

  // Tema efectivo: el elegido con el botón o, si no, el del sistema.
  const temaActual = () => raiz.dataset.theme || (consultaClaro.matches ? 'light' : 'dark');

  function actualizarInterfaz() {
    const oscuro = temaActual() === 'dark';
    boton.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    $('.btn-tema__icono', boton).textContent = oscuro ? '☀️' : '🌙';
    if (metaColor) metaColor.setAttribute('content', oscuro ? '#060a14' : '#f3f6fc');
    // Aviso global para que los canvas vuelvan a leer los colores
    document.dispatchEvent(new CustomEvent('cambiotema'));
  }

  boton.addEventListener('click', () => {
    // La elección dura solo mientras la página está abierta (no se guarda nada).
    raiz.dataset.theme = temaActual() === 'dark' ? 'light' : 'dark';
    actualizarInterfaz();
  });

  // Si cambia el tema del sistema y no se eligió uno manualmente
  consultaClaro.addEventListener('change', () => {
    if (!raiz.dataset.theme) actualizarInterfaz();
  });

  actualizarInterfaz();
}

/* ---------- 3. Barra de progreso de lectura y cabecera ---------- */
function iniciarBarraProgreso() {
  const barra = $('#barra-progreso');
  const cabecera = $('#cabecera');
  let pendiente = false;

  function actualizar() {
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = recorrido > 0 ? window.scrollY / recorrido : 0;
    barra.style.transform = `scaleX(${Math.min(1, Math.max(0, progreso))})`;
    cabecera.classList.toggle('con-scroll', window.scrollY > 10);
    pendiente = false;
  }

  // requestAnimationFrame evita recalcular más de una vez por cuadro
  window.addEventListener('scroll', () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizar);
    }
  }, { passive: true });

  actualizar();
}

/* ---------- 4. Menú de navegación ---------- */
function iniciarNavegacion() {
  const nav = $('#nav');
  const boton = $('#btn-menu');
  const enlaces = $$('.nav__lista a');

  function abrirMenu(abrir) {
    nav.classList.toggle('nav--abierta', abrir);
    boton.setAttribute('aria-expanded', String(abrir));
    $('.sr-only', boton).textContent = abrir ? 'Cerrar menú' : 'Abrir menú';
  }

  boton.addEventListener('click', () => abrirMenu(!nav.classList.contains('nav--abierta')));
  enlaces.forEach((enlace) => enlace.addEventListener('click', () => abrirMenu(false)));

  // Cerrar con la tecla Escape y devolver el foco al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--abierta')) {
      abrirMenu(false);
      boton.focus();
    }
  });

  // Resaltar el enlace de la sección que se está leyendo
  if (!('IntersectionObserver' in window)) return;
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      enlaces.forEach((enlace) => {
        const activo = enlace.getAttribute('href') === `#${entrada.target.id}`;
        enlace.classList.toggle('activo', activo);
        if (activo) enlace.setAttribute('aria-current', 'true');
        else enlace.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  $$('main section[id]').forEach((seccion) => observador.observe(seccion));
}

/* ---------- 5. Efecto de máquina de escribir ---------- */
function iniciarMaquinaEscribir() {
  const destino = $('#texto-escrito');
  if (!destino) return;

  // Cada segmento puede tener su propio estilo (la parte final va en neón)
  const segmentos = [
    { texto: 'Dentro de la mente ', clase: '' },
    { texto: 'de una IA', clase: 'texto-neon' }
  ];

  // Con movimiento reducido se muestra el texto completo de inmediato
  if (reducirMovimiento) {
    destino.innerHTML = segmentos
      .map((s) => (s.clase ? `<span class="${s.clase}">${escaparHTML(s.texto)}</span>` : escaparHTML(s.texto)))
      .join('');
    return;
  }

  let indiceSegmento = 0;
  let indiceLetra = 0;
  let spanActual = null;

  function escribir() {
    if (indiceSegmento >= segmentos.length) return;

    const segmento = segmentos[indiceSegmento];
    if (!spanActual) {
      spanActual = document.createElement('span');
      if (segmento.clase) spanActual.className = segmento.clase;
      destino.appendChild(spanActual);
    }

    spanActual.textContent += segmento.texto[indiceLetra];
    indiceLetra++;

    if (indiceLetra >= segmento.texto.length) {
      indiceSegmento++;
      indiceLetra = 0;
      spanActual = null;
    }

    // Velocidad ligeramente aleatoria para que parezca escrito a mano
    setTimeout(escribir, 55 + Math.random() * 75);
  }

  setTimeout(escribir, 500);
}

/* ---------- 6. Fondo animado de nodos (hero) ---------- */
function iniciarFondoHero() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let dims = { ancho: 0, alto: 0 };
  let nodos = [];
  let colores = leerColores();
  let visible = true;
  const raton = { x: null, y: null };
  const DISTANCIA_CONEXION = 130;

  function crearNodos() {
    dims = ajustarCanvas(canvas, ctx);
    // Menos nodos en pantallas pequeñas para cuidar el rendimiento
    const cantidad = Math.min(110, Math.floor((dims.ancho * dims.alto) / 11000));
    nodos = Array.from({ length: cantidad }, () => ({
      x: Math.random() * dims.ancho,
      y: Math.random() * dims.alto,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1.2 + Math.random() * 2
    }));
  }

  function mover() {
    for (const n of nodos) {
      n.x += n.vx;
      n.y += n.vy;
      // Rebotar en los bordes
      if (n.x < 0 || n.x > dims.ancho) n.vx *= -1;
      if (n.y < 0 || n.y > dims.alto) n.vy *= -1;
    }
  }

  function dibujar() {
    ctx.clearRect(0, 0, dims.ancho, dims.alto);

    // Conexiones entre nodos cercanos: más cerca = más visibles
    ctx.lineWidth = 1;
    ctx.strokeStyle = colores.cian;
    for (let i = 0; i < nodos.length; i++) {
      for (let j = i + 1; j < nodos.length; j++) {
        const dx = nodos[i].x - nodos[j].x;
        const dy = nodos[i].y - nodos[j].y;
        const distancia = Math.hypot(dx, dy);
        if (distancia < DISTANCIA_CONEXION) {
          ctx.globalAlpha = (1 - distancia / DISTANCIA_CONEXION) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodos[i].x, nodos[i].y);
          ctx.lineTo(nodos[j].x, nodos[j].y);
          ctx.stroke();
        }
      }
    }

    // Conexiones con el puntero (en magenta)
    if (raton.x !== null) {
      ctx.strokeStyle = colores.magenta;
      for (const n of nodos) {
        const distancia = Math.hypot(n.x - raton.x, n.y - raton.y);
        if (distancia < DISTANCIA_CONEXION * 1.4) {
          ctx.globalAlpha = (1 - distancia / (DISTANCIA_CONEXION * 1.4)) * 0.7;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(raton.x, raton.y);
          ctx.stroke();
        }
      }
    }

    // Nodos
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = colores.cian;
    for (const n of nodos) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function bucle() {
    if (visible && !document.hidden) {
      mover();
      dibujar();
    }
    requestAnimationFrame(bucle);
  }

  // El puntero se escucha en la sección para no bloquear el contenido
  const hero = $('#inicio');
  hero.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    raton.x = e.clientX - rect.left;
    raton.y = e.clientY - rect.top;
  });
  hero.addEventListener('pointerleave', () => {
    raton.x = null;
    raton.y = null;
  });

  document.addEventListener('cambiotema', () => {
    colores = leerColores();
    dibujar();
  });

  alRedimensionar(canvas, () => {
    crearNodos();
    dibujar();
  });
  observarVisibilidad(canvas, (v) => (visible = v));

  crearNodos();
  dibujar();
  // Con movimiento reducido el fondo queda como imagen estática
  if (!reducirMovimiento) requestAnimationFrame(bucle);
}

/* ---------- 7. Diagrama de círculos ---------- */
function iniciarCirculos() {
  const botones = $$('[data-capa-boton]');
  const capasSvg = $$('.capa');
  const articulos = $$('[data-capa-info]');

  function seleccionar(id) {
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.capaBoton === id)));
    capasSvg.forEach((g) => g.classList.toggle('activa', g.dataset.capa === id));
    articulos.forEach((a) => (a.hidden = a.dataset.capaInfo !== id));
  }

  botones.forEach((b) => b.addEventListener('click', () => seleccionar(b.dataset.capaBoton)));
  // Los círculos también responden al clic (los botones cubren el teclado)
  capasSvg.forEach((g) => g.addEventListener('click', () => seleccionar(g.dataset.capa)));

  seleccionar('ia');
}

/* ---------- 8. Animación de la red neuronal ---------- */
function iniciarRedNeuronal() {
  const canvas = $('#red-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const boton = $('#btn-red-pausa');
  const etiquetaFase = $('#fase-red');

  const CAPAS = [3, 5, 5, 2];                      // Neuronas por capa
  const NOMBRES_CAPAS = ['Entrada', 'Oculta 1', 'Oculta 2', 'Salida'];
  const NOMBRES_SALIDA = ['Gato', 'Perro'];
  const DURACION_FASE = { adelante: 5, atras: 2.6 }; // Segundos
  const MAX_PULSOS = 140;

  // pesos[c][i][j] = conexión entre la neurona i de la capa c y la j de la capa c+1
  const pesos = CAPAS.slice(0, -1).map((n, c) =>
    Array.from({ length: n }, () => Array.from({ length: CAPAS[c + 1] }, () => Math.random() * 2 - 1))
  );

  let neuronas = [];   // neuronas[c][i] = { x, y, act }
  let pulsos = [];     // Señales viajando por las conexiones
  let dims = { ancho: 0, alto: 0 };
  let colores = leerColores();
  let fase = 'adelante';
  let tiempoFase = 0;
  let tiempoEmision = 0;
  let enPausa = reducirMovimiento;
  let visible = false;
  let ultimoTiempo = 0;

  const azar = (n) => Math.floor(Math.random() * n);
  const radioNeurona = () => Math.max(8, Math.min(16, dims.alto / 28));

  /** Calcula la posición de cada neurona según el tamaño del canvas. */
  function posicionar() {
    dims = ajustarCanvas(canvas, ctx);
    const margenIzq = Math.max(40, dims.ancho * 0.09);
    const margenDer = margenIzq + 48; // Espacio para las etiquetas de salida
    const margenSup = 24;
    const margenInf = 40;             // Espacio para los nombres de las capas
    const anchoUtil = dims.ancho - margenIzq - margenDer;
    const altoUtil = dims.alto - margenSup - margenInf;

    neuronas = CAPAS.map((cantidad, c) =>
      Array.from({ length: cantidad }, (_, i) => ({
        x: margenIzq + (anchoUtil * c) / (CAPAS.length - 1),
        y: margenSup + (altoUtil * (i + 1)) / (cantidad + 1),
        act: neuronas[c]?.[i]?.act || 0
      }))
    );
  }

  /** Lanza señales desde la neurona (c, i) hacia la capa siguiente (dir 1) o anterior (dir -1). */
  function emitir(c, i, dir) {
    const destino = c + dir;
    if (destino < 0 || destino >= CAPAS.length) return;
    for (let j = 0; j < CAPAS[destino]; j++) {
      if (pulsos.length >= MAX_PULSOS) return;
      if (Math.random() < 0.55) pulsos.push({ c, i, cd: destino, j, t: 0, dir });
    }
  }

  /** Devuelve la ubicación [capa, i, j] del peso que recorre un pulso. */
  function indicePeso(p) {
    return p.dir === 1 ? [p.c, p.i, p.j] : [p.cd, p.j, p.i];
  }

  function actualizarEtiqueta() {
    if (enPausa) {
      etiquetaFase.textContent = reducirMovimiento && ultimoTiempo === 0
        ? 'Animación en pausa (tienes activado “reducir movimiento”).'
        : 'Animación en pausa.';
      return;
    }
    etiquetaFase.textContent = fase === 'adelante'
      ? 'Fase actual: ➜ propagación hacia adelante (la red predice)'
      : 'Fase actual: ⟲ retropropagación (la red corrige sus pesos)';
  }

  function actualizar(dt) {
    // Alternar entre "predecir" y "corregir"
    tiempoFase += dt;
    if (tiempoFase > DURACION_FASE[fase]) {
      fase = fase === 'adelante' ? 'atras' : 'adelante';
      tiempoFase = 0;
      actualizarEtiqueta();
    }

    // Emitir nuevas señales cada cierto tiempo
    tiempoEmision += dt;
    if (tiempoEmision > 0.45) {
      tiempoEmision = 0;
      if (fase === 'adelante') {
        const i = azar(CAPAS[0]);
        neuronas[0][i].act = 1;
        emitir(0, i, 1);
      } else {
        const c = CAPAS.length - 1;
        const i = azar(CAPAS[c]);
        neuronas[c][i].act = 1;
        emitir(c, i, -1);
      }
    }

    // Mover señales; al llegar, encienden la neurona y pueden continuar
    for (const p of pulsos) {
      if (p.t >= 1) continue;
      p.t += dt * 1.2;
      if (p.t >= 1) {
        neuronas[p.cd][p.j].act = 1;
        if (p.dir === -1) {
          // Al corregir, el peso cambia un poco: ¡eso es aprender!
          const [c, i, j] = indicePeso(p);
          pesos[c][i][j] = Math.max(-1, Math.min(1, pesos[c][i][j] + (Math.random() - 0.5) * 0.3));
        }
        if (Math.random() < 0.5) emitir(p.cd, p.j, p.dir);
      }
    }
    pulsos = pulsos.filter((p) => p.t < 1);

    // Las neuronas se "apagan" poco a poco
    for (const capa of neuronas) {
      for (const n of capa) n.act = Math.max(0, n.act - dt * 1.5);
    }
  }

  function dibujar() {
    ctx.clearRect(0, 0, dims.ancho, dims.alto);
    const r = radioNeurona();

    // Conexiones: el grosor representa la importancia (peso)
    for (let c = 0; c < CAPAS.length - 1; c++) {
      for (let i = 0; i < CAPAS[c]; i++) {
        for (let j = 0; j < CAPAS[c + 1]; j++) {
          const a = neuronas[c][i];
          const b = neuronas[c + 1][j];
          const w = pesos[c][i][j];
          ctx.globalAlpha = 0.15 + Math.abs(w) * 0.3;
          ctx.strokeStyle = w >= 0 ? colores.cian : colores.violeta;
          ctx.lineWidth = 0.5 + Math.abs(w) * 2.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Señales viajando
    ctx.globalAlpha = 1;
    for (const p of pulsos) {
      const a = neuronas[p.c][p.i];
      const b = neuronas[p.cd][p.j];
      const color = p.dir === 1 ? colores.cian : colores.magenta;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Neuronas: se iluminan según su activación
    neuronas.forEach((capa) => {
      capa.forEach((n) => {
        const color = fase === 'atras' ? colores.magenta : colores.cian;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = colores.fondo;
        ctx.fill();
        if (n.act > 0) {
          ctx.globalAlpha = n.act * 0.85;
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 18 * n.act;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = colores.cian;
        ctx.stroke();
      });
    });

    // Etiquetas de las capas y de las salidas
    ctx.fillStyle = colores.suave;
    ctx.font = `${dims.ancho < 480 ? 10 : 12}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    neuronas.forEach((capa, c) => ctx.fillText(NOMBRES_CAPAS[c], capa[0].x, dims.alto - 14));

    ctx.textAlign = 'left';
    ctx.fillStyle = colores.texto;
    neuronas[CAPAS.length - 1].forEach((n, i) => ctx.fillText(NOMBRES_SALIDA[i], n.x + r + 8, n.y + 4));
  }

  function bucle(tiempo) {
    const dt = ultimoTiempo ? Math.min(0.05, (tiempo - ultimoTiempo) / 1000) : 0;
    ultimoTiempo = tiempo;
    if (visible && !enPausa && !document.hidden) {
      actualizar(dt);
      dibujar();
    }
    requestAnimationFrame(bucle);
  }

  boton.addEventListener('click', () => {
    enPausa = !enPausa;
    boton.textContent = enPausa ? '▶ Reanudar' : '⏸ Pausar';
    boton.setAttribute('aria-pressed', String(enPausa));
    actualizarEtiqueta();
  });

  document.addEventListener('cambiotema', () => {
    colores = leerColores();
    dibujar();
  });

  alRedimensionar(canvas, () => {
    posicionar();
    dibujar();
  });
  observarVisibilidad(canvas, (v) => (visible = v));

  if (enPausa) {
    boton.textContent = '▶ Reanudar';
    boton.setAttribute('aria-pressed', 'true');
  }
  posicionar();
  dibujar();
  actualizarEtiqueta();
  requestAnimationFrame(bucle);
}

/* ---------- 9. Tarjetas giratorias ---------- */
function renderizarTarjetas() {
  const contenedor = $('#tarjetas');
  if (!contenedor || typeof TARJETAS_IA === 'undefined') return;

  contenedor.innerHTML = TARJETAS_IA.map((t) => `
    <li class="reveal">
      <button class="tarjeta" type="button" aria-pressed="false">
        <span class="tarjeta__interior">
          <span class="tarjeta__cara tarjeta__cara--frente">
            <span class="tarjeta__icono" aria-hidden="true">${escaparHTML(t.icono)}</span>
            <span class="tarjeta__titulo">${escaparHTML(t.titulo)}</span>
            <span class="tarjeta__resumen">${escaparHTML(t.pregunta)}</span>
            <span class="tarjeta__pista">Toca para descubrir <span aria-hidden="true">↻</span></span>
          </span>
          <span class="tarjeta__cara tarjeta__cara--reverso" aria-hidden="true">
            <span class="tarjeta__titulo">¿Cómo lo hace?</span>
            <span class="tarjeta__texto">${escaparHTML(t.explicacion)}</span>
            <span class="tarjeta__etiqueta">${escaparHTML(t.tecnica)}</span>
          </span>
        </span>
      </button>
    </li>`).join('');

  // Girar la tarjeta con clic, Enter o Espacio (comportamiento nativo del botón)
  $$('.tarjeta', contenedor).forEach((tarjeta) => {
    tarjeta.addEventListener('click', () => {
      const girada = tarjeta.getAttribute('aria-pressed') === 'true';
      tarjeta.setAttribute('aria-pressed', String(!girada));
      // Solo la cara visible se anuncia en lectores de pantalla
      $('.tarjeta__cara--frente', tarjeta).setAttribute('aria-hidden', String(!girada));
      $('.tarjeta__cara--reverso', tarjeta).setAttribute('aria-hidden', String(girada));
    });
  });
}

/* ---------- 10. Línea de tiempo ---------- */
function renderizarLineaTiempo() {
  const contenedor = $('#linea-tiempo');
  if (!contenedor || typeof LINEA_TIEMPO === 'undefined') return;

  contenedor.innerHTML = LINEA_TIEMPO.map((hito) => `
    <li class="linea-tiempo__item reveal">
      <article class="linea-tiempo__tarjeta">
        <span class="linea-tiempo__anio">${escaparHTML(hito.anio)}</span>
        <h3>${escaparHTML(hito.titulo)}</h3>
        <p>${escaparHTML(hito.descripcion)}</p>
        <span class="linea-tiempo__etiqueta">${escaparHTML(hito.etiqueta)}</span>
      </article>
    </li>`).join('');
}

/* ---------- 11. Animaciones al hacer scroll ---------- */
function iniciarAnimacionesScroll() {
  const elementos = $$('.reveal');

  // Sin soporte o con movimiento reducido: mostrar todo directamente
  if (!('IntersectionObserver' in window) || reducirMovimiento) {
    elementos.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        obs.unobserve(entrada.target); // Solo se anima una vez
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach((el) => observador.observe(el));
}

/* ---------- 12. Formulario de suscripción ---------- */
function iniciarSuscripcion() {
  const form = $('#form-suscripcion');
  if (!form) return;
  const input = $('#email');
  const error = $('#email-error');
  const boton = $('#btn-suscribir');
  const gracias = $('#suscripcion-gracias');

  // Formato básico: algo@algo.dominio (sin espacios)
  const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function mostrarError(mensaje) {
    error.textContent = mensaje;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  function limpiarError() {
    error.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  // Quitar el error en cuanto el correo escrito sea válido
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true' && FORMATO_CORREO.test(input.value.trim())) {
      limpiarError();
    }
  });

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evita recargar la página
    limpiarError();

    const correo = input.value.trim();
    if (!correo) {
      mostrarError('Escribe tu correo electrónico para suscribirte.');
      return;
    }
    if (correo.length > 254 || !FORMATO_CORREO.test(correo)) {
      mostrarError('El formato del correo no es válido. Ejemplo: nombre@dominio.com');
      return;
    }
    if (form.action.includes('TU_ID')) {
      mostrarError('El formulario aún no está configurado: reemplaza TU_ID por tu ID de Formspree en index.html.');
      return;
    }

    input.value = correo;
    boton.disabled = true;
    boton.textContent = 'Enviando…';

    try {
      const respuesta = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (respuesta.ok) {
        form.reset();
        form.hidden = true;
        gracias.hidden = false;
        gracias.focus();
      } else {
        const datos = await respuesta.json().catch(() => ({}));
        const detalle = Array.isArray(datos.errors) ? datos.errors.map((e) => e.message).join(' ') : '';
        mostrarError(detalle || 'No pudimos completar la suscripción. Inténtalo de nuevo más tarde.');
      }
    } catch {
      mostrarError('Parece que no hay conexión. Revisa tu internet e inténtalo de nuevo.');
    } finally {
      boton.disabled = false;
      boton.textContent = 'Suscribirme';
    }
  });
}

/* ---------- Arranque ---------- */
document.documentElement.classList.add('js');

iniciarTema();
iniciarBarraProgreso();
iniciarNavegacion();
iniciarMaquinaEscribir();
iniciarFondoHero();
iniciarCirculos();
iniciarRedNeuronal();
renderizarTarjetas();
renderizarLineaTiempo();
iniciarAnimacionesScroll(); // Después de renderizar, para incluir tarjetas e hitos
iniciarSuscripcion();

$('#anio-actual').textContent = new Date().getFullYear();
