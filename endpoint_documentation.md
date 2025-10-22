# API Endpoint - Google Sheets Data

## Información Básica

**URL Base:** `https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec`

**Método:** `GET`

**Tipo de Respuesta:** `application/json`

---

## Endpoints Disponibles

### 1. Test de Conectividad
**Propósito:** Verificar que el endpoint está funcionando y puede acceder a la hoja de cálculo

**Parámetros:**
- `action=test`

**Ejemplo:**
```bash
curl -G "https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec" \
  --data-urlencode "action=test"
```

**Respuesta esperada:**
```json
{
  "status": 200,
  "timestamp": "2025-01-XX...",
  "status": "OK",
  "message": "Endpoint funcionando correctamente",
  "sheetInfo": {
    "name": "Sheet0",
    "lastRow": 150,
    "lastColumn": 25
  },
  "headersCount": 25,
  "sampleRowsCount": 3,
  "firstFewHeaders": ["Header1", "Header2", "..."]
}
```

### 2. Obtener Datos
**Propósito:** Recuperar registros de la hoja de cálculo

**Parámetros:**
- `action=getData` (requerido)
- `limit=XX` (opcional, por defecto: 10, máximo: 50)

**Ejemplo:**
```bash
curl -G "https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec" \
  --data-urlencode "action=getData" \
  --data-urlencode "limit=50"
```

**Respuesta esperada:**
```json
{
  "status": 200,
  "timestamp": "2025-01-XX...",
  "data": [
    {
      "_rowIndex": 8,
      "Header1": "valor1",
      "Header2": "valor2",
      "...": "..."
    },
    {
      "_rowIndex": 9,
      "Header1": "valor1",
      "Header2": "valor2",
      "...": "..."
    }
  ],
  "count": 50,
  "debug": {
    "sheetName": "Sheet0",
    "lastRow": 150,
    "lastColumn": 25
  }
}
```

---

## Estructura de la Hoja de Cálculo

- **Hoja utilizada:** `Sheet0`
- **Fila de headers:** Fila 7
- **Datos:** Desde la fila 8 en adelante
- **Campo especial:** `_rowIndex` indica la fila original en la hoja

---

## Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| `200`  | Éxito - Datos devueltos correctamente |
| `400`  | Error de parámetros - Acción no válida |
| `500`  | Error del servidor - Problema con la hoja o script |
| `501`  | No implementado - Función temporalmente deshabilitada |

---

## Manejo de Errores

**Respuesta de error típica:**
```json
{
  "status": 500,
  "timestamp": "2025-01-XX...",
  "error": "Descripción del error",
  "details": "Información adicional del error"
}
```

**Errores comunes:**
- **"No se pudo acceder a la hoja"**: La hoja `Sheet0` no existe o no es accesible
- **"Error de conexión a la hoja"**: Problemas de permisos o estructura de la hoja
- **"La hoja tiene muy pocas filas"**: La hoja no tiene suficientes datos (menos de 8 filas)

---

## Limitaciones Actuales

- **Máximo de registros por request:** 50
- **Solo lectura:** No soporta escritura o modificación
- **Hoja fija:** Solo lee de `Sheet0`
- **Funciones deshabilitadas:** `search`, `getById`, `getStats` están temporalmente deshabilitadas

---

## Uso en N8N

**Configuración del nodo HTTP Request:**
- **Method:** GET
- **URL:** `https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec`
- **Query Parameters:**
  - `action`: `getData`
  - `limit`: `50` (o el número deseado)

**Headers (opcionales):**
- `Accept`: `application/json`

---

## Ejemplos de Uso

### Browser (URL directa)
```
https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec?action=getData&limit=10
```

### JavaScript (fetch)
```javascript
const response = await fetch(
  'https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec?action=getData&limit=50'
);
const data = await response.json();
```

### Python (requests)
```python
import requests

response = requests.get(
    'https://script.google.com/macros/s/AKfycbyPP_fxSfu6vajpZG_0VNVggSA0eIoW38kSCG1a2zA5UlB9dsNoQn8gGf1UZ9l8oMIQJg/exec',
    params={
        'action': 'getData',
        'limit': 50
    }
)
data = response.json()
```

---

## Notas Importantes

1. **Sin autenticación:** El endpoint es público pero solo permite lectura
2. **CORS:** Habilitado para requests desde cualquier origen
3. **Rate Limiting:** Sujeto a las limitaciones de Google Apps Script
4. **Cache:** Las respuestas no están cacheadas, siempre devuelve datos actuales
5. **Timezone:** Los timestamps están en ISO 8601 UTC

---

## Troubleshooting

**Si obtienes HTML en lugar de JSON:**
- Verifica que la URL esté correcta
- Asegúrate de que el script esté desplegado correctamente
- Revisa que los parámetros estén bien codificados

**Si obtienes error 500:**
- Usa primero `action=test` para diagnosticar
- Verifica que la hoja `Sheet0` exista y tenga datos
- Revisa los logs en Google Apps Script