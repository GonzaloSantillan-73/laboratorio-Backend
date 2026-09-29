/*
  Warnings:

  - You are about to drop the column `coordenadas` on the `Stand` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Stand` table. All the data in the column will be lost.
  - Added the required column `coordenadaX` to the `Stand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordenadaY` to the `Stand` table without a default value. This is not possible if the table is not empty.
  - Made the column `artesanoId` on table `Stand` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_artesanoId_fkey";

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "coordenadas",
DROP COLUMN "numero",
ADD COLUMN     "coordenadaX" INTEGER NOT NULL,
ADD COLUMN     "coordenadaY" INTEGER NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'DISPONIBLE',
ALTER COLUMN "artesanoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE CASCADE ON UPDATE CASCADE;
