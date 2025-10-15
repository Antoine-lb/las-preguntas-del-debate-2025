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

		// Fondo más limpio y sutil
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);

		// Patrón de puntos muy sutil
		ctx.fillStyle = '#f1f5f9';
		ctx.globalAlpha = 0.3;
		for (let i = 0; i < width; i += 60) {
			for (let j = 0; j < height; j += 60) {
				ctx.beginPath();
				ctx.arc(i, j, 0.5, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
		ctx.globalAlpha = 1;

		const words = getWordsData();
		if (words.length === 0) return;

		// Configuración de fuentes y tamaños mejorada con alta nitidez
		const fontFamily = '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif';
		const maxFontSize = 72;
		const minFontSize = 16;

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

			// Configurar fuente con peso optimizado para nitidez
			ctx.font = `600 ${fontSize}px ${fontFamily}`;
			
			// Configurar renderizado de texto para máxima nitidez
			ctx.textBaseline = 'alphabetic';
			ctx.textAlign = 'left';
			ctx.textRenderingOptimization = 'optimizeQuality';

			// Medir el texto
			const textMetrics = ctx.measureText(word.text);
			const wordWidth = textMetrics.width;
			const wordHeight = fontSize;

			// Encontrar posición libre
			const position = findFreePosition(wordWidth, wordHeight);

			// Crear gradiente más sutil para mejor nitidez
			const textGradient = ctx.createLinearGradient(position.x, position.y, position.x + wordWidth, position.y + wordHeight);
			
			// Usar colores más vibrantes y modernos
			const baseColor = word.color;
			textGradient.addColorStop(0, baseColor);
			textGradient.addColorStop(0.5, baseColor);
			textGradient.addColorStop(1, adjustBrightness(baseColor, -15));

			// Dibujar sombra muy sutil para nitidez
			ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
			ctx.shadowBlur = 2;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;

			// Dibujar el texto con gradiente
			ctx.fillStyle = textGradient;
			ctx.fillText(word.text, position.x, position.y + wordHeight);

			// Resetear sombra
			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;

			// Agregar efecto hover (borde sutil para palabras grandes)
			if (normalizedWeight > 0.7) {
				ctx.strokeStyle = adjustBrightness(baseColor, 30);
				ctx.lineWidth = 1;
				ctx.strokeText(word.text, position.x, position.y + wordHeight);
			}

			// Registrar la posición ocupada
			occupiedPositions.push({
				x: position.x,
				y: position.y,
				width: wordWidth,
				height: wordHeight
			});
		});

		// Dibujar título con máxima nitidez
		ctx.font = '700 32px "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif';
		ctx.textRenderingOptimization = 'optimizeQuality';
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#0f172a';
		ctx.textAlign = 'center';
		
		// Sombra muy sutil para el título
		ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
		ctx.shadowBlur = 1;
		ctx.shadowOffsetY = 1;
		
		ctx.fillText(getTitle(), width / 2, 40);
		
		// Resetear sombra y alineación
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetY = 0;
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
			
			// Configurar renderizado de texto para máxima nitidez
			ctx.textRenderingOptimization = 'optimizeQuality';
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
		padding: 2rem;
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 1rem;
		box-shadow: 
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(226, 232, 240, 0.8);
		position: relative;
		overflow: hidden;
	}

	.wordcloud-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #D97757, #3B82F6, #10B981, #F59E0B);
		border-radius: 1rem 1rem 0 0;
	}

	.wordcloud-canvas {
		border: 1px solid rgba(226, 232, 240, 0.8);
		border-radius: 1rem;
		background: #ffffff;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		
		/* Optimización para alta resolución */
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		image-rendering: pixelated;
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
		transform: translateY(-2px) scale(1.005);
		box-shadow: 
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border-color: rgba(217, 119, 87, 0.4);
	}

	.wordcloud-canvas:hover::before {
		transform: translateX(100%);
	}

	.wordcloud-info {
		text-align: center;
		margin-top: 1rem;
		padding: 0.75rem 1.5rem;
		background: rgba(248, 250, 252, 0.8);
		border-radius: 0.5rem;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(226, 232, 240, 0.5);
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
