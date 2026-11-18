import express from 'express'
import { obtenerRoles, obtenerRolPorId, crearRol, actualizarRol, eliminarRol}
from '../controllers/roles.controllers.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js"
import { rolSchema, consultarRolSchema } from "../validators/roles.schemas.js"
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

// los GET son publicos; crear, modificar y borrar solo ADMINISTRADOR
const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar roles"
    #swagger.security = [] */ validarConsulta(consultarRolSchema, "Parámetros de consulta de roles inválidos."), obtenerRoles)
router.get('/:id', /* #swagger.summary = "Consultar un rol"
    #swagger.security = [] */ validarID, obtenerRolPorId)
router.post('/', /* #swagger.summary = "Crear un rol (ADMINISTRADOR)" */ ...controlesAdministrador, validarBody(rolSchema, "Datos de rol invalidos"), crearRol)
router.put('/:id', /* #swagger.summary = "Modificar un rol (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarBody(rolSchema, "Datos de rol invalidos"), actualizarRol)
router.delete('/:id', /* #swagger.summary = "Eliminar un rol (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarRol)

export default router
