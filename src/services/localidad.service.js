import prisma from '../config/prisma.js'

export const consultarProvincias = async () => {
    return prisma.provincia.findMany({
        orderBy: { nombre: 'asc' }
    })
}

export const consultarDepartamentos = async (criterios) => {
    const { provinciaId } = criterios

    const where = {}

    if (provinciaId !== undefined) {
        where.provinciaId = provinciaId
    }

    return prisma.departamento.findMany({
        where,
        orderBy: { nombre: 'asc' }
    })
}

export const consultarLocalidades = async (criterios) => {
    const { nombre, provinciaId, departamentoId, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    if (provinciaId !== undefined) {
        where.provinciaId = provinciaId
    }

    if (departamentoId !== undefined) {
        where.departamentoId = departamentoId
    }

    const desplazamiento = (pagina - 1) * limite
    const [localidades, total] = await prisma.$transaction([
        prisma.localidad.findMany({
            where,
            orderBy: [{ nombre: 'asc' }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite,
            include: { departamento: true, provincia: true }
        }),
        prisma.localidad.count({ where })
    ])
    return { localidades, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}

export const consultarLocalidadPorId = async (id) => {
    return prisma.localidad.findUnique({
        where: { id },
        include: { departamento: true, provincia: true }
    })
}
