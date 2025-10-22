/**
 * src/components/MetricsDashboard.js
 * * Renderiza el dashboard de métricas y el bloque de resultado global, con lógica actualizada.
 * @param {object} data - El objeto de respuesta de N8N (con métricas y estados).
 */
export function renderMetricsDashboard(data) {
	document.getElementById("metrics-section").style.display = "block";

	const formatter = new Intl.NumberFormat("es-ES");

	// ===========================================
	// 1. Lógica y Detalles (CORRECCIÓN DE ALCANCE Y LÓGICA ANTERIOR)
	// ===========================================

	// --- Cobertura (¿Salió en medios?) --- (Lógica de 0, 1-2, >3)
	let coberturaDetalle, color_cobertura, estado_cobertura_texto;

	if (data.cobertura_mediatica === 0) {
		color_cobertura = "rojo";
		estado_cobertura_texto = "❌ Malo";
		coberturaDetalle = "¡Cero medios! No hubo repercusión.";
	} else if (data.cobertura_mediatica === 1 || data.cobertura_mediatica === 2) {
		color_cobertura = "amarillo";
		estado_cobertura_texto = "⚠ Regular";
		coberturaDetalle = `Solo se encontraron ${data.cobertura_mediatica} menciones. Baja cobertura.`;
	} else {
		// Más de 3
		color_cobertura = "verde";
		estado_cobertura_texto = "✅ Bien";
		coberturaDetalle = "¡Excelente! Se alcanzó una amplia cobertura mediática.";
	}

	// --- Duración (¿Duró en medios?) --- (Lógica de 0, 1-2, >3)
	let duracionDetalle, color_duracion, estado_duracion_texto;

	if (data.duracion_dias === 0) {
		color_duracion = "rojo";
		estado_duracion_texto = "❌ Malo";
		duracionDetalle = "Fue noticia de un solo día. No generó seguimiento.";
	} else if (data.duracion_dias === 1 || data.duracion_dias === 2) {
		color_duracion = "amarillo";
		estado_duracion_texto = "⚠ Regular";
		duracionDetalle = `El tema se mantuvo vigente por ${data.duracion_dias} días.`;
	} else {
		// Más de 3 días
		color_duracion = "verde";
		estado_duracion_texto = "✅ Bien";
		duracionDetalle = "¡Genial! El tema se mantuvo vigente por varios días.";
	}

	// --- Alcance (¿La gente se enteró?) --- (NUEVA LÓGICA BASADA EN data.estado_alcance)
	let alcanceDetalle, color_alcance, estado_alcance_texto;

	// Usaremos el estado que viene del backend ('Excelente' o 'Regular') para definir el color
	if (data.estado_alcance === "Excelente") {
		color_alcance = "verde";
		estado_alcance_texto = "✅ Bien";
		alcanceDetalle = `${formatter.format(
			data.alcance_estimado
		)} personas leyeron la noticia. ¡Gran alcance!`;
	} else {
		// Asumimos que cualquier otro estado (ej. 'Regular' o 'Bajo') es amarillo o rojo
		// Si el estado es 'Regular', debe ser AMARILLO (como en la imagen que enviaste)
		color_alcance = "amarillo";
		estado_alcance_texto = "⚠ Regular";
		alcanceDetalle = `${formatter.format(
			data.alcance_estimado
		)} personas leyeron la noticia. El alcance fue regular, podría haber llegado a más gente.`;
	}

	// --- Engagement (¿Se compartió?) --- (Lógica de simulación anterior)
	let engagementValue = Math.round(data.engagement / 5);
	const color_engagement = engagementValue >= 20 ? "verde" : "rojo";
	const estado_engagement_texto = engagementValue >= 20 ? "✅ Bien" : "❌ Malo";
	let engagementDetalle = "Las interacciones fueron buenas en redes sociales.";
	if (engagementValue < 10)
		engagementDetalle = "Muy poco para un tema social importante.";

	// --- Resultado Global (Se mantiene la lógica de N8N) ---
	const colorIndicador = data.color_indicador;
	const resultadoTexto = data.resultado_global.toUpperCase();
	let resumenGlobal =
		"Tu nota tuvo buena cobertura en medios tradicionales y se mantuvo varios días en la agenda mediática.";
	let mejoraGlobal =
		'Añadir fotos y hacer la nota más "compatible" en redes sociales.';

	// ===========================================
	// 2. Renderizado de Tarjetas de Métricas
	// ===========================================

	// --- Cobertura (1) ---
	const coberturaCard = document.querySelector(".coverage-card");
	coberturaCard.className = `summary-card coverage-card status-card-${color_cobertura}`;
	document.getElementById("cobertura-value").textContent = formatter.format(
		data.cobertura_mediatica
	);
	document.getElementById("cobertura-detalle").textContent = coberturaDetalle;
	document.getElementById("cobertura-estado").textContent =
		estado_cobertura_texto;
	document.getElementById(
		"cobertura-estado"
	).className = `status status-${color_cobertura}`;

	// --- Alcance (2) ---
	const alcanceCard = document.querySelector(".reach-card");
	alcanceCard.className = `summary-card reach-card status-card-${color_alcance}`;
	document.getElementById("alcance-value").textContent = formatter.format(
		data.alcance_estimado
	);
	document.getElementById("alcance-detalle").textContent = alcanceDetalle;
	document.getElementById("alcance-estado").textContent = estado_alcance_texto;
	document.getElementById(
		"alcance-estado"
	).className = `status status-${color_alcance}`; // AHORA ES DINÁMICO

	// --- Duración (3) ---
	const duracionCard = document.querySelector(".duration-card");
	duracionCard.className = `summary-card duration-card status-card-${color_duracion}`;
	document.getElementById("duracion-value").textContent = data.duracion_dias;
	document.getElementById("duracion-detalle").textContent = duracionDetalle;
	document.getElementById("duracion-estado").textContent =
		estado_duracion_texto;
	document.getElementById(
		"duracion-estado"
	).className = `status status-${color_duracion}`;

	// --- Engagement (4) ---
	const engagementCard = document.querySelector(".engagement-card");
	engagementCard.className = `summary-card engagement-card status-card-${color_engagement}`;
	document.getElementById("engagement-value").textContent =
		formatter.format(engagementValue);
	document.getElementById("engagement-detalle").textContent = engagementDetalle;
	document.getElementById("engagement-estado").textContent =
		estado_engagement_texto;
	document.getElementById(
		"engagement-estado"
	).className = `status status-${color_engagement}`;

	// ===========================================
	// 3. Renderizado del Resultado Global (Se mantiene igual)
	// ===========================================

	const globalBox = document.getElementById("global-result-box");
	globalBox.className = `global-result-box-dynamic status-box-${colorIndicador}`;

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
	improvementSpan.className = `for-improvement status-text-${colorIndicador}`;
}
