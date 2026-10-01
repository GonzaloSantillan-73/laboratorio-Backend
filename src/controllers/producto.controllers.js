import { crearError } from '../utils/errores.js'
import prisma from '../config/prisma.js'

export const obtenerProductos = async (req, res, next) => {
    try {
        const resultado = await productoServices.consultarProductos(req.query)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerProductoPorId = async (req, res, next) => {
    try {
        const producto = await productoServices.consultarProductoPorId(req.recursoId)
        if (!producto) {
            return next(crearError(`No existe un producto con ID ${req.recursoId}`, 404))
        }
        res.json(producto)
    } catch (error) {
        next(error)
    }
}

export const crearProducto = async (req, res, next) => {
    try {
        const nuevoProducto = await productoServices.crearProducto(req.body)
        res.status(201).json(nuevoProducto)
    } catch (error) {
        next(error)
    }
}

export const actualizarProducto = async (req, res, next) => {
    try {
        const producto = await productoServices.actualizarProducto(req.recursoId, req.body)
        if (!producto) {
            return next(crearError(`No existe un producto con ID ${req.recursoId}`, 404))
        }
        res.json(producto)
    } catch (error) {
        next(error)
    }
}

export const eliminarProducto = async (req, res, next) => {
    try {
        const eliminado = await productoServices.eliminarProducto(req.recursoId)
        if (!eliminado) {
            return next(crearError(`No existe el producto con ID ${req.recursoId}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}