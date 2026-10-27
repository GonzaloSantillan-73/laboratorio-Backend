import express from 'express'
import { obtenerProvincias, obtenerDepartamentos, obtenerLocalidades, obtenerLocalidadPorId }
from '../controllers/localidades.controllers.js'
import { validarConsulta, validarParametros } from "../middlewares/validacion.middleware.js"
import { consultarLocalidadSchema, consultarDepartamentoSchema, localidadIdParametrosSchema } from "../validators/localidades.schemas.js"

export const provinciasRouter = express.Router()
export const departamentosRouter = express.Router()
export const localidadesRouter = express.Router()

provinciasRouter.get('/', obtenerProvincias)

departamentosRouter.get('/', validarConsulta(consultarDepartamentoSchema), obtenerDepartamentos)

localidadesRouter.get('/', validarConsulta(consultarLocalidadSchema), obtenerLocalidades)
localidadesRouter.get('/:id', validarParametros(localidadIdParametrosSchema, "ID inválido."), obtenerLocalidadPorId)
