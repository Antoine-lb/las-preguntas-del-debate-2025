<script lang="ts">
	import { onMount } from 'svelte';
	import type { WordCloudData, WordData } from './types';

	export let data: WordCloudData;
	export let candidatoId: string | null = null;
	export let width: number = 800;
	export let height: number = 400;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	// Función para obtener los datos de palabras según el contexto
	function getWordsData(): WordData[] {
		if (candidatoId && data.candidatos[candidatoId]) {
			return data.candidatos[candidatoId].words;
		}
		return data.general.words;
	}

	// Función para obtener el título
	function getTitle(): string {
		if (candidatoId && data.candidatos[candidatoId]) {
			return `Conceptos clave - ${data.candidatos[candidatoId].nombre}`;
		}
		return data.general.title;
	}

	// Función para dibujar la nube de palabras
	function drawWordCloud() {
		if (!ctx || !canvas) return;

		// Limpiar canvas
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#f8f9fa';
		ctx.fillRect(0, 0, width, height);

		const words = getWordsData();
		if (words.length === 0) return;

		// Configuración de fuentes y tamaños
		const fontFamily = 'Arial, sans-serif';
		const maxFontSize = 48;
		const minFontSize = 12;

		// Calcular el peso máximo para normalizar
		const maxWeight = Math.max(...words.map(w => w.weight));
		const minWeight = Math.min(...words.map(w => w.weight));

		// Array para almacenar posiciones ocupadas
		const occupiedPositions: Array<{ x: number; y: number; width: number; height: number }> = [];

		// Función para verificar si una posición está ocupada
		function isPositionOccupied(x: number, y: number, wordWidth: number, wordHeight: number): boolean {
			const margin = 5; // Margen entre palabras
			return occupiedPositions.some(pos => 
				!(x + wordWidth + margin < pos.x || 
				  x - margin > pos.x + pos.width || 
				  y + wordHeight + margin < pos.y || 
				  y - margin > pos.y + pos.height)
			);
		}

		// Función para encontrar una posición libre
		function findFreePosition(wordWidth: number, wordHeight: number): { x: number; y: number } {
			const maxAttempts = 100;
			let attempts = 0;

			while (attempts < maxAttempts) {
				const x = Math.random() * (width - wordWidth);
				const y = Math.random() * (height - wordHeight);

				if (!isPositionOccupied(x, y, wordWidth, wordHeight)) {
					return { x, y };
				}
				attempts++;
			}

			// Si no encuentra posición, colocar en el centro
			return {
				x: (width - wordWidth) / 2,
				y: (height - wordHeight) / 2
			};
		}

		// Ordenar palabras por peso (mayor a menor)
		const sortedWords = [...words].sort((a, b) => b.weight - a.weight);

		// Dibujar cada palabra
		sortedWords.forEach(word => {
			// Calcular tamaño de fuente basado en el peso
			const normalizedWeight = (word.weight - minWeight) / (maxWeight - minWeight);
			const fontSize = minFontSize + (maxFontSize - minFontSize) * normalizedWeight;

			ctx.font = `${fontSize}px ${fontFamily}`;
			ctx.fillStyle = word.color || '#333';

			// Medir el texto
			const textMetrics = ctx.measureText(word.text);
			const wordWidth = textMetrics.width;
			const wordHeight = fontSize;

			// Encontrar posición libre
			const position = findFreePosition(wordWidth, wordHeight);

			// Dibujar el texto
			ctx.fillText(word.text, position.x, position.y + wordHeight);

			// Registrar la posición ocupada
			occupiedPositions.push({
				x: position.x,
				y: position.y,
				width: wordWidth,
				height: wordHeight
			});
		});

		// Dibujar título
		ctx.font = 'bold 24px Arial, sans-serif';
		ctx.fillStyle = '#333';
		ctx.textAlign = 'center';
		ctx.fillText(getTitle(), width / 2, 30);
		ctx.textAlign = 'left';
	}

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d')!;
			canvas.width = width;
			canvas.height = height;
			drawWordCloud();
		}
	});

	// Redibujar cuando cambien los datos o candidato
	$: if (ctx && data) {
		drawWordCloud();
	}
</script>

<div class="wordcloud-container">
	<canvas 
		bind:this={canvas} 
		width={width} 
		height={height}
		class="wordcloud-canvas"
	></canvas>
	
	<!-- Información adicional -->
	<div class="wordcloud-info">
		<p class="text-sm text-gray-600 mt-2">
			{#if candidatoId && data.candidatos[candidatoId]}
				{data.candidatos[candidatoId].words.length} conceptos clave de {data.candidatos[candidatoId].nombre}
			{:else}
				{data.general.words.length} conceptos más utilizados en el debate
			{/if}
		</p>
	</div>
</div>

<style>
	.wordcloud-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.wordcloud-canvas {
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		background: #f8f9fa;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.wordcloud-canvas:hover {
		transform: scale(1.02);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.wordcloud-info {
		text-align: center;
		margin-top: 0.5rem;
	}
</style>
