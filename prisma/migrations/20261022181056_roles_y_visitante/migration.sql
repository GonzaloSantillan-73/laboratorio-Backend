/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Rol` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Rol` table. All the data in the column will be lost.
  - You are about to drop the column `rolId` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_rolId_fkey";

-- AlterTable
ALTER TABLE "Rol" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rolId",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "usuarioId" UUID NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuarioId","rolId")
);

-- CreateTable
CREATE TABLE "Visitante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitante_dni_key" ON "Visitante"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Visitante_usuarioId_key" ON "Visitante"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
