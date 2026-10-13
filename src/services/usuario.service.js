import bcrypt from "bcrypt";
import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'

const FACTOR_COSTO = 10;


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
        where.rolId = rolId
    }

    const desplazamiento = (pagina - 1) * limite
    const [usuarios, total] = await prisma.$transaction([
        prisma.usuario.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion },{id:'asc'}],
            skip: desplazamiento,
            take: limite,
            include: { rol: true }
        }),
        prisma.usuario.count({ where })
    ])
    return { usuarios, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}


export const consultarUsuarioPorId = async (id) => {
    return prisma.usuario.findUnique({ where: { id }, include: { rol: true } })
}

export const crearUsuario = async (datos) => {
    const { nombre, apellido, email, password, rolId } = datos
    await verificarRol(rolId)
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
    return prisma.usuario.create({
        data: {
            nombre,
            apellido,
            email,
            passwordHash,
            rol: { connect: { id: rolId } }
        },
        include: { rol: true }
    })
}

export const actualizarUsuario = async (id, datos) => {
    const existe = await prisma.usuario.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { nombre, apellido, email, password, rolId } = datos
    await verificarRol(rolId)
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
    return prisma.usuario.update({
        where: { id },
        data: {
            nombre,
            apellido,
            email,
            passwordHash,
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

export const registrarUsuario = async (registrarUsuarioDto) => {
    const { nombre, apellido, email, password, rolId } = registrarUsuarioDto;
    // Busca un usuario con el mismo email.
    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: email }
    });
    if (usuarioExistente) {
        const error = new Error("Ya existe usuario con ese email.");
        error.status = 409;
        throw error;
    }
    await verificarRol(rolId)
    // Genera el salt y el hash de la contraseña.
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
    // Guarda hash, nunca contraseña original.
    return prisma.usuario.create({
        data: {
            nombre: nombre, apellido: apellido, email: email,
            passwordHash: passwordHash, rol: { connect: { id: rolId } }
        },
        select: {
            id: true, nombre: true, apellido: true,
            email: true, createdAt: true
        }
    });
};

export const iniciarSesion = async (iniciarSesionDto) => {
    const { email, password } = iniciarSesionDto;
    const usuario = await prisma.usuario.findUnique({
        where: { email: email }
    });
    if (!usuario) {
        const error = new Error("Las credenciales son inválidas.");
        error.status = 401;
        throw error;
    }
    // Compara la contraseña con el hash almacenado.
    const passwordValida = await bcrypt.compare(
        password,
        usuario.passwordHash
    );

    if (!passwordValida) {
        const error = new Error(
            "Las credenciales son inválidas."
        );

        error.status = 401;
        throw error;
    }

    // respuesta del servicio.
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
    };
};