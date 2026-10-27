import "dotenv/config";
import { readFile } from "node:fs/promises";
import prisma from "../src/config/prisma.js";

try {
    const texto = await readFile("scripts/datos/localidades.json", "utf-8");
    const datos = JSON.parse(texto);

    const provincias = [];
    const departamentos = [];
    const localidades = [];

    for (const l of datos.localidades) {
        provincias.push({ id: l.provincia.id, nombre: l.provincia.nombre });
        departamentos.push({ id: l.departamento.id, nombre: l.departamento.nombre, provinciaId: l.provincia.id });
        localidades.push({
            id: l.id, nombre: l.nombre,
            departamentoId: l.departamento.id, provinciaId: l.provincia.id
        });
    }

    // skipDuplicates saltea las provincias y departamentos que se repiten
    await prisma.provincia.createMany({ data: provincias, skipDuplicates: true });
    await prisma.departamento.createMany({ data: departamentos, skipDuplicates: true });
    await prisma.localidad.createMany({ data: localidades, skipDuplicates: true });

    console.log(`Se cargaron ${localidades.length} localidades.`);
} finally {
    await prisma.$disconnect();
}
