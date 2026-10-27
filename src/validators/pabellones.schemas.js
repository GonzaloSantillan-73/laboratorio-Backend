import { z } from "zod"

export const pabellonSchema = z.object({
    nombre: z.string().trim().min(2, 'El nombre del pabellón es obligatorio').max(100),
})

export const consultarPabellonSchema = z.object({
    nombre: z.string().trim().max(100).optional(),
    ordenPor: z.enum(['nombre']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
})
