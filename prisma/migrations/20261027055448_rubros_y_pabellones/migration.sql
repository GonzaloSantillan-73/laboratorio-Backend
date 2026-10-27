/*
  Warnings:

  - You are about to drop the column `rubro` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `pabellon` on the `Stand` table. All the data in the column will be lost.
  - Added the required column `pabellonId` to the `Stand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN "rubro";

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "pabellon",
ADD COLUMN     "pabellonId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Rubro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtesanoRubro" (
    "artesanoId" INTEGER NOT NULL,
    "rubroId" INTEGER NOT NULL,

    CONSTRAINT "ArtesanoRubro_pkey" PRIMARY KEY ("artesanoId","rubroId")
);

-- CreateTable
CREATE TABLE "Pabellon" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Pabellon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_key" ON "Rubro"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pabellon_nombre_key" ON "Pabellon"("nombre");

-- AddForeignKey
ALTER TABLE "ArtesanoRubro" ADD CONSTRAINT "ArtesanoRubro_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtesanoRubro" ADD CONSTRAINT "ArtesanoRubro_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "Rubro" ("nombre")
VALUES
  ('Textil'),
  ('Cerámica'),
  ('Platería'),
  ('Cuero'),
  ('Madera'),
  ('Cestería');

INSERT INTO "Pabellon" ("nombre")
VALUES
  ('Pabellón 1'),
  ('Pabellón 2'),
  ('Pabellón 3');
