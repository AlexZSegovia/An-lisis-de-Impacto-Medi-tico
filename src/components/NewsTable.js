const dateFormatter = new Intl.DateTimeFormat("es-ES", {
	year: "numeric",
	month: "short",
	day: "numeric",
});

/**
 * @param {Array<object>} noticias
 */
export function renderNewsTable(noticias) {
	const container = document.getElementById("news-details");
	if (!container) return;

	if (!noticias || noticias.length === 0) {
		container.innerHTML = `
            <div class="bg-gray-800/80 p-6 rounded-xl text-center text-gray-400 border border-gray-700 mt-8">
                <p class="font-semibold">No se encontraron noticias específicas para esta búsqueda.</p>
                <p class="text-sm mt-1">Revisa el filtro aplicado en la búsqueda de N8N.</p>
            </div>
        `;
		return;
	}

	const tableRows = noticias
		.map(
			(noticia, index) => `
        <!-- Fila de la noticia: Añadimos hover y un borde superior claro -->
        <tr class="transition duration-300 ease-in-out hover:bg-gray-700 border-t border-gray-700">
            <!-- Columna de número -->
            <td class="px-6 py-4 text-sm font-medium text-gray-400 align-top w-12">${
							index + 1
						}</td>
            
            <!-- Columna de Título y Extracto (Ancho flexible) -->
            <td class="px-6 py-4 align-top w-2/5">
                <div class="space-y-1">
                    <!-- Título con más peso visual (font-bold) -->
                    <div class="text-base font-bold text-white leading-snug">${
											noticia.Title || "Título no disponible"
										}</div>
                    <!-- Extracto -->
                    <div class="text-sm text-gray-300">${
											noticia.Snippet || "Sin extracto."
										}</div>
                     <!-- Fecha (opcional, si la necesitas, asumiendo que la tienes) -->
                    <div class="text-xs text-gray-500">${
											noticia.date
												? dateFormatter.format(new Date(noticia.date))
												: "N/A"
										}</div>
                </div>
            </td>
            
            <!-- Columna de Organización -->
            <td class="px-6 py-4 text-sm text-gray-300 align-top w-1/5">${
							noticia.QueryName_Organizacion || "N/A"
						}</td>

            <!-- Columna de Tema -->
            <td class="px-6 py-4 text-sm text-gray-300 align-top w-1/5">${
							noticia.Title_Tema || "N/A"
						}</td>
        </tr>
    `
		)
		.join("");

	// Estructura de la tabla completa
	const tableHTML = `
        <div class="mt-8 news-details-container">
            <!-- Título -->
            <h3 class="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Detalles de Cobertura (${noticias.length} Noticias)</h3>

            <!-- Contenedor de la tabla, con scroll si es necesario y bordes redondeados -->
            <div class="overflow-x-auto rounded-xl shadow-lg">
                <table class="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-xl">
                    <!-- Encabezado de la tabla, fijo en la parte superior para scroll -->
                    <thead class="bg-gray-900 sticky top-0">
                        <tr>
                            <!-- Aplicamos padding, alineación y estilo de texto a los encabezados -->
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-2/5">Título y Extracto</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/5">Organización</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/5">Tema</th>
                        </tr>
                    </thead>
                    <!-- Cuerpo de la tabla con las noticias -->
                    <tbody class="divide-y divide-gray-700">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

	container.innerHTML = tableHTML;
}
