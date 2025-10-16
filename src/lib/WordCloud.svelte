<script lang="ts">
	import { onMount } from 'svelte';
	import type { WordCloudData, WordData } from './types';

	export let data: WordCloudData;
	export let candidatoId: string | null = null;
	export let width: number = 800;
	export let height: number = 400;
	
	// Variables reactivas para responsive
	$: responsiveWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(350, window.innerWidth - 32) : width;
	$: responsiveHeight = typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : height;

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
		ctx.fillRect(0, 0, responsiveWidth, responsiveHeight);

		// Gradiente de fondo muy sutil para profundidad
		const bgGradient = ctx.createLinearGradient(0, 0, 0, responsiveHeight);
		bgGradient.addColorStop(0, '#ffffff');
		bgGradient.addColorStop(1, '#fefefe');
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, responsiveWidth, responsiveHeight);

		const words = getWordsData();
		if (words.length === 0) return;

		// Configuración de fuentes profesionales y elegantes
		const fontFamily = '"Inter", "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif';
		const maxFontSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 28 : 68;
		const minFontSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 14;

		// Calcular el peso máximo para normalizar
		const maxWeight = Math.max(...words.map(w => w.weight));
		const minWeight = Math.min(...words.map(w => w.weight));

		// Array para almacenar posiciones ocupadas
		const occupiedPositions: Array<{ x: number; y: number; width: number; height: number }> = [];

		// ALGORITMO COMPLETAMENTE NUEVO - POSICIONAMIENTO POR GRID FIJO
		function findFreePosition(wordWidth: number, wordHeight: number): { x: number; y: number } {
			// Crear un grid fijo para evitar superposiciones
			const gridSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 100;
			const margin = typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 60;
			
			// Crear todas las posiciones posibles del grid
			const gridPositions = [];
			for (let y = margin; y <= responsiveHeight - margin - gridSize; y += gridSize) {
				for (let x = margin; x <= responsiveWidth - margin - gridSize; x += gridSize) {
					// Verificar que la palabra cabe en esta posición del grid
					if (x + wordWidth <= responsiveWidth - margin && y + wordHeight <= responsiveHeight - margin) {
						gridPositions.push({ x, y });
					}
				}
			}
			
			// Buscar una posición libre en el grid
			for (const gridPos of gridPositions) {
				let isOccupied = false;
				
				// Verificar si esta posición del grid está ocupada
				for (const occupiedPos of occupiedPositions) {
					// Verificar si hay superposición con margen generoso
					const marginCheck = 20;
					const left1 = gridPos.x - marginCheck;
					const right1 = gridPos.x + wordWidth + marginCheck;
					const top1 = gridPos.y - marginCheck;
					const bottom1 = gridPos.y + wordHeight + marginCheck;
					
					const left2 = occupiedPos.x - marginCheck;
					const right2 = occupiedPos.x + occupiedPos.width + marginCheck;
					const top2 = occupiedPos.y - marginCheck;
					const bottom2 = occupiedPos.y + occupiedPos.height + marginCheck;
					
					// Si hay intersección, esta posición está ocupada
					if (!(left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2)) {
						isOccupied = true;
						break;
					}
				}
				
				if (!isOccupied) {
					return gridPos;
				}
			}
			
			// Si no se encuentra posición en el grid, usar posiciones aleatorias con márgenes muy grandes
			const maxAttempts = 1000;
			const largeMargin = typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 80;
			
			for (let i = 0; i < maxAttempts; i++) {
				const x = largeMargin + Math.random() * (responsiveWidth - wordWidth - (largeMargin * 2));
				const y = largeMargin + Math.random() * (responsiveHeight - wordHeight - (largeMargin * 2));
				
				let isOccupied = false;
				for (const occupiedPos of occupiedPositions) {
					const marginCheck = 30;
					const left1 = x - marginCheck;
					const right1 = x + wordWidth + marginCheck;
					const top1 = y - marginCheck;
					const bottom1 = y + wordHeight + marginCheck;
					
					const left2 = occupiedPos.x - marginCheck;
					const right2 = occupiedPos.x + occupiedPos.width + marginCheck;
					const top2 = occupiedPos.y - marginCheck;
					const bottom2 = occupiedPos.y + occupiedPos.height + marginCheck;
					
					if (!(left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2)) {
						isOccupied = true;
						break;
					}
				}
				
				if (!isOccupied) {
					return { x, y };
				}
			}
			
			// Último recurso: posición fija en el centro
			return {
				x: (responsiveWidth - wordWidth) / 2,
				y: (responsiveHeight - wordHeight) / 2
			};
		}

		// Ordenar palabras por peso (mayor a menor) y limitar DRÁSTICAMENTE en móviles y desktop
		const sortedWords = [...words].sort((a, b) => b.weight - a.weight);
		const maxWords = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 20; // Menos palabras en ambos casos
		const wordsToRender = sortedWords.slice(0, maxWords);

		// Dibujar cada palabra con efectos mejorados
		wordsToRender.forEach((word, index) => {
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

			// Encontrar posición libre usando el nuevo algoritmo
			const position = findFreePosition(wordWidth, wordHeight);

			// Renderizado optimizado para máxima intensidad y nitidez
			const baseColor = word.color;
			
			// Intensificar el color para mejor contraste
			const intensifiedColor = adjustBrightness(baseColor, -15);
			
			// Sombra sutil para todas las palabras importantes
			if (normalizedWeight > 0.5) {
				ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
				ctx.shadowBlur = 1.5;
				ctx.shadowOffsetX = 0.8;
				ctx.shadowOffsetY = 0.8;
			}

			// Dibujar el texto con color intensificado para máxima claridad
			ctx.fillStyle = intensifiedColor;
			ctx.fillText(word.text, position.x, position.y + wordHeight);

			// Para palabras muy importantes, agregar un borde sutil
			if (normalizedWeight > 0.7) {
				ctx.strokeStyle = adjustBrightness(intensifiedColor, -10);
				ctx.lineWidth = 0.5;
				ctx.strokeText(word.text, position.x, position.y + wordHeight);
			}

			// Resetear sombra y stroke
			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.strokeStyle = 'transparent';
			ctx.lineWidth = 0;

			// Registrar la posición ocupada (el algoritmo ya verificó que está libre)
			occupiedPositions.push({
				x: position.x,
				y: position.y,
				width: wordWidth,
				height: wordHeight
			});
		});

		// El título ahora se renderiza fuera del canvas, en el componente padre
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
			
			// Establecer el tamaño real del canvas usando dimensiones responsivas
			canvas.width = responsiveWidth * devicePixelRatio;
			canvas.height = responsiveHeight * devicePixelRatio;
			
			// Establecer el tamaño de visualización
			canvas.style.width = responsiveWidth + 'px';
			canvas.style.height = responsiveHeight + 'px';
			
			// Escalar el contexto para la alta resolución
			ctx.scale(devicePixelRatio, devicePixelRatio);
			
			// Configurar renderizado para máxima nitidez
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';
			
			drawWordCloud();
		}
		
		// Listener para redimensionamiento
		const handleResize = () => {
			if (canvas && ctx && data) {
				// Actualizar dimensiones
				canvas.width = responsiveWidth * (window.devicePixelRatio || 1);
				canvas.height = responsiveHeight * (window.devicePixelRatio || 1);
				canvas.style.width = responsiveWidth + 'px';
				canvas.style.height = responsiveHeight + 'px';
				ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
				
				drawWordCloud();
			}
		};
		
		window.addEventListener('resize', handleResize);
		
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	// Redibujar cuando cambien los datos o candidato
	$: if (ctx && data && candidatoId !== undefined) {
		drawWordCloud();
	}
</script>

<div class="wordcloud-container">
	<!-- Título estilizado fuera del canvas -->
	<div class="wordcloud-title">
		<h2 class="title-text">{getTitle()}</h2>
		<div class="title-decoration"></div>
	</div>
	
	<canvas 
		bind:this={canvas} 
		width={responsiveWidth} 
		height={responsiveHeight}
		class="wordcloud-canvas"
	></canvas>
	
	<!-- Información adicional -->
	<div class="wordcloud-info">
		<p class="text-sm text-gray-600 mt-2">
			{#if candidatoId && data.candidatos[candidatoId]}
				{typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(8, data.candidatos[candidatoId].words.length) : Math.min(20, data.candidatos[candidatoId].words.length)} conceptos clave de {data.candidatos[candidatoId].nombre}
			{:else}
				{typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(8, data.general.words.length) : Math.min(20, data.general.words.length)} conceptos más utilizados en el debate
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
		height: 3px;
		background: linear-gradient(90deg, #D97757, #3B82F6, #10B981, #F59E0B);
		border-radius: 1.25rem 1.25rem 0 0;
	}

	.wordcloud-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
		position: relative;
	}

	.title-text {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0 0 0.75rem 0;
		text-align: center;
		letter-spacing: -0.025em;
		line-height: 1.2;
		background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		z-index: 2;
	}

	.title-decoration {
		width: 60px;
		height: 4px;
		background: linear-gradient(90deg, #D97757, #3B82F6, #10B981);
		border-radius: 2px;
		position: relative;
	}

	.title-decoration::before {
		content: '';
		position: absolute;
		top: 50%;
		left: -20px;
		width: 20px;
		height: 2px;
		background: linear-gradient(90deg, transparent, #D97757);
		transform: translateY(-50%);
	}

	.title-decoration::after {
		content: '';
		position: absolute;
		top: 50%;
		right: -20px;
		width: 20px;
		height: 2px;
		background: linear-gradient(90deg, #10B981, transparent);
		transform: translateY(-50%);
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
