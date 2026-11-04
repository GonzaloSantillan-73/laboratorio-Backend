# Laboratorio Backend – API REST de Feria de Artesanos

API REST para gestionar una feria de artesanos: usuarios, postulaciones de artesanos, rubros, productos, pabellones, stands y su ubicación en el predio, además de las ubicaciones geográficas (provincias, departamentos y localidades).

- **Repositorio:** <https://github.com/GonzaloSantillan-73/laboratorio-Backend.git>

## Integrantes

| Nombre                 | MU    |
| ---------------------- | ----- |
| Camila Molas Gaitan    | 00366 |
| Gonzalo Luis Santillan | 00320 |

## Tecnologías

- **Node.js** (ES Modules) + **Express 5**
- **PostgreSQL** con **Prisma 7** (`@prisma/adapter-pg`)
- **Zod** para validar body, params y query
- **JWT** (`jsonwebtoken`) para autenticación y **bcrypt** para hashear contraseñas
- **Swagger UI** + `swagger-autogen` para la documentación OpenAPI
- **node:test** + **Supertest** para las pruebas automatizadas

## Estructura del proyecto

```
app.js                  # Punto de entrada: monta rutas, Swagger y manejo de errores
generar-docs.js         # Genera swagger-output.json
prisma/
  schema.prisma         # Modelo de datos
  migrations/           # Migraciones (incluyen datos iniciales: roles, rubros, pabellones, coordenadas)
prisma7.config.ts       # Configuración de Prisma
scripts/
  cargar-localidades.js # Carga provincias, departamentos y localidades desde scripts/datos
  inicializar-admin.js  # Crea el primer usuario ADMINISTRADOR
src/
  config/               # Cliente de Prisma y secreto JWT
  routes/               # Definición de endpoints (con anotaciones Swagger)
  middlewares/          # Autenticación, autorización por rol y validaciones
  controllers/          # Manejo de request/response
  services/             # Lógica de negocio y acceso a datos
  validators/           # Esquemas Zod
  tareas/               # Tarea periódica de limpieza de tokens revocados
  utils/                # Caché en memoria y errores
tests/                  # Pruebas unitarias y de integración
```

La aplicación sigue una arquitectura en capas: **ruta → middlewares → controller → service → Prisma**.

## Requisitos

- Node.js 20 o superior
- PostgreSQL

## Instalación y puesta en marcha

1. Clonar el repositorio e instalar dependencias:

   ```bash
   git clone https://github.com/GonzaloSantillan-73/laboratorio-Backend.git
   cd laboratorio-Backend
   npm install
   ```

2. Crear un archivo `.env` en la raíz:

   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/backend_laboratorio?schema=public"
   JWT_SECRET=un-secreto-largo-y-privado

   # Datos del administrador inicial (los usa scripts/inicializar-admin.js)
   ADMIN_NOMBRE=Admin
   ADMIN_APELLIDO=Principal
   ADMIN_EMAIL=admin@ejemplo.com
   ADMIN_PASSWORD=una-contrasena-segura
   ```

3. Aplicar las migraciones y generar el cliente de Prisma:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. Cargar las localidades y crear el administrador inicial:

   ```bash
   node scripts/cargar-localidades.js
   node scripts/inicializar-admin.js
   ```

5. Levantar el servidor:

   ```bash
   npm run dev     # con recarga automática
   npm start       # modo normal
   ```

   El servidor queda escuchando en <http://localhost:3000>.

## Documentación de la API

Con el servidor levantado, la documentación interactiva está en **<http://localhost:3000/docs>**.

Para probar endpoints protegidos: hacer `POST /api/usuarios/login`, copiar el token y cargarlo con el botón **Authorize**.

Si se modifican las anotaciones de las rutas, regenerar el archivo con:

```bash
npm run docs
```

## Autenticación y roles

- Login con `POST /api/usuarios/login`, que devuelve un **JWT válido por 24 h**. Se envía en cada request como `Authorization: Bearer <token>`.
- `POST /api/usuarios/logout` revoca el token. Los tokens revocados se guardan en la base y una tarea los limpia cada hora una vez vencidos.
- Roles:
  - **ADMINISTRADOR**: administra usuarios, roles, rubros, pabellones, coordenadas, stands y aprueba o rechaza las solicitudes de artesanos.
  - **ARTESANO**: gestiona su perfil (`/api/artesanos/me`) y sus productos (`/api/productos/me`).
- Endpoints públicos: login, postulación como artesano (`POST /api/usuarios/postulacion`) y consulta de ubicaciones.

### Flujo de postulación

1. Una persona se postula con `POST /api/usuarios/postulacion` y queda como solicitud **PENDIENTE**.
2. Un administrador revisa las solicitudes en `GET /api/artesanos/solicitudes`.
3. La aprueba o rechaza con `PATCH /api/artesanos/:id/solicitud`. Al aprobarla se le asigna el rol **ARTESANO**.

## Endpoints principales

| Recurso       | Ruta base            | Descripción                                                   |
| ------------- | -------------------- | ------------------------------------------------------------- |
| Usuarios      | `/api/usuarios`      | Login, logout, postulación, alta de administradores, roles y activación |
| Artesanos     | `/api/artesanos`     | Perfiles de artesanos y gestión de solicitudes                |
| Productos     | `/api/productos`     | Catálogo con filtros y paginación; ABM para artesanos         |
| Stands        | `/api/stands`        | Stands por pabellón, coordenada y artesano asignado           |
| Pabellones    | `/api/pabellones`    | ABM de pabellones                                             |
| Coordenadas   | `/api/coordenadas`   | Posiciones (x, y) del predio                                  |
| Rubros        | `/api/rubros`        | ABM de rubros (con caché en memoria de 30 s)                  |
| Roles         | `/api/roles`         | ABM de roles                                                  |
| Consultas     | `/api/consultas`     | Registro de búsquedas realizadas                              |
| Ubicaciones   | `/api/provincias`, `/api/departamentos`, `/api/localidades` | Consulta de ubicaciones geográficas |

El detalle de cada endpoint (parámetros, cuerpos y respuestas) está en Swagger (`/docs`).

## Manejo de errores

Todas las respuestas de error tienen el formato:

```json
{ "mensaje": "Descripción del error" }
```

| Código | Caso                                                     |
| ------ | -------------------------------------------------------- |
| 400    | Datos inválidos (incluye el detalle de cada campo)       |
| 401    | Falta el token, es inválido, está vencido o revocado     |
| 403    | El usuario no tiene el rol necesario o su cuenta está inactiva |
| 404    | Recurso o ruta inexistente                               |
| 409    | Conflicto: dato único repetido o registros relacionados  |
| 500    | Error interno del servidor                               |

## Pruebas

Pruebas unitarias (no necesitan base de datos):

```bash
npm test
```

Pruebas de integración contra una base de datos de pruebas:

1. Copiar `.env.test.example` a `.env.test` y completar `DATABASE_URL` con una base **separada** de la de desarrollo.
2. Preparar la base y correr las pruebas:

   ```bash
   npm run db:test:preparar
   npm run test:integracion
   ```

## Scripts disponibles

| Script                     | Descripción                                          |
| -------------------------- | ---------------------------------------------------- |
| `npm start`                | Inicia el servidor                                   |
| `npm run dev`              | Inicia el servidor con recarga automática            |
| `npm run docs`             | Regenera `swagger-output.json`                       |
| `npm test`                 | Corre las pruebas unitarias                          |
| `npm run db:test:preparar` | Aplica las migraciones en la base de pruebas         |
| `npm run test:integracion` | Corre las pruebas de integración                     |
