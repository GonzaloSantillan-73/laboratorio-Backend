import express from 'express'
import { obtenerLocalidades, obtenerLocalidadPorId } from '../controllers/localidades.controllers.js'
import { validarConsulta, validarParametros } from "../middlewares/validacion.middleware.js"
import { consultarLocalidadSchema, localidadIdParametrosSchema } from "../validators/localidades.schemas.js"

const router = express.Router()

router.get('/', /* #swagger.summary = "Listar localidades"
    #swagger.security = [] */ validarConsulta(consultarLocalidadSchema), obtenerLocalidades)
router.get('/:id', /* #swagger.summary = "Consultar una localidad"
    #swagger.security = [] */ validarParametros(localidadIdParametrosSchema, "ID inválido."), obtenerLocalidadPorId)

export default router
