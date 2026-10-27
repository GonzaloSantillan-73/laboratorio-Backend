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

router.get('/', validarConsultarRubro, obtenerRubros)
router.get('/:id', validarID, obtenerRubroPorId)
router.post('/', ...controlesAdministrador, validarRubro, crearRubro)
router.put('/:id', ...controlesAdministrador, validarID, validarRubro, actualizarRubro)
router.delete('/:id', ...controlesAdministrador, validarID, eliminarRubro)

export default router
