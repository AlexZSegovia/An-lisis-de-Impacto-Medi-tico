/**
 * @param {string} organizacion - El nombre de la organización a buscar.
 * @param {string} tema - El tema de la cobertura a buscar.
 * @returns {object} El primer objeto de la respuesta de N8N con métricas y detalles.
 */
export async function getMediaAnalysis(organizacion, tema) {
	const webhookUrl =
		"https://alexzion1.app.n8n.cloud/webhook/5d9e655d-a5d2-4b05-accc-2fc803c682dd";

	const body = { organizacion, tema };

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error(
				`Error HTTP: ${response.status} - ${response.statusText}`
			);
		}

		const data = await response.json();

		return data[0];
	} catch (error) {
		console.error("Fallo en la llamada al Webhook:", error);
		return {
			error: true,
			mensaje: error.message || "Error desconocido al contactar el servicio.",
		};
	}
}
