# **⚙️ Documentación Técnica del Dashboard de Análisis de Impacto Mediático**

## **1\. Introducción**

Este documento describe la arquitectura técnica, la lógica de implementación y las convenciones de estilo del **Dashboard de Análisis de Impacto Mediático**. El objetivo es proporcionar una guía para desarrolladores sobre la estructura del código y los flujos de datos, incluyendo la nueva funcionalidad de **Comparación en Vivo**.

## **2\. Arquitectura de la Aplicación (Modularización Día 3\)**

La aplicación sigue una arquitectura **Front-end modularizada**, diseñada para desacoplar las responsabilidades de estado, renderizado principal y comunicación con la API.

| Módulo/Componente | Archivo de Referencia | Responsabilidad |
| :---- | :---- | :---- |
| **Métricas Principales** | src/components/MetricsDashboard.js | Aplica la lógica de negocio para la calificación (verde/amarillo/rojo) y manipula el DOM para inyectar valores y clases de estado en las métricas A. |
| **Comparación en Vivo** | src/components/LiveComparison.js | Contiene la lógica exclusiva para calcular la diferencia (**MEJOR/PEOR**) entre los análisis A y B, y renderizar sus tarjetas de comparación. |
| **Llamada a la API** | src/api/media-analysis.js | Contiene la función asíncrona que gestiona la solicitud HTTP al WebHook de N8N, incluyendo manejo de errores y códigos de respuesta. |
| **Estilos** | src/styles/main.css | Controla el diseño visual, incluyendo el Tema Oscuro Suave, la estructura y las reglas de color dinámicas. |

## **3\. Flujo de Datos y Mapeo de la Interfaz**

El flujo de trabajo comienza con la función getMediaAnalysis(organizacion, tema) en src/api/media-analysis.js, que realiza una solicitud POST al WebHook de N8N.

### **3.1. Implementación de la API (src/api/media-analysis.js)**

La función utiliza la siguiente URL como WebHook de N8N. Esta URL debe ser sustituida por el *endpoint* de producción en un entorno real.

const N8N\_WEBHOOK\_URL \= '\[\[https://alexzion1.app.n8n.cloud/webhook/5d9e655d-a5d2-4b05-accc-2fc803c682dd\](https://alexzion1.app.n8n.cloud/webhook/5d9e655d-a5d2-4b05-accc-2fc803c682dd)\]';

### **3.2. Estructura de Datos (JSON Esperado de N8N)**

El Front-end espera un objeto JSON (contenido en el primer índice del *array* devuelto por N8N) con las siguientes propiedades para llenar el dashboard y la sección de comparación:

| Propiedad | Tipo | Uso |
| :---- | :---- | :---- |
| cobertura\_mediatica | Number | Valor usado para la métrica de Cobertura (N° de menciones). |
| duracion\_dias | Number | Valor usado para la métrica de Duración. |
| alcance\_estimado | Number | Valor usado para la métrica de Alcance. |
| engagement | Number | Valor bruto usado para calcular el Engagement. |
| estado\_alcance | String | Estado de Alcance ('Excelente', 'Regular'). |
| color\_indicador | String | Estado global ('verde', 'amarillo', 'rojo'). |
| resultado\_global | String | Texto de la conclusión general. |
| news\_list | Array\<Object\> | Lista de noticias para la tabla inferior. |

### **3.3. Estructura del Código y Funciones Clave (Simulación de Módulos)**

A pesar de que la implementación reside en un único archivo (index.html), la lógica JavaScript simula la modularidad mediante las siguientes funciones principales:

| Función | Descripción | Dependencias |
| :---- | :---- | :---- |
| fetchData() | Simula la llamada a la API. Retorna una Promesa con la estructura JSON esperada (dashboardData). | dashboardData (Mock/Estructura de datos) |
| getStatusDetails(estado, metrica, nombre) | **Lógica central del dashboard.** Clasifica una métrica numérica/estado N8N en los estados: Bien (verde), Regular (amarillo), Malo (rojo). | Valores de umbral definidos internamente. |
| renderMetricsDashboard(data) | Dibuja las 4 tarjetas de métricas, el resumen global y el análisis de competencia, aplicando las clases de color dinámicamente. | getStatusDetails, renderNewsTable |
| renderNewsTable(noticias) | Dibuja la tabla inferior con las noticias filtradas. | N/A |

### **3.4. Lógica de Clasificación (getStatusDetails)**

Esta función es crítica para la aplicación de códigos de colores. Define las siguientes reglas:

| Métrica | Regla de Clasificación | Estado Retornado | Color |
| :---- | :---- | :---- | :---- |
| **Cobertura (menciones)** | \> 2 | Bien | Verde |
|  | 1-2 | Regular | Amarillo |
|  | 0 | Malo | Rojo |
| **Duración (días)** | \> 2 | Bien | Verde |
|  | 1-2 | Regular | Amarillo |
|  | 0 | Malo | Rojo |
| **Engagement (Valor)** | \> 19 (Valor/5) | Bien | Verde |
|  | 10-19 (Valor/5) | Regular | Amarillo |
|  | \< 10 (Valor/5) | Malo | Rojo |
| **Alcance (Estado N8N)** | Excelente o Bien | Bien | Verde |
|  | Regular | Regular | Amarillo |
|  | Otros | Malo | Rojo |

## **4\. Estructura del Objeto JSON Completo**

El objeto JSON esperado debe incluir todos los campos para el renderizado del dashboard principal y la sección de comparación:

{  
  "busqueda": "Nombre de la Campaña/Búsqueda",  
  "fecha": "DD/MM/AAAA",  
  "resultado\_global": "GLOBAL\_BIEN/REGULAR/MALO",  
  "color\_indicador": "verde/amarillo/rojo",  
  "cobertura\_mediatica": 5,  
  "estado\_cobertura": "Bien",  
  "alcance\_estimado": 125000,  
  "estado\_alcance": "Excelente",  
  "duracion\_dias": 3,  
  "estado\_duracion": "Bien",  
  "engagement": 150,  
  "resumen\_global": "...",  
  "mejora\_global": "...",  
  "comparison\_metrics": {  
    "alcance\_vs\_historico\_porcentaje": 15, // Métrica A vs. B  
    "cobertura\_vs\_competencia\_menciones": 2 // Métrica A vs. B  
  },  
  "noticias\_filtradas": \[  
    {  
      "titulo": "Título de la noticia",  
      "medio": "Nombre del Medio",  
      "fecha": "DD/MM/AAAA",  
      "alcance\_estimado": 3000,  
      "link": "https://..."  
    }  
  \]  
}

## **5\. Instrucciones de Despliegue y Configuración**

Dado que el proyecto es una aplicación de un solo archivo, el despliegue es trivial y altamente flexible.

* \#\# 🚀 Instalación y Ejecución  
  *   
  * Este es un proyecto puramente Front-end (HTML/CSS/JS). Para ejecutarlo:  
  *   
  * 1\.  Clona o descarga el repositorio.  
  * 2\.  Abre el archivo \`index.html\` en tu navegador web.  
  *   
  * \> \*\***Nota:**\*\* *Para que el dashboard funcione dinámicamente, debes simular o conectar una fuente de datos que envíe la estructura JSON esperada.(ya viene conectado uno)*  
  * 

