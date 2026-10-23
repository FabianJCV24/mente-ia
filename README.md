# 🧠 Dentro de la mente de una IA: cómo aprenden las máquinas

> Una página web visual e interactiva que explica la inteligencia artificial para cualquier persona, sin conocimientos técnicos.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?logo=github&logoColor=white)](#)

🔗 **Demo en vivo:** https://fabianjcv24.github.io/mente-ia/

---

## 📖 Descripción

**Dentro de la mente de una IA** es un sitio estático que recorre, paso a paso y de forma visual, qué es la inteligencia artificial y cómo aprende:

| # | Sección | Qué incluye |
|---|---------|-------------|
| 1 | **Inicio** | Título con efecto de máquina de escribir y fondo animado de nodos conectados (`<canvas>`). |
| 2 | **¿Qué es la IA?** | Diagrama interactivo de círculos concéntricos: IA ⊃ Machine Learning ⊃ Deep Learning. |
| 3 | **Cómo aprende una red neuronal** | Animación de una red (entrada, ocultas, salida) con señales hacia adelante y retropropagación. |
| 4 | **Demo interactiva** | Coloca puntos de dos colores y un perceptrón aprende a separarlos en tiempo real. |
| 5 | **La IA en tu día a día** | Tarjetas que se voltean: Netflix, asistentes de voz, spam, autos autónomos, medicina… |
| 6 | **Línea de tiempo** | De Alan Turing (1950) a los modelos de lenguaje actuales, animada al hacer scroll. |
| 7 | **Ética y retos** | Sesgos, privacidad, empleo y desinformación. |
| 8 | **Suscripción** | Un único campo (correo) enviado con Formspree, sin recargar la página. |
| 9 | **Fuentes y créditos** | Referencias académicas y divulgativas. |
| 10 | **Footer** | Autor, enlace al repositorio y año. |

**Extras:** modo claro/oscuro, barra de progreso de lectura, animaciones suaves al hacer scroll, diseño responsive y accesible.

### 🔒 Privacidad

- ❌ Sin cookies, sin analíticas, sin `localStorage`, sin registro ni login.
- ✅ El **único** dato que se solicita es el correo electrónico, en una sección **opcional**.
- ✅ La demo del perceptrón funciona 100 % en el navegador: los puntos no se guardan ni se envían.
- ℹ️ Las tipografías se cargan desde Google Fonts (no usa cookies). Si prefieres no hacer ninguna petición externa, elimina las etiquetas `<link>` de Google Fonts en `index.html`: la página usará las fuentes del sistema.

---

## 📸 Capturas

> Guarda tus capturas en `assets/img/` con estos nombres (o cambia las rutas).

| Escritorio | Celular |
|------------|---------|
| ![Inicio en escritorio](assets/img/captura-inicio.png) | ![Vista en celular](assets/img/captura-movil.png) |
| ![Demo del perceptrón](assets/img/captura-demo.png) | ![Modo claro](assets/img/captura-modo-claro.png) |

---

## 🛠️ Tecnologías usadas

- **HTML5** semántico (`<section>`, `<nav>`, `<figure>`, `<details>`, ARIA).
- **CSS3**: variables (custom properties), Grid, Flexbox, transformaciones 3D, `@media` para responsive, `prefers-color-scheme` y `prefers-reduced-motion`.
- **JavaScript puro (ES2020)**: Canvas 2D, `IntersectionObserver`, `ResizeObserver`, `fetch`. Sin frameworks ni dependencias.
- **[Formspree](https://formspree.io/)** para recibir los correos sin backend.
- **GitHub Pages** para el alojamiento gratuito.

### ♿ Accesibilidad

- Contraste adecuado en ambos temas y foco visible en todos los controles.
- Enlace “Saltar al contenido”, navegación completa con teclado (incluida la demo: flechas + Enter).
- Textos alternativos (`aria-label`, `<title>`/`<desc>` en SVG) para los elementos visuales.
- Respeta la preferencia “reducir movimiento” del sistema.

---

## 📁 Estructura del proyecto

```
mente-ia/
├── index.html          # Estructura y contenido de la página
├── css/
│   └── styles.css      # Estilos, temas y diseño responsive
├── js/
│   ├── data.js         # ✏️ Datos editables: tarjetas y línea de tiempo
│   ├── main.js         # Tema, navegación, animaciones, formulario
│   └── perceptron.js   # Clase Perceptron + demo interactiva
├── assets/
│   └── img/            # Capturas e imágenes
└── README.md
```

### ✏️ Editar el contenido

Las tarjetas y los hitos de la historia están en `js/data.js` como arreglos de objetos. Por ejemplo, para añadir un hito:

```js
{
  anio: '2030',
  titulo: 'Mi nuevo hito',
  descripcion: 'Explicación breve del acontecimiento.',
  etiqueta: 'Futuro'
}
```

---

## 💻 Cómo ejecutarlo localmente

1. Clona o descarga el repositorio:
   ```bash
   git clone https://github.com/FabianJCV24/mente-ia.git
   cd mente-ia
   ```
2. Abre el sitio de una de estas formas:
   - **Directo:** doble clic en `index.html`.
   - **Con un servidor local (recomendado)**, por ejemplo con Python:
     ```bash
     python -m http.server 8000
     ```
     y visita <http://localhost:8000>.
   - **VS Code:** instala la extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.

---

## ✉️ Cómo configurar Formspree

1. Crea una cuenta gratuita en <https://formspree.io/>.
2. Pulsa **New Form**, ponle un nombre (por ejemplo “Suscripción Mente IA”) y el correo donde quieres recibir las suscripciones.
3. Formspree te dará una URL como `https://formspree.io/f/abcdwxyz`. El ID es la última parte: `abcdwxyz`.
4. En `index.html`, busca esta línea y reemplaza `TU_ID` por tu ID:
   ```html
   <form id="form-suscripcion" ... action="https://formspree.io/f/TU_ID" method="POST" novalidate>
   ```
5. Guarda, sube los cambios y prueba el formulario. El primer envío puede pedirte confirmar el formulario desde tu correo.

> Mientras `TU_ID` siga en el código, el formulario mostrará un aviso en lugar de enviar. El campo oculto `_gotcha` es una trampa anti-spam de Formspree y no recoge datos de las personas.

---

## 🚀 Publicar en GitHub Pages

### 1. Crear el repositorio
En GitHub: **New repository** → nombre `mente-ia` → público → **sin** README (ya tienes uno) → **Create repository**.

### 2. Subir el código
Desde la carpeta `mente-ia`:

```bash
git init
git add .
git commit -m "Primera versión: Dentro de la mente de una IA"
git branch -M main
git remote add origin https://github.com/FabianJCV24/mente-ia.git
git push -u origin main
```

### 3. Activar GitHub Pages
1. En el repositorio, ve a **Settings → Pages**.
2. En **Build and deployment → Source**, elige **Deploy from a branch**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)` → **Save**.
4. Espera 1–2 minutos y recarga: verás el enlace `https://fabianjcv24.github.io/mente-ia/`.

### Actualizar la página más adelante
```bash
git add .
git commit -m "Describe aquí tu cambio"
git push
```

---

## 📚 Fuentes

Turing (1950), Rosenblatt (1958), Rumelhart, Hinton y Williams (1986), Vaswani et al. (2017), Russell y Norvig, Goodfellow et al., UNESCO (2021), entre otras. La lista completa con enlaces está en la sección **Fuentes y créditos** de la página.

---

## 👤 Autor

**FabianJCV24** — [@FabianJCV24](https://github.com/FabianJCV24)

## 📄 Licencia

Distribuido bajo la licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente citando al autor.
