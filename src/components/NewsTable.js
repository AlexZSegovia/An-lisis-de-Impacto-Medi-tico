/**
 * @param {Array<object>} noticias -
 */
export function renderNewsTable(noticias) {
	const tableSection = document.getElementById("details-section");
	const tbody = document.getElementById("news-table").querySelector("tbody");
	const count = document.getElementById("noticias-count");

	tableSection.style.display = "block";
	tbody.innerHTML = "";
	count.textContent = noticias.length;

	if (noticias.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="3">No se encontraron noticias con los filtros aplicados.</td></tr>';
		return;
	}

	noticias.forEach((nota) => {
		const row = document.createElement("tr");
		row.innerHTML = `
            <td>${nota.Title || "N/A"}</td>
            <td>${nota.Snippet || "No disponible"}</td>
            <td>${nota.QueryName_Organizacion || "N/A"}</td>
        `;
		tbody.appendChild(row);
	});
}
