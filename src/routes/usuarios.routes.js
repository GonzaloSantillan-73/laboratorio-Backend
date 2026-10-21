import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, obtenerMiUsuario, crearUsuario, actualizarUsuario, eliminarUsuario, registrarUsuarioVisitante, iniciarSesion}
from '../controllers/usuarios.controllers.js'
import { validarUsuario, validarRegistroUsuario, validarInicioSesion } from '../middlewares/validarUsuario.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarUsuario } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cerrarSesion } from "../controllers/sesiones.controllers.js"
import { registroVisitanteSchema } from "../validators/usuarios.schemas.js"

const router = express.Router()

router.get('/', validarConsultarUsuario, obtenerUsuarios)
router.get('/me', autenticarUsuario, obtenerMiUsuario)
router.get('/:id', validarID, obtenerUsuarioPorId)
router.post('/', validarUsuario, crearUsuario)
router.post("/registro",
            validarRegistroUsuario,
            registrarUsuarioVisitante
);
router.post(
    "/login",
    validarInicioSesion,
    iniciarSesion
);
router.post("/logout", autenticarUsuario, cerrarSesion)
router.post("/registro-visitante", validarRegistroUsuario(registroVisitanteSchema), registrarUsuarioVisitante)
router.put('/:id', validarID, validarUsuario, actualizarUsuario)
router.delete('/:id', validarID, eliminarUsuario)

export default router