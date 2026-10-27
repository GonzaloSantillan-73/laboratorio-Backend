import prisma from '../config/prisma.js'

export const consultarRubros = async (criterios) => {
    const { nombre, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    const desplazamiento = (pagina - 1) * limite
    const [rubros, total] = await prisma.$transaction([
        prisma.rubro.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite,
        }),
        prisma.rubro.count({ where })
    ])
    return { rubros, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}

export const consultarRubroPorId = async (id) => {
    return prisma.rubro.findUnique({ where: { id } })
}

export const crearRubro = async (datos) => {
    const { nombre } = datos
    return prisma.rubro.create({
        data: { nombre }
    })
}

export const actualizarRubro = async (id, datos) => {
    const existe = await prisma.rubro.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { nombre } = datos
    return prisma.rubro.update({
        where: { id },
        data: { nombre }
    })
}

export const eliminarRubro = async (id) => {
    const existe = await prisma.rubro.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.rubro.delete({ where: { id } })
}
