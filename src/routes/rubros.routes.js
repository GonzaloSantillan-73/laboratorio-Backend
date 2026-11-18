import express from 'express'
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro }
from '../controllers/rubros.controllers.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js"
import { rubroSchema, consultarRubroSchema } from "../validators/rubros.schemas.js"
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

// los GET son publicos; crear, modificar y borrar solo ADMINISTRADOR
const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar rubros"
    #swagger.security = [] */ validarConsulta(consultarRubroSchema, "Parámetros de consulta de rubros inválidos."), obtenerRubros)
router.get('/:id', /* #swagger.summary = "Consultar un rubro"
    #swagger.security = [] */ validarID, obtenerRubroPorId)
router.post('/', /* #swagger.summary = "Crear un rubro (ADMINISTRADOR)"
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoRubro" } } } }
    #swagger.responses[201] = { description: "Rubro creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/RubroCreado" } } } } */
    ...controlesAdministrador, validarBody(rubroSchema, "Datos de rubro invalidos"), crearRubro)
router.put('/:id', /* #swagger.summary = "Modificar un rubro (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarBody(rubroSchema, "Datos de rubro invalidos"), actualizarRubro)
router.delete('/:id', /* #swagger.summary = "Eliminar un rubro (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarRubro)

export default router
