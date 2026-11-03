import test from "node:test";
import assert from "node:assert/strict";
import { ProductoSchema } from "../src/validators/productos.schemas.js";

const valido = { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: 15000, stock: 5 };

const casos = [
    ["producto completo", valido, true],
    ["campo ausente", { nombre: "Vasija", descripcion: "Vasija pintada", precio: 100 }, false],
    ["nombre muy corto", { ...valido, nombre: "V" }, false],
    ["nombre de 100 caracteres", { ...valido, nombre: "a".repeat(100) }, true],
    ["nombre de 101 caracteres", { ...valido, nombre: "a".repeat(101) }, false],
    ["descripción de 301 caracteres", { ...valido, descripcion: "a".repeat(301) }, false],
    ["precio cero", { ...valido, precio: 0 }, false],
    ["precio negativo", { ...valido, precio: -10 }, false],
    ["precio decimal", { ...valido, precio: 1500.5 }, true],
    ["precio como texto", { ...valido, precio: "15000" }, false],
    ["stock decimal", { ...valido, stock: 1.5 }, false],
    ["stock cero", { ...valido, stock: 0 }, false],
    ["campo adicional artesanoId", { ...valido, artesanoId: 7 }, false],
];

for (const [nombre, entrada, esValido] of casos) {
    test(`Esquema: ${nombre}`, () => {
        const resultado = ProductoSchema.safeParse(entrada);
        assert.equal(resultado.success, esValido);
    });
}
