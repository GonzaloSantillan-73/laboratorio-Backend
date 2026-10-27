/*
  Warnings:

  - You are about to drop the column `localidad` on the `Artesano` table. All the data in the column will be lost.
  - Added the required column `localidadId` to the `Artesano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN "localidad",
ADD COLUMN     "localidadId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Provincia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "provinciaId" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "provinciaId" TEXT NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departamento" ADD CONSTRAINT "Departamento_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localidad" ADD CONSTRAINT "Localidad_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localidad" ADD CONSTRAINT "Localidad_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
