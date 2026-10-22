import { Router } from 'express'
import {
    obtenerArtesanos,
    obtenerArtesanosPorId,
    crearArtesano,
    actualizarArtesanoId,
    eliminarArtesanoId,
    consultarMiArtesano
} from '../controllers/artesanos.controllers.js'
import {
    validarCreacionArtesano,
    validarActualizacionArtesano,
    validarConsultaArtesanos
} from '../middlewares/artesano.middleware.js'
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = Router()

router.get('/', validarConsultaArtesanos, obtenerArtesanos);
router.get("/me", autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ARTESANO"),
    consultarMiArtesano);
router.get('/:id', validarId, obtenerArtesanosPorId)
router.post('/', validarCreacionArtesano, crearArtesano)
router.put('/:id', validarId, validarActualizacionArtesano, actualizarArtesanoId)
router.delete('/:id', validarId, eliminarArtesanoId)

export default router
