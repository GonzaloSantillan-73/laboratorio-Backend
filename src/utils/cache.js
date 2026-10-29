// Cache simple en memoria
// Se guarda cada resultado con la hora en que vence

const cache = {}

// tiempo de vida de cada dato en la cache (30 segundos)
export const TTL = 30 * 1000

export const obtenerDeCache = (clave) => {
    const dato = cache[clave]

    if (!dato) {
        return null
    }

    // si ya paso el tiempo de vida lo borramos y devolvemos null
    if (Date.now() > dato.vence) {
        delete cache[clave]
        console.log(`[CACHE] Vencido: ${clave}`)
        return null
    }

    return dato.valor
}

export const guardarEnCache = (clave, valor) => {
    cache[clave] = {
        valor: valor,
        vence: Date.now() + TTL
    }
}

// borra todo lo que empiece con el prefijo (ej: "rubros")
export const limpiarCache = (prefijo) => {
    for (const clave in cache) {
        if (clave.startsWith(prefijo)) {
            delete cache[clave]
        }
    }
    console.log(`[CACHE] Se limpio la cache de ${prefijo}`)
}
