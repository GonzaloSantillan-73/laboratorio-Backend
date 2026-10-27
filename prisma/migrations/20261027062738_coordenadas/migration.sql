/*
  Warnings:

  - You are about to drop the column `coordenadaX` on the `Stand` table. All the data in the column will be lost.
  - You are about to drop the column `coordenadaY` on the `Stand` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coordenadaId]` on the table `Stand` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coordenadaId` to the `Stand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "coordenadaX",
DROP COLUMN "coordenadaY",
ADD COLUMN     "coordenadaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Coordenada" (
    "id" SERIAL NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "Coordenada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coordenada_x_y_key" ON "Coordenada"("x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_coordenadaId_key" ON "Stand"("coordenadaId");

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_coordenadaId_fkey" FOREIGN KEY ("coordenadaId") REFERENCES "Coordenada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "Coordenada" ("x", "y")
VALUES
  (1, 1), (1, 2), (1, 3),
  (2, 1), (2, 2), (2, 3),
  (3, 1), (3, 2), (3, 3);
