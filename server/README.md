# Server — Autenticación (JWT) y endpoints

Cómo probar el backend localmente y con Postman.

Requisitos previos

- Node.js 18+ y npm
- MongoDB local o un URI de MongoDB Atlas

1) Instalar dependencias

```bash
cd server
npm ci
```

2) Crear `.env`

```bash
cp .env.example .env
# editar .env con tus valores
code .env
```

3) Levantar el servidor

```bash
npm start
# o en modo desarrollo
npm run dev
```

Endpoints principales (ejemplos para Postman)

Base URL (local): http://localhost:3000

1) Registro (POST /api/auth/register)
- Método: POST
- URL: http://localhost:3000/api/auth/register
- Body (JSON):
```
{
  "email": "user@example.com",
  "password": "password123",
  "role": "User"
}
```
- Respuesta esperada: 201 Created (user object sin `password_hash`)

2) Login (POST /api/auth/login)
- Método: POST
- URL: http://localhost:3000/api/auth/login
- Body (JSON):
```
{
  "email": "user@example.com",
  "password": "password123"
}
```
- Respuesta: `access_token` (Bearer token)

3) Obtener perfil (GET /api/profile)
- Método: GET
- URL: http://localhost:3000/api/profile
- Header: Authorization: Bearer <access_token>

4) Subir JSON (POST /api/data) — solo usuarios autenticados (role User)
- Método: POST
- URL: http://localhost:3000/api/data
- Header: Authorization: Bearer <access_token>
- Body (JSON): cualquier objeto JSON que quieras guardar en la colección `data`

5) Admin: desactivar usuario (PATCH /api/users/:email/deactivate)
- Método: PATCH
- URL: http://localhost:3000/api/users/user@example.com/deactivate
- Header: Authorization: Bearer <admin_access_token>

Notas

- El archivo `.env.example` en `server/` contiene las variables necesarias. No subas `.env` al repositorio.
- Si tus tokens expiran, usa el flujo de refresh (no implementado por defecto en esta versión básica).

Postman: pasos rápidos

1. Crear una colección nueva.
2. Agregar una petición POST /api/auth/register y ejecutar.
3. Agregar una petición POST /api/auth/login y ejecutar.
4. Copiar el `access_token` de la respuesta.
5. En las peticiones protegidas, en la pestaña Authorization elegir "Bearer Token" y pegar el token.

Si quieres, añado un script de Postman (o un archivo JSON exportable) con ejemplos pre-configurados.
