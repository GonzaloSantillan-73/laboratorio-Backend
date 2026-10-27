import { Router } from 'express'
import {
    obtenerArtesanos,
    obtenerArtesanosPorId,
    crearArtesano,
    actualizarArtesanoId,
    eliminarArtesanoId,
    consultarMiArtesano,
    resolverSolicitud,
    obtenerSolicitudes
} from '../controllers/artesanos.controllers.js'
import {
    validarCreacionArtesano,
    validarActualizacionArtesano,
    validarConsultaArtesanos
} from '../middlewares/artesano.middleware.js'
import { validarId } from "../middlewares/validarId.middleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js";
import { validarBody } from "../middlewares/validacion.middleware.js";
import { resolverSolicitudSchema } from "../validators/artesanos.schemas.js";

const router = Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', validarConsultaArtesanos, obtenerArtesanos);
router.get("/me", autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ARTESANO"),
    consultarMiArtesano);
router.get('/solicitudes', ...controlesAdministrador, validarConsultaArtesanos, obtenerSolicitudes);
router.get('/:id', validarId, obtenerArtesanosPorId)
router.post('/', ...controlesAdministrador, validarCreacionArtesano, crearArtesano)
router.put('/:id', ...controlesAdministrador, validarId, validarActualizacionArtesano, actualizarArtesanoId)
router.patch('/:id/solicitud',
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarId,
    validarBody(resolverSolicitudSchema, "Estado de solicitud inválido."),
    resolverSolicitud
);
router.delete('/:id', ...controlesAdministrador, validarId, eliminarArtesanoId)

export default router
