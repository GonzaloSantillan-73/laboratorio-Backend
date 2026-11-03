import { Router } from 'express';
import {
    obtenerStands,
    obtenerStandPorId,
    crearStand,
    actualizarStandId,
    eliminarStandId
} from '../controllers/stands.controllers.js';
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js";
import {
    crearStandSchema,
    actualizarStandSchema,
    consultarStandsSchema
} from "../validators/stands.schemas.js";

const router = Router();

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.tags = ["Stands"]
    #swagger.summary = "Listar stands"
    #swagger.description = "Público. Lista paginada de stands con filtros."
    #swagger.auto = false
    #swagger.security = []
    #swagger.parameters['pabellon'] = { in: 'query', description: 'Nombre del pabellón (búsqueda parcial).',
        '@schema': { type: 'string', minLength: 1 } }
    #swagger.parameters['sector'] = { in: 'query', description: 'Sector (búsqueda parcial).',
        '@schema': { type: 'string', minLength: 1 } }
    #swagger.parameters['estado'] = { in: 'query',
        '@schema': { type: 'string', enum: ['DISPONIBLE', 'OCUPADO'] } }
    #swagger.parameters['ordenarPor'] = { in: 'query',
        '@schema': { type: 'string', enum: ['pabellonId', 'sector', 'createdAt'], default: 'createdAt' } }
    #swagger.parameters['direccion'] = { in: 'query',
        '@schema': { type: 'string', enum: ['asc', 'desc'], default: 'asc' } }
    #swagger.parameters['pagina'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limite'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, maximum: 50, default: 10 } }
    #swagger.responses[200] = { description: "Listado de stands.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ListadoStands" } } } }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos." }
    */
    validarConsulta(consultarStandsSchema, "Los parámetros de consulta de stands son inválidos."),
    obtenerStands);

router.get('/:id', /* #swagger.tags = ["Stands"]
    #swagger.summary = "Consultar un stand"
    #swagger.description = "Público. Devuelve el stand con su pabellón, coordenada y artesano."
    #swagger.auto = false
    #swagger.security = []
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del stand.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.responses[200] = { description: "Stand encontrado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Stand" } } } }
    #swagger.responses[400] = { description: "ID inválido." }
    #swagger.responses[404] = { description: "Stand inexistente." }
    */
    validarId, obtenerStandPorId);

router.post('/', /* #swagger.tags = ["Stands"]
    #swagger.summary = "Crear un stand"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoStand" } } } }
    #swagger.responses[201] = { description: "Stand creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Stand" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "Se requiere un token de acceso" }
        } } }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Pabellón, coordenada o artesano inexistente." }
    #swagger.responses[409] = { description: "La coordenada ya está ocupada o el artesano ya tiene un stand." }
    */
    ...controlesAdministrador,
    validarBody(crearStandSchema, "Los datos enviados para el stand son inválidos."),
    crearStand);

router.put('/:id', /* #swagger.tags = ["Stands"]
    #swagger.summary = "Modificar un stand"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR. Todos los campos son opcionales."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del stand.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarStand" } } } }
    #swagger.responses[200] = { description: "Stand modificado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Stand" } } } }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Stand, pabellón o coordenada inexistente." }
    #swagger.responses[409] = { description: "La coordenada ya está ocupada por otro stand o conflicto de datos." }
    */
    ...controlesAdministrador, validarId,
    validarBody(actualizarStandSchema, "Los datos enviados para la actualización del stand son inválidos."),
    actualizarStandId);

router.delete('/:id', /* #swagger.tags = ["Stands"]
    #swagger.summary = "Eliminar un stand"
    #swagger.description = "JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del stand.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.responses[200] = { description: "Stand eliminado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/StandEliminado" } } } }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Stand inexistente." }
    */
    ...controlesAdministrador, validarId,
    eliminarStandId);

export default router;
