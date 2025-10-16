<script lang="ts">
	import { onMount } from 'svelte';
	import CSSWordCloud from '$lib/CSSWordCloud.svelte';
	import type { WordCloudResponse } from '$lib/types';
	import { candidatos2025 } from '$lib/candidatos-2025';

	let wordcloudData: WordCloudResponse | null = null;
	let selectedCandidato: string | null = null;
	let loading = true;
	let error = '';

	// Cargar datos de la nube de palabras
	async function loadWordCloudData() {
		try {
			const response = await fetch('/enade-wordcloud-2025-10-14.json');
			if (!response.ok) {
				throw new Error('Error al cargar los datos de la nube de palabras');
			}
			wordcloudData = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error desconocido';
		} finally {
			loading = false;
		}
	}

	// Obtener candidatos disponibles
	$: candidatosDisponibles = wordcloudData 
		? Object.keys(wordcloudData.wordcloudData.candidatos).map(id => ({
			id,
			nombre: candidatos2025.find(c => c.id === id)?.nombre || wordcloudData!.wordcloudData.candidatos[id].nombre,
			color: wordcloudData!.wordcloudData.candidatos[id].color
		}))
		: [];

	onMount(() => {
		loadWordCloudData();
	});

	function selectCandidato(candidatoId: string | null) {
		selectedCandidato = candidatoId;
	}

	// Función auxiliar para ajustar brillo de color
	function adjustBrightness(color: string, amount: number): string {
		const hex = color.replace('#', '');
		const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
		const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
		const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
		return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
	}
</script>

<svelte:head>
	<title>Nube de Palabras - Debate ENADE 2025</title>
	<meta name="description" content="Análisis de conceptos clave del debate ENADE 2025 mediante nubes de palabras por candidato" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<!-- Header -->
	<header class="mb-8 text-center">
		<h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
			Nube de Palabras - Debate ENADE 2025
		</h1>
		<p class="text-lg text-gray-600 max-w-3xl mx-auto">
			Análisis de los conceptos más utilizados en el debate presidencial ENADE 2025. 
			Explora los temas centrales de cada candidato.
		</p>
	</header>

	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97757]"></div>
			<span class="ml-3 text-gray-600">Cargando análisis de palabras...</span>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
			<h2 class="text-xl font-semibold text-red-800 mb-2">Error al cargar los datos</h2>
			<p class="text-red-600">{error}</p>
		</div>
	{:else if wordcloudData}
		<!-- Selector de vista mejorado -->
		<div class="mb-8 md:mb-12">
			<div class="flex flex-wrap gap-2 md:gap-4 justify-center px-4">
				<button
					on:click={() => selectCandidato(null)}
					class="px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
						{selectedCandidato === null 
							? 'bg-gradient-to-r from-[#D97757] to-[#c56a4c] text-white shadow-[#D97757]/25' 
							: 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'}"
				>
					<span class="flex items-center gap-1 md:gap-2">
						<svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						<span class="hidden sm:inline">Vista General</span>
						<span class="sm:hidden">General</span>
					</span>
				</button>
				
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
		</div>

		<!-- Nube de palabras -->
		<div class="relative px-4 md:px-0">
			<!-- Indicador de candidato seleccionado -->
			{#if selectedCandidato}
				<div class="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
					<div 
						class="px-3 md:px-4 py-1 md:py-2 rounded-full text-white font-semibold text-xs md:text-sm shadow-lg flex items-center gap-1 md:gap-2"
						style:background={`linear-gradient(135deg, ${candidatosDisponibles.find(c => c.id === selectedCandidato)?.color}, ${adjustBrightness(candidatosDisponibles.find(c => c.id === selectedCandidato)?.color || '#000', -20)})`}
					>
						<img 
							src="/blog/candidatos/{candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}.webp"
							alt="{candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre}"
							class="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover border border-white shadow-sm"
						/>
						<span class="hidden sm:inline">{candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre}</span>
						<span class="sm:hidden">{candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre.split(' ')[0]}</span>
					</div>
				</div>
			{/if}
			
			<div class="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 border border-gray-100">
				<CSSWordCloud 
					data={wordcloudData} 
					candidatoId={selectedCandidato}
				/>
			</div>
		</div>

		<!-- Lista de conceptos por candidato - Movida aquí para estar debajo de la nube -->
		{#if selectedCandidato}
			<div class="mt-6 md:mt-8 mx-4 md:mx-0 bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
				<div class="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
					<div class="relative">
						<img 
							src="/blog/candidatos/{candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}.webp"
							alt="{candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre}"
							class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-white shadow-lg"
						/>
						<div 
							class="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white flex items-center justify-center"
							style:background-color={candidatosDisponibles.find(c => c.id === selectedCandidato)?.color}
						>
							<svg class="w-2 h-2 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
							</svg>
						</div>
					</div>
					<h3 class="text-lg md:text-2xl font-bold text-gray-900">
						<span class="hidden sm:inline">Conceptos detallados - {candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre}</span>
						<span class="sm:hidden">Conceptos - {candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre.split(' ')[0]}</span>
					</h3>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
					{#each wordcloudData.wordcloudData.candidatos[selectedCandidato].words as word, index}
						<div class="group bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
							<div class="flex items-center justify-between mb-2">
								<span class="font-semibold text-gray-900 text-sm md:text-lg">{word.text}</span>
								<div class="flex items-center gap-1 md:gap-2">
									<div 
										class="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-sm" 
										style:background-color={word.color}
									></div>
									<span class="text-xs md:text-sm font-bold text-gray-600 bg-gray-100 px-1 md:px-2 py-1 rounded-full">
										{word.weight}
									</span>
								</div>
							</div>
							<!-- Barra de progreso visual -->
							<div class="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
								<div 
									class="h-1.5 md:h-2 rounded-full transition-all duration-500"
									style:background-color={word.color}
									style:width={`${(word.weight / Math.max(...wordcloudData.wordcloudData.candidatos[selectedCandidato].words.map(w => w.weight))) * 100}%`}
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Información adicional -->
		<div class="mt-8 md:mt-12 mx-4 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
			<!-- Estadísticas generales -->
			<div class="bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
				<div class="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
					<div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#D97757] to-[#c56a4c] rounded-xl flex items-center justify-center">
						<svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
					</div>
					<h3 class="text-lg md:text-xl font-bold text-gray-900">Estadísticas del Análisis</h3>
				</div>
				<div class="space-y-3 md:space-y-4">
					<div class="flex justify-between items-center p-2 md:p-3 bg-white rounded-lg border border-gray-100">
						<span class="text-gray-600 font-medium text-sm md:text-base">Total de conceptos:</span>
						<span class="font-bold text-base md:text-lg text-[#D97757]">{wordcloudData.metadata.totalWords}</span>
					</div>
					<div class="flex justify-between items-center p-2 md:p-3 bg-white rounded-lg border border-gray-100">
						<span class="text-gray-600 font-medium text-sm md:text-base">Candidatos analizados:</span>
						<span class="font-bold text-base md:text-lg text-[#3B82F6]">{wordcloudData.metadata.candidatosCount}</span>
					</div>
					<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 md:p-3 bg-white rounded-lg border border-gray-100 gap-1 sm:gap-0">
						<span class="text-gray-600 font-medium text-sm md:text-base">Fuente:</span>
						<span class="font-semibold text-gray-900 text-sm md:text-base">{wordcloudData.metadata.source}</span>
					</div>
					<div class="flex justify-between items-center p-2 md:p-3 bg-white rounded-lg border border-gray-100">
						<span class="text-gray-600 font-medium text-sm md:text-base">Fecha de análisis:</span>
						<span class="font-semibold text-gray-900 text-sm md:text-base">{new Date(wordcloudData.metadata.created).toLocaleDateString('es-CL')}</span>
					</div>
				</div>
			</div>

			<!-- Descripción -->
			<div class="bg-gradient-to-br from-white to-blue-50 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 border border-blue-100">
				<div class="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
					<div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
						<svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h3 class="text-lg md:text-xl font-bold text-gray-900">Sobre este Análisis</h3>
				</div>
				<p class="text-gray-700 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
					{wordcloudData.metadata.description}
				</p>
				<div class="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-xl border border-blue-200">
					<div class="flex items-start gap-2 md:gap-3">
						<div class="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
							<svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
							</svg>
						</div>
						<p class="text-xs md:text-sm text-blue-800 font-medium">
							<strong>Nota:</strong> Los tamaños de las palabras reflejan la frecuencia de uso. 
							Los colores representan diferentes categorías temáticas o candidatos.
						</p>
					</div>
				</div>
			</div>
		</div>

	{/if}
</div>

<style>
	.container {
		min-height: 100vh;
	}
</style>
