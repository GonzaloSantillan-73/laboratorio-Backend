import prisma from '../config/prisma.js'

export const consultarProducto = async (criterios) => {
    const { nombre, descripcion, precio, stock, activo, ordenPor, direccion, pagina, limite } = criterios
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
    // llega como texto desde la url, por eso se compara con 'true'
    where.activo = activo === 'true'
    const desplazamiento = (pagina - 1) * limite
    const [productos, total] = await prisma.$transaction([
        prisma.producto.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite
        }),
        prisma.producto.count({ where })
    ])
    return { productos, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}


export const consultarProductoPorId = async (id) => {
    return prisma.producto.findUnique({ where: { id }, include: { artesano: true } })
}


export const crearProducto = async (datos, usuarioId) => {
    const { nombre, descripcion, precio, stock } = datos
    // el artesano sale de la cuenta autenticada, nunca del body
    const artesano = await prisma.artesano.findUniqueOrThrow({
        where: { usuarioId }
    })
    return prisma.producto.create({
        data: { nombre, descripcion, precio, stock, artesano: { connect: { id: artesano.id } } },
        include: { artesano: true }
    })
}

export const actualizarProducto = async (id, usuarioId, datos) => {
    // busca el producto solo entre los del artesano que hace la solicitud
    const existe = await prisma.producto.findFirst({
        where: { id, artesano: { usuarioId } }
    })
    if (!existe) {
        return null
    }
    const { nombre, descripcion, precio, stock } = datos
    return prisma.producto.update({
        where: { id },
        data: { nombre, descripcion, precio, stock },
        include: { artesano: true }
    })
}

export const eliminarProducto = async (id, usuarioId) => {
    const existe = await prisma.producto.findFirst({
        where: { id, artesano: { usuarioId } }
    })
    if (!existe) {
        return null
    }
    return prisma.producto.delete({ where: { id } })
}

export const cambiarActivoProducto = async (id, usuarioId, activo) => {
    // busca el producto solo entre los del artesano que hace la solicitud
    const producto = await prisma.producto.findFirst({
        where: { id, artesano: { usuarioId } }
    })
    if (!producto) {
        return null
    }
    return prisma.producto.update({
        where: { id },
        data: { activo },
        select: { id: true, nombre: true, activo: true }
    })
}

export const listarMisProductos = async (usuarioId) => {
    return prisma.producto.findMany({
        where: { artesano: { usuarioId } },
        orderBy: { createdAt: 'desc' }
    })
}
