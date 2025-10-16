<script lang="ts">
	import type { WordCloudResponse } from './types';

	export let data: WordCloudResponse;
	export let candidatoId: string | null = null;

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

	// Obtener las palabras a mostrar
	$: words = candidatoId && data.wordcloudData.candidatos && data.wordcloudData.candidatos[candidatoId] 
		? data.wordcloudData.candidatos[candidatoId].words 
		: data.wordcloudData.general.words;

	// Ordenar palabras por peso y limitar cantidad
	$: sortedWords = words ? [...words].sort((a, b) => b.weight - a.weight) : [];
	$: maxWords = typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 24;
	$: wordsToShow = sortedWords.slice(0, maxWords);

	// Calcular tamaños de fuente
	$: maxWeight = wordsToShow.length > 0 ? Math.max(...wordsToShow.map(w => w.weight)) : 100;
	$: minWeight = wordsToShow.length > 0 ? Math.min(...wordsToShow.map(w => w.weight)) : 10;

	// Función para calcular tamaño de fuente
	function getFontSize(weight: number): number {
		const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
		const sizeMultiplier = Math.pow(normalizedWeight, 0.8);
		const minFontSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 14 : 18;
		const maxFontSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 32 : 48;
		return minFontSize + (maxFontSize - minFontSize) * sizeMultiplier;
	}

	// Función para calcular opacidad basada en peso
	function getOpacity(weight: number): number {
		const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
		return 0.7 + (normalizedWeight * 0.3); // Entre 0.7 y 1.0
	}
</script>

<div class="css-wordcloud-container">
	<!-- Título -->
	<div class="wordcloud-title">
		<h2 class="title-text">
			{candidatoId && data.wordcloudData.candidatos && data.wordcloudData.candidatos[candidatoId] 
				? `Conceptos de ${data.wordcloudData.candidatos[candidatoId].nombre}`
				: data.wordcloudData.general?.title || 'Nube de Palabras'}
		</h2>
		<div class="title-decoration"></div>
	</div>

	<!-- Grid de palabras -->
	<div class="words-grid">
		{#if wordsToShow.length > 0}
			{#each wordsToShow as word, index}
				<div 
					class="word-item"
					style="
						font-size: {getFontSize(word.weight)}px;
						color: {adjustBrightness(word.color, -10)};
						opacity: {getOpacity(word.weight)};
						--word-color: {word.color};
						animation-delay: {index * 0.1}s;
					"
				>
					{word.text}
				</div>
			{/each}
		{:else}
			<div class="no-words-message">
				<p class="text-gray-500">Cargando palabras...</p>
			</div>
		{/if}
	</div>

	<!-- Información adicional -->
	<div class="wordcloud-info">
		<p class="text-sm text-gray-600 mt-2">
			{wordsToShow.length} conceptos {candidatoId && data.wordcloudData.candidatos[candidatoId] ? 'clave' : 'más utilizados'} {candidatoId && data.wordcloudData.candidatos[candidatoId] ? `de ${data.wordcloudData.candidatos[candidatoId].nombre}` : 'en el debate'}
		</p>
	</div>
</div>

<style>
	.css-wordcloud-container {
		@apply relative w-full;
	}

	.wordcloud-title {
		@apply text-center mb-8;
	}

	.title-text {
		@apply text-2xl md:text-3xl font-bold text-gray-900 mb-4;
	}

	.title-decoration {
		@apply w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 rounded-full;
	}

	.words-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1.5rem 2rem;
		justify-items: center;
		align-items: center;
		padding: 2rem;
		min-height: 400px;
	}

	@media (max-width: 768px) {
		.words-grid {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
			gap: 1rem 1.5rem;
			padding: 1.5rem;
			min-height: 300px;
		}
	}

	.word-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		background: linear-gradient(135deg, var(--word-color)15, var(--word-color)25);
		border: 2px solid var(--word-color);
		font-weight: 600;
		text-align: center;
		word-break: break-word;
		transition: all 0.3s ease;
		animation: wordAppear 0.6s ease-out forwards;
		opacity: 0;
		transform: translateY(20px) scale(0.9);
		box-shadow: 0 4px 12px var(--word-color)30;
		backdrop-filter: blur(10px);
	}

	.word-item:hover {
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 8px 25px var(--word-color)40;
		background: linear-gradient(135deg, var(--word-color)25, var(--word-color)35);
	}

	@media (max-width: 768px) {
		.word-item {
			padding: 0.375rem 0.75rem;
			border-radius: 0.75rem;
			border-width: 1.5px;
		}
	}

	@keyframes wordAppear {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.wordcloud-info {
		@apply text-center mt-6;
	}

	.no-words-message {
		@apply flex items-center justify-center col-span-full py-12;
	}

	/* Animación de entrada para el contenedor */
	.css-wordcloud-container {
		animation: containerAppear 0.8s ease-out;
	}

	@keyframes containerAppear {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
