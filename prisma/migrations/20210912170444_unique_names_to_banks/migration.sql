/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bank.name_unique" ON "Bank"("name");
