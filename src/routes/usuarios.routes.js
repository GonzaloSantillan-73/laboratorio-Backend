import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario, registrarUsuario, iniciarSesion}
from '../controllers/usuarios.controllers.js'
import { validarUsuario, validarRegistroUsuario, validarInicioSesion } from '../middlewares/validarUsuario.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarUsuario } from '../middlewares/validarconsultas.js'


const router = express.Router()

router.get('/', validarConsultarUsuario, obtenerUsuarios)
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
router.put('/:id', validarID, validarUsuario, actualizarUsuario)
router.delete('/:id', validarID, eliminarUsuario)

export default router