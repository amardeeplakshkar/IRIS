-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "parts" JSONB;
