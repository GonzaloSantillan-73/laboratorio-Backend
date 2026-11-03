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

router.get('/', /* #swagger.summary = "Listar coordenadas"
    #swagger.security = [] */ validarConsultarCoordenada, obtenerCoordenadas)
router.get('/:id', /* #swagger.summary = "Consultar una coordenada"
    #swagger.security = [] */ validarID, obtenerCoordenadaPorId)
router.post('/', /* #swagger.summary = "Crear una coordenada (ADMINISTRADOR)" */ ...controlesAdministrador, validarCoordenada, crearCoordenada)
router.put('/:id', /* #swagger.summary = "Modificar una coordenada (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarCoordenada, actualizarCoordenada)
router.delete('/:id', /* #swagger.summary = "Eliminar una coordenada (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarCoordenada)

export default router
