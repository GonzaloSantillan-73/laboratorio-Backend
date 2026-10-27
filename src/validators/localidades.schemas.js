import { z } from "zod"

export const localidadIdParametrosSchema = z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe tener solo números')
})

export const consultarLocalidadSchema = z.object({
    nombre: z.string().trim().max(100).optional(),
    provinciaId: z.string().regex(/^\d+$/).optional(),
    departamentoId: z.string().regex(/^\d+$/).optional(),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
})

export const consultarDepartamentoSchema = z.object({
    provinciaId: z.string().regex(/^\d+$/).optional(),
})
