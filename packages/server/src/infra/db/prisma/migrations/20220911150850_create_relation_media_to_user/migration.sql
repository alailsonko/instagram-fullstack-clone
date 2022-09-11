-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("idSerial") ON DELETE CASCADE ON UPDATE CASCADE;
