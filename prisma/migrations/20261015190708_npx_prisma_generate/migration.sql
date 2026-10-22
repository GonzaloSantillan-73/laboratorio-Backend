/*
  Warnings:

  - The `usuarioId` column on the `Consulta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `usuarioId` on the `Artesano` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Artesano" DROP CONSTRAINT "Artesano_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN "usuarioId",
ADD COLUMN     "usuarioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "usuarioId",
ADD COLUMN     "usuarioId" UUID;

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "TokenRevocado" (
    "jti" TEXT NOT NULL,
    "venceEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenRevocado_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE INDEX "TokenRevocado_venceEn_idx" ON "TokenRevocado"("venceEn");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_usuarioId_key" ON "Artesano"("usuarioId");

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
