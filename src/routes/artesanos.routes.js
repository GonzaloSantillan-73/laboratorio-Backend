import { Router } from 'express'
import {
    obtenerArtesanos,
    obtenerArtesanosPorId,
    crearArtesano,
    actualizarArtesanoId,
    eliminarArtesanoId,
    consultarMiArtesano,
    resolverSolicitud,
    obtenerSolicitudes
} from '../controllers/artesanos.controllers.js'
import {
    validarCreacionArtesano,
    validarActualizacionArtesano,
    validarConsultaArtesanos
} from '../middlewares/artesano.middleware.js'
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";
import { validarBody } from "../middlewares/validacion.middleware.js";
import { resolverSolicitudSchema } from "../validators/artesanos.schemas.js";

const router = Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.tags = ["Artesanos"]
    #swagger.summary = "Listar artesanos aprobados"
    #swagger.description = "Público. Solo muestra artesanos con la solicitud APROBADA."
    #swagger.auto = false
    #swagger.security = []
    #swagger.parameters['localidad'] = { in: 'query', description: 'Nombre de la localidad (búsqueda parcial).',
        '@schema': { type: 'string', minLength: 1 } }
    #swagger.parameters['rubro'] = { in: 'query', description: 'Nombre del rubro (búsqueda parcial).',
        '@schema': { type: 'string', minLength: 1 } }
    #swagger.parameters['ordenarPor'] = { in: 'query',
        '@schema': { type: 'string', enum: ['nombreEmprendimiento', 'createdAt', 'localidadId'], default: 'createdAt' } }
    #swagger.parameters['direccion'] = { in: 'query',
        '@schema': { type: 'string', enum: ['asc', 'desc'], default: 'asc' } }
    #swagger.parameters['pagina'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limite'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, maximum: 50, default: 10 } }
    #swagger.responses[200] = { description: "Listado de artesanos aprobados.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ListadoArtesanos" } } } }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos." }
    */
    validarConsultaArtesanos, obtenerArtesanos);

router.get("/me", /* #swagger.tags = ["Artesanos"]
    #swagger.summary = "Consultar mi artesano"
    #swagger.description = "JWT, cuenta activa y rol ARTESANO. Devuelve el artesano de la cuenta autenticada."
    #swagger.auto = false
    #swagger.responses[200] = { description: "Datos del artesano propio.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/MiArtesano" } } } }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
    #swagger.responses[404] = { description: "La cuenta no tiene un artesano asociado." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ARTESANO"),
    consultarMiArtesano);

router.get('/solicitudes', /* #swagger.tags = ["Solicitudes"]
    #swagger.summary = "Listar solicitudes de artesanos"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Incluye todos los estados de solicitud."
    #swagger.auto = false
    #swagger.parameters['estadoSolicitud'] = { in: 'query',
        '@schema': { type: 'string', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'MODIFICACIONES'] } }
    #swagger.parameters['localidad'] = { in: 'query', description: 'Nombre de la localidad (búsqueda parcial).',
        '@schema': { type: 'string', minLength: 1 } }
    #swagger.parameters['rubro'] = { in: 'query', description: 'Nombre del rubro (búsqueda parcial).',
        '@schema': { type: 'string', minLength: 1 } }
    #swagger.parameters['ordenarPor'] = { in: 'query',
        '@schema': { type: 'string', enum: ['nombreEmprendimiento', 'createdAt', 'localidadId'], default: 'createdAt' } }
    #swagger.parameters['direccion'] = { in: 'query',
        '@schema': { type: 'string', enum: ['asc', 'desc'], default: 'asc' } }
    #swagger.parameters['pagina'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limite'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, maximum: 50, default: 10 } }
    #swagger.responses[200] = { description: "Listado de solicitudes.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ListadoArtesanos" } } } }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    */
    ...controlesAdministrador, validarConsultaArtesanos, obtenerSolicitudes);

router.get('/:id', /* #swagger.tags = ["Artesanos"]
    #swagger.summary = "Consultar un artesano aprobado"
    #swagger.description = "Público. Devuelve el artesano con sus productos, stand, rubros y localidad."
    #swagger.auto = false
    #swagger.security = []
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del artesano.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.responses[200] = { description: "Artesano encontrado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Artesano" } } } }
    #swagger.responses[400] = { description: "ID inválido." }
    #swagger.responses[404] = { description: "Artesano inexistente o sin solicitud aprobada." }
    */
    validarId, obtenerArtesanosPorId)

router.post('/', /* #swagger.tags = ["Artesanos"]
    #swagger.summary = "Crear un artesano"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Asocia un artesano a un usuario existente."
    #swagger.auto = false
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoArtesano" } } } }
    #swagger.responses[201] = { description: "Artesano creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Artesano" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "Token inválido, vencido o revocado" }
        } } }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Usuario, rubro o localidad inexistente." }
    #swagger.responses[409] = { description: "El usuario ya tiene un artesano o conflicto de datos." }
    */
    ...controlesAdministrador, validarCreacionArtesano, crearArtesano)

router.put('/:id', /* #swagger.tags = ["Artesanos"]
    #swagger.summary = "Modificar un artesano"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Todos los campos son opcionales."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del artesano.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarArtesano" } } } }
    #swagger.responses[200] = { description: "Artesano modificado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Artesano" } } } }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Artesano, rubro o localidad inexistente." }
    #swagger.responses[409] = { description: "Conflicto de datos (por ejemplo, el usuario ya tiene otro artesano)." }
    */
    ...controlesAdministrador, validarId, validarActualizacionArtesano, actualizarArtesanoId)

router.patch('/:id/solicitud', /* #swagger.tags = ["Solicitudes"]
    #swagger.summary = "Resolver la solicitud de un artesano"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Al aprobar, el usuario recibe el rol ARTESANO."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del artesano.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/ResolverSolicitud" } } } }
    #swagger.responses[200] = { description: "Solicitud resuelta.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/SolicitudResuelta" } } } }
    #swagger.responses[400] = { description: "ID o estado inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Artesano inexistente." }
    #swagger.responses[409] = { description: "La solicitud ya fue resuelta (APROBADO o RECHAZADO).",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "La solicitud ya fue resuelta." }
        } } }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarId,
    validarBody(resolverSolicitudSchema, "Estado de solicitud inválido."),
    resolverSolicitud
);

router.delete('/:id', /* #swagger.tags = ["Artesanos"]
    #swagger.summary = "Eliminar un artesano"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del artesano.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.responses[200] = { description: "Artesano eliminado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ArtesanoEliminado" } } } }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Artesano inexistente." }
    */
    ...controlesAdministrador, validarId, eliminarArtesanoId)

export default router
