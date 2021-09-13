/*
  Warnings:

  - You are about to drop the column `LoanTerm` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `MaxDownPayment` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `MaxLoan` on the `Bank` table. All the data in the column will be lost.
  - Added the required column `loanTerm` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxDownPayment` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxLoan` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "LoanTerm",
DROP COLUMN "MaxDownPayment",
DROP COLUMN "MaxLoan",
ADD COLUMN     "loanTerm" INTEGER NOT NULL,
ADD COLUMN     "maxDownPayment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxLoan" INTEGER NOT NULL;
