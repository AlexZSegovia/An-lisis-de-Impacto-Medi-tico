# **📰 Dashboard de Análisis de Impacto Mediático**

Este proyecto implementa un dashboard interactivo de **Front-end puro** (HTML, CSS, JavaScript) diseñado para analizar el impacto mediático de una campaña o un tema específico para una organización dada. El sistema consume datos a través de un WebHook externo (N8N) y presenta las métricas clave, las calificaciones de rendimiento y, crucialmente, permite la **Comparación en Vivo** de dos análisis.

## **✨ Características Principales**

* **Análisis de Métricas Clave:** Muestra de forma clara la Cobertura Mediática, el Alcance Estimado, la Duración de la Campaña y el Engagement calculado.  
* **Calificación Dinámica:** Las métricas principales se califican automáticamente (**Verde, Amarillo, Rojo**) basándose en umbrales de negocio predefinidos.  
* **Comparación en Vivo (A vs B):** Permite ejecutar una segunda búsqueda (B) y compararla métrica por métrica con el resultado principal (A), mostrando indicadores de **MEJOR/PEOR** y la diferencia numérica.  
* **Diseño Profesional:** Implementa un tema **Soft Dark Mode** (Modo Oscuro Suave) para una excelente usabilidad visual.  
* **Tabla de Resultados Detallada:** Lista las noticias que cumplen con los criterios de filtro.

## **📐 Arquitectura Técnica**

El dashboard opera bajo una arquitectura de tres capas conceptuales, gestionadas principalmente a través de un único archivo HTML con simulación de modularización JS.

| Capa | Archivos de Referencia | Función |
| :---- | :---- | :---- |
| **Presentación (UI)** | index.html, src/styles/main.css | Estructura de la UI y aplicación de estilos responsive y dinámicos (clases de estado de Tailwind). |
| **Lógica de Negocio y Presentación (JS)** | src/index.js, src/components/MetricsDashboard.js, src/components/LiveComparison.js | Captura de la entrada, gestión de estados (A y B), **cálculo de umbrales** (Verde/Amarillo/Rojo), y renderizado de todos los componentes. |
| **Capa de Datos (API/N8N)** | src/api/media-analysis.js | Se comunica con un WebHook de N8N para delegar la tarea pesada de *data mining* y cálculo de métricas complejas. |

## **🛠️ Configuración y Ejecución**

El proyecto depende de la correcta configuración de su WebHook de N8N como fuente de datos.

### **1\. Configuración del WebHook (N8N)**

El Front-end está configurado para llamar al WebHook de N8N con la siguiente estructura de *payload*:

#### **Endpoint de la API:**

// La URL de tu WebHook de N8N.  
const N8N\_WEBHOOK\_URL \= '\[\[https://alexzion1.app.n8n.cloud/webhook/5d9e655d-a5d2-4b05-accc-2fc803c682dd\](https://alexzion1.app.n8n.cloud/webhook/5d9e655d-a5d2-4b05-accc-2fc803c682dd)\]';

#### **Payload Requerido (JSON POST):**

El sistema envía la siguiente información para iniciar el análisis:

{  
  "tema": "El tema que se está buscando (ej: 'Lanzamiento de la Nueva Serie')",  
  "organizacion": "La organización de referencia (ej: 'Netflix')"  
}

#### **Respuesta Esperada:**

El WebHook de N8N debe devolver un JSON con la estructura del análisis, conteniendo las métricas clave, estados y la lista de noticias filtradas.

### **2\. Umbrales de Calificación**

La lógica de calificación (verde/amarillo/rojo) está actualmente *hardcodeada* en el módulo de presentación (MetricsDashboard.js conceptualmente).

| Métrica | Condición (Ejemplos Duros) | Estado Asignado |
| :---- | :---- | :---- |
| **Cobertura** | $\>= 3$ menciones | Verde |
| **Duración** | $\>= 3$ días en medios | Verde |
| **Alcance** | data.estado\_alcance \=== 'Excelente' (viene de la API) | Verde |

Cualquier ajuste a estos umbrales debe realizarse directamente en el código JavaScript de renderizado.

## **🔗 Módulos Clave**

| Módulo | Responsabilidad Principal | Notas |
| :---- | :---- | :---- |
| src/index.js | Controlador de Eventos y Gestión de Estado | Contiene los estados mainData y comparisonData. |
| src/components/MetricsDashboard.js | Renderizado y Calificación de la Búsqueda A | Se encarga de la inyección de valores en las tarjetas principales. |
| src/components/LiveComparison.js | Lógica de Comparación B vs A | Calcula las diferencias (**MEJOR/PEOR**) y renderiza las tarjetas de comparación dinámica. |
| src/api/media-analysis.js | Capa de Acceso a Datos | Solo contiene la función asíncrona getMediaAnalysis. |

## **🚀 Instalación y Ejecución**

Este es un proyecto puramente Front-end (HTML/CSS/JS). Para ejecutarlo:

1. Clona o descarga el repositorio.  
2. Abre el archivo index.html en tu navegador web.

**Nota:** Para que el dashboard funcione dinámicamente, debes simular o conectar una fuente de datos que envíe la estructura JSON esperada.

## **🎯 Lógica de Calificación (Umbrales Detallados)**

El componente que maneja la lógica de calificación implementa los siguientes umbrales para determinar el color de las tarjetas:

| Métrica | Regla | Estado y Color |
| :---- | :---- | :---- |
| **Cobertura** | Si $= 0$ medios | Malo (Rojo) |
|  | Si $= 1$ o $2$ medios | Regular (Amarillo) |
|  | Si $\\ge 3$ medios | Bien (Verde) |
| **Duración** | Si $= 0$ días | Malo (Rojo) |
|  | Si $= 1$ o $2$ días | Regular (Amarillo) |
|  | Si $\\ge 3$ días | Bien (Verde) |
| **Alcance** | Basado en el estado\_alcance de N8N | Bien (Verde) si es 'Excelente', Regular (Amarillo) si es 'Regular'. Otros son Rojo. |
| **Engagement** | Si Engagement Value $\< 10$ | Malo (Rojo) |
|  | Si Engagement Value $\\ge 20$ | Bien (Verde) |
|  | Otros | Regular (Amarillo) |
| **Resultado Global** | Basado en el color\_indicador de N8N | Verde, Amarillo o Rojo. |

