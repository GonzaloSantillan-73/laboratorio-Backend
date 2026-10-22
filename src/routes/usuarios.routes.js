import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, obtenerMiUsuario, crearUsuario, actualizarUsuario, eliminarUsuario, registrarUsuario, iniciarSesion, crearAdministrador}
from '../controllers/usuarios.controllers.js'
import { agregarRol, quitarRol } from '../controllers/roles.controllers.js'
import { actualizarActivo } from '../controllers/estado.controllers.js'
import { validarUsuario, validarRegistroUsuario, validarInicioSesion } from '../middlewares/validarUsuario.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarUsuario } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cerrarSesion } from "../controllers/sesiones.controllers.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"
import { validarBody, validarParametros } from "../middlewares/validacion.middleware.js"
import { registroAdminSchema, usuarioIdParametrosSchema } from "../validators/usuarios.schemas.js"
import { asignarAdministradorSchema, retirarRolParametrosSchema } from "../validators/roles.schemas.js"
import { actualizarActivoSchema } from "../validators/estado.schemas.js"

const router = express.Router()

router.get('/', validarConsultarUsuario, obtenerUsuarios)
router.get('/me', autenticarUsuario, cargarContextoUsuario, obtenerMiUsuario)
router.get('/:id', validarID, obtenerUsuarioPorId)
router.post('/', validarUsuario, crearUsuario)
router.post("/registro",
            validarRegistroUsuario,
            registrarUsuario
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

router.put('/:id', validarID, validarUsuario, actualizarUsuario)
router.delete('/:id', validarID, eliminarUsuario)

export default router
