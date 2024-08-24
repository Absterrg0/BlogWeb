/*
  Warnings:

  - You are about to drop the column `votes` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_postId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "votes";
-- Add the new `updatedAt` column with a default value to avoid errors with existing rows
ALTER TABLE "Comment" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();

-- (Optional) Remove the default value to match the Prisma schema after the migration
ALTER TABLE "Comment" ALTER COLUMN "updatedAt" DROP DEFAULT;
