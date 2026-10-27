import prisma from '../config/prisma.js'

export const consultarPabellones = async (criterios) => {
    const { nombre, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    const desplazamiento = (pagina - 1) * limite
    const [pabellones, total] = await prisma.$transaction([
        prisma.pabellon.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite,
        }),
        prisma.pabellon.count({ where })
    ])
    return { pabellones, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}

export const consultarPabellonPorId = async (id) => {
    return prisma.pabellon.findUnique({
        where: { id },
        include: { stands: true }
    })
}

export const crearPabellon = async (datos) => {
    const { nombre } = datos
    return prisma.pabellon.create({
        data: { nombre }
    })
}

export const actualizarPabellon = async (id, datos) => {
    const existe = await prisma.pabellon.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { nombre } = datos
    return prisma.pabellon.update({
        where: { id },
        data: { nombre }
    })
}

export const eliminarPabellon = async (id) => {
    const existe = await prisma.pabellon.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.pabellon.delete({ where: { id } })
}
