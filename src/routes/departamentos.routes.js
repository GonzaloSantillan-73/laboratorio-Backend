import express from 'express'
import { obtenerDepartamentos } from '../controllers/localidades.controllers.js'
import { validarConsulta } from "../middlewares/validacion.middleware.js"
import { consultarDepartamentoSchema } from "../validators/localidades.schemas.js"

const router = express.Router()

router.get('/', /* #swagger.summary = "Listar departamentos"
    #swagger.security = [] */ validarConsulta(consultarDepartamentoSchema), obtenerDepartamentos)

export default router
