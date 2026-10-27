# Correcciones en productos, usuarios y roles

- **Controllers:** 

usaban `req.recursoId`, que no existe. `validarId` guarda el id en `req.params.id`.

- **producto.controllers.js:** 

llamaba a `consultarProductos`, pero la función se llama `consultarProducto`.

- **validarconsultas.js:** 

en Express 5 no se puede hacer `req.query = ...`. Ahora se guarda en `req.consultaProductos` y `req.consultaUsuarios`, como en artesanos.

- **validarconsultas.js:** 

faltaba `validarConsultarRol`, que roles.routes.js ya importaba.

- **validarRol.js:** 

faltaba importar `rolSchema` y `detallarErroresZod`.

- **roles.routes.js:** 

importaba de `validar.js`, que no existe. Ahora importa de `validarId.middleware.js`.

- **app.js:** 

las rutas de roles no estaban montadas.

- **manejadorErrores.js:** 

no devolvía `err.detalles`, así que no se veía qué campo estaba mal.

- **Services:** 

`findMany` devuelve un array, no `{ productos, total }`, y el `count` no tenía `await`. Ahora usan `$transaction`, como artesanos.

- **usuario.service.js:** 

`contains` no sirve para un número. Ahora es `where.rolId = rolId`.

- **actualizar... (services):** 

tiraban error (500) en vez de devolver `null`, entonces nunca salía el 404 del controller.

- **productos.schemas.js:** 

`precio` era string, pero en la base es `Float`. Faltaba `artesanoId`, y Zod lo borraba.

- **Schemas de consulta:** 

`stock`, `precio` y `rolId` llegan como texto por la URL, así que ahora usan `z.coerce.number()`, como `pagina` y `limite`.

- **usuarios.schemas.js:** 

se agregó `.email()` para validar el email.
