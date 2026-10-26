# ecora-api-tests

Pruebas funcionales automatizadas de la API de Ecora con **Jest** y **Axios**.

## Estructura
- `config/`  URL base y credenciales (leídas del `.env`)
- `clients/` cliente Axios común y funciones por servicio
- `helpers/` login y obtención de tokens
- `data/`    datos de prueba en JSON (ids, tokens falsos, valores)
- `tests/`   casos de prueba por área

## Preparación
1. `npm install`
2. Copia `.env.example` como `.env` y completa los correos y contraseñas (admin y cliente).
3. Levanta la API de Ecora (`npm start` en el proyecto de la API).
4. Revisa en `data/ordenes.data.json` que `productoExistente` sea el id de un producto real.

## Ejecución
- Todo: `npm test`
- Solo los casos OR-01 a OR-10: `npm run test:ordenes`
- Solo los extras de permisos y robustez: `npm run test:extras` (pueden fallar por defectos de la API)

## Notas
- La API valida el token en `msg` (middleware) y responde con `msj` en las rutas de órdenes.
- No existe `DELETE` de órdenes: las que crean las pruebas quedan en la base de datos.
- Crear una orden intenta enviar un correo con Resend; si falla, la orden igual se crea (201).
  Mantén en el `.env` de la API una clave de pruebas y no una real.
- No subir el `.env` a Git.
