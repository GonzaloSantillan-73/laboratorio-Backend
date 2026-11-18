import express from 'express'
import { obtenerCoordenadas, obtenerCoordenadaPorId, crearCoordenada, actualizarCoordenada, eliminarCoordenada }
from '../controllers/coordenadas.controllers.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js"
import { coordenadaSchema, consultarCoordenadaSchema } from "../validators/coordenadas.schemas.js"
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

// los GET son publicos; crear, modificar y borrar solo ADMINISTRADOR
const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar coordenadas"
    #swagger.security = [] */ validarConsulta(consultarCoordenadaSchema, "Parámetros de consulta de coordenadas inválidos."), obtenerCoordenadas)
router.get('/:id', /* #swagger.summary = "Consultar una coordenada"
    #swagger.security = [] */ validarID, obtenerCoordenadaPorId)
router.post('/', /* #swagger.summary = "Crear una coordenada (ADMINISTRADOR)" */ ...controlesAdministrador, validarBody(coordenadaSchema, "Datos de coordenada invalidos"), crearCoordenada)
router.put('/:id', /* #swagger.summary = "Modificar una coordenada (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarBody(coordenadaSchema, "Datos de coordenada invalidos"), actualizarCoordenada)
router.delete('/:id', /* #swagger.summary = "Eliminar una coordenada (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarCoordenada)

export default router
