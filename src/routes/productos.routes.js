import express from 'express'
import { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto, actualizarActivoProducto, listarMisProductos}
from '../controllers/producto.controllers.js'
import { validarProducto } from '../middlewares/validarProducto.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarProducto } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"
import { validarBody } from "../middlewares/validacion.middleware.js"
import { actualizarActivoSchema } from "../validators/estado.schemas.js"

const router = express.Router()

const controlesArtesano = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ARTESANO")
];

router.get('/', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Listar productos"
    #swagger.description = "Público. Lista paginada de productos con filtros."
    #swagger.auto = false
    #swagger.security = []
    #swagger.parameters['nombre'] = { in: 'query', description: 'Búsqueda parcial por nombre.',
        '@schema': { type: 'string', maxLength: 100 } }
    #swagger.parameters['descripcion'] = { in: 'query', description: 'Búsqueda parcial por descripción.',
        '@schema': { type: 'string', maxLength: 300 } }
    #swagger.parameters['precio'] = { in: 'query', description: 'Precio exacto.',
        '@schema': { type: 'number', minimum: 0, exclusiveMinimum: true } }
    #swagger.parameters['stock'] = { in: 'query', description: 'Stock exacto.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.parameters['activo'] = { in: 'query', description: 'Productos activos o inactivos.',
        '@schema': { type: 'string', enum: ['true', 'false'], default: 'true' } }
    #swagger.parameters['ordenPor'] = { in: 'query',
        '@schema': { type: 'string', enum: ['nombre', 'descripcion', 'precio', 'stock'], default: 'nombre' } }
    #swagger.parameters['direccion'] = { in: 'query',
        '@schema': { type: 'string', enum: ['asc', 'desc'], default: 'asc' } }
    #swagger.parameters['pagina'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limite'] = { in: 'query',
        '@schema': { type: 'integer', minimum: 1, maximum: 50, default: 10 } }
    #swagger.responses[200] = { description: "Listado de productos.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ListadoProductos" } } } }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos." }
    */
    validarConsultarProducto, obtenerProductos)

router.get('/me', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Listar mis productos"
    #swagger.description = "JWT, cuenta activa y rol ARTESANO. Devuelve solo los productos del artesano autenticado."
    #swagger.auto = false
    #swagger.responses[200] = { description: "Productos propios.",
        content: { "application/json": { schema: { type: "array",
            items: { $ref: "#/components/schemas/Producto" } } } } }
    #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
    */
    ...controlesArtesano, listarMisProductos)

router.get('/:id', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Consultar un producto"
    #swagger.description = "Público. Devuelve el producto con su artesano."
    #swagger.auto = false
    #swagger.security = []
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del producto.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.responses[200] = { description: "Producto encontrado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Producto" } } } }
    #swagger.responses[400] = { description: "ID inválido." }
    #swagger.responses[404] = { description: "Producto inexistente." }
    */
    validarID, obtenerProductoPorId)

router.post('/', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Crear un producto"
    #swagger.description = "JWT, cuenta activa y rol ARTESANO. El artesano sale de la cuenta autenticada: enviar artesanoId produce 400."
    #swagger.auto = false
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoProducto" } } } }
    #swagger.responses[201] = { description: "Producto creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Producto" } } } }
    #swagger.responses[400] = { description: "Cuerpo inválido (incluye campos no permitidos) o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.",
        content: { "application/json": {
            schema: { $ref: "#/components/schemas/ErrorApi" },
            example: { mensaje: "Se requiere un token de acceso" }
        } } }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
    #swagger.responses[404] = { description: "La cuenta no tiene un artesano asociado." }
    */
    ...controlesArtesano, validarProducto, crearProducto)

router.put('/:id', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Modificar un producto propio"
    #swagger.description = "JWT, cuenta activa y rol ARTESANO. Solo se puede modificar un producto propio."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del producto.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoProducto" } } } }
    #swagger.responses[200] = { description: "Producto modificado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Producto" } } } }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
    #swagger.responses[404] = { description: "Producto inexistente o de otro artesano." }
    */
    ...controlesArtesano, validarID, validarProducto, actualizarProducto)

router.patch('/:id/activo', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Activar o desactivar un producto propio"
    #swagger.description = "JWT, cuenta activa y rol ARTESANO. Solo sobre un producto propio."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del producto.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CambiarActivo" } } } }
    #swagger.responses[200] = { description: "Estado del producto actualizado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ProductoActivo" } } } }
    #swagger.responses[400] = { description: "ID o campo activo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
    #swagger.responses[404] = { description: "Producto inexistente o de otro artesano." }
    */
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ARTESANO"),
    validarID,
    validarBody(actualizarActivoSchema, "Campo activo inválido."),
    actualizarActivoProducto
)

router.delete('/:id', /* #swagger.tags = ["Productos"]
    #swagger.summary = "Eliminar un producto propio"
    #swagger.description = "JWT, cuenta activa y rol ARTESANO. Solo se puede eliminar un producto propio."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, description: 'ID del producto.',
        '@schema': { type: 'integer', minimum: 1 } }
    #swagger.responses[204] = { description: "Producto eliminado. Sin contenido." }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
    #swagger.responses[404] = { description: "Producto inexistente o de otro artesano." }
    */
    ...controlesArtesano, validarID, eliminarProducto)

export default router
