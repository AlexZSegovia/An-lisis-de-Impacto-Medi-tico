import { getMediaAnalysis } from "./api/media-analysis.js";
import { renderSearchForm } from "./components/SearchForm.js";
import { renderMetricsDashboard } from "./components/MetricsDashboard.js";
import { renderNewsTable } from "./components/NewsTable.js";

// Función principal que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", () => {
	renderSearchForm(handleSearch);

	document.getElementById("metrics-section").style.display = "none";
	document.getElementById("details-section").style.display = "none";
});

async function handleSearch(organizacion, tema) {
	const loadingIndicator = document.getElementById("loading-indicator");
	const searchButton = document.getElementById("search-button");

	if (!organizacion || !tema) return;

	loadingIndicator.style.display = "block";
	searchButton.disabled = true;

	const analisis = await getMediaAnalysis(organizacion, tema);

	loadingIndicator.style.display = "none";
	searchButton.disabled = false;

	if (analisis.error || analisis.cobertura_mediatica === 0) {
		const mensaje = analisis.error
			? analisis.mensaje
			: `Filtro Fallido: No se encontraron noticias para TEMA: '${organizacion}' y ORGANIZACIÓN: '${tema}'.`;

		alert(`¡Análisis Fallido! ${mensaje}`);

		document.getElementById("metrics-section").style.display = "none";
		document.getElementById("details-section").style.display = "none";
		return;
	}

	renderMetricsDashboard(analisis);
	renderNewsTable(analisis.noticias_filtradas);
}
