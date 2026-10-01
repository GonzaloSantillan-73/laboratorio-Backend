import express from 'express'
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario} 
from '../controllers/usuarios.controllers.js'
import { validarUsuario } from '../middlewares/validarUsuario.js'
import { validarID } from '../middlewares/validar.js'
import { validarConsultarUsuario } from '../middlewares/validarconsultas.js'


const router = express.Router()

router.get('/', validarConsultarUsuario, obtenerUsuarios)
router.get('/:id', validarID, obtenerUsuarioPorId)
router.post('/', validarUsuario, crearUsuario)
router.put('/:id', validarID, validarUsuario, actualizarUsuario)
router.delete('/:id', validarID, eliminarUsuario)

export default router