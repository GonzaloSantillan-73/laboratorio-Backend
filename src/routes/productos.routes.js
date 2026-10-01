import express from 'express'
import { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto} 
from '../controllers/producto.controllers.js'
import { validarProducto } from '../middlewares/validarProducto.js'
import { validarID } from '../middlewares/validar.js'
import { validarConsultarProducto } from '../middlewares/validarconsultas.js'

const router = express.Router()

router.get('/', validarConsultarProducto, obtenerProductos)
router.get('/:id', validarID, obtenerProductoPorId)
router.post('/', validarProducto, crearProducto)
router.put('/:id', validarID, validarProducto, actualizarProducto)
router.delete('/:id', validarID, eliminarProducto)

export default router