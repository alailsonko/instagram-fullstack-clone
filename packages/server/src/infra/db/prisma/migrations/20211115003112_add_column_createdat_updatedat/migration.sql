/*
  Warnings:

  - Added the required column `createdAt` to the `LikesOnPosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LikesOnPosts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LikesOnPosts" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;
