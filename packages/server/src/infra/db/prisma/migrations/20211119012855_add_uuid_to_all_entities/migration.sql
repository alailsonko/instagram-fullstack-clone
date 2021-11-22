-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" DROP NOT NULL;
