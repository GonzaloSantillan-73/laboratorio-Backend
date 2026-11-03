import express from 'express'
import { obtenerProvincias } from '../controllers/localidades.controllers.js'

const router = express.Router()

router.get('/', /* #swagger.summary = "Listar provincias"
    #swagger.security = [] */ obtenerProvincias)

export default router
