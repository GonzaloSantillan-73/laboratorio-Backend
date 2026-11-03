import express from 'express'
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro }
from '../controllers/rubros.controllers.js'
import { validarRubro } from '../middlewares/validarRubro.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarRubro } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar rubros"
    #swagger.security = [] */ validarConsultarRubro, obtenerRubros)
router.get('/:id', /* #swagger.summary = "Consultar un rubro"
    #swagger.security = [] */ validarID, obtenerRubroPorId)
router.post('/', /* #swagger.summary = "Crear un rubro (ADMINISTRADOR)"
    #swagger.requestBody = { required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoRubro" } } } }
    #swagger.responses[201] = { description: "Rubro creado.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/RubroCreado" } } } } */
    ...controlesAdministrador, validarRubro, crearRubro)
router.put('/:id', /* #swagger.summary = "Modificar un rubro (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarRubro, actualizarRubro)
router.delete('/:id', /* #swagger.summary = "Eliminar un rubro (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarRubro)

export default router
