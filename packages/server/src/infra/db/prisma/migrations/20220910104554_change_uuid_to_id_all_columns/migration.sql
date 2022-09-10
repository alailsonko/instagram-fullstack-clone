-- This is an empty migration.
ALTER TABLE "User" RENAME COLUMN "uuid" TO "id";
ALTER TABLE "Media" RENAME COLUMN "uuid" TO "id";
ALTER TABLE "Post" RENAME COLUMN "uuid" TO "id";
