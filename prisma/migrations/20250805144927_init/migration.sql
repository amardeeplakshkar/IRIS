/*
  Warnings:

  - The `attachments` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parts` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB[],
DROP COLUMN "parts",
ADD COLUMN     "parts" JSONB[];
