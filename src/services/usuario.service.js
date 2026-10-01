import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'


const verificarRol = async (rolId) => {
    if (rolId === undefined || rolId === null) {
        return
    }
    const rol = await prisma.rol.findUnique({
        where: { id: rolId }
    })
    if (!rol) {
        throw crearError(`No existe un rol con ID ${rolId}`, 400)
    }
}

export const consultarUsuario = async (criterios) => {
    const { nombre, apellido, email, rolId, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    if (apellido !== undefined) {
        where.apellido = { contains: apellido, mode: 'insensitive' }
    }

    if (email !== undefined) {
        where.email = {
            contains: email, mode: 'insensitive'
        }
    }
    if (rolId !== undefined) {
        where.rolId = {
            contains: rolId}
    }

    const desplazamiento = (pagina - 1) * limite
    const { usuarios,total } = await prisma.usuario.findMany({
        where,
        orderBy: [{ [ordenPor]: direccion },{id:'asc'}],
        skip: desplazamiento,
        take: limite,
        include: { rol: true }
    })
    prisma.usuario.count({ where })
    return { usuarios, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}


export const consultarUsuarioPorId = async (id) => {
    return prisma.usuario.findUnique({ where: { id }, include: { rol: true } })
}

export const crearUsuario = async (datos) => {
    const { nombre, apellido, email, password, rolId } = datos
    await verificarRol(rolId)
    return prisma.usuario.create({
        data: {
            nombre,
            apellido,
            email,
            password,
            rol: { connect: { id: rolId } }
        },
        include: { rol: true }
    })
}

export const actualizarUsuario = async (id, datos) => {
    const existe = await prisma.usuario.findUnique({ where: { id } })
    if (!existe) {
        throw new Error(`No existe un usuario con ID ${id}`)
    }
    const { nombre, apellido, email, password, rolId } = datos
    await verificarRol(rolId)
    return prisma.usuario.update({
        where: { id },
        data: {
            nombre,
            apellido,
            email,
            password,
            rol: { connect: { id: rolId } }
        },
        include: { rol: true }
    })
}

export const eliminarUsuario = async (id) => {
    const existe = await prisma.usuario.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.usuario.delete({ where: { id } })
}