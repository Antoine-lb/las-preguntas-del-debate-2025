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

		// Fondo ultra limpio y profesional
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);

		// Gradiente de fondo muy sutil para profundidad
		const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
		bgGradient.addColorStop(0, '#ffffff');
		bgGradient.addColorStop(1, '#fefefe');
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, width, height);

		const words = getWordsData();
		if (words.length === 0) return;

		// Configuración de fuentes profesionales y elegantes
		const fontFamily = '"Inter", "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif';
		const maxFontSize = 68;
		const minFontSize = 14;

		// Calcular el peso máximo para normalizar
		const maxWeight = Math.max(...words.map(w => w.weight));
		const minWeight = Math.min(...words.map(w => w.weight));

		// Array para almacenar posiciones ocupadas
		const occupiedPositions: Array<{ x: number; y: number; width: number; height: number }> = [];

		// Función para verificar si una posición está ocupada
		function isPositionOccupied(x: number, y: number, wordWidth: number, wordHeight: number): boolean {
			const margin = 3; // Margen reducido para palabras más juntas
			return occupiedPositions.some(pos => 
				!(x + wordWidth + margin < pos.x || 
				  x - margin > pos.x + pos.width || 
				  y + wordHeight + margin < pos.y || 
				  y - margin > pos.y + pos.height)
			);
		}

		// Función para encontrar una posición libre con algoritmo mejorado para nubes compactas
		function findFreePosition(wordWidth: number, wordHeight: number): { x: number; y: number } {
			const maxAttempts = 300;
			let attempts = 0;
			const centerX = width / 2;
			const centerY = height / 2;

			// Intentar posiciones más cercanas al centro primero
			while (attempts < maxAttempts) {
				// Usar distribución espiral más compacta
				const angle = attempts * 0.15;
				const radius = Math.min(attempts * 1.5, Math.min(width, height) / 3);
				
				// Agregar variación aleatoria para evitar patrones muy regulares
				const randomOffset = (Math.random() - 0.5) * 20;
				
				const x = centerX + radius * Math.cos(angle) - wordWidth / 2 + randomOffset;
				const y = centerY + radius * Math.sin(angle) - wordHeight / 2 + randomOffset;

				// Verificar límites más estrictos para mantener compacto
				if (x >= 10 && x <= width - wordWidth - 10 && 
					y >= 50 && y <= height - wordHeight - 10 &&
					!isPositionOccupied(x, y, wordWidth, wordHeight)) {
					return { x, y };
				}
				attempts++;
			}

			// Fallback: posición aleatoria más agresiva
			for (let i = 0; i < 100; i++) {
				const x = 10 + Math.random() * (width - wordWidth - 20);
				const y = 50 + Math.random() * (height - wordHeight - 60);

				if (!isPositionOccupied(x, y, wordWidth, wordHeight)) {
					return { x, y };
				}
			}

			// Último recurso: centro
			return {
				x: (width - wordWidth) / 2,
				y: (height - wordHeight) / 2
			};
		}

		// Ordenar palabras por peso (mayor a menor)
		const sortedWords = [...words].sort((a, b) => b.weight - a.weight);

		// Dibujar cada palabra con efectos mejorados
		sortedWords.forEach((word, index) => {
			// Calcular tamaño de fuente con mayor diferenciación
			const normalizedWeight = (word.weight - minWeight) / (maxWeight - minWeight);
			// Usar función cuadrática para mayor diferenciación de tamaños
			const sizeMultiplier = Math.pow(normalizedWeight, 0.8);
			const fontSize = minFontSize + (maxFontSize - minFontSize) * sizeMultiplier;

			// Configurar fuente profesional con peso optimizado
			const fontWeight = normalizedWeight > 0.6 ? '700' : '600';
			ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
			
			// Configurar renderizado de texto para máxima calidad
			ctx.textBaseline = 'alphabetic';
			ctx.textAlign = 'left';

			// Medir el texto
			const textMetrics = ctx.measureText(word.text);
			const wordWidth = textMetrics.width;
			const wordHeight = fontSize;

			// Encontrar posición libre
			const position = findFreePosition(wordWidth, wordHeight);

			// Renderizado limpio y profesional - sin gradientes complejos
			const baseColor = word.color;
			
			// Solo para palabras muy importantes: sombra ultra sutil
			if (normalizedWeight > 0.8) {
				ctx.shadowColor = 'rgba(0, 0, 0, 0.04)';
				ctx.shadowBlur = 1;
				ctx.shadowOffsetX = 0.5;
				ctx.shadowOffsetY = 0.5;
			}

			// Dibujar el texto con color sólido para máxima claridad
			ctx.fillStyle = baseColor;
			ctx.fillText(word.text, position.x, position.y + wordHeight);

			// Resetear sombra
			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;

			// Registrar la posición ocupada
			occupiedPositions.push({
				x: position.x,
				y: position.y,
				width: wordWidth,
				height: wordHeight
			});
		});

		// Título elegante y profesional
		ctx.font = '600 24px "Inter", "SF Pro Display", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif';
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#374151';
		ctx.textAlign = 'center';
		
		ctx.fillText(getTitle(), width / 2, 35);
		
		// Resetear configuración
		ctx.textAlign = 'left';
	}

	// Función auxiliar para ajustar brillo de color
	function adjustBrightness(color: string, amount: number): string {
		const hex = color.replace('#', '');
		const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
		const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
		const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
		return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
	}

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d')!;
			
			// Configurar canvas para alta resolución y nitidez
			const devicePixelRatio = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			
			// Establecer el tamaño real del canvas
			canvas.width = width * devicePixelRatio;
			canvas.height = height * devicePixelRatio;
			
			// Establecer el tamaño de visualización
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			
			// Escalar el contexto para la alta resolución
			ctx.scale(devicePixelRatio, devicePixelRatio);
			
			// Configurar renderizado para máxima nitidez
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';
			
			drawWordCloud();
		}
	});

	// Redibujar cuando cambien los datos o candidato
	$: if (ctx && data && candidatoId !== undefined) {
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
		padding: 2.5rem;
		background: #ffffff;
		border-radius: 1.25rem;
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -1px rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(229, 231, 235, 0.6);
		position: relative;
		overflow: hidden;
	}

	.wordcloud-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #D97757, #3B82F6, #10B981);
		border-radius: 1.25rem 1.25rem 0 0;
	}

	.wordcloud-canvas {
		border: 1px solid rgba(229, 231, 235, 0.5);
		border-radius: 0.75rem;
		background: #ffffff;
		cursor: pointer;
		transition: all 0.2s ease-out;
		position: relative;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		
		/* Optimización para alta resolución */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}

	.wordcloud-canvas::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
		pointer-events: none;
		transition: transform 0.6s ease;
	}

	.wordcloud-canvas:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		border-color: rgba(217, 119, 87, 0.3);
	}

	.wordcloud-canvas:hover::before {
		transform: translateX(100%);
	}

	.wordcloud-info {
		text-align: center;
		margin-top: 1.25rem;
		padding: 1rem 1.5rem;
		background: rgba(249, 250, 251, 0.9);
		border-radius: 0.75rem;
		border: 1px solid rgba(229, 231, 235, 0.4);
	}

	.wordcloud-info p {
		margin: 0;
		font-weight: 500;
		color: #475569;
		font-size: 0.875rem;
		letter-spacing: 0.025em;
	}

	/* Animaciones adicionales */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.wordcloud-container {
		animation: fadeInUp 0.6s ease-out;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.wordcloud-container {
			padding: 1rem;
		}
		
		.wordcloud-canvas {
			transform: scale(0.9);
		}
		
		.wordcloud-canvas:hover {
			transform: translateY(-2px) scale(0.91);
		}
	}
</style>
