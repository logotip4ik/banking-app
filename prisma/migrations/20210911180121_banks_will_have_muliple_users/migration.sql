/*
  Warnings:

  - You are about to drop the column `userId` on the `Bank` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_userId_fkey";

-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_BankToBankUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BankToBankUser_AB_unique" ON "_BankToBankUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BankToBankUser_B_index" ON "_BankToBankUser"("B");

-- AddForeignKey
ALTER TABLE "_BankToBankUser" ADD FOREIGN KEY ("A") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BankToBankUser" ADD FOREIGN KEY ("B") REFERENCES "BankUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
