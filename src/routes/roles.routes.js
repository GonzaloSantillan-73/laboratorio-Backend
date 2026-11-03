import express from 'express'
import { obtenerRoles, obtenerRolPorId, crearRol, actualizarRol, eliminarRol}
from '../controllers/roles.controllers.js'
import { validarRol } from '../middlewares/validarRol.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarRol } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar roles"
    #swagger.security = [] */ validarConsultarRol, obtenerRoles)
router.get('/:id', /* #swagger.summary = "Consultar un rol"
    #swagger.security = [] */ validarID, obtenerRolPorId)
router.post('/', /* #swagger.summary = "Crear un rol (ADMINISTRADOR)" */ ...controlesAdministrador, validarRol, crearRol)
router.put('/:id', /* #swagger.summary = "Modificar un rol (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarRol, actualizarRol)
router.delete('/:id', /* #swagger.summary = "Eliminar un rol (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarRol)

export default router
