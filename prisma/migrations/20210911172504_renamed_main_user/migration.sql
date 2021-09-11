/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "BankUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankUser.email_unique" ON "BankUser"("email");

-- AddForeignKey
ALTER TABLE "Bank" ADD FOREIGN KEY ("userId") REFERENCES "BankUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
