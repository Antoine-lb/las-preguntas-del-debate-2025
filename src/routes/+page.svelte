<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { candidatos2025, getCandidatoById } from '$lib/candidatos-2025';
	import {
		debates2025,
		getPreguntasPorDebate,
		getRespuesta,
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
		empleo: IconoBriefcase
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
	 * Obtiene debates donde participó el candidato seleccionado
	 */
	const debatesFiltrados = $derived.by((): Debate[] => {
		let debates = debates2025;

		// Filtrar por candidato si está seleccionado
		if (candidatoSeleccionadoId) {
			return debates.filter((d) => d.candidatosIds.includes(candidatoSeleccionadoId!));
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
	 * Calcula el total de respuestas visibles según filtros
	 */
	const totalRespuestas = $derived.by(() => {
		let count = 0;
		debatesFiltrados.forEach((d) => {
			const preguntas = getPreguntasPorDebate(d.id);
			const filtradas = candidatoSeleccionadoId
				? preguntas.filter((p) => getRespuesta(p.id, candidatoSeleccionadoId!))
				: temaSeleccionadoId
					? preguntas.filter((p) => p.temaId === temaSeleccionadoId)
					: preguntas;

			filtradas.forEach((pregunta) => {
				if (candidatoSeleccionadoId) {
					// Solo contar la respuesta del candidato seleccionado
					if (getRespuesta(pregunta.id, candidatoSeleccionadoId)) {
						count++;
					}
				} else {
					// Contar todas las respuestas a esta pregunta
					d.candidatosIds.forEach((cId) => {
						if (getRespuesta(pregunta.id, cId)) {
							count++;
						}
					});
				}
			});
		});
		return count;
	});

</script>

<svelte:head>
	<title>Debates Presidenciales Chile 2025 - Infografía Interactiva | Parlamento AI</title>
	<meta
		name="description"
		content="Explora de forma interactiva todos los debates presidenciales de Chile 2025. Filtra por candidato, lee sus respuestas y compara propuestas."
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
		<h1 class="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Las preguntas del debate</h1>
		<p class="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
			Infografía interactiva con todas las preguntas y respuestas de los candidatos. Haz clic en un
			candidato para filtrar sus respuestas.
		</p>
	</header>

	<!-- Selector de Candidatos y Temas -->
	<section class="mb-12">
		<h2 class="text-lg md:text-xl font-semibold mb-4 text-gray-900">Filtrar por candidato</h2>

		<!-- Candidatos -->
		<div class="mb-4">
			<div class="flex flex-wrap gap-2 md:gap-3">
				{#each candidatosVisibles as candidato}
					<button
						onclick={() => seleccionarCandidato(candidato.id)}
						class="group flex items-center gap-1.5 md:gap-2 pr-3 md:pr-4 rounded-full border transition-all duration-200 overflow-hidden h-12 md:h-20 {candidatoSeleccionadoId ===
						candidato.id
							? 'shadow-md'
							: ''}"
						style="
						{candidatoSeleccionadoId === candidato.id
							? `border-color: ${candidato.color}; background-color: ${candidato.color}18`
							: `border-color: ${candidato.color}40; background-color: ${candidato.color}08`}
					"
						onmouseenter={(e) => {
							if (candidatoSeleccionadoId !== candidato.id) {
								e.currentTarget.style.backgroundColor = `${candidato.color}18`;
							}
						}}
						onmouseleave={(e) => {
							if (candidatoSeleccionadoId !== candidato.id) {
								e.currentTarget.style.backgroundColor = `${candidato.color}08`;
							}
						}}
					>
						<div class="h-full flex items-end">
							<img
								src={candidato.fotoSinFondo || candidato.foto}
								alt={candidato.nombre}
								class="h-full w-auto object-contain transition-transform duration-300 ease-out group-hover:translate-x-2 {candidato.fotoSinFondo
									? ''
									: 'rounded-full'}"
							/>
						</div>
						<div class="text-left py-1 md:py-2">
							<h3
								class="font-semibold text-sm md:text-base leading-tight {candidatoSeleccionadoId ===
								candidato.id
									? ''
									: 'text-gray-900'}"
								style={candidatoSeleccionadoId === candidato.id ? `color: ${candidato.color}` : ''}
							>
								{candidato.nombre}
							</h3>
							<p
								class="hidden md:block text-sm leading-tight {candidatoSeleccionadoId === candidato.id
									? ''
									: 'text-gray-600'}"
								style={candidatoSeleccionadoId === candidato.id
									? `color: ${candidato.color}B3`
									: ''}
							>
								{candidato.coalicion || candidato.partido}
							</p>
						</div>
					</button>
				{/each}

				<!-- Botón "Otros" para toggle de eliminados -->
				<button
					onclick={() => (mostrarEliminados = !mostrarEliminados)}
					class="group flex items-center gap-1.5 md:gap-2 pr-4 md:pr-6 rounded-full border transition-all duration-200 overflow-hidden h-12 md:h-20 {mostrarEliminados
						? 'border-yellow-600/30 bg-yellow-50/50 shadow-sm'
						: 'border-yellow-600/20 bg-transparent hover:bg-yellow-50/30'}"
				>
					<div class="h-full flex items-center justify-center pl-3 md:pl-4">
						<svg
							class="w-4 md:w-5 h-4 md:h-5 text-yellow-700 transition-transform duration-300 ease-out {mostrarEliminados
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
					<div class="text-left py-1 md:py-2">
						<h3 class="font-semibold text-sm md:text-base leading-tight text-yellow-700">
							{mostrarEliminados ? 'Ocultar otros' : 'Otros'}
						</h3>
						<p class="hidden md:block text-sm leading-tight text-yellow-600">
							{mostrarEliminados ? 'Eliminados en primarias' : 'Ver más candidatos'}
						</p>
					</div>
				</button>
			</div>
		</div>

		<!-- Temas -->
		<div>
			<h3 class="text-sm font-medium text-gray-600 mb-2">Temas</h3>
			<div class="flex flex-wrap gap-1.5 md:gap-2">
				{#each temas as tema}
					{@const IconoTema = iconosPorTema[tema.id]}
					<button
						onclick={() => seleccionarTema(tema.id)}
						class="flex items-center gap-1.5 md:gap-2.5 px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-full border transition-all duration-200 text-xs md:text-sm font-medium {temaSeleccionadoId ===
						tema.id
							? 'shadow-md'
							: 'hover:shadow-sm'}"
						style="
							{temaSeleccionadoId === tema.id
							? `background-color: ${tema.color}30; border-color: ${tema.color}; color: ${tema.color}`
							: `background-color: ${tema.color}10; border-color: ${tema.color}40; color: ${tema.color}E6`}
						"
					>
						{#if IconoTema}
							<IconoTema class="w-4 h-4 md:w-6 md:h-6" />
						{/if}
						{tema.nombre}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- Estadísticas y Filtros Activos -->
	<section class="mb-8">
		<p class="text-sm text-gray-500 mb-3">Resultados:</p>
		<div class="flex items-center justify-between gap-4 flex-wrap">
			<!-- Estadísticas -->
			<div class="flex items-center gap-6">
				<!-- Debates -->
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-[#D97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
						></path>
					</svg>
					{#key debatesFiltrados.length}
						<span class="text-sm font-medium text-gray-700" in:fade={{ duration: 200 }}>
							{debatesFiltrados.length}
							{debatesFiltrados.length === 1 ? 'debate' : 'debates'}
						</span>
					{/key}
				</div>

				<!-- Preguntas -->
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-[#D97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					{#key totalPreguntas}
						<span class="text-sm font-medium text-gray-700" in:fade={{ duration: 200 }}>
							{totalPreguntas}
							{totalPreguntas === 1 ? 'pregunta' : 'preguntas'}
						</span>
					{/key}
				</div>

				<!-- Respuestas -->
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-[#D97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						></path>
					</svg>
					{#key totalRespuestas}
						<span class="text-sm font-medium text-gray-700" in:fade={{ duration: 200 }}>
							{totalRespuestas}
							{totalRespuestas === 1 ? 'respuesta' : 'respuestas'}
						</span>
					{/key}
				</div>

				<!-- Filtro Activo -->
				{#if candidatoSeleccionado || temaSeleccionado}
					{@const colorFiltro =
						candidatoSeleccionado?.color || temaSeleccionado?.color || '#D97757'}
					<div
						class="flex items-center gap-2 pl-4 border-l-2 border-gray-300"
						in:fly={{ x: -10, duration: 300 }}
						out:fade={{ duration: 150 }}
					>
						<span class="text-sm font-medium text-gray-600">Filtrado por:</span>
						<div
							class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 shadow-sm"
							style="background-color: {colorFiltro}18; border-color: {colorFiltro}80"
							in:scale={{ duration: 250, start: 0.9 }}
						>
							<span class="text-sm font-semibold" style="color: {colorFiltro}">
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
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
						</div>
					</div>
				{/if}
			</div>

		</div>
	</section>

	<!-- Debates y Preguntas -->
	<section class="space-y-12">
		{#key `${candidatoSeleccionadoId}-${temaSeleccionadoId}`}
			{#each debatesFiltrados as debate, idx}
				{@const preguntas = getPreguntasPorDebate(debate.id)}
				{@const preguntasConRespuesta = candidatoSeleccionadoId
					? preguntas.filter((p) => getRespuesta(p.id, candidatoSeleccionadoId!))
					: temaSeleccionadoId
						? preguntas.filter((p) => p.temaId === temaSeleccionadoId)
						: preguntas}

				{#if preguntasConRespuesta.length > 0}
					<article
						class="bg-white rounded-lg border border-gray-200"
						in:fly={{ y: 20, duration: 400, delay: idx * 100 }}
					>
						<!-- Header del Debate -->
						<header class="p-6 border-b border-gray-200">
							<div class="flex items-start justify-between gap-4 mb-4">
								<h3 class="text-2xl font-bold text-gray-900 flex-1">{debate.nombre}</h3>
								<a
									href={debate.transcriptUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="flex-shrink-0 text-sm text-[#D97757] hover:text-[#c56a4c] font-medium hover:underline"
								>
									Ver transcripción completa →
								</a>
							</div>
							<div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
								<span class="flex items-center gap-2">
									<svg class="w-4 h-4 text-[#D97757]" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clip-rule="evenodd"
										></path>
									</svg>
									{debate.organizador}
								</span>
								<span class="flex items-center gap-2">
									<svg class="w-4 h-4 text-[#D97757]" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
											clip-rule="evenodd"
										></path>
									</svg>
									{new Date(debate.fecha).toLocaleDateString('es-CL', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</span>
								{#if debate.duracion}
									<span class="flex items-center gap-2">
										<svg class="w-4 h-4 text-[#D97757]" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
												clip-rule="evenodd"
											></path>
										</svg>
										{debate.duracion}
									</span>
								{/if}
							</div>

							<!-- Participantes -->
							<div>
								<p class="text-xs font-medium text-gray-500 mb-2">Participantes:</p>
								<div class="flex flex-wrap gap-2">
									{#each debate.candidatosIds as candidatoId}
										{@const candidato = getCandidatoById(candidatoId)}
										{#if candidato}
											<div
												class="inline-flex items-center gap-2 pl-0 pr-3 py-0 rounded-full overflow-hidden h-7"
												style="background-color: {candidato.color}20"
											>
												<div class="h-full flex items-end flex-shrink-0">
													<img
														src={candidato.fotoSinFondo || candidato.foto}
														alt={candidato.nombre}
														class="h-full w-auto object-contain {candidato.fotoSinFondo
															? ''
															: 'rounded-full object-cover'}"
													/>
												</div>
												<span class="text-sm font-semibold" style="color: {candidato.color}">
													{candidato.abreviacion}
												</span>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						</header>

						<!-- Preguntas y Respuestas -->
						<div class="divide-y divide-gray-100">
							{#each preguntasConRespuesta as pregunta, idx}
								{@const respuestaMostrar = candidatoSeleccionadoId
									? getRespuesta(pregunta.id, candidatoSeleccionadoId)
									: null}

								<div class="p-5">
									<!-- Pregunta -->
									<div class="mb-3">
										<div class="flex gap-3 items-start">
											<!-- Burbuja de categoría (siempre presente para mantener alineación) -->
											{#if pregunta.temaId}
												{@const tema = getTemaById(pregunta.temaId)}
												{@const IconoTema = tema ? iconosPorTema[tema.id] : null}
												{#if tema && IconoTema}
													<div
														class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center -mt-1"
														style="background-color: {tema.color}20; color: {tema.color}; "
													>
														<IconoTema class="w-5 h-5" />
													</div>
												{/if}
											{:else}
												<!-- Burbuja vacía para preguntas sin categoría -->
												<div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 -mt-1"></div>
											{/if}
											<p class="flex-1 text-gray-900 font-medium leading-relaxed">
												<span class="text-[#D97757] font-semibold mr-2">{idx + 1}.</span>
												{pregunta.pregunta}
											</p>
										</div>
									</div>

									<!-- Respuestas -->
									<div class="ml-11">
										{#if candidatoSeleccionado && respuestaMostrar}
											<!-- Vista filtrada: solo el candidato seleccionado -->
											<div class="flex gap-3 items-start">
												<div
													class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
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
												<div class="flex-1">
													<p class="font-medium text-[#D97757] text-sm mb-0.5">
														{candidatoSeleccionado.nombre}
													</p>
													<p class="text-gray-700 text-sm leading-relaxed">
														{respuestaMostrar.resumen}
														{#if respuestaMostrar.timestamp}
															<span class="text-xs text-gray-400 ml-1.5">
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
												<div class="space-y-2.5">
													{#each todasRespuestas as { candidato, respuesta }}
														{#if candidato && respuesta}
															<div class="flex gap-3 items-start">
																<div
																	class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
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
																<div class="flex-1">
																	<p class="font-medium text-gray-900 text-sm mb-0.5">
																		{candidato.nombre}
																	</p>
																	<p class="text-gray-700 text-sm leading-relaxed">
																		{respuesta.resumen}
																		{#if respuesta.timestamp}
																			<span class="text-xs text-gray-400 ml-1.5">
																				{formatearTiempo(respuesta.timestamp)}
																			</span>
																		{/if}
																	</p>
																</div>
															</div>
														{/if}
													{/each}
												</div>
											{:else}
												<p class="text-gray-500 italic text-sm">
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
</div>
