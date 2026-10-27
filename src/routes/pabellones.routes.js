import express from 'express'
import { obtenerPabellones, obtenerPabellonPorId, crearPabellon, actualizarPabellon, eliminarPabellon }
from '../controllers/pabellones.controllers.js'
import { validarPabellon } from '../middlewares/validarPabellon.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarPabellon } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', validarConsultarPabellon, obtenerPabellones)
router.get('/:id', validarID, obtenerPabellonPorId)
router.post('/', ...controlesAdministrador, validarPabellon, crearPabellon)
router.put('/:id', ...controlesAdministrador, validarID, validarPabellon, actualizarPabellon)
router.delete('/:id', ...controlesAdministrador, validarID, eliminarPabellon)

export default router
