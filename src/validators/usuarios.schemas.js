import {z} from "zod"

export const usuarioSchema = z.object({
    nombre: z.string().trim().min(2,'El nombre es obligatorio').max(100),
    apellido: z.string().trim().min(2,'El apellido es obligatorio').max(100),
    email: z.string().trim().max(100),
    password: z.string().trim().min(6,'La contraseña debe tener al menos 6 caracteres').max(100),
    rolId: z.number().int('El rol debe ser un número entero').positive('El rol debe ser un número positivo'),
})

export const consultarUsuarioSchema = z.object({
    nombre: z.string().trim().max(100).optional(),
    apellido: z.string().trim().max(100).optional(),
    email: z.string().trim().max(100).optional(),
    rolId: z.number().int().positive().optional(),
    ordenPor: z.enum(['nombre', 'apellido', 'email', 'rolId']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
})