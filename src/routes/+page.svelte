<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { candidatos2025, getCandidatoById } from '$lib/candidatos-2025';
	import {
		debates2025,
		getPreguntasPorDebate,
		getRespuesta,
		getRespuestasPorPregunta,
		formatearTiempo,
		construirUrlTimestamp,
		temas,
		getTemaById,
		type Debate,
		type Pregunta
	} from './datos';

	// Iconos para temas (Solar Duotone)
	import IconoCurrency from '~icons/solar/chart-2-bold-duotone';
	import IconoShield from '~icons/solar/shield-check-bold-duotone';
	import IconoLeaf from '~icons/solar/leaf-bold-duotone';
	import IconoTruck from '~icons/solar/delivery-bold-duotone';
	import IconoGlobe from '~icons/solar/globus-bold-duotone';
	import IconoHeart from '~icons/solar/heart-pulse-bold-duotone';
	import IconoGraduationCap from '~icons/solar/user-speak-bold-duotone';
	import IconoBriefcase from '~icons/solar/case-minimalistic-bold-duotone';
	import IconoGovernment from '~icons/solar/home-2-bold-duotone';

	/**
	 * Mapeo de temas a componentes de iconos
	 */
	const iconosPorTema: Record<string, any> = {
		economia: IconoCurrency,
		seguridad: IconoShield,
		'medio-ambiente': IconoLeaf,
		transporte: IconoTruck,
		'relaciones-exteriores': IconoGlobe,
		salud: IconoHeart,
		educacion: IconoGraduationCap,
		empleo: IconoBriefcase,
		politica: IconoGovernment
	};

	/**
	 * Estado: candidato seleccionado (null = todos)
	 */
	let candidatoSeleccionadoId = $state<string | null>(null);

	/**
	 * Estado: tema seleccionado (null = todos)
	 */
	let temaSeleccionadoId = $state<string | null>(null);

	/**
	 * Estado: mostrar candidatos eliminados en primarias
	 */
	let mostrarEliminados = $state(false);

	/**
	 * Estado: término de búsqueda
	 */
	let terminoBusqueda = $state('');

	/**
	 * Estado: mostrar barra de búsqueda
	 */
	let mostrarBusqueda = $state(false);

	/**
	 * Estado: modo de comparación
	 */
	let modoComparacion = $state(false);

	/**
	 * Estado: candidatos seleccionados para comparación
	 */
	let candidatosComparacion = $state<string[]>([]);

	/**
	 * Estado: loading para simular carga
	 */
	let isLoading = $state(false);

	/**
	 * Estado: filtros avanzados
	 */
	let filtroFecha = $state<string>('');
	let filtroOrganizador = $state<string>('');
	let filtroDuracion = $state<string>('');
	let mostrarFiltrosAvanzados = $state(false);

	/**
	 * Estado: exportación
	 */
	let exportando = $state(false);

	/**
	 * Estado: búsqueda inteligente
	 */
	let sugerenciasBusqueda = $state<string[]>([]);
	let mostrarSugerencias = $state(false);
	let indiceSugerenciaSeleccionada = $state(-1);

	/**
	 * Estado: modo lectura
	 */
	let modoLectura = $state(false);

	/**
	 * Candidato seleccionado derivado
	 */
	const candidatoSeleccionado = $derived(
		candidatoSeleccionadoId ? getCandidatoById(candidatoSeleccionadoId) : null
	);

	/**
	 * Candidatos visibles según filtro de eliminados
	 */
	const candidatosVisibles = $derived(
		mostrarEliminados
			? candidatos2025
			: candidatos2025.filter((c) => !c.eliminadoEnPrimarias)
	);

	/**
	 * Tema seleccionado derivado
	 */
	const temaSeleccionado = $derived(temaSeleccionadoId ? getTemaById(temaSeleccionadoId) : null);

	/**
	 * Maneja el click en un candidato
	 * Limpia el filtro de tema si existe
	 */
	function seleccionarCandidato(id: string) {
		if (candidatoSeleccionadoId === id) {
			candidatoSeleccionadoId = null;
		} else {
			candidatoSeleccionadoId = id;
			temaSeleccionadoId = null; // Limpiar tema
		}
	}

	/**
	 * Maneja el click en un tema
	 * Limpia el filtro de candidato si existe
	 */
	function seleccionarTema(id: string) {
		if (temaSeleccionadoId === id) {
			temaSeleccionadoId = null;
		} else {
			temaSeleccionadoId = id;
			candidatoSeleccionadoId = null; // Limpiar candidato
		}
	}

	/**
	 * Obtiene organizadores únicos para filtros
	 */
	const organizadoresUnicos = $derived(
		Array.from(new Set(debates2025.map(d => d.organizador))).sort()
	);

	/**
	 * Obtiene duraciones únicas para filtros
	 */
	const duracionesUnicas = $derived(
		Array.from(new Set(debates2025.map(d => d.duracion).filter(Boolean))).sort()
	);

	/**
	 * Calcula estadísticas de temas más discutidos
	 */
	const temasMasDiscutidos = $derived.by(() => {
		const conteoTemas: Record<string, number> = {};
		
		debatesFiltrados.forEach(debate => {
			const preguntas = getPreguntasPorDebate(debate.id);
			preguntas.forEach(pregunta => {
				if (pregunta.temaId) {
					conteoTemas[pregunta.temaId] = (conteoTemas[pregunta.temaId] || 0) + 1;
				}
			});
		});

		return Object.entries(conteoTemas)
			.map(([temaId, count]) => ({
				tema: getTemaById(temaId),
				count
			}))
			.filter(item => item.tema)
			.sort((a, b) => b.count - a.count)
			.slice(0, 6); // Top 6 temas
	});

	/**
	 * Genera sugerencias de búsqueda inteligente
	 */
	const generarSugerencias = $derived.by(() => {
		if (terminoBusqueda.length < 2) return [];

		const termino = terminoBusqueda.toLowerCase();
		const sugerencias: string[] = [];

		// Sugerencias de candidatos
		candidatos2025.forEach(candidato => {
			if (candidato.nombre.toLowerCase().includes(termino)) {
				sugerencias.push(candidato.nombre);
			}
		});

		// Sugerencias de temas
		temas2025.forEach(tema => {
			if (tema.nombre.toLowerCase().includes(termino)) {
				sugerencias.push(tema.nombre);
			}
		});

		// Sugerencias de organizadores
		organizadoresUnicos.forEach(organizador => {
			if (organizador.toLowerCase().includes(termino)) {
				sugerencias.push(organizador);
			}
		});

		// Palabras clave comunes
		const palabrasClave = [
			'economía', 'salud', 'educación', 'seguridad', 'medio ambiente',
			'pensiones', 'vivienda', 'transporte', 'corrupción', 'reforma',
			'constitución', 'derechos', 'mujeres', 'jóvenes', 'adultos mayores',
			'regiones', 'desarrollo', 'crecimiento', 'empleo', 'inflación'
		];

		palabrasClave.forEach(palabra => {
			if (palabra.toLowerCase().includes(termino)) {
				sugerencias.push(palabra);
			}
		});

		// Eliminar duplicados y limitar a 8 sugerencias
		return [...new Set(sugerencias)].slice(0, 8);
	});

	/**
	 * Obtiene debates filtrados por criterios avanzados
	 */
	const debatesFiltrados = $derived.by((): Debate[] => {
		let debates = debates2025;

		// Filtrar por candidato si está seleccionado
		if (candidatoSeleccionadoId) {
			debates = debates.filter((d) => d.candidatosIds.includes(candidatoSeleccionadoId!));
		}

		// Filtrar por tema si está seleccionado
		if (temaSeleccionadoId) {
			const preguntasDelTema = getPreguntasPorDebate('').filter(p => p.temaId === temaSeleccionadoId);
			const debatesDelTema = new Set(preguntasDelTema.map(p => p.debateId));
			debates = debates.filter(d => debatesDelTema.has(d.id));
		}

		// Filtros avanzados
		if (filtroFecha) {
			debates = debates.filter(d => d.fecha === filtroFecha);
		}

		if (filtroOrganizador) {
			debates = debates.filter(d => d.organizador === filtroOrganizador);
		}

		if (filtroDuracion) {
			debates = debates.filter(d => d.duracion === filtroDuracion);
		}

		return debates;
	});

	/**
	 * Calcula el total de preguntas visibles según filtros
	 */
	const totalPreguntas = $derived.by(() => {
		return debatesFiltrados.reduce((acc, d) => {
			const preguntas = getPreguntasPorDebate(d.id);
			const filtradas = candidatoSeleccionadoId
				? preguntas.filter((p) => getRespuesta(p.id, candidatoSeleccionadoId!))
				: temaSeleccionadoId
					? preguntas.filter((p) => p.temaId === temaSeleccionadoId)
					: preguntas;
			return acc + filtradas.length;
		}, 0);
	});

	/**
	 * Calcula el total de preguntas sin filtros
	 */
	const totalPreguntasSinFiltros = $derived.by(() => {
		return debatesFiltrados.reduce((acc, d) => {
			const preguntas = getPreguntasPorDebate(d.id);
			return acc + preguntas.length;
		}, 0);
	});

	/**
	 * Calcula el total de respuestas visibles
	 */
	const totalRespuestas = $derived.by(() => {
		return debatesFiltrados.reduce((acc, d) => {
			const preguntas = getPreguntasPorDebate(d.id);
			const filtradas = candidatoSeleccionadoId
				? preguntas.filter((p) => getRespuesta(p.id, candidatoSeleccionadoId!))
				: temaSeleccionadoId
					? preguntas.filter((p) => p.temaId === temaSeleccionadoId)
					: preguntas;
			
			return acc + filtradas.reduce((respAcc, p) => {
				if (candidatoSeleccionadoId) {
					return respAcc + (getRespuesta(p.id, candidatoSeleccionadoId!) ? 1 : 0);
				} else {
					// Contar todas las respuestas para esta pregunta
					return respAcc + Object.values(getRespuesta(p.id, '') || {}).length;
				}
			}, 0);
		}, 0);
	});

	/**
	 * Filtra preguntas por término de búsqueda
	 */
	const preguntasFiltradasPorBusqueda = $derived.by(() => {
		if (!terminoBusqueda.trim()) return [];

		const termino = terminoBusqueda.toLowerCase().trim();
		const resultados: Array<{debate: Debate, pregunta: Pregunta, candidato: any, respuesta: any}> = [];

		debatesFiltrados.forEach(debate => {
			const preguntas = getPreguntasPorDebate(debate.id);
			preguntas.forEach(pregunta => {
				// Buscar en el texto de la pregunta
				if (pregunta.pregunta.toLowerCase().includes(termino)) {
					// Si hay filtro de candidato, solo mostrar su respuesta
					if (candidatoSeleccionadoId) {
						const respuesta = getRespuesta(pregunta.id, candidatoSeleccionadoId);
						if (respuesta) {
							resultados.push({
								debate,
								pregunta,
								candidato: getCandidatoById(candidatoSeleccionadoId),
								respuesta
							});
						}
					} else {
						// Mostrar todas las respuestas a esta pregunta
						debate.candidatosIds.forEach(candidatoId => {
							const respuesta = getRespuesta(pregunta.id, candidatoId);
							if (respuesta && respuesta.resumen.toLowerCase().includes(termino)) {
								resultados.push({
									debate,
									pregunta,
									candidato: getCandidatoById(candidatoId),
									respuesta
								});
							}
						});
					}
				} else {
					// Buscar en las respuestas
					debate.candidatosIds.forEach(candidatoId => {
						const respuesta = getRespuesta(pregunta.id, candidatoId);
						if (respuesta && respuesta.resumen.toLowerCase().includes(termino)) {
							// Aplicar filtros adicionales
							if (candidatoSeleccionadoId && candidatoId !== candidatoSeleccionadoId) return;
							if (temaSeleccionadoId && pregunta.temaId !== temaSeleccionadoId) return;
							
							resultados.push({
								debate,
								pregunta,
								candidato: getCandidatoById(candidatoId),
								respuesta
							});
						}
					});
				}
			});
		});

		return resultados;
	});

	/**
	 * Función para alternar candidato en comparación
	 */
	function alternarCandidatoComparacion(candidatoId: string) {
		if (candidatosComparacion.includes(candidatoId)) {
			candidatosComparacion = candidatosComparacion.filter(id => id !== candidatoId);
		} else if (candidatosComparacion.length < 3) {
			candidatosComparacion = [...candidatosComparacion, candidatoId];
		}
	}

	/**
	 * Función para limpiar comparación
	 */
	function limpiarComparacion() {
		candidatosComparacion = [];
		modoComparacion = false;
	}

	/**
	 * Función para limpiar búsqueda
	 */
	function limpiarBusqueda() {
		terminoBusqueda = '';
		mostrarSugerencias = false;
		indiceSugerenciaSeleccionada = -1;
	}

	/**
	 * Función para manejar sugerencias de búsqueda
	 */
	function manejarSugerencias(event: KeyboardEvent) {
		const sugerencias = generarSugerencias;
		
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			indiceSugerenciaSeleccionada = Math.min(indiceSugerenciaSeleccionada + 1, sugerencias.length - 1);
			mostrarSugerencias = true;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			indiceSugerenciaSeleccionada = Math.max(indiceSugerenciaSeleccionada - 1, -1);
		} else if (event.key === 'Enter' && indiceSugerenciaSeleccionada >= 0) {
			event.preventDefault();
			terminoBusqueda = sugerencias[indiceSugerenciaSeleccionada];
			mostrarSugerencias = false;
			indiceSugerenciaSeleccionada = -1;
		} else if (event.key === 'Escape') {
			mostrarSugerencias = false;
			indiceSugerenciaSeleccionada = -1;
		}
	}

	/**
	 * Función para seleccionar sugerencia
	 */
	function seleccionarSugerencia(sugerencia: string) {
		terminoBusqueda = sugerencia;
		mostrarSugerencias = false;
		indiceSugerenciaSeleccionada = -1;
	}

	/**
	 * Función para compartir respuesta específica
	 */
	function compartirRespuesta(preguntaId: string, candidatoId: string) {
		const url = `${window.location.origin}${window.location.pathname}?pregunta=${preguntaId}&candidato=${candidatoId}`;
		
		if (navigator.share) {
			navigator.share({
				title: 'Respuesta de candidato presidencial',
				text: `Mira esta respuesta de ${getCandidatoById(candidatoId)?.nombre}`,
				url: url
			});
		} else {
			// Fallback: copiar al portapapeles
			navigator.clipboard.writeText(url).then(() => {
				alert('Enlace copiado al portapapeles');
			});
		}
	}

	/**
	 * Función para obtener enlace directo a respuesta
	 */
	function obtenerEnlaceRespuesta(preguntaId: string, candidatoId: string) {
		return `${window.location.origin}${window.location.pathname}?pregunta=${preguntaId}&candidato=${candidatoId}`;
	}

	/**
	 * Función para exportar datos a CSV
	 */
	async function exportarCSV() {
		exportando = true;
		
		try {
			const datos = [];
			
			// Agregar encabezados
			datos.push([
				'Candidato',
				'Debate',
				'Fecha',
				'Organizador',
				'Tema',
				'Pregunta',
				'Respuesta',
				'Timestamp'
			]);

			// Agregar datos de respuestas
			for (const debate of debatesFiltrados) {
				const preguntas = getPreguntasPorDebate(debate.id);
				
				for (const pregunta of preguntas) {
					const respuestas = getRespuestasPorPregunta(pregunta.id);
					const tema = getTemaById(pregunta.temaId);
					
					for (const respuesta of respuestas) {
						const candidato = getCandidatoById(respuesta.candidatoId);
						
						datos.push([
							candidato?.nombre || 'Desconocido',
							debate.nombre,
							debate.fecha,
							debate.organizador,
							tema?.nombre || 'Sin tema',
							pregunta.pregunta,
							respuesta.resumen,
							respuesta.timestamp
						]);
					}
				}
			}

			// Convertir a CSV
			const csvContent = datos.map(row => 
				row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
			).join('\n');

			// Crear y descargar archivo
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', `debates-presidenciales-2025-${new Date().toISOString().split('T')[0]}.csv`);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
		} catch (error) {
			console.error('Error al exportar:', error);
			alert('Error al exportar los datos. Por favor, inténtalo de nuevo.');
		} finally {
			exportando = false;
		}
	}

	/**
	 * Función para exportar resumen a PDF (simulado)
	 */
	async function exportarPDF() {
		exportando = true;
		
		try {
			// Simular generación de PDF
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Crear contenido HTML para PDF
			const contenido = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>Resumen Debates Presidenciales 2025</title>
					<style>
						body { font-family: Arial, sans-serif; margin: 20px; }
						h1 { color: #1f2937; }
						h2 { color: #374151; margin-top: 30px; }
						.stats { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
						.candidate { margin: 20px 0; padding: 15px; border-left: 4px solid #3b82f6; }
					</style>
				</head>
				<body>
					<h1>Presidencial 2025: Las Respuestas que Definirán Chile</h1>
					<div class="stats">
						<p><strong>Total de debates:</strong> ${debatesFiltrados.length}</p>
						<p><strong>Total de preguntas:</strong> ${totalPreguntas}</p>
						<p><strong>Candidatos participantes:</strong> ${candidatos2025.length}</p>
					</div>
					
					<h2>Temas Más Discutidos</h2>
					${temasMasDiscutidos.map(({tema, count}, index) => 
						`<p>${index + 1}. ${tema.nombre}: ${count} preguntas</p>`
					).join('')}
					
					<h2>Resumen por Candidato</h2>
					${candidatos2025.map(candidato => {
						const respuestasCandidato = getRespuestasPorCandidato(candidato.id);
						return `
							<div class="candidate">
								<h3>${candidato.nombre}</h3>
								<p><strong>Partido/Coalición:</strong> ${candidato.coalicion || candidato.partido}</p>
								<p><strong>Total de respuestas:</strong> ${respuestasCandidato.length}</p>
							</div>
						`;
					}).join('')}
				</body>
				</html>
			`;

			// Crear y descargar archivo HTML (que se puede convertir a PDF)
			const blob = new Blob([contenido], { type: 'text/html;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', `resumen-debates-presidenciales-2025-${new Date().toISOString().split('T')[0]}.html`);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
		} catch (error) {
			console.error('Error al exportar PDF:', error);
			alert('Error al exportar el PDF. Por favor, inténtalo de nuevo.');
		} finally {
			exportando = false;
		}
	}

	/**
	 * Preguntas para comparación
	 */
	const preguntasComparacion = $derived.by(() => {
		if (!modoComparacion || candidatosComparacion.length === 0) return [];

		const preguntas: Array<{
			pregunta: Pregunta;
			tema: any;
			respuestas: Array<{candidato: any, respuesta: any}>;
		}> = [];

		debatesFiltrados.forEach(debate => {
			const preguntasDebate = getPreguntasPorDebate(debate.id);
			preguntasDebate.forEach(pregunta => {
				const respuestas = candidatosComparacion.map(candidatoId => {
					const candidato = getCandidatoById(candidatoId);
					const respuesta = getRespuesta(pregunta.id, candidatoId);
					return { candidato, respuesta };
				}).filter(r => r.respuesta); // Solo incluir candidatos que respondieron

				if (respuestas.length > 0) {
					preguntas.push({
						pregunta,
						tema: getTemaById(pregunta.temaId),
						respuestas
					});
				}
			});
		});

		return preguntas;
	});

</script>

<svelte:head>
	<title>Presidencial 2025: las respuestas que definirán Chile | Parlamento AI</title>
	<meta
		name="description"
		content="Presidencial 2025: las respuestas que definirán Chile. Explora de forma interactiva todas las preguntas y respuestas de los candidatos presidenciales. Filtra por candidato y compara propuestas."
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<br />
	<!-- Logos -->
	<!-- <div class="flex items-center justify-center gap-8 mb-8 opacity-70">
		<img src="/press/tironi_logo.svg" alt="Tironi y Asociados" class="h-20" />
		<img src="/logo.png" alt="Parlamento AI" class="h-28" />
	</div> -->

	<!-- Header -->
	<header class="mb-12 text-center">
		<h1 class="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Presidencial 2025: las respuestas que definirán Chile</h1>
		<p class="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
			Infografía interactiva con todas las preguntas y respuestas de los candidatos. Haz clic en un
			candidato para filtrar sus respuestas.
		</p>
		
		<!-- Enlace a nube de palabras - OCULTO EN DESARROLLO -->
		<!-- 
		<div class="mt-6">
			<a 
				href="/enade-wordcloud" 
				class="inline-flex items-center gap-2 px-6 py-3 bg-[#D97757] text-white rounded-full font-medium hover:bg-[#c56a4c] transition-colors shadow-lg hover:shadow-xl"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
				</svg>
				Ver Nube de Palabras del Debate ENADE
			</a>
		</div>
		-->
	</header>

	<!-- Modo Lectura -->
	{#if modoLectura}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 -mx-4 px-4">
			<div class="max-w-4xl mx-auto">
				<!-- Header del modo lectura -->
				<div class="text-center mb-8">
					<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Modo Lectura</h1>
					<p class="text-lg text-gray-600 mb-6">Vista limpia para leer las respuestas de los candidatos</p>
					
					<!-- Filtros del modo lectura -->
					<div class="flex flex-wrap gap-4 justify-center">
						<select
							bind:value={candidatoSeleccionadoId}
							class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						>
							<option value="">Todos los candidatos</option>
							{#each candidatos2025 as candidato}
								<option value={candidato.id}>{candidato.nombre}</option>
							{/each}
						</select>
						
						<select
							bind:value={temaSeleccionadoId}
							class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						>
							<option value="">Todos los temas</option>
							{#each temas2025 as tema}
								<option value={tema.id}>{tema.nombre}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Lista de respuestas en modo lectura -->
				<div class="space-y-6">
					{#each preguntasFiltradas as pregunta}
						<div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
							<!-- Header de la pregunta -->
							<div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
								<div class="flex items-center gap-3 mb-2">
									<div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: {getTemaById(pregunta.temaId)?.color}20">
										<svelte:component this={iconosPorTema[pregunta.temaId]} class="w-5 h-5" style="color: {getTemaById(pregunta.temaId)?.color}" />
									</div>
									<span class="font-semibold text-gray-700">{getTemaById(pregunta.temaId)?.nombre}</span>
								</div>
								<h3 class="text-lg font-bold text-gray-900 leading-relaxed">{pregunta.pregunta}</h3>
							</div>

							<!-- Respuestas -->
							<div class="p-6">
								{#each getRespuestasPorPregunta(pregunta.id) as respuesta}
									<div class="mb-6 last:mb-0">
										<div class="flex items-start gap-4">
											<!-- Avatar del candidato -->
											<div class="flex-shrink-0">
												<div class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
													<img
														src={getCandidatoById(respuesta.candidatoId)?.fotoSinFondo || getCandidatoById(respuesta.candidatoId)?.foto}
														alt={getCandidatoById(respuesta.candidatoId)?.nombre}
														class="w-full h-full object-cover"
													/>
												</div>
											</div>

											<!-- Contenido de la respuesta -->
											<div class="flex-1 min-w-0">
												<div class="flex items-center gap-2 mb-2">
													<h4 class="font-bold text-gray-900">{getCandidatoById(respuesta.candidatoId)?.nombre}</h4>
													<span class="px-2 py-1 text-xs font-semibold rounded-full" style="color: {getCandidatoById(respuesta.candidatoId)?.color}; background: {getCandidatoById(respuesta.candidatoId)?.color}20">
														{getCandidatoById(respuesta.candidatoId)?.coalicion || getCandidatoById(respuesta.candidatoId)?.partido}
													</span>
												</div>
												<p class="text-gray-700 leading-relaxed text-base">{respuesta.resumen}</p>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}

	<!-- Selector de Temas y Candidatos -->
	<section class="mb-12">
		<!-- Temas -->
		<div class="mb-8">
			<div class="text-center mb-6 md:mb-8">
				<h2 class="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-gray-800 leading-tight">
					¿Qué dicen los candidatos sobre estas temáticas?
				</h2>
				<div class="w-16 md:w-24 h-0.5 md:h-1 bg-gray-600 rounded-full mx-auto"></div>
			</div>
			<div class="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 justify-center">
				{#each temas as tema}
					{@const IconoTema = iconosPorTema[tema.id]}
					<button
						onclick={() => seleccionarTema(tema.id)}
						class="group relative flex flex-col items-center p-2 md:p-4 rounded-2xl md:rounded-3xl transition-all duration-300 overflow-hidden active:scale-105 md:hover:scale-110 hover:shadow-2xl {temaSeleccionadoId ===
						tema.id
							? 'shadow-2xl scale-105 md:scale-110'
							: 'hover:shadow-xl'}"
						style="
						{temaSeleccionadoId === tema.id
							? `background: linear-gradient(145deg, ${tema.color}20, ${tema.color}08); box-shadow: 0 20px 40px ${tema.color}25, 0 8px 16px ${tema.color}15, inset 0 1px 0 ${tema.color}30`
							: `background: linear-gradient(145deg, ${tema.color}12, ${tema.color}05); box-shadow: 0 4px 12px ${tema.color}20, inset 0 1px 0 ${tema.color}15`}
					"
						onmouseenter={(e) => {
							if (temaSeleccionadoId !== tema.id) {
								e.currentTarget.style.background = `linear-gradient(145deg, ${tema.color}18, ${tema.color}08)`;
								e.currentTarget.style.boxShadow = `0 12px 24px ${tema.color}30, 0 4px 8px ${tema.color}20, inset 0 1px 0 ${tema.color}25`;
							}
						}}
						onmouseleave={(e) => {
							if (temaSeleccionadoId !== tema.id) {
								e.currentTarget.style.background = `linear-gradient(145deg, ${tema.color}12, ${tema.color}05)`;
								e.currentTarget.style.boxShadow = `0 4px 12px ${tema.color}20, inset 0 1px 0 ${tema.color}15`;
							}
						}}
					>
						<!-- Icono del tema -->
						<div class="relative mb-3 md:mb-4">
							<!-- Círculo exterior con gradiente -->
							<div class="relative w-12 h-12 md:w-20 md:h-20 rounded-full p-1.5 md:p-2 transition-all duration-300 group-hover:scale-110 {temaSeleccionadoId === tema.id ? 'scale-105 md:scale-110' : ''}"
								style={temaSeleccionadoId === tema.id 
									? `background: linear-gradient(135deg, ${tema.color}, ${tema.color}CC); box-shadow: 0 8px 24px ${tema.color}40, 0 0 0 4px ${tema.color}20`
									: `background: linear-gradient(135deg, ${tema.color}60, ${tema.color}40); box-shadow: 0 4px 12px ${tema.color}30`}>
								
								<!-- Icono del tema -->
								<div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
									{#if IconoTema}
										<IconoTema class="w-6 h-6 md:w-10 md:h-10 transition-all duration-300 ease-out group-hover:scale-110" 
											style={temaSeleccionadoId === tema.id ? `color: ${tema.color}` : `color: ${tema.color}CC`} />
									{/if}
								</div>
							</div>
							
							<!-- Indicador de selección -->
							{#if temaSeleccionadoId === tema.id}
								<div class="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce"
									style="background: linear-gradient(135deg, ${tema.color}, ${tema.color}DD); box-shadow: 0 4px 12px ${tema.color}60, 0 0 0 3px white">
									✓
								</div>
							{/if}
							
							<!-- Efecto de pulso en hover -->
							<div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-ping"
								style="background: radial-gradient(circle, ${tema.color}30, transparent 70%)"></div>
						</div>
						
						<!-- Información del tema -->
						<div class="text-center space-y-1 md:space-y-2">
							<h3
								class="font-bold text-xs md:text-sm leading-tight transition-colors duration-300 {temaSeleccionadoId ===
								tema.id
									? ''
									: 'text-gray-900 group-hover:text-gray-800'}"
								style={temaSeleccionadoId === tema.id ? `color: ${tema.color}` : ''}
							>
								{tema.nombre}
							</h3>
						</div>
						
						<!-- Efecto de brillo superior -->
						<div class="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
							style="background: linear-gradient(180deg, ${tema.color}20, transparent)"></div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Gráfico de Temas Más Discutidos -->
		{#if temasMasDiscutidos.length > 0}
			<section class="mb-6 md:mb-8">
				<div class="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold text-gray-900">Temas más discutidos</h3>
							<p class="text-sm text-gray-600">Los temas que más aparecen en los debates</p>
						</div>
					</div>

					<div class="space-y-3">
						{#each temasMasDiscutidos as { tema, count }, index}
							<div class="flex items-center gap-4">
								<!-- Ranking -->
								<div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold {index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-600'}">
									{index + 1}
								</div>

								<!-- Tema -->
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-1">
										<div class="w-6 h-6 rounded-lg flex items-center justify-center" style="background: {tema.color}20">
											<svelte:component this={iconosPorTema[tema.id]} class="w-4 h-4" style="color: {tema.color}" />
										</div>
										<span class="font-semibold text-gray-900 text-sm">{tema.nombre}</span>
									</div>
									
									<!-- Barra de progreso -->
									<div class="w-full bg-gray-200 rounded-full h-2">
										<div 
											class="h-2 rounded-full transition-all duration-1000 ease-out"
											style="background: linear-gradient(90deg, {tema.color}, {tema.color}CC); width: {(count / temasMasDiscutidos[0].count) * 100}%"
										></div>
									</div>
								</div>

								<!-- Contador -->
								<div class="flex-shrink-0 text-right">
									<span class="text-lg font-bold text-gray-900">{count}</span>
									<span class="text-xs text-gray-500 block">preguntas</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- Candidatos -->
		<div>
			<div class="text-center mb-6 md:mb-8">
				<h2 class="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-gray-800 leading-tight">
					Elige a tu candidato
				</h2>
				<div class="w-16 md:w-24 h-0.5 md:h-1 bg-gray-600 rounded-full mx-auto"></div>
			</div>
			<div class="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
				{#each candidatosVisibles as candidato}
					<button
						onclick={() => modoComparacion ? alternarCandidatoComparacion(candidato.id) : seleccionarCandidato(candidato.id)}
						class="group relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 overflow-hidden active:scale-105 hover:scale-105 hover:shadow-2xl aspect-square {modoComparacion 
							? candidatosComparacion.includes(candidato.id) 
								? 'shadow-2xl scale-105 ring-2 ring-purple-500' 
								: 'hover:shadow-xl'
							: candidatoSeleccionadoId === candidato.id
								? 'shadow-2xl scale-105'
								: 'hover:shadow-xl'}"
						style="
						{candidatoSeleccionadoId === candidato.id
							? `background: linear-gradient(145deg, ${candidato.color}20, ${candidato.color}08); box-shadow: 0 20px 40px ${candidato.color}25, 0 8px 16px ${candidato.color}15, inset 0 1px 0 ${candidato.color}30`
							: `background: linear-gradient(145deg, ${candidato.color}12, ${candidato.color}05); box-shadow: 0 4px 12px ${candidato.color}20, inset 0 1px 0 ${candidato.color}15`}
					"
						onmouseenter={(e) => {
							if (candidatoSeleccionadoId !== candidato.id) {
								e.currentTarget.style.background = `linear-gradient(145deg, ${candidato.color}18, ${candidato.color}08)`;
								e.currentTarget.style.boxShadow = `0 12px 24px ${candidato.color}30, 0 4px 8px ${candidato.color}20, inset 0 1px 0 ${candidato.color}25`;
							}
						}}
						onmouseleave={(e) => {
							if (candidatoSeleccionadoId !== candidato.id) {
								e.currentTarget.style.background = `linear-gradient(145deg, ${candidato.color}12, ${candidato.color}05)`;
								e.currentTarget.style.boxShadow = `0 4px 12px ${candidato.color}20, inset 0 1px 0 ${candidato.color}15`;
							}
						}}
					>
						<!-- Avatar del candidato -->
						<div class="relative mb-3">
							<!-- Círculo exterior con gradiente -->
							<div class="relative w-16 h-16 rounded-full p-1 transition-all duration-300 group-hover:scale-110 {candidatoSeleccionadoId === candidato.id ? 'scale-105' : ''}"
								style={candidatoSeleccionadoId === candidato.id 
									? `background: linear-gradient(135deg, ${candidato.color}, ${candidato.color}CC); box-shadow: 0 8px 24px ${candidato.color}40, 0 0 0 4px ${candidato.color}20`
									: `background: linear-gradient(135deg, ${candidato.color}60, ${candidato.color}40); box-shadow: 0 4px 12px ${candidato.color}30`}>
								
								<!-- Imagen del candidato -->
								<div class="w-full h-full rounded-full overflow-hidden bg-white">
									<img
										src={candidato.fotoSinFondo || candidato.foto}
										alt={candidato.nombre}
										class="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-105 {candidato.fotoSinFondo
											? ''
											: 'rounded-full'}"
									/>
								</div>
							</div>
							
							<!-- Indicador de selección -->
							{#if modoComparacion ? candidatosComparacion.includes(candidato.id) : candidatoSeleccionadoId === candidato.id}
								<div class="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce"
									style="background: {modoComparacion ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : `linear-gradient(135deg, ${candidato.color}, ${candidato.color}DD)`}; box-shadow: 0 4px 12px {modoComparacion ? '#8b5cf660' : `${candidato.color}60`}, 0 0 0 3px white">
									{modoComparacion ? candidatosComparacion.indexOf(candidato.id) + 1 : '✓'}
								</div>
							{/if}
							
							<!-- Efecto de pulso en hover -->
							<div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-ping"
								style="background: radial-gradient(circle, ${candidato.color}30, transparent 70%)"></div>
						</div>
						
						<!-- Información del candidato -->
						<div class="text-center space-y-1 flex-1 flex flex-col justify-center">
							<h3
								class="font-bold text-sm leading-tight transition-colors duration-300 {candidatoSeleccionadoId ===
								candidato.id
									? ''
									: 'text-gray-900 group-hover:text-gray-800'}"
								style={candidatoSeleccionadoId === candidato.id ? `color: ${candidato.color}` : ''}
							>
								{candidato.nombre}
							</h3>
							
							<!-- Etiqueta del partido -->
							<div class="px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300 {candidatoSeleccionadoId === candidato.id
								? ''
								: 'group-hover:scale-105'}"
								style={candidatoSeleccionadoId === candidato.id
									? `color: white; background: linear-gradient(135deg, ${candidato.color}, ${candidato.color}CC); box-shadow: 0 2px 8px ${candidato.color}40`
									: `color: ${candidato.color}; background: linear-gradient(135deg, ${candidato.color}20, ${candidato.color}10); box-shadow: 0 1px 4px ${candidato.color}20`}
							>
								{candidato.coalicion || candidato.partido}
							</div>
						</div>
						
						<!-- Efecto de brillo superior -->
						<div class="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
							style="background: linear-gradient(180deg, ${candidato.color}20, transparent)"></div>
					</button>
				{/each}

				<!-- Botón "Otros" para toggle de eliminados -->
				<button
					onclick={() => (mostrarEliminados = !mostrarEliminados)}
					class="group relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 overflow-hidden active:scale-105 hover:scale-105 hover:shadow-2xl aspect-square {mostrarEliminados
						? 'shadow-2xl scale-105'
						: 'hover:shadow-xl'}"
					style={mostrarEliminados
						? 'background: linear-gradient(145deg, #fef3c7, #fde68a); box-shadow: 0 20px 40px #f59e0b25, 0 8px 16px #f59e0b15, inset 0 1px 0 #f59e0b30'
						: 'background: linear-gradient(145deg, #fef3c7, #fde68a); box-shadow: 0 4px 12px #f59e0b20, inset 0 1px 0 #f59e0b15'}
				>
					<!-- Avatar del botón -->
					<div class="relative mb-3">
						<!-- Círculo exterior con gradiente -->
						<div class="relative w-16 h-16 rounded-full p-1 transition-all duration-300 group-hover:scale-110 {mostrarEliminados ? 'scale-105' : ''}"
							style={mostrarEliminados 
								? 'background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 24px #f59e0b40, 0 0 0 4px #f59e0b20'
								: 'background: linear-gradient(135deg, #f59e0b60, #f59e0b40); box-shadow: 0 4px 12px #f59e0b30'}>
							
							<!-- Icono -->
							<div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
								<svg
									class="w-6 h-6 text-yellow-600 transition-transform duration-300 ease-out {mostrarEliminados
										? 'rotate-180'
										: 'group-hover:rotate-90'}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4v16m8-8H4"
									></path>
								</svg>
							</div>
						</div>
						
						<!-- Indicador de selección -->
						{#if mostrarEliminados}
							<div class="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce"
								style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 12px #f59e0b60, 0 0 0 3px white">
								✓
							</div>
						{/if}
						
						<!-- Efecto de pulso en hover -->
						<div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-ping"
							style="background: radial-gradient(circle, #f59e0b30, transparent 70%)"></div>
					</div>
					
					<!-- Información -->
					<div class="text-center space-y-1 flex-1 flex flex-col justify-center">
						<h3
							class="font-bold text-sm leading-tight transition-colors duration-300 {mostrarEliminados
								? 'text-yellow-800'
								: 'text-gray-900 group-hover:text-gray-800'}"
						>
							{mostrarEliminados ? 'Ocultar otros' : 'Otros'}
						</h3>
						
						<!-- Etiqueta -->
						<div class="px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300 {mostrarEliminados
							? ''
							: 'group-hover:scale-105'}"
							style={mostrarEliminados
								? 'color: white; background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 2px 8px #f59e0b40'
								: 'color: #f59e0b; background: linear-gradient(135deg, #f59e0b20, #f59e0b10); box-shadow: 0 1px 4px #f59e0b20'}
						>
							{mostrarEliminados ? 'Eliminados en primarias' : 'Ver más candidatos'}
						</div>
					</div>
					
					<!-- Efecto de brillo superior -->
					<div class="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
						style="background: linear-gradient(180deg, #f59e0b20, transparent)"></div>
				</button>
			</div>
		</div>
	</section>

	<!-- Barra de Búsqueda y Comparación -->
	<section class="mb-6 md:mb-8">
		<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
			<!-- Botones de herramientas -->
			<div class="flex flex-wrap gap-3">
				<!-- Botón para mostrar/ocultar búsqueda -->
				<button
					onclick={() => mostrarBusqueda = !mostrarBusqueda}
					class="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden {mostrarBusqueda
						? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
						: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'}"
				>
					<!-- Icono de búsqueda -->
					<div class="relative">
						<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
						{#if mostrarBusqueda}
							<div class="absolute inset-0 animate-ping opacity-20">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
								</svg>
							</div>
						{/if}
					</div>
					
					<span class="relative z-10">
						{mostrarBusqueda ? 'Ocultar búsqueda' : 'Buscar en respuestas'}
					</span>
					
					<!-- Efecto de brillo -->
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
				</button>

				<!-- Botón para modo de comparación -->
				<button
					onclick={() => modoComparacion = !modoComparacion}
					class="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden {modoComparacion
						? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
						: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10'}"
				>
					<!-- Icono de comparación -->
					<div class="relative">
						<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						{#if modoComparacion}
							<div class="absolute inset-0 animate-ping opacity-20">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
						{/if}
					</div>
					
					<span class="relative z-10">
						{modoComparacion ? 'Salir de comparación' : 'Comparar candidatos'}
					</span>
					
					<!-- Efecto de brillo -->
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
				</button>

				<!-- Botón de modo lectura -->
				<button
					onclick={() => (modoLectura = !modoLectura)}
					class="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden {modoLectura
						? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
						: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10'}"
				>
					<!-- Icono de lectura -->
					<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
					</svg>
					
					<span class="relative z-10">
						{modoLectura ? 'Salir de lectura' : 'Modo lectura'}
					</span>
					
					<!-- Efecto de brillo -->
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
				</button>

				<!-- Botón de exportación -->
				<div class="relative group">
					<button
						onclick={() => {}}
						class="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/10"
					>
						<!-- Icono de descarga -->
						<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						
						<span class="relative z-10">
							Exportar datos
						</span>
						
						<!-- Efecto de brillo -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
					</button>

					<!-- Menú desplegable de exportación -->
					<div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
						<div class="py-2">
							<button
								onclick={exportarCSV}
								disabled={exportando}
								class="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
								</svg>
								<span>Descargar CSV</span>
							</button>
							<button
								onclick={exportarPDF}
								disabled={exportando}
								class="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
								</svg>
								<span>Descargar PDF</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Barra de búsqueda -->
			{#if mostrarBusqueda}
				<div class="w-full md:w-96 relative" in:fly={{ y: -10, duration: 300 }} out:fade={{ duration: 150 }}>
					<div class="relative group">
						<!-- Input con diseño mejorado -->
						<input
							type="text"
							bind:value={terminoBusqueda}
							onkeydown={manejarSugerencias}
							onfocus={() => mostrarSugerencias = generarSugerencias.length > 0}
							onblur={() => setTimeout(() => mostrarSugerencias = false, 200)}
							placeholder="Buscar por palabras clave en preguntas y respuestas..."
							class="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium placeholder-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl focus:shadow-blue-500/10"
						/>
						
						<!-- Icono de búsqueda -->
						<div class="absolute left-4 top-1/2 transform -translate-y-1/2">
							<svg class="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						
						<!-- Botón de limpiar -->
						{#if terminoBusqueda}
							<button
								onclick={() => terminoBusqueda = ''}
								aria-label="Limpiar búsqueda"
								class="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</button>
						{/if}
						
						<!-- Efecto de brillo en focus -->
						<div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

						<!-- Panel de sugerencias -->
						{#if mostrarSugerencias && generarSugerencias.length > 0}
							<div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
								<div class="py-2">
									{#each generarSugerencias as sugerencia, index}
										<button
											onclick={() => seleccionarSugerencia(sugerencia)}
											class="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors duration-200 {index === indiceSugerenciaSeleccionada ? 'bg-blue-50' : ''}"
										>
											<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
											</svg>
											<span>{sugerencia}</span>
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
					
					<!-- Resultados de búsqueda -->
					{#if terminoBusqueda && preguntasFiltradasPorBusqueda.length > 0}
						<div class="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-10 max-h-96 overflow-y-auto backdrop-blur-sm">
							<div class="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
								<p class="text-sm font-semibold text-gray-700 flex items-center gap-2">
									<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
									{preguntasFiltradasPorBusqueda.length} resultado{preguntasFiltradasPorBusqueda.length === 1 ? '' : 's'} para "{terminoBusqueda}"
								</p>
							</div>
							<div class="divide-y divide-gray-100">
								{#each preguntasFiltradasPorBusqueda.slice(0, 10) as resultado}
									<button 
										class="group p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 hover:shadow-sm w-full text-left"
										onclick={() => {
											// Scroll to the question
											const element = document.getElementById(`pregunta-${resultado.pregunta.id}`);
											if (element) {
												element.scrollIntoView({ behavior: 'smooth', block: 'center' });
												element.classList.add('ring-2', 'ring-blue-500');
												setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500'), 3000);
											}
											mostrarBusqueda = false;
										}}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												// Scroll to the question
												const element = document.getElementById(`pregunta-${resultado.pregunta.id}`);
												if (element) {
													element.scrollIntoView({ behavior: 'smooth', block: 'center' });
													element.classList.add('ring-2', 'ring-blue-500');
													setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500'), 3000);
												}
												mostrarBusqueda = false;
											}
										}}
									>
										<div class="flex items-start gap-4">
											<!-- Avatar del candidato con borde mejorado -->
											<div class="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
												<img
													src={resultado.candidato.fotoSinFondo || resultado.candidato.foto}
													alt={resultado.candidato.nombre}
													class="w-full h-full object-cover"
												/>
												<!-- Efecto de brillo en hover -->
												<div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
											</div>
											
											<div class="flex-1 min-w-0">
												<!-- Nombre del candidato con color -->
												<p class="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
													{resultado.candidato.nombre}
												</p>
												
												<!-- Tema con badge -->
												<div class="flex items-center gap-2 mt-1 mb-2">
													<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-200">
														{getTemaById(resultado.pregunta.temaId)?.nombre}
													</span>
												</div>
												
												<!-- Pregunta con highlight del término de búsqueda -->
												<p class="text-sm text-gray-700 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
													{resultado.pregunta.pregunta}
												</p>
											</div>
										</div>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<!-- Filtros Avanzados -->
	<section class="mb-6 md:mb-8">
		<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
			<!-- Botón para mostrar filtros avanzados -->
			<button
				onclick={() => mostrarFiltrosAvanzados = !mostrarFiltrosAvanzados}
				class="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden {mostrarFiltrosAvanzados
					? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25'
					: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/10'}"
			>
				<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
				</svg>
				<span class="relative z-10">
					{mostrarFiltrosAvanzados ? 'Ocultar filtros' : 'Filtros avanzados'}
				</span>
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
			</button>

			<!-- Timeline de debates -->
			<div class="flex items-center gap-2 text-sm text-gray-600">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				</svg>
				<span class="font-medium">{debatesFiltrados.length} debates</span>
			</div>
		</div>

		<!-- Panel de filtros avanzados -->
		{#if mostrarFiltrosAvanzados}
			<div class="mt-4 p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-lg" in:fly={{ y: -10, duration: 300 }} out:fade={{ duration: 150 }}>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Filtro por fecha -->
					<div>
						<label class="block text-sm font-semibold text-gray-700 mb-2">Fecha del debate</label>
						<select
							bind:value={filtroFecha}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
						>
							<option value="">Todas las fechas</option>
							{#each debates2025.map(d => d.fecha).sort() as fecha}
								<option value={fecha}>{new Date(fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</option>
							{/each}
						</select>
					</div>

					<!-- Filtro por organizador -->
					<div>
						<label class="block text-sm font-semibold text-gray-700 mb-2">Organizador</label>
						<select
							bind:value={filtroOrganizador}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
						>
							<option value="">Todos los organizadores</option>
							{#each organizadoresUnicos as organizador}
								<option value={organizador}>{organizador}</option>
							{/each}
						</select>
					</div>

					<!-- Filtro por duración -->
					<div>
						<label class="block text-sm font-semibold text-gray-700 mb-2">Duración</label>
						<select
							bind:value={filtroDuracion}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
						>
							<option value="">Todas las duraciones</option>
							{#each duracionesUnicas as duracion}
								<option value={duracion}>{duracion}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Botón limpiar filtros -->
				<div class="mt-4 flex justify-end">
					<button
						onclick={() => {
							filtroFecha = '';
							filtroOrganizador = '';
							filtroDuracion = '';
						}}
						class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
					>
						Limpiar filtros
					</button>
				</div>
			</div>
		{/if}
	</section>

	<!-- Estadísticas y Filtros Activos -->
	<section class="mb-6 md:mb-8">
		<!-- Estadísticas como badges compactos -->
		<div class="flex flex-wrap items-center gap-2 md:gap-3">
			<!-- Debates -->
			{#key debatesFiltrados.length}
				<div
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-white border border-gray-200 text-xs md:text-sm shadow-sm hover:shadow-md transition-all duration-200"
					in:scale={{ duration: 300, start: 0.8 }}
					out:fade={{ duration: 200 }}
				>
					<svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
						></path>
					</svg>
					<span class="font-semibold text-gray-900">{debatesFiltrados.length}</span>
					<span class="text-gray-500">{debatesFiltrados.length === 1 ? 'debate' : 'debates'}</span>
				</div>
			{/key}

			<!-- Preguntas con progreso -->
			{#key totalPreguntas}
				<div
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-white border border-gray-200 text-xs md:text-sm shadow-sm hover:shadow-md transition-all duration-200"
					in:scale={{ duration: 300, start: 0.8 }}
					out:fade={{ duration: 200 }}
				>
					<svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span class="font-semibold text-gray-900">{totalPreguntas}</span>
					<span class="text-gray-500">
						{#if candidatoSeleccionado || temaSeleccionado}
							de {totalPreguntasSinFiltros} preguntas
						{:else}
							{totalPreguntas === 1 ? 'pregunta' : 'preguntas'}
						{/if}
					</span>
				</div>
			{/key}

			<!-- Respuestas -->
			{#key totalRespuestas}
				<div
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-white border border-gray-200 text-xs md:text-sm shadow-sm hover:shadow-md transition-all duration-200"
					in:scale={{ duration: 300, start: 0.8 }}
					out:fade={{ duration: 200 }}
				>
					<svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						></path>
					</svg>
					<span class="font-semibold text-gray-900">{totalRespuestas}</span>
					<span class="text-gray-500">{totalRespuestas === 1 ? 'respuesta' : 'respuestas'}</span>
				</div>
			{/key}

			<!-- Indicador de búsqueda activa -->
			{#if terminoBusqueda}
				<div
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-blue-50 border border-blue-200 text-xs md:text-sm shadow-sm"
					in:fade={{ duration: 200 }}
				>
					<svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					<span class="font-semibold text-blue-800">
						{preguntasFiltradasPorBusqueda.length} resultado{preguntasFiltradasPorBusqueda.length === 1 ? '' : 's'} para "{terminoBusqueda}"
					</span>
				</div>
			{/if}

			<!-- Indicador de filtros activos -->
			{#if candidatoSeleccionado || temaSeleccionado}
				<div
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-amber-50 border border-amber-200 text-xs md:text-sm shadow-sm"
					in:fade={{ duration: 200 }}
				>
					<svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
						></path>
					</svg>
					<span class="font-semibold text-amber-800">Filtros activos</span>
				</div>
			{/if}

			<!-- Filtro Activo -->
			{#if candidatoSeleccionado || temaSeleccionado}
				{@const colorFiltro = candidatoSeleccionado?.color || temaSeleccionado?.color || '#D97757'}
				<div
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg border text-xs md:text-sm shadow-sm"
					style="background-color: {colorFiltro}18; border-color: {colorFiltro}60"
					in:fly={{ x: -10, duration: 300 }}
					out:fade={{ duration: 150 }}
				>
					<span class="font-semibold" style="color: {colorFiltro}">
						{#if candidatoSeleccionado}
							{candidatoSeleccionado.nombre}
						{:else if temaSeleccionado}
							{temaSeleccionado.nombre}
						{/if}
					</span>
					<button
						onclick={() => {
							candidatoSeleccionadoId = null;
							temaSeleccionadoId = null;
						}}
						class="transition-colors hover:opacity-70"
						style="color: {colorFiltro}"
						aria-label="Limpiar filtro"
					>
						<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Botón Limpiar Todos los Filtros -->
			{#if candidatoSeleccionado || temaSeleccionado}
				<button
					onclick={() => {
						candidatoSeleccionadoId = null;
						temaSeleccionadoId = null;
					}}
					class="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-red-50 border border-red-200 text-xs md:text-sm font-medium text-red-700 hover:bg-red-100 transition-colors shadow-sm"
					in:fly={{ x: -10, duration: 300 }}
					out:fade={{ duration: 150 }}
				>
					<svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
					Limpiar filtros
				</button>
			{/if}
		</div>
	</section>

	<!-- Modo de Comparación -->
	{#if modoComparacion}
		<section class="mb-8">
			<div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6">
				<div class="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
					<div>
						<h3 class="text-lg font-bold text-gray-900 mb-2">Modo de Comparación</h3>
						<p class="text-sm text-gray-600">
							Selecciona hasta 3 candidatos para comparar sus respuestas lado a lado
						</p>
					</div>
					<div class="flex gap-2">
						{#if candidatosComparacion.length > 0}
							<button
								onclick={limpiarComparacion}
								class="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
							>
								Limpiar selección
							</button>
						{/if}
						<button
							onclick={() => modoComparacion = false}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Salir de comparación
						</button>
					</div>
				</div>

				<!-- Candidatos seleccionados -->
				{#if candidatosComparacion.length > 0}
					<div class="flex flex-wrap gap-3 mb-6">
						{#each candidatosComparacion as candidatoId, index}
							{@const candidato = getCandidatoById(candidatoId)}
							<div class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
								<div class="w-6 h-6 rounded-full overflow-hidden">
									<img
										src={candidato.fotoSinFondo || candidato.foto}
										alt={candidato.nombre}
										class="w-full h-full object-cover"
									/>
								</div>
								<span class="text-sm font-medium text-gray-900">{candidato.nombre}</span>
								<button
									onclick={() => alternarCandidatoComparacion(candidatoId)}
									aria-label="Eliminar {candidato.nombre} de la comparación"
									class="w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
								>
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>
						{/each}
					</div>

					<!-- Preguntas de comparación -->
					{#if preguntasComparacion.length > 0}
						<div class="space-y-6">
							{#each preguntasComparacion as item, idx}
								<div class="bg-white rounded-lg border border-gray-200 p-4">
									<!-- Pregunta -->
									<div class="flex gap-3 items-start mb-4">
										{#if item.tema}
											{@const IconoTema = iconosPorTema[item.tema.id]}
											{#if IconoTema}
												<div
													class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
													style="background-color: {item.tema.color}20; color: {item.tema.color};"
												>
													<IconoTema class="w-4 h-4" />
												</div>
											{/if}
										{/if}
										<div class="flex-1">
											<p class="text-gray-900 font-medium text-sm mb-1">
												<span class="text-purple-600 font-semibold mr-2">{idx + 1}.</span>
												{item.pregunta.pregunta}
											</p>
											{#if item.tema}
												<span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
													{item.tema.nombre}
												</span>
											{/if}
										</div>
									</div>

									<!-- Respuestas lado a lado -->
									<div class="grid grid-cols-1 md:grid-cols-{Math.min(candidatosComparacion.length, 3)} gap-4">
										{#each item.respuestas as respuesta}
											<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
												<div class="flex items-center gap-3 mb-3">
													<div class="w-8 h-8 rounded-full overflow-hidden">
														<img
															src={respuesta.candidato.fotoSinFondo || respuesta.candidato.foto}
															alt={respuesta.candidato.nombre}
															class="w-full h-full object-cover"
														/>
													</div>
													<div>
														<p class="font-medium text-gray-900 text-sm">{respuesta.candidato.nombre}</p>
														<p class="text-xs text-gray-500">{respuesta.candidato.coalicion || respuesta.candidato.partido}</p>
													</div>
												</div>
												<p class="text-sm text-gray-700 leading-relaxed">
													{respuesta.respuesta.resumen}
												</p>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-center py-8">
							<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
							</svg>
							<p class="text-gray-500">No hay preguntas comunes para los candidatos seleccionados</p>
						</div>
					{/if}
				{:else}
					<div class="text-center py-8">
						<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						<p class="text-gray-500">Selecciona candidatos para comenzar la comparación</p>
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<section class="space-y-8">
			{#each Array(2) as _, idx}
				<div class="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
					<div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
					<div class="space-y-4">
						{#each Array(3) as _, qIdx}
							<div class="border-t border-gray-100 pt-4">
								<div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
								<div class="ml-8 space-y-2">
									<div class="h-3 bg-gray-200 rounded w-full"></div>
									<div class="h-3 bg-gray-200 rounded w-5/6"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</section>
	{:else}
		<!-- Debates y Preguntas -->
		<section class="space-y-12">
			{#key `${candidatoSeleccionadoId}-${temaSeleccionadoId}-${terminoBusqueda}`}
				{#each debatesFiltrados as debate, idx}
				{@const preguntas = getPreguntasPorDebate(debate.id)}
				{@const preguntasConRespuesta = candidatoSeleccionadoId
					? preguntas.filter((p) => getRespuesta(p.id, candidatoSeleccionadoId))
					: temaSeleccionadoId
						? preguntas.filter((p) => p.temaId === temaSeleccionadoId)
						: preguntas}

				{#if preguntasConRespuesta.length > 0}
					<article
						class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
						in:fly={{ y: 20, duration: 500, delay: idx * 150 }}
						out:fade={{ duration: 300 }}
					>
						<!-- Header del Debate -->
						<header class="p-3 md:p-4 border-b border-gray-200">
							<h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">{debate.nombre}</h3>
							<div class="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 text-xs md:text-sm text-gray-500">
								<span>{debate.organizador}</span>
								<span>•</span>
								<span>
									{new Date(debate.fecha).toLocaleDateString('es-CL', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</span>
								{#if debate.duracion}
									<span>•</span>
									<span>{debate.duracion}</span>
								{/if}
								<span class="ml-auto">
									<a
										href={debate.transcriptUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="text-[#D97757] hover:text-[#c56a4c] font-medium hover:underline"
									>
										Transcripción →
									</a>
								</span>
							</div>
						</header>

						<!-- Preguntas y Respuestas -->
						<div class="divide-y divide-gray-100">
							{#each preguntasConRespuesta as pregunta, idx}
								{@const respuestaMostrar = candidatoSeleccionadoId
									? getRespuesta(pregunta.id, candidatoSeleccionadoId)
									: null}

								<div 
									id="pregunta-{pregunta.id}" 
									class="p-3 md:p-4 hover:bg-gray-50 transition-colors duration-200 group"
									in:fly={{ x: -20, duration: 400, delay: idx * 100 }}
									out:fade={{ duration: 200 }}
								>
									<!-- Pregunta -->
									<div class="flex gap-2 md:gap-2.5 items-start mb-2 md:mb-3">
										<!-- Burbuja de categoría -->
										{#if pregunta.temaId}
											{@const tema = getTemaById(pregunta.temaId)}
											{@const IconoTema = tema ? iconosPorTema[tema.id] : null}
											{#if tema && IconoTema}
												<div
													class="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
													style="background-color: {tema.color}20; color: {tema.color};"
												>
													<IconoTema class="w-3.5 h-3.5 md:w-4 md:h-4" />
												</div>
											{/if}
										{:else}
											<div class="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-100"></div>
										{/if}
										<p class="flex-1 text-gray-900 font-medium text-sm md:text-base leading-snug">
											<span class="text-[#D97757] font-semibold mr-1.5">{idx + 1}.</span>
											{pregunta.pregunta}
										</p>
									</div>

									<!-- Respuestas -->
									<div class="ml-8 md:ml-9 space-y-2">
										{#if candidatoSeleccionado && respuestaMostrar}
											<!-- Vista filtrada: solo el candidato seleccionado -->
											<div 
												class="flex gap-2 items-start p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-sm transition-all duration-300"
												in:scale={{ duration: 300, delay: 200 }}
											>
												<div
													class="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
													style="background-color: {candidatoSeleccionado.color}50"
												>
													<img
														src={candidatoSeleccionado.fotoSinFondo || candidatoSeleccionado.foto}
														alt={candidatoSeleccionado.nombre}
														class="w-full h-full object-contain {candidatoSeleccionado.fotoSinFondo
															? ''
															: 'rounded-full object-cover'}"
													/>
												</div>
												<div class="flex-1 min-w-0">
													<div class="flex items-center justify-between mb-1">
														<p class="font-semibold text-gray-900 text-xs md:text-sm">
															{candidatoSeleccionado.nombre}
														</p>
														<button
															onclick={() => compartirRespuesta(pregunta.id, candidatoSeleccionado.id)}
															class="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
															aria-label="Compartir respuesta"
														>
															<svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
															</svg>
														</button>
													</div>
													<p class="text-gray-700 text-xs md:text-sm leading-relaxed">
														{respuestaMostrar.resumen}
														{#if respuestaMostrar.timestamp}
															<span class="text-[10px] md:text-xs text-gray-400 ml-1">
																{formatearTiempo(respuestaMostrar.timestamp)}
															</span>
														{/if}
													</p>
												</div>
											</div>
										{:else if !candidatoSeleccionado}
											<!-- Vista completa: todas las respuestas -->
											{@const todasRespuestas =
												pregunta.id.split('-').map((_, i) =>
													debate.candidatosIds
														.map((cId) => ({
															candidato: getCandidatoById(cId),
															respuesta: getRespuesta(pregunta.id, cId)
														}))
														.filter((r) => r.respuesta && r.candidato)
												)[0] || []}

											{#if todasRespuestas.length > 0}
												{#each todasRespuestas as { candidato, respuesta }, respIdx}
													{#if candidato && respuesta}
														<div 
															class="flex gap-2 items-start p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
															in:fly={{ y: 10, duration: 400, delay: respIdx * 100 }}
															out:fade={{ duration: 200 }}
														>
															<div
																class="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
																style="background-color: {candidato.color}50"
															>
																<img
																	src={candidato.fotoSinFondo || candidato.foto}
																	alt={candidato.nombre}
																	class="w-full h-full object-contain {candidato.fotoSinFondo
																		? ''
																		: 'rounded-full object-cover'}"
																/>
															</div>
															<div class="flex-1 min-w-0">
																<div class="flex items-center justify-between mb-1">
																	<p class="font-semibold text-gray-900 text-xs md:text-sm">
																		{candidato.nombre}
																	</p>
																	<button
																		onclick={() => compartirRespuesta(pregunta.id, candidato.id)}
																		class="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100"
																		aria-label="Compartir respuesta"
																	>
																		<svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
																		</svg>
																	</button>
																</div>
																<p class="text-gray-700 text-xs md:text-sm leading-relaxed">
																	{respuesta.resumen}
																	{#if respuesta.timestamp}
																		<span class="text-[10px] md:text-xs text-gray-400 ml-1">
																			{formatearTiempo(respuesta.timestamp)}
																		</span>
																	{/if}
																</p>
															</div>
														</div>
													{/if}
												{/each}
											{:else}
												<p class="text-gray-500 italic text-xs md:text-sm">
													No hay respuestas registradas para esta pregunta
												</p>
											{/if}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</article>
				{/if}
			{/each}
		{/key}
		</section>
	{/if}
	{/if}
</div>
