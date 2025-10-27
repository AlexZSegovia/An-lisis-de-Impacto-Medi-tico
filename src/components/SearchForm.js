/**
 * @param {function} onSearch -
 */
export function renderSearchForm(onSearch) {
	const container = document.getElementById("search-form-container");

	container.innerHTML = `
        <form id="search-form" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
                <!-- Campo Organización / Medio -->
                <div>
                    <label
                        for="organizacion-input"
                        class="block text-sm font-medium text-gray-300 mb-1">
                        Organización / Medio (Ej: 'TechCorp')
                    </label>
                    <input
                        type="text"
                        id="organizacion-input"
                        name="organizacion"
                        required
                        value="TripAdvisor"
                        placeholder="Escribe el nombre de la organización..."
                        class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                </div>
                
                <!-- Campo Tema a Buscar -->
                <div>
                    <label
                        for="tema-input"
                        class="block text-sm font-medium text-gray-300 mb-1">
                        Tema a Buscar (Ej: 'Lanzamiento de Producto')
                    </label>
                    <input
                        type="text"
                        id="tema-input"
                        name="tema"
                        required
                        value="Lanzarote Cycling"
                        placeholder="Escribe el tema de la noticia..."
                        class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                </div>
            </div>
            
            <!-- Botón de Búsqueda -->
            <div class="flex justify-center pt-2">
                <button
                    type="submit"
                    id="search-button"
                    class="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-lg shadow-md transition duration-200 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0V3h4v2m-4 0h4m-2 2v2m-2 0h4m-2 4v2m-2 0h4m-2 4v2m-2 0h4" />
                    </svg>
                    Analizar Cobertura
                </button>
            </div>
        </form>
    `;

	const form = document.getElementById("search-form");

	if (form) {
		form.addEventListener("submit", (e) => {
			e.preventDefault();

			const organizacion = document.getElementById("organizacion-input").value;
			const tema = document.getElementById("tema-input").value;

			onSearch(organizacion, tema);
		});
	}
}
