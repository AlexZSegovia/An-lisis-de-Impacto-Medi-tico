const formatter = new Intl.NumberFormat("es-ES");

/**
 * @param {{title: string, mainValue: number, comparisonValue: number, unit: string, formatter: Intl.NumberFormat}} config
 * @returns {string}
 */
function createLiveComparisonCard({
	title,
	mainValue,
	comparisonValue,
	unit,
	formatter,
}) {
	const isEngagement = title.includes("Engagement");

	const valA = mainValue || 0;
	const valB = comparisonValue || 0;

	const diff = valB - valA;
	const diffAbs = Math.abs(diff);

	let status;
	let icon;
	let colorClass;
	let iconColorClass;

	if (diff > 0) {
		status = "MEJOR (B)";
		icon = "↑";
		colorClass = "comparison-good";
		iconColorClass = "text-green-400";
	} else if (diff < 0) {
		status = "PEOR (B)";
		icon = "↓";
		colorClass = "comparison-bad";
		iconColorClass = "text-red-400";
	} else {
		status = "IGUAL (A=B)";
		icon = "=";
		colorClass = "comparison-neutral";
		iconColorClass = "text-yellow-400";
	}

	const diffTextFormatted =
		diff === 0 ? "Sin diferencia" : `${formatter.format(diffAbs)}`;

	const displayValueA = isEngagement
		? `${formatter.format(Math.round(valA / 5))}%`
		: formatter.format(valA);
	const displayValueB = isEngagement
		? `${formatter.format(Math.round(valB / 5))}%`
		: formatter.format(valB);

	const statusClass =
		diff > 0 ? "status-verde" : diff < 0 ? "status-rojo" : "status-amarillo";

	return `
        <div class="comparison-card p-6 rounded-xl bg-gray-800 shadow-xl border-l-4 ${colorClass}">
            <h4 class="text-lg font-semibold mb-2 text-white">${title}</h4>
            <p class="text-gray-300 mb-4 text-sm">Búsqueda A vs. Búsqueda B</p>
            
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="text-center md:text-left mb-4 md:mb-0">
                    <p class="text-sm font-light text-gray-400">Resultado A:</p>
                    <span class="text-xl font-bold text-white">${displayValueA} ${unit}</span>
                    <p class="text-sm font-light text-gray-400 mt-2">Resultado B:</p>
                    <span class="text-xl font-bold text-white">${displayValueB} ${unit}</span>
                </div>

                <div class="text-center">
                    <span class="text-4xl md:text-5xl font-extrabold flex items-center justify-center comparison-icon ${iconColorClass} whitespace-nowrap">
                        ${icon} ${diffTextFormatted} <span class="text-xl ml-1">${unit}</span>
                    </span>
                    <span class="text-sm font-medium status ${statusClass} mt-2 inline-block">${status}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * @param {object} mainData
 * @param {object} comparisonData
 */
export function renderLiveComparison(mainData, comparisonData) {
	const container = document.getElementById("live-comparison-results");
	if (!container) return;

	if (!mainData) {
		container.innerHTML = `
            <div class="p-4 bg-gray-800/20 border border-gray-700 rounded-xl text-center mt-4 text-gray-400">
                Realiza la búsqueda principal primero para activar la comparación.
            </div>
         `;
		return;
	}
	if (!comparisonData) {
		container.innerHTML = `
            <div class="p-4 bg-gray-800/20 border border-gray-700 rounded-xl text-center mt-4 text-gray-400">
                Inicia una búsqueda de comparación para ver el análisis detallado.
            </div>
         `;
		return;
	}

	const engagementFormatter = new Intl.NumberFormat("es-ES", {
		maximumFractionDigits: 0,
	});

	const metrics = [
		{
			title: "Cobertura (Menciones)",
			unit: "Menciones",
			mainValue: mainData.cobertura_mediatica || 0,
			comparisonValue: comparisonData.cobertura_mediatica || 0,
			formatter: formatter,
		},
		{
			title: "Alcance Estimado",
			unit: "Personas",
			mainValue: mainData.alcance_estimado || 0,
			comparisonValue: comparisonData.alcance_estimado || 0,
			formatter: formatter,
		},
		{
			title: "Duración (Días)",
			unit: "Días",
			mainValue: mainData.duracion_dias || 0,
			comparisonValue: comparisonData.duracion_dias || 0,
			formatter: formatter,
		},
		{
			title: "Engagement (Interacciones/5)",
			unit: "%",
			mainValue: mainData.engagement || 0,
			comparisonValue: comparisonData.engagement || 0,
			formatter: engagementFormatter,
		},
	];

	const htmlCards = metrics
		.map((config) => createLiveComparisonCard({ ...config }))
		.join("");

	const titleA = `${mainData.organizacion || "Organización A"} / ${
		mainData.tema || "Tema A"
	}`;
	const titleB = `${comparisonData.organizacion || "Organización B"} / ${
		comparisonData.tema || "Tema B"
	}`;

	container.innerHTML = `
        <div class="mt-8">
            <h3 class="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">
                Comparación Detallada (A: ${titleA} vs. B: ${titleB})
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
                ${htmlCards}
            </div>
        </div>
    `;
}
