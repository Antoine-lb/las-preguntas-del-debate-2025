<script lang="ts">
	import { onMount } from 'svelte';
	import WordCloud from '$lib/WordCloud.svelte';
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
		<!-- Selector de vista -->
		<div class="mb-8">
			<div class="flex flex-wrap gap-3 justify-center">
				<button
					onclick={() => selectCandidato(null)}
					class="px-4 py-2 rounded-full text-sm font-medium transition-colors
						{selectedCandidato === null 
							? 'bg-[#D97757] text-white' 
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					Vista General
				</button>
				
				{#each candidatosDisponibles as candidato}
					<button
						onclick={() => selectCandidato(candidato.id)}
						class="px-4 py-2 rounded-full text-sm font-medium transition-colors
							{selectedCandidato === candidato.id 
								? 'text-white' 
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						style:background-color={selectedCandidato === candidato.id ? candidato.color : undefined}
					>
						{candidato.nombre}
					</button>
				{/each}
			</div>
		</div>

		<!-- Nube de palabras -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<WordCloud 
				data={wordcloudData.wordcloudData} 
				candidatoId={selectedCandidato}
				width={800}
				height={500}
			/>
		</div>

		<!-- Información adicional -->
		<div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Estadísticas generales -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-xl font-semibold mb-4 text-gray-900">Estadísticas del Análisis</h3>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-600">Total de conceptos:</span>
						<span class="font-semibold">{wordcloudData.metadata.totalWords}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Candidatos analizados:</span>
						<span class="font-semibold">{wordcloudData.metadata.candidatosCount}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Fuente:</span>
						<span class="font-semibold">{wordcloudData.metadata.source}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Fecha de análisis:</span>
						<span class="font-semibold">{new Date(wordcloudData.metadata.created).toLocaleDateString('es-CL')}</span>
					</div>
				</div>
			</div>

			<!-- Descripción -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-xl font-semibold mb-4 text-gray-900">Sobre este Análisis</h3>
				<p class="text-gray-600 leading-relaxed">
					{wordcloudData.metadata.description}
				</p>
				<div class="mt-4 p-3 bg-blue-50 rounded-lg">
					<p class="text-sm text-blue-800">
						<strong>Nota:</strong> Los tamaños de las palabras reflejan la frecuencia de uso. 
						Los colores representan diferentes categorías temáticas o candidatos.
					</p>
				</div>
			</div>
		</div>

		<!-- Lista de conceptos por candidato -->
		{#if selectedCandidato}
			<div class="mt-8 bg-white rounded-lg shadow p-6">
				<h3 class="text-xl font-semibold mb-4 text-gray-900">
					Conceptos detallados - {candidatosDisponibles.find(c => c.id === selectedCandidato)?.nombre}
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{#each wordcloudData.wordcloudData.candidatos[selectedCandidato].words as word}
						<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
							<span class="font-medium">{word.text}</span>
							<div class="flex items-center gap-2">
								<div 
									class="w-4 h-4 rounded-full" 
									style:background-color={word.color}
								></div>
								<span class="text-sm text-gray-600">{word.weight}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		min-height: 100vh;
	}
</style>
