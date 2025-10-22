/**
 * src/components/SearchForm.js
 * @param {function} onSearch - Callback a ejecutar cuando se presiona el botón de búsqueda.
 */
export function renderSearchForm(onSearch) {
	const container = document.getElementById("search-form-container");
	container.innerHTML = `
        <div class="input-group">
            <label for="organizacion-input">Organización:</label>
            <input type="text" id="organizacion-input" value="TripAdvisor" placeholder="Ej: TripAdvisor">
        </div>
        <div class="input-group">
            <label for="tema-input">Tema:</label>
            <input type="text" id="tema-input" value="Lanzarote Cycling" placeholder="Ej: Lanzarote Cycling">
        </div>
        <button id="search-button">Analizar Cobertura</button>
    `;

	document.getElementById("search-button").addEventListener("click", () => {
		const organizacion = document.getElementById("organizacion-input").value;
		const tema = document.getElementById("tema-input").value;
		onSearch(organizacion, tema);
	});
}
