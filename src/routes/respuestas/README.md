# Carpeta de Respuestas

Esta carpeta contiene un archivo JSON por cada debate con todas las respuestas de los candidatos.

## Estructura

Cada archivo debe llamarse: `[debate-id].json`

Ejemplos:

- `chv-debate-presidencial-2025-09-10.json`
- `asimet-foro-2025-08-28.json`
- `clapes-uc-2025-08-05.json`

## Estado de Debates

### ✅ Con respuestas completas

- **CLAPES UC (5 ago)** - `clapes-uc-2025-08-05.json` - 20 respuestas (Jeannette Jara)

### ✅ Con respuestas (parciales)

- Debate CHV (10 sept) - `chv-debate-presidencial-2025-09-10.json`
- Debate ASIMET (28 ago) - `asimet-foro-2025-08-28.json`

### ⏳ Pendientes

- Seminario SOFOFA (31 jul) - 4 preguntas
- ENATRANS Transporte (7 ago) - 3 preguntas
- Minería UC (6 ago) - 14 preguntas
- Congreso ICARE (26 ago) - 12 preguntas
- Salmón Summit (22 jul) - 4 preguntas
- Primarias TVN (22 jun) - 14 preguntas
- Primarias T13 (15 jun) - 8 preguntas

**Referencia de preguntas:**

- Todas las preguntas con IDs están en `../datos.ts` (array `preguntas2025`)

## Cómo Agregar un Debate

1. Lee el archivo `PROMPT.md` en la carpeta padre
2. Usa el prompt con una IA (ChatGPT/Claude)
3. Guarda el JSON aquí con el nombre correcto
4. Actualiza `datos.ts` agregando el import:

```typescript
import respuestasNuevo from './respuestas/[nombre-archivo].json';
```

Y en la función `cargarRespuestas()`:

```typescript
if (respuestasNuevo?.respuestas) {
	todas.push(...respuestasNuevo.respuestas);
}
```

## Formato del JSON

Ver archivos existentes como ejemplo. Estructura:

```json
{
	"debateId": "id-del-debate",
	"respuestas": [
		{
			"preguntaId": "debate-q1",
			"candidatoId": "evelyn-matthei",
			"resumen": "Resumen en 1-2 oraciones.",
			"timestamp": 1234
		}
	]
}
```

**Campos:**

- `debateId`: ID del debate
- `preguntaId`: ID de la pregunta
- `candidatoId`: ID del candidato (de la lista oficial)
- `resumen`: Resumen breve de la respuesta (1-2 oraciones)
- `timestamp`: (recomendado) Segundo exacto en que respondió, número entero. La URL se construye automáticamente.

## 🧪 Modo de Prueba

**Antes de integrar tu JSON, ¡pruébalo!**

1. Ve a `/p/debate-2025` en tu navegador
2. Haz clic en "Probar JSON" (botón al lado del título de debates)
3. Elige tu archivo
4. Verifica que:
   - ✅ No hay errores
   - ✅ Las respuestas aparecen correctamente
   - ✅ Los timestamps se muestran bien

Si hay errores, aparecerán en pantalla y en la consola del navegador (F12).

## Checklist por Archivo

Antes de marcar como completo:

- [ ] **Probado en modo de prueba** (sin errores)
- [ ] JSON válido (sin errores de sintaxis)
- [ ] `debateId` correcto
- [ ] `candidatoId` exactos (de la lista oficial)
- [ ] `preguntaId` correctos
- [ ] Resúmenes breves y claros
- [ ] Timestamps son números (no strings)
- [ ] Import agregado en `datos.ts` (equipo técnico)
- [ ] Verificado en la página
