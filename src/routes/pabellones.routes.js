import express from 'express'
import { obtenerPabellones, obtenerPabellonPorId, crearPabellon, actualizarPabellon, eliminarPabellon }
from '../controllers/pabellones.controllers.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarBody, validarConsulta } from "../middlewares/validacion.middleware.js"
import { pabellonSchema, consultarPabellonSchema } from "../validators/pabellones.schemas.js"
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

// los GET son publicos; crear, modificar y borrar solo ADMINISTRADOR
const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', /* #swagger.summary = "Listar pabellones"
    #swagger.security = [] */ validarConsulta(consultarPabellonSchema, "Parámetros de consulta de pabellones inválidos."), obtenerPabellones)
router.get('/:id', /* #swagger.summary = "Consultar un pabellón"
    #swagger.security = [] */ validarID, obtenerPabellonPorId)
router.post('/', /* #swagger.summary = "Crear un pabellón (ADMINISTRADOR)" */ ...controlesAdministrador, validarBody(pabellonSchema, "Datos de pabellón invalidos"), crearPabellon)
router.put('/:id', /* #swagger.summary = "Modificar un pabellón (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, validarBody(pabellonSchema, "Datos de pabellón invalidos"), actualizarPabellon)
router.delete('/:id', /* #swagger.summary = "Eliminar un pabellón (ADMINISTRADOR)" */ ...controlesAdministrador, validarID, eliminarPabellon)

export default router
