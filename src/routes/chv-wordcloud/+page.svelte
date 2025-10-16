<script lang="ts">
	import CSSWordCloud from '$lib/CSSWordCloud.svelte';
	import type { WordCloudResponse } from '$lib/types';
	import { candidatos2025 } from '$lib/candidatos-2025';

	let wordcloudData: WordCloudResponse | null = null;
	let selectedCandidato: string | null = null;
	let loading = true;
	let error = '';

	// Función para ajustar brillo de colores
	function adjustBrightness(hex: string, percent: number): string {
		const num = parseInt(hex.replace('#', ''), 16);
		const amt = Math.round(2.55 * percent);
		const R = (num >> 16) + amt;
		const G = (num >> 8 & 0x00FF) + amt;
		const B = (num & 0x0000FF) + amt;
		return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
			(G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
			(B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
	}

	// Cargar datos
	async function loadWordCloudData() {
		try {
			const response = await fetch('/chv-wordcloud-2025-09-10.json');
			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}
			wordcloudData = await response.json();
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar datos';
			loading = false;
		}
	}

	// Función para seleccionar candidato
	function selectCandidato(candidatoId: string | null) {
		selectedCandidato = candidatoId;
	}

	// Candidatos disponibles para el debate CHV
	const candidatosDisponibles = candidatos2025.filter(c => 
		['harold-mayne-nicholls', 'eduardo-artes', 'evelyn-matthei', 
		 'franco-parisi', 'jeannette-jara', 'johannes-kaiser', 
		 'jose-antonio-kast', 'marco-enriquez-ominami'].includes(c.id)
	);

	// Cargar datos al montar el componente
	loadWordCloudData();
</script>

<svelte:head>
	<title>Nube de Palabras - Debate Chilevisión 2025 | Las Preguntas del Debate</title>
	<meta name="description" content="Análisis visual de conceptos predominantes en el debate presidencial de Chilevisión 2025">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<!-- Header -->
	<header class="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
			<div class="text-center">
				<h1 class="text-3xl md:text-5xl font-bold mb-4">
					Nube de Palabras
				</h1>
				<h2 class="text-xl md:text-2xl font-medium mb-6 opacity-90">
					Debate Presidencial Chilevisión 2025
				</h2>
				<p class="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
					Análisis visual de los conceptos más utilizados por cada candidato presidencial
				</p>
			</div>
		</div>
	</header>

	<!-- Contenido principal -->
	<main class="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6">
		{#if loading}
			<div class="flex justify-center items-center py-20">
				<div class="text-center">
					<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
					<p class="text-gray-600 text-lg">Cargando análisis...</p>
				</div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
				<div class="text-red-600 mb-4">
					<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-red-800 mb-2">Error al cargar datos</h3>
				<p class="text-red-700">{error}</p>
			</div>
		{:else if wordcloudData}
			<!-- Selector de candidatos -->
			<div class="flex flex-wrap gap-2 md:gap-4 justify-center px-4 mb-8">
				<!-- Botón General -->
				<button
					on:click={() => selectCandidato(null)}
					class="px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
						{selectedCandidato === null 
							? 'text-white shadow-lg' 
							: 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'}"
					style:background={selectedCandidato === null ? 'linear-gradient(135deg, #dc2626, #991b1b)' : undefined}
					style:box-shadow={selectedCandidato === null ? '0 10px 25px -5px rgba(220, 38, 38, 0.25)' : undefined}
				>
					<span class="flex items-center gap-1 md:gap-3">
						<svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						<span class="hidden sm:inline">Vista General</span>
						<span class="sm:hidden">General</span>
					</span>
				</button>

				<!-- Botones de candidatos -->
				{#each candidatosDisponibles as candidato}
					<button
						on:click={() => selectCandidato(candidato.id)}
						class="px-2 md:px-4 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
							{selectedCandidato === candidato.id 
								? 'text-white shadow-lg' 
								: 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'}"
						style:background={selectedCandidato === candidato.id ? `linear-gradient(135deg, ${candidato.color}, ${adjustBrightness(candidato.color, -20)})` : undefined}
						style:box-shadow={selectedCandidato === candidato.id ? `0 10px 25px -5px ${candidato.color}40` : undefined}
					>
						<span class="flex items-center gap-1 md:gap-3">
							<img 
								src="/blog/candidatos/{candidato.nombre.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}.webp"
								alt="{candidato.nombre}"
								class="w-4 h-4 md:w-6 md:h-6 rounded-full object-cover border border-white shadow-sm"
							/>
							<span class="hidden sm:inline">{candidato.nombre}</span>
							<span class="sm:hidden">{candidato.nombre.split(' ')[0]}</span>
						</span>
					</button>
				{/each}
			</div>

			<!-- Indicador flotante del candidato seleccionado -->
			{#if selectedCandidato}
				{@const candidatoSeleccionado = candidatosDisponibles.find(c => c.id === selectedCandidato)}
				{#if candidatoSeleccionado}
					<div class="relative px-4 md:px-0">
						<div class="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
							<div 
								class="px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white shadow-lg flex items-center gap-2"
								style="background: linear-gradient(135deg, {candidatoSeleccionado.color}, {adjustBrightness(candidatoSeleccionado.color, -20)})"
							>
								<img 
									src="/blog/candidatos/{candidatoSeleccionado.nombre.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}.webp"
									alt="{candidatoSeleccionado.nombre}"
									class="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover border border-white shadow-sm"
								/>
								<span class="hidden sm:inline">Análisis de {candidatoSeleccionado.nombre}</span>
								<span class="sm:hidden">{candidatoSeleccionado.nombre.split(' ')[0]}</span>
							</div>
						</div>
					</div>
				{/if}
			{/if}

			<!-- Contenedor de la nube de palabras -->
			<div class="relative px-4 md:px-0">
				<div class="rounded-xl md:rounded-2xl p-4 md:p-8 bg-white shadow-xl border border-gray-100">
					<CSSWordCloud 
						data={wordcloudData} 
						candidatoId={selectedCandidato}
					/>
				</div>
			</div>

			<!-- Conceptos detallados por candidato -->
			{#if selectedCandidato && wordcloudData.candidatos[selectedCandidato]}
				{@const candidatoSeleccionado = candidatosDisponibles.find(c => c.id === selectedCandidato)}
				{@const conceptosCandidato = wordcloudData.candidatos[selectedCandidato]}
				<div class="mt-6 md:mt-8 mx-4 md:mx-0">
					<div class="rounded-xl md:rounded-2xl p-4 md:p-8 bg-white shadow-xl border border-gray-100">
						<div class="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
							<img 
								src="/blog/candidatos/{candidatoSeleccionado.nombre.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}.webp"
								alt="{candidatoSeleccionado.nombre}"
								class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 shadow-lg"
							/>
							<div>
								<h3 class="text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2">
									<svg class="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
									</svg>
									<span class="hidden sm:inline">Conceptos detallados de {candidatoSeleccionado.nombre}</span>
									<span class="sm:hidden">Conceptos de {candidatoSeleccionado.nombre.split(' ')[0]}</span>
								</h3>
								<p class="text-sm md:text-base text-gray-600 mt-1">
									Los conceptos más utilizados en sus intervenciones
								</p>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
							{#each conceptosCandidato.words as concepto, index}
								<div class="rounded-lg md:rounded-xl p-3 md:p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
									<div class="flex items-center justify-between mb-2">
										<span class="text-sm md:text-lg font-semibold text-gray-900">
											{concepto.text}
										</span>
										<div 
											class="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-sm"
											style="background-color: {concepto.color}"
										></div>
									</div>
									<div class="flex items-center justify-between text-xs md:text-sm text-gray-600">
										<span>Peso: {concepto.weight}</span>
										<div class="flex-1 mx-2">
											<div class="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
												<div 
													class="rounded-full h-1.5 md:h-2 transition-all duration-500"
													style="width: {(concepto.weight / 100) * 100}%; background-color: {concepto.color}"
												></div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<!-- Estadísticas del análisis -->
			<div class="mt-8 md:mt-12 mx-4 md:mx-0">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
					<!-- Estadísticas principales -->
					<div class="rounded-xl md:rounded-2xl p-4 md:p-8 bg-white shadow-xl border border-gray-100">
						<div class="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
							<div class="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<svg class="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
							<h3 class="text-lg md:text-xl font-bold text-gray-900">Estadísticas del Análisis</h3>
						</div>
						<div class="space-y-3 md:space-y-4">
							<div class="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg">
								<span class="text-gray-600 font-medium text-sm md:text-base">Total de conceptos:</span>
								<span class="font-semibold text-gray-900 text-sm md:text-base">{wordcloudData.metadata.totalWords}</span>
							</div>
							<div class="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg">
								<span class="text-gray-600 font-medium text-sm md:text-base">Candidatos analizados:</span>
								<span class="font-semibold text-gray-900 text-sm md:text-base">{wordcloudData.metadata.candidatosCount}</span>
							</div>
							<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 md:p-3 bg-white rounded-lg border border-gray-100 gap-1 sm:gap-0">
								<span class="text-gray-600 font-medium text-sm md:text-base">Fuente:</span>
								<span class="font-semibold text-gray-900 text-sm md:text-base">{wordcloudData.metadata.source}</span>
							</div>
							<div class="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg">
								<span class="text-gray-600 font-medium text-sm md:text-base">Fecha de análisis:</span>
								<span class="font-semibold text-gray-900 text-sm md:text-base">{wordcloudData.metadata.created}</span>
							</div>
						</div>
					</div>

					<!-- Descripción -->
					<div class="rounded-xl md:rounded-2xl p-4 md:p-8 bg-white shadow-xl border border-gray-100">
						<div class="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
							<div class="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<svg class="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<h3 class="text-lg md:text-xl font-bold text-gray-900">Sobre este Análisis</h3>
						</div>
						<p class="mb-4 md:mb-6 text-sm md:text-base text-gray-700 leading-relaxed">
							{wordcloudData.metadata.description}
						</p>
						<div class="p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl border border-blue-100">
							<div class="flex items-start gap-2 md:gap-3">
								<div class="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
									</svg>
								</div>
								<p class="text-xs md:text-sm text-blue-800">
									<strong>Nota:</strong> Los tamaños de las palabras reflejan la frecuencia de uso de cada concepto en las intervenciones de los candidatos durante el debate.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	/* Estilos adicionales si son necesarios */
</style>
