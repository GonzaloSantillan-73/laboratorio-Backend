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

router.get('/', validarConsultarRol, obtenerRoles)
router.get('/:id', validarID, obtenerRolPorId)
router.post('/', ...controlesAdministrador, validarRol, crearRol)
router.put('/:id', ...controlesAdministrador, validarID, validarRol, actualizarRol)
router.delete('/:id', ...controlesAdministrador, validarID, eliminarRol)

export default router
