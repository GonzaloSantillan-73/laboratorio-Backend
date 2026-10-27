import prisma from '../config/prisma.js'

export const consultarCoordenadas = async (criterios) => {
    const { x, y, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (x !== undefined) {
        where.x = x
    }

    if (y !== undefined) {
        where.y = y
    }

    const desplazamiento = (pagina - 1) * limite
    const [coordenadas, total] = await prisma.$transaction([
        prisma.coordenada.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite,
        }),
        prisma.coordenada.count({ where })
    ])
    return { coordenadas, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}

export const consultarCoordenadaPorId = async (id) => {
    return prisma.coordenada.findUnique({
        where: { id },
        include: { stand: true }
    })
}

export const crearCoordenada = async (datos) => {
    const { x, y } = datos
    return prisma.coordenada.create({
        data: { x, y }
    })
}

export const actualizarCoordenada = async (id, datos) => {
    const existe = await prisma.coordenada.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { x, y } = datos
    return prisma.coordenada.update({
        where: { id },
        data: { x, y }
    })
}

export const eliminarCoordenada = async (id) => {
    const existe = await prisma.coordenada.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.coordenada.delete({ where: { id } })
}
