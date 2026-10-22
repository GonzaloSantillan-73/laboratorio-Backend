import prisma from '../config/prisma.js'

export const consultarRoles = async (criterios) => {
    const { nombre, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    const desplazamiento = (pagina - 1) * limite
    const [roles, total] = await prisma.$transaction([
        prisma.rol.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion },{id:'asc'}],
            skip: desplazamiento,
            take: limite,
        }),
        prisma.rol.count({ where })
    ])
    return { roles, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}


export const consultarRolPorId = async (id) => {
    return prisma.rol.findUnique({ where: { id } })
}

export const crearRol = async (datos) => {
    const { nombre } = datos
    return prisma.rol.create({
        data: {nombre}
    })
    }

export const actualizarRol = async (id, datos) => {
    const existe = await prisma.rol.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { nombre } = datos
    return prisma.rol.update({
        where: { id },
        data: { nombre }
    })
}

export const eliminarRol = async (id) => {
    const existe = await prisma.rol.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.rol.delete({ where: { id } })
}

export const asignarAdministrador = async (usuarioId) => {
    return prisma.$transaction(async (tx) => {
        await tx.usuario.findUniqueOrThrow({
            where: { id: usuarioId },
            select: { id: true }
        });
        const rol = await tx.rol.findUniqueOrThrow({
            where: { nombre: "ADMINISTRADOR" }
        });
        const clave = { usuarioId, rolId: rol.id };
        return tx.usuarioRol.upsert({
            where: { usuarioId_rolId: clave },
            update: {}, create: clave
        });
    });
};
