import { crearError } from '../utils/errores.js'
import * as productoServices from '../services/producto.service.js'

export const obtenerProductos = async (req, res, next) => {
    try {
        const resultado = await productoServices.consultarProducto(req.consultaProductos)
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
        const nuevoProducto = await productoServices.crearProducto(req.body, req.contextoUsuario.id)
        res.status(201).json(nuevoProducto)
    } catch (error) {
        next(error)
    }
}

export const actualizarProducto = async (req, res, next) => {
    try {
        const producto = await productoServices.actualizarProducto(req.params.id, req.contextoUsuario.id, req.body)
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
