import { Router } from 'express'
import {
    obtenerArtesanos,
    obtenerArtesanosPorId,
    crearArtesano,
    actualizarArtesanoId,
    eliminarArtesanoId
} from '../controllers/artesanos.controllers.js'
import { validarCreacionArtesano } from '../middlewares/artesano.middleware.js'

const router = Router()

router.get('/', obtenerArtesanos)
router.get('/:id', obtenerArtesanosPorId)
router.post('/', validarCreacionArtesano, crearArtesano)
router.put('/:id', actualizarArtesanoId)
router.delete('/:id', eliminarArtesanoId)

export default router