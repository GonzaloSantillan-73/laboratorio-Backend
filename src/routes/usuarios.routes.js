import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, obtenerMiUsuario, crearUsuario, actualizarUsuario, eliminarUsuario, registrarPostulacion, iniciarSesion, crearAdministrador, asociarArtesano}
from '../controllers/usuarios.controllers.js'
import { agregarRol, quitarRol } from '../controllers/roles.controllers.js'
import { actualizarActivo } from '../controllers/estado.controllers.js'
import { validarUsuario, validarInicioSesion } from '../middlewares/validarUsuario.js'
import { validarConsultarUsuario } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cerrarSesion } from "../controllers/sesiones.controllers.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"
import { validarBody, validarParametros } from "../middlewares/validacion.middleware.js"
import { registroAdminSchema, usuarioIdParametrosSchema, asignarArtesanoSchema, postulacionSchema } from "../validators/usuarios.schemas.js"
import { asignarAdministradorSchema, retirarRolParametrosSchema } from "../validators/roles.schemas.js"
import { actualizarActivoSchema } from "../validators/estado.schemas.js"

const router = express.Router()

const controlesAdministrador = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR")
];

router.get('/', ...controlesAdministrador, validarConsultarUsuario, obtenerUsuarios)
router.get('/me', autenticarUsuario, cargarContextoUsuario, obtenerMiUsuario)
router.get('/:id', ...controlesAdministrador,
    validarParametros(usuarioIdParametrosSchema, "ID inválido."),
    obtenerUsuarioPorId)
router.post('/', ...controlesAdministrador, validarUsuario, crearUsuario)
// Postulación pública: no requiere JWT
router.post("/postulacion",
    validarBody(postulacionSchema),
    registrarPostulacion
);
router.post(
    "/login",
    validarInicioSesion,
    iniciarSesion
);
router.post("/logout", autenticarUsuario, cerrarSesion)
router.post("/registro-administrador",
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarBody(registroAdminSchema),
    crearAdministrador
);
router.post("/asignar-artesano",
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarBody(asignarArtesanoSchema),
    asociarArtesano
);
router.post("/:id/roles",
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarParametros(
        usuarioIdParametrosSchema, "ID inválido."),
    validarBody(asignarAdministradorSchema,
        "Solo se puede asignar ADMINISTRADOR."),
    agregarRol
);
router.delete("/:id/roles/:rol",
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarParametros(retirarRolParametrosSchema),
    quitarRol
);
router.patch("/:id/activo",
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ADMINISTRADOR"),
    validarParametros(
        usuarioIdParametrosSchema, "ID inválido."),
    validarBody(actualizarActivoSchema,
        "Campo activo inválido."),
    actualizarActivo
);

router.put('/:id', ...controlesAdministrador,
    validarParametros(usuarioIdParametrosSchema, "ID inválido."),
    validarUsuario, actualizarUsuario)
router.delete('/:id', ...controlesAdministrador,
    validarParametros(usuarioIdParametrosSchema, "ID inválido."),
    eliminarUsuario)

export default router
