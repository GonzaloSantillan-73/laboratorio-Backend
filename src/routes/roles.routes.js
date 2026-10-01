import express from 'express'
import { obtenerRoles, obtenerRolPorId, crearRol, actualizarRol, eliminarRol} 
from '../controllers/roles.controllers.js'
import { validarRol } from '../middlewares/validarRol.js'
import { validarID } from '../middlewares/validar.js'
import { validarConsultarRol } from '../middlewares/validarconsultas.js'

const router = express.Router()

router.get('/', validarConsultarRol, obtenerRoles)
router.get('/:id', validarID, obtenerRolPorId)
router.post('/', validarRol, crearRol)
router.put('/:id', validarID, validarRol, actualizarRol)
router.delete('/:id', validarID, eliminarRol)

export default router