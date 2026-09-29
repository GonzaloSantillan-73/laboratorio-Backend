import { Router } from 'express' 
import { 
    obtenerArtesanos,
    obtenerArtesanosPorId,
    crearArtesano
} from '../controllers/artesanos.controllers.js'

const router = Router()

router.get('/',obtenerArtesanos)
router.get('/:id',obtenerArtesanosPorId)
router.post('/',crearArtesano)

export default router