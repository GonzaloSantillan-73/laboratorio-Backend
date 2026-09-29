import { Router } from 'express' 
import { 
    obtenerArtesanos,
    obtenerArtesanosPorId
} from '../controllers/artesanos.controllers.js'

const router = Router()

router.get('/',obtenerArtesanos)
router.get('/:id',obtenerArtesanosPorId)

export default router