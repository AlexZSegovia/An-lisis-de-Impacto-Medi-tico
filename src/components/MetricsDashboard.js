import { renderNewsTable } from "./NewsTable.js";

const formatter = new Intl.NumberFormat("es-ES");

/**
 * * @param {string} estado
 * @param {number} metrica
 * @param {string} nombre
 * @returns {{color: string, texto: string, detalle: string}}
 */
function getStatusDetails(estado, metrica, nombre) {
	let estadoCalculado = "Malo";
	let color = "rojo";
	let texto = "❌ Malo";
	let detalle = `Métrica de ${nombre} baja.`;

	if (nombre === "cobertura" || nombre === "duración") {
		if (metrica >= 3) {
			estadoCalculado = "Bien";
		} else if (metrica >= 1 && metrica <= 2) {
			estadoCalculado = "Regular";
		} else {
			estadoCalculado = "Malo";
		}
	} else if (nombre === "engagement") {
		const engagementValue = metrica;
		if (engagementValue >= 20) {
			estadoCalculado = "Bien";
		} else if (engagementValue >= 10 && engagementValue < 20) {
			estadoCalculado = "Regular";
		} else {
			estadoCalculado = "Malo";
		}
	} else if (nombre === "alcance") {
		const estadoNormalizado = estado ? estado.toLowerCase() : "malo";
		if (estadoNormalizado === "excelente" || estadoNormalizado === "bien") {
			estadoCalculado = "Bien";
		} else if (estadoNormalizado === "regular") {
			estadoCalculado = "Regular";
		} else {
			estadoCalculado = "Malo";
		}
	}

	const estadoFinal = estadoCalculado.toLowerCase();

	if (estadoFinal === "bien") {
		color = "verde";
		texto = "✅ Bien";
	} else if (estadoFinal === "regular") {
		color = "amarillo";
		texto = "⚠ Regular";
	} else {
		// Malo
		color = "rojo";
		texto = "❌ Malo";
	}

	if (nombre === "cobertura") {
		detalle =
			metrica === 0
				? "¡Cero medios! No hubo repercusión."
				: metrica < 3
				? `Solo se encontraron ${metrica} menciones. Baja cobertura.`
				: `¡Excelente! Se alcanzó una amplia cobertura mediática con ${metrica} menciones.`;
	} else if (nombre === "duración") {
		detalle =
			metrica === 0
				? "Fue noticia de un solo día. No generó seguimiento."
				: metrica < 3
				? `El tema se mantuvo vigente por ${metrica} días.`
				: "¡Genial! El tema se mantuvo vigente por varios días.";
	} else if (nombre === "alcance") {
		detalle = `${formatter.format(
			metrica
		)} personas leyeron la noticia. El alcance fue ${estadoFinal}.`;
	} else if (nombre === "engagement") {
		// La metrica para engagement ya es el valor redondeado (engagementValue)
		if (metrica >= 20) {
			detalle = "Las interacciones fueron buenas en redes sociales.";
		} else if (metrica >= 10) {
			detalle =
				"Las interacciones son aceptables, pero aún hay margen de mejora.";
		} else {
			detalle = "Muy poco para un tema social importante.";
		}
	}

	return { color, texto, detalle };
}

/**
 * @param {object} data -
 */
export function renderMetricsDashboard(data) {
	document.getElementById("metrics-section").style.display = "grid";

	const engagementValue =
		data.engagement !== undefined ? Math.round(data.engagement / 5) : 0;

	const cobertura = getStatusDetails(
		data.estado_cobertura,
		data.cobertura_mediatica,
		"cobertura"
	);
	const alcance = getStatusDetails(
		data.estado_alcance,
		data.alcance_estimado,
		"alcance"
	);
	const duracion = getStatusDetails(
		data.estado_duracion,
		data.duracion_dias,
		"duración"
	);

	const engagement = getStatusDetails(null, engagementValue, "engagement");

	const colorIndicador = data.color_indicador || "rojo";
	const resultadoTexto = data.resultado_global
		? data.resultado_global.toUpperCase()
		: "N/A";

	const metricas = [
		{
			nombre: "Cobertura",
			valor: data.cobertura_mediatica,
			estado: cobertura.color,
			detalle: cobertura.detalle,
		},
		{
			nombre: "Alcance",
			valor: data.alcance_estimado,
			estado: alcance.color,
			detalle: alcance.detalle,
		},
		{
			nombre: "Duración",
			valor: data.duracion_dias,
			estado: duracion.color,
			detalle: duracion.detalle,
		},
		{
			nombre: "Engagement",
			valor: data.engagement,
			estado: engagement.color,
			detalle: engagement.detalle,
		},
	];

	const generarResumenAutomatico = (metricaArr, indicador) => {
		const malas = metricaArr.filter((m) => m.estado === "rojo");
		const buenas = metricaArr.filter((m) => m.estado === "verde");
		const regulares = metricaArr.filter((m) => m.estado === "amarillo");

		let resumen = "El rendimiento general es ";

		if (indicador === "rojo") {
			resumen += "preocupante. Se observa un desempeño crítico en ";
			const malosNombres = malas.map((m) => m.nombre);
			resumen +=
				malosNombres.length > 0
					? malosNombres.join(", ") + "."
					: "varias métricas clave.";
			if (regulares.length > 0) {
				resumen += ` Mantenemos un estado ${regulares[0].estado} en ${regulares[0].nombre}.`;
			}
		} else if (indicador === "verde") {
			resumen += "favorable. Destacan positivamente los resultados en ";
			const buenosNombres = buenas.map((m) => m.nombre);
			resumen +=
				buenosNombres.length > 0
					? buenosNombres.join(", ") + "."
					: "la mayoría de áreas.";
			if (malas.length > 0) {
				resumen += ` Sin embargo, es necesario revisar ${malas[0].nombre}.`;
			}
		} else {
			resumen += "mixto y aceptable. Las áreas de ";
			const regularesNombres = regulares.map((m) => m.nombre);
			resumen +=
				regularesNombres.length > 0
					? regularesNombres.join(", ") + " se mantienen estables."
					: "varias áreas se mantienen estables.";
			if (malas.length > 0) {
				resumen += ` Se debe prestar especial atención a ${malas[0].nombre}.`;
			}
		}

		return resumen;
	};

	const generarMejoraAutomatica = (metricaArr) => {
		const malas = metricaArr.filter((m) => m.estado === "rojo");
		if (malas.length > 0) {
			const peorMetrica = malas[0].nombre;
			return `Mejora enfocándote en la métrica de ${peorMetrica}. ${
				peorMetrica === "Engagement"
					? "Impulsa la interacción social."
					: peorMetrica === "Cobertura"
					? "Busca nuevos medios de contacto."
					: "Revisa la estrategia de contenido."
			}`;
		}
		return "Para mantener el impulso, evalúa la competencia y desarrolla contenido más profundo.";
	};

	const resumenGlobal =
		data.resumen_global || generarResumenAutomatico(metricas, colorIndicador);

	const mejoraGlobal = data.mejora_global || generarMejoraAutomatica(metricas);

	const coberturaCard = document.querySelector(".coverage-card");
	coberturaCard.className = `summary-card coverage-card bg-gray-800 p-5 rounded-xl shadow-md border-l-4 status-card-${cobertura.color}`;
	document.getElementById("cobertura-value").textContent = formatter.format(
		data.cobertura_mediatica
	);
	document.getElementById("cobertura-detalle").textContent = cobertura.detalle;
	document.getElementById("cobertura-estado").textContent = cobertura.texto;
	document.getElementById(
		"cobertura-estado"
	).className = `status status-${cobertura.color}`;

	const alcanceCard = document.querySelector(".reach-card");
	alcanceCard.className = `summary-card reach-card bg-gray-800 p-5 rounded-xl shadow-md border-l-4 status-card-${alcance.color}`;
	document.getElementById("alcance-value").textContent = formatter.format(
		data.alcance_estimado
	);
	document.getElementById("alcance-detalle").textContent = alcance.detalle;
	document.getElementById("alcance-estado").textContent = alcance.texto;
	document.getElementById(
		"alcance-estado"
	).className = `status status-${alcance.color}`;

	const duracionCard = document.querySelector(".duration-card");
	duracionCard.className = `summary-card duration-card bg-gray-800 p-5 rounded-xl shadow-md border-l-4 status-card-${duracion.color}`;
	document.getElementById("duracion-value").textContent = data.duracion_dias;
	document.getElementById("duracion-detalle").textContent = duracion.detalle;
	document.getElementById("duracion-estado").textContent = duracion.texto;
	document.getElementById(
		"duracion-estado"
	).className = `status status-${duracion.color}`;

	const engagementCard = document.querySelector(".engagement-card");
	engagementCard.className = `summary-card engagement-card bg-gray-800 p-5 rounded-xl shadow-md border-l-4 status-card-${engagement.color}`;
	document.getElementById("engagement-value").textContent =
		formatter.format(engagementValue);
	document.getElementById("engagement-detalle").textContent =
		engagement.detalle;
	document.getElementById("engagement-estado").textContent = engagement.texto;
	document.getElementById(
		"engagement-estado"
	).className = `status status-${engagement.color}`;

	const globalBox = document.getElementById("global-result-box");
	globalBox.className = `p-6 rounded-xl mt-10 mb-10 border-2 global-result-box-dynamic status-box-${colorIndicador}`;

	document.getElementById("global-result-title").innerHTML = `
        <span class="global-icon-color status-text-${colorIndicador}">
            ${
							colorIndicador === "verde"
								? "✅"
								: colorIndicador === "amarillo"
								? "⚠"
								: "❌"
						}
        </span>
        RESULTADO GLOBAL: 
        <span id="resultado-global" class="status status-${colorIndicador}">
            ${resultadoTexto}
        </span>
    `;

	document.getElementById("global-result-summary").textContent = resumenGlobal;
	const improvementSpan = document.getElementById("global-result-improvement");
	improvementSpan.textContent = mejoraGlobal;
	improvementSpan.className = `font-semibold status-text-${colorIndicador}`;

	renderNewsTable(data.noticias_filtradas || []);
}

/**
 * Renderiza el análisis de competencia e histórico (datos precalculados).
 * @param {object} comparisonMetrics
 */
export function renderComparisonResults(comparisonMetrics) {
	const container = document.getElementById("comparison-results");
	if (!container) return; // Asegurar que el contenedor existe

	const alcancePct = comparisonMetrics.alcance_vs_historico_porcentaje;
	const coberturaMenciones =
		comparisonMetrics.cobertura_vs_competencia_menciones;

	const isAlcancePositive = alcancePct >= 0;
	const alcanceColorClass = isAlcancePositive
		? "comparison-good"
		: "comparison-bad";
	const alcanceIcon = isAlcancePositive ? "↑" : "↓";
	const alcanceStatus = isAlcancePositive ? "MEJORA" : "DETERIORO";
	const alcanceText = isAlcancePositive
		? `El alcance es un ${Math.abs(
				alcancePct
		  )}% superior al promedio histórico.`
		: `El alcance es un ${Math.abs(
				alcancePct
		  )}% inferior al promedio histórico.`;

	const isCoberturaPositive = coberturaMenciones >= 0;
	const coberturaColorClass = isCoberturaPositive
		? "comparison-good"
		: "comparison-bad";
	const coberturaIcon = isCoberturaPositive ? "👍" : "👎";
	const coberturaStatus =
		coberturaMenciones > 0
			? "SUPERIOR"
			: coberturaMenciones === 0
			? "NEUTRO"
			: "INFERIOR";
	const coberturaText =
		coberturaMenciones === 0
			? `Se obtuvieron el mismo número de menciones que el competidor promedio.`
			: isCoberturaPositive
			? `Se obtuvieron ${coberturaMenciones} menciones más que el competidor promedio.`
			: `Se obtuvieron ${Math.abs(
					coberturaMenciones
			  )} menciones menos que el competidor promedio.`;

	container.innerHTML = `
        <div class="mt-8">
            <h3 class="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Análisis de Competencia e Histórico</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="comparison-card p-6 rounded-xl bg-gray-800 shadow-xl border-l-4 ${alcanceColorClass}">
                    <h4 class="text-lg font-semibold mb-2 text-white">Alcance vs. Histórico</h4>
                    <p class="text-gray-300 mb-4 text-sm">Rendimiento comparado con búsquedas pasadas de la organización.</p>
                    <div class="flex items-center justify-between">
                        <span class="text-5xl md:text-6xl font-extrabold flex items-center comparison-icon ${
													isAlcancePositive ? "text-green-400" : "text-red-400"
												}">
                            ${alcanceIcon} ${Math.abs(alcancePct)}%
                        </span>
                        <div class="text-right">
                            <span class="text-sm font-medium status status-${
															alcanceColorClass === "comparison-good"
																? "verde"
																: "rojo"
														}">${alcanceStatus}</span>
                            <p class="text-sm text-gray-400 mt-1 max-w-xs">${alcanceText}</p>
                        </div>
                    </div>
                </div>

                <div class="comparison-card p-6 rounded-xl bg-gray-800 shadow-xl border-l-4 ${coberturaColorClass}">
                    <h4 class="text-lg font-semibold mb-2 text-white">Cobertura vs. Competencia</h4>
                    <p class="text-gray-300 mb-4 text-sm">Menciones obtenidas en comparación con el promedio de la competencia.</p>
                    <div class="flex items-center justify-between">
                        <span class="text-5xl md:text-6xl font-extrabold flex items-center comparison-icon ${
													isCoberturaPositive
														? "text-green-400"
														: coberturaMenciones === 0
														? "text-yellow-400"
														: "text-red-400"
												}">
                            ${
															coberturaMenciones >= 0 ? "+" : ""
														}${coberturaMenciones} ${coberturaIcon}
                        </span>
                        <div class="text-right">
                            <span class="text-sm font-medium status status-${
															coberturaColorClass === "comparison-good"
																? "verde"
																: coberturaColorClass === "comparison-bad"
																? "rojo"
																: "amarillo"
														}">${coberturaStatus}</span>
                            <p class="text-sm text-gray-400 mt-1 max-w-xs">${coberturaText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	container.classList.remove("hidden");
}
