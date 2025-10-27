import {
	renderMetricsDashboard,
	renderComparisonResults,
} from "./components/MetricsDashboard.js";

import { renderLiveComparison } from "./components/LiveComparison.js";

import { getMediaAnalysis } from "./api/media-analysis.js";

const searchForm = document.getElementById("search-form");
const loadingIndicator = document.getElementById("loading-indicator");
const dashboardContent = document.getElementById("dashboard-content");

const toggleComparisonBtn = document.getElementById("toggle-comparison-btn");
const comparisonResultsContainer =
	document.getElementById("comparison-results");

const comparisonSearchForm = document.getElementById("comparison-search-form");
const liveComparisonResultsContainer = document.getElementById(
	"live-comparison-results"
);
const comparisonLoadingIndicator = document.getElementById(
	"comparison-loading-indicator"
);

let mainData = null;
let comparisonData = null;

/**
 * @param {boolean} show
 */
const showLoading = (show) => {
	loadingIndicator.classList.toggle("hidden", !show);
};

/**
 * @param {boolean} show
 */
const showComparisonLoading = (show) => {
	if (comparisonLoadingIndicator) {
		comparisonLoadingIndicator.classList.toggle("hidden", !show);
	}
};

/**
 * @param {boolean} show
 */
const toggleHistoricalComparison = (show) => {
	comparisonResultsContainer.classList.toggle("hidden", !show);
	if (show) {
		toggleComparisonBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
            </svg>
            Ocultar Competencia/Histórico
        `;
	} else {
		toggleComparisonBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 3a1 1 0 011-1h2a1 1 0 011 1v13a1 1 0 01-1 1h-2a1 1 0 01-1-1V3z"/>
            </svg>
            Mostrar Competencia/Histórico
        `;
	}
};

searchForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const tema = document.getElementById("tema").value.trim();
	const organizacion = document.getElementById("organizacion").value.trim();

	if (!tema || !organizacion) {
		if (dashboardContent) {
			dashboardContent.innerHTML = `
                <div class="p-4 bg-yellow-800/20 border border-yellow-600 rounded-xl text-center mt-4 text-yellow-300">
                    Por favor, introduce tanto el tema como la organización.
                </div>
            `;
			dashboardContent.classList.remove("hidden");
		}
		return;
	}

	showLoading(true);
	dashboardContent.classList.add("hidden");
	toggleHistoricalComparison(false);
	liveComparisonResultsContainer.innerHTML = "";

	try {
		const apiResponse = await getMediaAnalysis(tema, organizacion);

		const metricsObject =
			Array.isArray(apiResponse) && apiResponse.length > 0
				? apiResponse[0]
				: {};

		if (Object.keys(metricsObject).length === 0 || metricsObject.error) {
			throw new Error(
				metricsObject.error || "La API devolvió una respuesta vacía o inválida."
			);
		}

		mainData = metricsObject;
		mainData.tema = tema;
		mainData.organizacion = organizacion;

		renderMetricsDashboard(mainData);
		dashboardContent.classList.remove("hidden");

		const hasHistoricalMetrics =
			mainData.comparison_metrics &&
			Object.keys(mainData.comparison_metrics).length > 0;

		toggleComparisonBtn.classList.toggle("hidden", !hasHistoricalMetrics);

		if (hasHistoricalMetrics) {
			renderComparisonResults(mainData.comparison_metrics);
			comparisonResultsContainer.classList.remove("hidden");
		} else {
			comparisonResultsContainer.classList.add("hidden");
		}

		renderLiveComparison(mainData, comparisonData);
	} catch (error) {
		console.error("Error al obtener datos principales:", error);

		if (dashboardContent) {
			dashboardContent.innerHTML = `
                <div class="p-8 bg-red-800/20 border border-red-600 rounded-xl text-center mt-10">
                    <h2 class="text-2xl font-bold text-red-400">Error en el Análisis Principal</h2>
                    <p class="text-red-300 mt-2">No se pudo procesar la solicitud de análisis.</p>
                    <p class="text-red-300 mt-1 text-sm">Detalles técnicos: ${error.message}</p>
                </div>
            `;
			dashboardContent.classList.remove("hidden");
		}
	} finally {
		showLoading(false);
	}
});

if (comparisonSearchForm) {
	comparisonSearchForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		comparisonData = null;

		if (!mainData) {
			if (liveComparisonResultsContainer) {
				liveComparisonResultsContainer.innerHTML = `
                    <div class="p-4 bg-yellow-800/20 border border-yellow-600 rounded-xl text-center mt-4 text-yellow-300">
                        ¡Advertencia! Primero realiza una búsqueda principal para poder comparar.
                    </div>
                `;
			}
			return;
		}

		const temaComp = document.getElementById("tema-comparacion")?.value.trim();
		const organizacionComp = document
			.getElementById("organizacion-comparacion")
			?.value.trim();

		if (!temaComp || !organizacionComp) {
			if (liveComparisonResultsContainer) {
				liveComparisonResultsContainer.innerHTML = `
                    <div class="p-4 bg-yellow-800/20 border border-yellow-600 rounded-xl text-center mt-4 text-yellow-300">
                        Por favor, ingresa tema y organización para la comparación.
                    </div>
                `;
			}
			return;
		}

		showComparisonLoading(true);
		liveComparisonResultsContainer.innerHTML = "";

		try {
			const apiResponse = await getMediaAnalysis(temaComp, organizacionComp);

			const metricsObject =
				Array.isArray(apiResponse) && apiResponse.length > 0
					? apiResponse[0]
					: {};

			if (Object.keys(metricsObject).length === 0 || metricsObject.error) {
				if (
					metricsObject.error &&
					metricsObject.error.includes("FILTRO FALLIDO: Cobertura 0")
				) {
					throw new Error(`FILTRO_CERO_COBERTURA|${metricsObject.error}`);
				}

				throw new Error(
					metricsObject.error ||
						"La API devolvió una respuesta vacía o inválida para la comparación."
				);
			}

			comparisonData = metricsObject;
			comparisonData.tema = temaComp;
			comparisonData.organizacion = organizacionComp;

			renderLiveComparison(mainData, comparisonData);
		} catch (error) {
			console.error("Error al obtener datos de comparación:", error);

			if (error.message.startsWith("FILTRO_CERO_COBERTURA|")) {
				const detailedMessage = error.message.replace(
					"FILTRO_CERO_COBERTURA|",
					""
				);
				if (liveComparisonResultsContainer) {
					liveComparisonResultsContainer.innerHTML = `
                       <div class="p-8 bg-yellow-800/20 border border-yellow-600 rounded-xl text-center mt-10">
                           <h2 class="text-2xl font-bold text-yellow-400">Resultado de la Búsqueda B: Sin Cobertura</h2>
                           <p class="text-yellow-300 mt-2">La búsqueda para **"${temaComp}"** y **"${organizacionComp}"** no arrojó resultados válidos de cobertura mediática. El filtro de análisis falló.</p>
                           <p class="text-yellow-300 mt-1 text-sm">Detalles: ${detailedMessage}</p>
                           <p class="text-yellow-300 mt-3 text-sm font-semibold">Intenta con términos más generales o asegúrate de que haya habido publicaciones recientes.</p>
                       </div>
                   `;
				}
			} else {
				if (liveComparisonResultsContainer) {
					liveComparisonResultsContainer.innerHTML = `
                        <div class="p-8 bg-red-800/20 border border-red-600 rounded-xl text-center mt-10">
                            <h2 class="text-2xl font-bold text-red-400">Error en la Comparación</h2>
                            <p class="text-red-300 mt-2">No se pudo procesar la solicitud de comparación.</p>
                            <p class="text-red-300 mt-1 text-sm">Detalles técnicos: ${error.message}</p>
                        </div>
                    `;
				}
			}
			comparisonData = null;
		} finally {
			showComparisonLoading(false);
		}
	});
}

toggleComparisonBtn.addEventListener("click", () => {
	if (mainData && mainData.comparison_metrics) {
		const isHidden = comparisonResultsContainer.classList.contains("hidden");
		toggleHistoricalComparison(isHidden);
	}
});

document.addEventListener("DOMContentLoaded", () => {
	toggleComparisonBtn.classList.add("hidden");

	renderLiveComparison(null, null);
});
