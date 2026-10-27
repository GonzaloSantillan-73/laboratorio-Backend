import express from 'express'
import { obtenerCoordenadas, obtenerCoordenadaPorId, crearCoordenada, actualizarCoordenada, eliminarCoordenada }
from '../controllers/coordenadas.controllers.js'
import { validarCoordenada } from '../middlewares/validarCoordenada.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarCoordenada } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', validarConsultarCoordenada, obtenerCoordenadas)
router.get('/:id', validarID, obtenerCoordenadaPorId)
router.post('/', ...controlesAdministrador, validarCoordenada, crearCoordenada)
router.put('/:id', ...controlesAdministrador, validarID, validarCoordenada, actualizarCoordenada)
router.delete('/:id', ...controlesAdministrador, validarID, eliminarCoordenada)

export default router
