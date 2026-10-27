import { z } from "zod"

export const coordenadaSchema = z.object({
    x: z.number().int('La coordenada X debe ser un número entero').min(0, 'La coordenada X no puede ser negativa'),
    y: z.number().int('La coordenada Y debe ser un número entero').min(0, 'La coordenada Y no puede ser negativa'),
})

export const consultarCoordenadaSchema = z.object({
    x: z.coerce.number().int().min(0).optional(),
    y: z.coerce.number().int().min(0).optional(),
    ordenPor: z.enum(['x', 'y']).default('x'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
})
