import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "node:url";
import * as esquemas from "./src/documentacion/esquemas.js";

const doc = {
    info: {
        title: "API Feria de Artesanos", version: "1.0.0",
        description: "Documentación de la API: usuarios, artesanos, productos y stands de la feria."
    },
    servers: [{ url: "/", description: "Servidor actual" }],
    components: {
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
        },
        "@schemas": esquemas
    }
};
const ruta = (archivo) =>
    fileURLToPath(new URL(archivo, import.meta.url)).replaceAll("\\", "/");
const outputFile = ruta("./swagger-output.json");
const routes = [ruta("./app.js")];
const generar = swaggerAutogen({ openapi: "3.0.0" });
const resultado = await generar(outputFile, routes, doc);
if (!resultado.success) {
    throw new Error("No se pudo generar la especificación OpenAPI.");
}
