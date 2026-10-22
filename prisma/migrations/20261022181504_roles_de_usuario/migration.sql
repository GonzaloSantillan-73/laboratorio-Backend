/*
  Warnings:

  - You are about to drop the `Visitante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Visitante" DROP CONSTRAINT "Visitante_usuarioId_fkey";

-- DropTable
DROP TABLE "Visitante";


INSERT INTO "Rol" ("nombre")
VALUES
  ('ARTESANO'),
  ('ADMINISTRADOR');
