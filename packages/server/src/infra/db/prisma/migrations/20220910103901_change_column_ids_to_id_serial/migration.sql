-- This is an empty migration.
ALTER TABLE "User" RENAME COLUMN "id" TO "idSerial";
ALTER TABLE "Media" RENAME COLUMN "id" TO "idSerial";
ALTER TABLE "Post" RENAME COLUMN "id" TO "idSerial";
