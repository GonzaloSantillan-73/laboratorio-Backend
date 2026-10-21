import { z } from "zod"

export const usuarioSchema = z.object({
    nombre: z.string().trim().min(2, 'El nombre es obligatorio').max(100),
    apellido: z.string().trim().min(2, 'El apellido es obligatorio').max(100),
    email: z.string().trim().email('El email no es válido').max(100),
    password: z.string().trim().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
    rolId: z.number().int('El rol debe ser un número entero').positive('El rol debe ser un número positivo'),
})

export const registrarUsuarioSchema = z.object({
    nombre: z.string().trim().min(2, "Debe tener al menos 2 caracteres."),
    apellido: z.string().trim().min(2, "Debe tener al menos 2 caracteres."),
    email: z.email("El email no tiene un formato válido."),
    password: z.string().min(8, "Debe tener al menos 8 caracteres."),
    rolId: z.number().int('El rol debe ser un número entero').positive('El rol debe ser un número positivo'),
})

export const iniciarSesionSchema = z.object({
    email: z.email("El email no tiene un formato válido."),
    password: z.string().min(1, "La contraseña es obligatoria."),
})

export const consultarUsuarioSchema = z.object({
    nombre: z.string().trim().max(100).optional(),
    apellido: z.string().trim().max(100).optional(),
    email: z.string().trim().max(100).optional(),
    rolId: z.coerce.number().int().positive().optional(),
    ordenPor: z.enum(['nombre', 'apellido', 'email', 'rolId']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
})

export const visitanteSchema = z.object({
    nombre: z.string().trim().min(2).max(120),
    dni: z.string().trim().regex(/^\d{7,8}$/),
    direccion: z.string().trim().min(5).max(200)
}).strict()

export const registroVisitanteSchema =
    registrarUsuarioSchema.extend({
        nombre: visitanteSchema.shape.nombre,
        dni: visitanteSchema.shape.dni,
        direccion: visitanteSchema.shape.direccion
    }).strict()