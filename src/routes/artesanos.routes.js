import { Router } from 'express' 
import { 
    obtenerArtesanos,
    obtenerArtesanosPorId,
    crearArtesano,
    actualizarArtesanoId,
    eliminarArtesanoId
} from '../controllers/artesanos.controllers.js'

const router = Router()

router.get('/',obtenerArtesanos)
router.get('/:id',obtenerArtesanosPorId)
router.post('/',crearArtesano)
router.put('/:id',actualizarArtesanoId)
router.delete('/:id',eliminarArtesanoId)

export default router