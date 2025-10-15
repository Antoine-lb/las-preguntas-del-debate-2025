# Las Preguntas del Debate - Chile 2025

[![Netlify Status](https://api.netlify.com/api/v1/badges/ec422c90-353a-402a-86d8-781a765a606e/deploy-status)](https://app.netlify.com/sites/las-preguntas-del-debate-2025/deploys)

Una infografía interactiva que recopila todas las preguntas y respuestas de los candidatos presidenciales en los debates de la elección presidencial de Chile 2025.

## Sobre el Proyecto

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

## Tecnologías

- **[SvelteKit 2](https://kit.svelte.dev/)** - Framework web moderno
- **[Svelte 5](https://svelte.dev/)** - Framework UI reactivo con runes
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TailwindCSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[unplugin-icons](https://github.com/unplugin/unplugin-icons)** - Iconos on-demand
- **[Solar Icons](https://www.figma.com/community/file/1166831539721848736)** - Set de iconos Duotone

## Agregar Nuevas Respuestas

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
