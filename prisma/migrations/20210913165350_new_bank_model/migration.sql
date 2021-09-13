/*
  Warnings:

  - You are about to drop the `_BankToBankUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bankUserId` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BankToBankUser" DROP CONSTRAINT "_BankToBankUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BankToBankUser" DROP CONSTRAINT "_BankToBankUser_B_fkey";

-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "bankUserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_BankToBankUser";

-- AddForeignKey
ALTER TABLE "Bank" ADD FOREIGN KEY ("bankUserId") REFERENCES "BankUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
