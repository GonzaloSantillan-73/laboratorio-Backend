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

router.get('/', /* #swagger.summary = "Listar pabellones"
    #swagger.security = [] */ validarConsultarPabellon, obtenerPabellones)
router.get('/:id', /* #swagger.summary = "Consultar un pabellón"
    #swagger.security = [] */ validarID, obtenerPabellonPorId)
router.post('/', /* #swagger.summary = "Crear un pabellón (ADMINISTRADOR)" */ ...controlesAdministrador, validarPabellon, crearPabellon)
router.put('/:id', /* #swagger.summary = "Modificar un pabellón (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarPabellon, actualizarPabellon)
router.delete('/:id', /* #swagger.summary = "Eliminar un pabellón (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarPabellon)

export default router
