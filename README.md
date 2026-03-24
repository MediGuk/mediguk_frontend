# Mediguk Frontend

Interfaz principal del Portal de Pacientes (y panel médico) para Mediguk.

## 🛠️ Stack Tecnológico Actual

- **Framework:** React + TypeScript montado sobre el rapidísimo **Vite**.
- **Estilos:** Tailwind CSS v4 (última versión, sin configuración pesada, integrado directamente por CSS).
- **Manejo de Peticiones:** `@tanstack/react-query` para controlar la caché, los reintentos y el estado de carga (`loading`, `error`) de todas las llamadas HTTP.
- **Tipado de API (¡Importante!):** Utilizamos `openapi-typescript` para generar automáticamente todas nuestras interfaces de TypeScript leyendo directamente el esquema (Swagger/OpenAPI) del Backend en Java. Esto nos garantiza un tipado 100% estricto y sin errores manuales entre las peticiones. Script: `pnpm openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api.ts`

## 🚀 Cómo Empezar

1. Instalar dependencias con pnpm:

   ```bash
   pnpm install
   ```

2. Arrancar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
