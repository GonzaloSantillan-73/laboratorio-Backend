import {z} from "zod"

export const ProductoSchema = z.object({
    nombre: z.string().trim().min(2,'El nombre es obligatorio').max(100),
    descripcion: z.string().trim().min(2,'La descripción es obligatoria').max(300),
    precio: z.string().trim().max(100),
    stock: z.number().int('El stock debe ser un número entero').positive('El stock debe ser un número positivo'),
})

export const consultarProductoSchema = z.object({
    nombre: z.string().trim().max(100).optional(),
    descripcion: z.string().trim().max(300).optional(),
    precio: z.string().trim().max(100).optional(),
    stock: z.number().int().positive().optional(),
    ordenPor: z.enum(['nombre', 'descripcion', 'precio', 'stock']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
})