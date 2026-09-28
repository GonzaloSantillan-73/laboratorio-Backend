import { Router } from 'express' 
import { obtenerArtesanos } from '../controllers/artesanos.controllers.js'

const router = Router()

router.get('/',obtenerArtesanos)

export default router