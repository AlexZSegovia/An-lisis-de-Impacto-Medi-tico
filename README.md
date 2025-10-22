# 📊 Dashboard de Análisis de Impacto Mediático (Media Insight)

Este proyecto es una interfaz de usuario (Front-end) diseñada para visualizar el impacto y el rendimiento de notas de prensa, campañas o temas específicos en los medios de comunicación y plataformas digitales.

El dashboard está optimizado para la claridad y la toma de decisiones rápidas, utilizando un diseño profesional de **Tema Oscuro Suave (Soft Dark Mode)** para mejorar la ergonomía visual.

## ✨ Características Principales

- **Análisis Dinámico de Métricas:** Visualización en tiempo real de cuatro métricas clave (Cobertura, Alcance, Duración y Engagement).
- **Indicadores de Estado:** Las tarjetas y el resultado global cambian dinámicamente de color (Verde, Amarillo, Rojo) según umbrales de rendimiento predefinidos (gestionados por el Backend/N8N).
- **Diseño Profesional (Dark Theme):** Paleta de colores optimizada para fondos oscuros, proporcionando una experiencia visual relajante y enfocada, ideal para consultoría o canales de noticias.
- **Integración con Backend (N8N):** Diseñado para consumir datos de un _workflow_ de N8N o cualquier API que devuelva los datos en formato JSON estructurado.
- **Detalle de Noticias:** Tabla interactiva para visualizar las fuentes y artículos específicos que contribuyen a las métricas.

## ⚙️ Estructura del Proyecto

El proyecto está compuesto por los siguientes archivos clave:

| Archivo                              | Descripción                                                                                                                                                                                                                          |
| :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                         | Estructura principal de la aplicación. Contiene los contenedores para el formulario, el dashboard y la tabla de resultados.                                                                                                          |
| `src/components/MetricsDashboard.js` | **Lógica central del Front-end.** Contiene las funciones para inyectar datos en el DOM, aplicar la lógica de calificación (Verde/Amarillo/Rojo) a las tarjetas individuales y al resultado global, y manejar los detalles textuales. |
| `src/styles/main.css`                | **Estilos y Diseño (Soft Dark Theme).** Define la paleta de colores, la tipografía y todo el look & feel del dashboard, incluyendo los estilos dinámicos de las tarjetas y el mensaje de carga.                                      |
| `[Tu archivo JS principal]`          | (Asumido) Archivo que maneja la interacción del formulario (`#search-button`), la llamada a la API (simulada) y el control del estado de carga (`#loading-message`).                                                                 |

## 🚀 Instalación y Ejecución

Este es un proyecto puramente Front-end (HTML/CSS/JS). Para ejecutarlo:

1.  Clona o descarga el repositorio.
2.  Abre el archivo `index.html` en tu navegador web.

> **Nota:** Para que el dashboard funcione dinámicamente, debes simular o conectar una fuente de datos que envíe la estructura JSON esperada.

## 🎯 Lógica de Calificación (Umbrales)

El componente `MetricsDashboard.js` implementa los siguientes umbrales para determinar el color de las tarjetas:

| Métrica              | Regla                                 | Estado y Color                                                      |
| :------------------- | :------------------------------------ | :------------------------------------------------------------------ |
| **Cobertura**        | Si = 0 medios                         | Malo (Rojo)                                                         |
|                      | Si = 1 o 2 medios                     | Regular (Amarillo)                                                  |
|                      | Si >= 3 medios                        | Bien (Verde)                                                        |
| **Duración**         | Si = 0 días                           | Malo (Rojo)                                                         |
|                      | Si = 1 o 2 días                       | Regular (Amarillo)                                                  |
|                      | Si >= 3 días                          | Bien (Verde)                                                        |
| **Alcance**          | Basado en el `estado_alcance` de N8N  | Bien (Verde) si es 'Excelente', Regular (Amarillo) si es 'Regular'. |
| **Engagement**       | Si Engagement Value < 10              | Malo (Rojo)                                                         |
|                      | Si Engagement Value >= 20             | Bien (Verde)                                                        |
| **Resultado Global** | Basado en el `color_indicador` de N8N | Verde, Amarillo o Rojo.                                             |
