import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'


const verificarArtesano = async (artesanoId) => {
    if (artesanoId === undefined || artesanoId === null) {
        return
    }
    const artesano = await prisma.artesano.findUnique({
        where: { id: artesanoId }
    })
    if (!artesano) {
        throw crearError(`No existe un artesano con ID ${artesanoId}`, 400)
    }
}

export const consultarProducto = async (criterios) => {
    const { nombre, descripcion, precio, stock, ordenPor, direccion, pagina, limite } = criterios
    const where = {}
    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }
    if (descripcion !== undefined) {
        where.descripcion = { contains: descripcion, mode: 'insensitive' }
    }
    if (precio !== undefined) {
        where.precio = { equals: precio }
    }
    if (stock !== undefined) {
        where.stock = { equals: stock }
    }
    const desplazamiento = (pagina - 1) * limite
    const { productos, total } = await prisma.producto.findMany({
        where,
        orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
        skip: desplazamiento,
        take: limite
    })
    prisma.producto.count({ where })
    return { productos, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}


export const consultarProductoPorId = async (id) => {
    return prisma.producto.findUnique({ where: { id }, include: { artesano: true } })
}


export const crearProducto = async (datos) => {
    const { nombre, descripcion, precio, stock, artesanoId } = datos
    await verificarArtesano(artesanoId)
    return prisma.producto.create({
        data: { nombre, descripcion, precio, stock, artesano: { connect: { id: artesanoId } } }, 
        include: { artesano: true }
    })
}

export const actualizarProducto = async (id, datos) => {
    const existe = await prisma.producto.findUnique({ where: { id } })
    if (!existe) {
        throw new Error(`No existe un producto con ID ${id}`)
    }
    const { nombre, descripcion, precio, stock, artesanoId } = datos
    await verificarArtesano(artesanoId)
    return prisma.producto.update({
        where: { id },
        data: { nombre, descripcion, precio, stock, artesano: { connect: { id: artesanoId } } },
        include: { artesano: true }
    })
}

export const eliminarProducto = async (id) => {
    const existe = await prisma.producto.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.producto.delete({ where: { id } })
}