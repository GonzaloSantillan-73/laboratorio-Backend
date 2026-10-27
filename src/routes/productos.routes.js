import express from 'express'
import { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto, actualizarActivoProducto}
from '../controllers/producto.controllers.js'
import { validarProducto } from '../middlewares/validarProducto.js'
import { validarId as validarID } from '../middlewares/validarId.middleware.js'
import { validarConsultarProducto } from '../middlewares/validarconsultas.js'
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js"
import { cargarContextoUsuario, autorizarRoles } from "../middlewares/autorizacion.middleware.js"
import { validarBody } from "../middlewares/validacion.middleware.js"
import { actualizarActivoSchema } from "../validators/estado.schemas.js"

const router = express.Router()

const controlesArtesano = [
    autenticarUsuario, cargarContextoUsuario,
    autorizarRoles("ARTESANO")
];

router.get('/', validarConsultarProducto, obtenerProductos)
router.get('/:id', validarID, obtenerProductoPorId)
router.post('/', ...controlesArtesano, validarProducto, crearProducto)
router.put('/:id', ...controlesArtesano, validarID, validarProducto, actualizarProducto)
router.patch('/:id/activo',
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ARTESANO"),
    validarID,
    validarBody(actualizarActivoSchema, "Campo activo inválido."),
    actualizarActivoProducto
)
router.delete('/:id', ...controlesArtesano, validarID, eliminarProducto)

export default router
