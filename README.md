# Las Preguntas del Debate - Chile 2025

Una infografía interactiva que recopila todas las preguntas y respuestas de los candidatos presidenciales en los debates de la elección presidencial de Chile 2025.

![Screenshot](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Sobre el Proyecto

Esta herramienta permite explorar de forma visual e interactiva todas las preguntas realizadas a los candidatos presidenciales en diversos debates durante la campaña 2025, incluyendo:

- **Primer Debate Presidencial CHV** (10 sept 2025)
- **Foro Anual ASIMET** (28 ago 2025)
- **Congreso ICARE** (26 ago 2025)
- **Debate ENATRANS** (7 ago 2025)
- **El Futuro de la Minería UC** (6 ago 2025)
- **Seminarios CLAPES UC** (5 ago 2025)
- **Seminario SOFOFA** (31 jul 2025)
- **Salmón Summit** (22 jul 2025)
- **Primarias Oficialistas TVN** (22 jun 2025)
- **Primarias Oficialistas T13** (15 jun 2025)

### ✨ Características

- **Filtrado por Candidato**: Visualiza solo las respuestas de un candidato específico
- **Filtrado por Tema**: Explora preguntas por categoría (Economía, Seguridad, Salud, etc.)
- **Transcripciones Completas**: Enlaces directos a las transcripciones completas en Parlamento AI
- **Diseño Responsive**: Optimizado para desktop y móvil
- **Navegación Intuitiva**: Interfaz limpia y fácil de usar

### 🎨 Temas Incluidos

- 💰 Economía
- 🛡️ Seguridad
- 🌱 Medio Ambiente
- 🚚 Transporte
- 🌍 Relaciones Exteriores
- ❤️ Salud
- 🎓 Educación
- 💼 Empleo y Trabajo

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- Yarn 1.22+

### Instalación

```bash
# Clonar el repositorio
git clone [tu-repo-url]
cd debate25

# Instalar dependencias
yarn install

# Iniciar servidor de desarrollo
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
yarn dev          # Inicia el servidor de desarrollo
yarn build        # Construye para producción
yarn preview      # Previsualiza el build de producción

# Calidad de código
yarn check        # Verifica tipos con TypeScript
yarn format       # Formatea código con Prettier
yarn lint         # Verifica código con ESLint
```

## 📁 Estructura del Proyecto

```
src/
├── lib/
│   └── candidatos-2025.ts      # Datos de candidatos
├── routes/
│   ├── +layout.svelte          # Layout principal
│   ├── +page.svelte            # Página principal (UI)
│   ├── datos.ts                # Datos de debates y preguntas
│   └── respuestas/             # Respuestas en formato JSON
│       ├── chv-debate-presidencial-2025-09-10-BASE.json
│       ├── asimet-foro-2025-08-28.json
│       └── ... (10 archivos JSON)
└── app.css                     # Estilos globales

static/
└── blog/candidatos/            # Fotos de candidatos
    ├── *.webp                  # Con fondo
    └── sin-fondo/*.webp        # Sin fondo
```

## 🎯 Tecnologías

- **[SvelteKit 2](https://kit.svelte.dev/)** - Framework web moderno
- **[Svelte 5](https://svelte.dev/)** - Framework UI reactivo con runes
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TailwindCSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[unplugin-icons](https://github.com/unplugin/unplugin-icons)** - Iconos on-demand
- **[Solar Icons](https://www.figma.com/community/file/1166831539721848736)** - Set de iconos Duotone

## 📊 Agregar Nuevas Respuestas

Para agregar respuestas de un nuevo debate:

1. **Crear archivo JSON** en `src/routes/respuestas/`:

```json
{
  "debateId": "nombre-debate-2025-MM-DD",
  "respuestas": [
    {
      "preguntaId": "debate-q1",
      "candidatoId": "nombre-apellido",
      "resumen": "Resumen de la respuesta del candidato...",
      "timestamp": 1234
    }
  ]
}
```

2. **Agregar debate** en `src/routes/datos.ts`:

```typescript
export const debates2025: Debate[] = [
  {
    id: 'nombre-debate-2025-MM-DD',
    nombre: 'Nombre del Debate',
    fecha: '2025-MM-DD',
    organizador: 'Organizador',
    duracion: '2h 30m',
    transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/XXXX',
    candidatosIds: ['candidato-1', 'candidato-2']
  }
];
```

3. **Agregar preguntas** en `src/routes/datos.ts`:

```typescript
export const preguntas2025: Pregunta[] = [
  {
    id: 'debate-q1',
    debateId: 'nombre-debate-2025-MM-DD',
    pregunta: '¿Texto de la pregunta?',
    orden: 1,
    temaId: 'economia' // opcional
  }
];
```

4. **Importar respuestas** al inicio de `datos.ts`:

```typescript
import respuestasNuevoDebate from './respuestas/nombre-debate-2025-MM-DD.json';
```

5. **Cargar respuestas** en la función `cargarRespuestas()`:

```typescript
if (respuestasNuevoDebate?.respuestas) {
  todas.push(...respuestasNuevoDebate.respuestas);
}
```

## 🌐 Despliegue

El proyecto está configurado con `@sveltejs/adapter-netlify`. Para desplegar:

### Netlify

```bash
yarn build
```

El output estará en `.svelte-kit/output/` listo para Netlify.

### Otros Adaptadores

Para desplegar en otras plataformas, cambia el adapter en `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-auto'; // o -node, -vercel, etc.
```

## 🤝 Contribuir

Este proyecto fue desarrollado como herramienta interna de **[Parlamento AI](https://parlamento.ai)** para facilitar el análisis de debates presidenciales.

Si encuentras errores o tienes sugerencias:

1. Abre un Issue
2. Envía un Pull Request con tus mejoras
3. Asegúrate de que `yarn check` y `yarn build` pasen sin errores

## 📝 Licencia

[Tu licencia aquí]

## 🙏 Créditos

- **Transcripciones**: [Parlamento AI](https://parlamento.ai) - Plataforma de transcripción y análisis parlamentario
- **Datos**: Recopilados de transmisiones oficiales de debates
- **Iconos**: [Solar Icons](https://www.figma.com/community/file/1166831539721848736) by 480 Design

---

**Desarrollado para la campaña presidencial Chile 2025** 🇨🇱
