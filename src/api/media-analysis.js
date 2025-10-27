const N8N_WEBHOOK_URL =
	"https://alexzion1.app.n8n.cloud/webhook/5d9e655d-a5d2-4b05-accc-2fc803c682dd";

/**
 * @param {string} tema
 * @param {string} organizacion
 * @returns {Promise<Array<object>>}
 */
export async function getMediaAnalysis(tema, organizacion) {
	if (!tema || !organizacion) {
		throw new Error(
			"Tanto el tema como la organización son campos obligatorios."
		);
	}

	try {
		const response = await fetch(N8N_WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tema: tema,
				organizacion: organizacion,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Error en la respuesta de N8N (Código ${
					response.status
				}): ${errorText.substring(0, 100)}...`
			);
		}

		return await response.json();
	} catch (error) {
		console.error("Error en la función getMediaAnalysis:", error);
		throw new Error(`Fallo en la comunicación con la API: ${error.message}`);
	}
}
