/*
  Warnings:

  - Made the column `uuid` on table `Media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `User` required. This step will fail if there are existing NULL values in that column.


*/

CREATE EXTENSION "pgcrypto";

-- AlterTable
UPDATE "Media" SET "uuid" = gen_random_uuid();

UPDATE "Post" SET "uuid" = gen_random_uuid();

UPDATE "User" SET "uuid" = gen_random_uuid();

ALTER TABLE "Media" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" SET NOT NULL;
