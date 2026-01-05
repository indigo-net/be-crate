-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'DATE';
ALTER TYPE "QuestionType" ADD VALUE 'FILE';

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 1;
