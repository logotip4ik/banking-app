-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER,
    "name" TEXT NOT NULL,
    "interestRate" INTEGER NOT NULL,
    "MaxLoan" INTEGER NOT NULL,
    "MaxDownPayment" INTEGER NOT NULL,
    "LoanTerm" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bank" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
