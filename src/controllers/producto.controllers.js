import { crearError } from '../utils/errores.js'
import * as productoServices from '../services/producto.service.js'

export const obtenerProductos = async (req, res, next) => {
    try {
        // req.consultaValidada lo arma validarConsulta (filtros y paginacion)
        const resultado = await productoServices.consultarProducto(req.consultaValidada)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerProductoPorId = async (req, res, next) => {
    try {
        const producto = await productoServices.consultarProductoPorId(req.params.id)
        if (!producto) {
            return next(crearError(`No existe un producto con ID ${req.params.id}`, 404))
        }
        res.json(producto)
    } catch (error) {
        next(error)
    }
}

export const crearProducto = async (req, res, next) => {
    try {
        // el artesano sale del usuario logueado, no del body
        const nuevoProducto = await productoServices.crearProducto(req.bodyValidado, req.contextoUsuario.id)
        res.status(201).json(nuevoProducto)
    } catch (error) {
        next(error)
    }
}

export const actualizarProducto = async (req, res, next) => {
    try {
        // se pasa el usuario para que solo pueda tocar sus propios productos
        const producto = await productoServices.actualizarProducto(req.params.id, req.contextoUsuario.id, req.bodyValidado)
        if (!producto) {
            return next(crearError(`No existe un producto con ID ${req.params.id}`, 404))
        }
        res.json(producto)
    } catch (error) {
        next(error)
    }
}

export const eliminarProducto = async (req, res, next) => {
    try {
        const eliminado = await productoServices.eliminarProducto(req.params.id, req.contextoUsuario.id)
        if (!eliminado) {
            return next(crearError(`No existe el producto con ID ${req.params.id}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const actualizarActivoProducto = async (req, res, next) => {
    try {
        const producto = await productoServices.cambiarActivoProducto(
            req.params.id,
            req.contextoUsuario.id,
            req.bodyValidado.activo)
        if (!producto) {
            return next(crearError(`No existe un producto con ID ${req.params.id}`, 404))
        }
        res.json(producto)
    } catch (error) {
        next(error)
    }
}

export const listarMisProductos = async (req, res, next) => {
    try {
        const productos = await productoServices.listarMisProductos(req.contextoUsuario.id)
        res.json(productos)
    } catch (error) {
        next(error)
    }
}
