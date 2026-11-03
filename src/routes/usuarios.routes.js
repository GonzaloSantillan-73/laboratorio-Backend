import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, obtenerMiUsuario, crearUsuario, actualizarUsuario, eliminarUsuario, registrarPostulacion, iniciarSesion, crearAdministrador, asociarArtesano}
from '../controllers/usuarios.controllers.js'
import { agregarRol, quitarRol } from '../controllers/roles.controllers.js'
import { actualizarActivo } from '../controllers/estado.controllers.js'
import { validarUsuario, validarInicioSesion } from '../middlewares/validarUsuario.js'
import { validarConsultarUsuario } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cerrarSesion } from "../controllers/sesiones.controllers.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"
import { validarBody, validarParametros } from "../middlewares/validacion.middleware.js"
import { registroAdminSchema, usuarioIdParametrosSchema, asignarArtesanoSchema, postulacionSchema } from "../validators/usuarios.schemas.js"
import { asignarAdministradorSchema, retirarRolParametrosSchema } from "../validators/roles.schemas.js"
import { actualizarActivoSchema } from "../validators/estado.schemas.js"

const router = express.Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Listar usuarios"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Lista paginada con filtros."
    #swagger.auto = false
    #swagger.parameters['nombre'] = { in: 'query', description: 'Búsqueda parcial por nombre.',
        '@schema': { type: 'string', maxLength: 100 } }
    #swagger.parameters['apellido'] = { in: 'query', description: 'Búsqueda parcial por apellido.',
        '@schema': { type: 'string', maxLength: 100 } }
    #swagger.parameters['email'] = { in: 'query', description: 'Búsqueda parcial por email.',
        '@schema': { type: 'string', maxLength: 100 } }
    #swagger.parameters['rolId'] = { in: 'query', description: 'Usuarios que tienen ese rol.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.parameters['ordenPor'] = { in: 'query',
        '@schema': { type: 'string', enum: ['nombre', 'apellido', 'email'], default: 'nombre' } }
    #swagger.parameters['direccion'] = { in: 'query',
        '@schema': { type: 'string', enum: ['asc', 'desc'], default: 'asc' } }
    #swagger.parameters['pagina'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limite'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, maximum: 50, default: 10 } }
    #swagger.responses[200] = { description: "Listado de usuarios.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ListadoUsuarios" } } } }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    */
    ...controlesAdministrador, validarConsultarUsuario, obtenerUsuarios)

router.get('/me', /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Consultar mi usuario"
    #swagger.description = "JWT y cuenta activa. Cualquier rol."
    #swagger.auto = false
    #swagger.responses[200] = { description: "Datos de la cuenta autenticada.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/MiUsuario" } } } }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva." }
    */
    autenticarUsuario, cargarContextoUsuario, obtenerMiUsuario)

router.get('/:id', /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Consultar un usuario"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID (UUID) del usuario.',
        '@schema': { type: 'string', format: 'uuid' } }
    #swagger.responses[200] = { description: "Usuario encontrado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Usuario" } } } }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    */
    ...controlesAdministrador,
    validarParametros(usuarioIdParametrosSchema, "ID inválido."),
    obtenerUsuarioPorId)

router.post('/', /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Crear un usuario"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Crea una cuenta con los roles indicados."
    #swagger.auto = false
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoUsuario" } } } }
    #swagger.responses[201] = { description: "Usuario creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioGuardado" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido, rol inexistente o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[409] = { description: "Ya existe un usuario con ese email." }
    */
    ...controlesAdministrador, validarUsuario, crearUsuario)

// Postulación pública: no requiere JWT
router.post("/postulacion", /* #swagger.tags = ["Solicitudes"]
    #swagger.summary = "Postularse como artesano"
    #swagger.description = "Público. Crea la cuenta y la solicitud en estado PENDIENTE. El rol ARTESANO se asigna al aprobar."
    #swagger.auto = false
    #swagger.security = []
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevaPostulacion" } } } }
    #swagger.responses[201] = { description: "Postulación registrada.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/PostulacionCreada" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido o con campos no permitidos." }
    #swagger.responses[404] = { description: "Localidad o rubro inexistente." }
    #swagger.responses[409] = { description: "Ya existe un usuario con ese email.",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "Ya existe un registro con esos datos únicos." }
        } } }
    */
    validarBody(postulacionSchema),
    registrarPostulacion
);

router.post(
    "/login", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Iniciar sesión"
    #swagger.description = "Público. Devuelve el JWT para usar en el botón Authorize."
    #swagger.auto = false
    #swagger.security = []
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/InicioSesion" } } } }
    #swagger.responses[200] = { description: "Credenciales correctas.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/SesionIniciada" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido." }
    #swagger.responses[401] = { description: "Email o contraseña incorrectos, o cuenta inactiva.",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "Las credenciales son inválidas." }
        } } }
    */
    validarInicioSesion,
    iniciarSesion
);

router.post("/logout", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Cerrar sesión"
    #swagger.description = "JWT. Revoca el token enviado."
    #swagger.auto = false
    #swagger.responses[204] = { description: "Sesión cerrada. Sin contenido." }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado.",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "Se requiere un token de acceso" }
        } } }
    */
    autenticarUsuario, cerrarSesion)

router.post("/registro-administrador", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Registrar un administrador"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Crea una cuenta con rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/RegistroAdministrador" } } } }
    #swagger.responses[201] = { description: "Administrador creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/AdministradorCreado" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[409] = { description: "Ya existe un usuario con ese email." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarBody(registroAdminSchema),
    crearAdministrador
);

router.post("/asignar-artesano", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Asignar un artesano a un administrador"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. El usuario destino debe ser administrador activo y no tener artesano."
    #swagger.auto = false
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/AsignarArtesano" } } } }
    #swagger.responses[201] = { description: "Artesano creado y aprobado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Artesano" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario, localidad o rubro inexistente." }
    #swagger.responses[409] = { description: "Requiere administrador activo sin artesano." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarBody(asignarArtesanoSchema),
    asociarArtesano
);

router.post("/:id/roles", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Asignar el rol ADMINISTRADOR"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Solo se puede asignar ADMINISTRADOR."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID (UUID) del usuario.',
        '@schema': { type: 'string', format: 'uuid' } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/AsignarRol" } } } }
    #swagger.responses[200] = { description: "Rol asignado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/RolAsignado" } } } }
    #swagger.responses[400] = { description: "ID o rol inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarParametros(
        usuarioIdParametrosSchema, "ID inválido."),
    validarBody(asignarAdministradorSchema,
        "Solo se puede asignar ADMINISTRADOR."),
    agregarRol
);

router.delete("/:id/roles/:rol", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Quitar un rol a un usuario"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. El usuario debe conservar al menos un rol."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID (UUID) del usuario.',
        '@schema': { type: 'string', format: 'uuid' } }
    #swagger.parameters['rol'] = { in: 'path', required: true, description: 'Rol a quitar.',
        '@schema': { type: 'string', enum: ['ARTESANO', 'ADMINISTRADOR'] } }
    #swagger.responses[204] = { description: "Rol quitado. Sin contenido." }
    #swagger.responses[400] = { description: "ID o rol inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    #swagger.responses[409] = { description: "Debe conservar un rol o debe quedar un administrador activo." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarParametros(retirarRolParametrosSchema),
    quitarRol
);

router.patch("/:id/activo", /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Activar o desactivar una cuenta"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Debe quedar al menos un administrador activo."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID (UUID) del usuario.',
        '@schema': { type: 'string', format: 'uuid' } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CambiarActivo" } } } }
    #swagger.responses[200] = { description: "Estado de la cuenta actualizado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioActivo" } } } }
    #swagger.responses[400] = { description: "ID o campo activo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    #swagger.responses[409] = { description: "Debe quedar un administrador activo." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarParametros(
        usuarioIdParametrosSchema, "ID inválido."),
    validarBody(actualizarActivoSchema,
        "Campo activo inválido."),
    actualizarActivo
);

router.put('/:id', /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Modificar un usuario"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Reemplaza los datos y los roles del usuario."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID (UUID) del usuario.',
        '@schema': { type: 'string', format: 'uuid' } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoUsuario" } } } }
    #swagger.responses[200] = { description: "Usuario modificado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioGuardado" } } } }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, rol inexistente o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    #swagger.responses[409] = { description: "Ya existe un usuario con ese email." }
    */
    ...controlesAdministrador,
    validarParametros(usuarioIdParametrosSchema, "ID inválido."),
    validarUsuario, actualizarUsuario)

router.delete('/:id', /* #swagger.tags = ["Usuarios"]
    #swagger.summary = "Eliminar un usuario"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID (UUID) del usuario.',
        '@schema': { type: 'string', format: 'uuid' } }
    #swagger.responses[204] = { description: "Usuario eliminado. Sin contenido." }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario inexistente." }
    */
    ...controlesAdministrador,
    validarParametros(usuarioIdParametrosSchema, "ID inválido."),
    eliminarUsuario)

export default router
