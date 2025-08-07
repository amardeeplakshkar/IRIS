/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessagePart` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attachments` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parts` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_messageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MessagePart" DROP CONSTRAINT "MessagePart_messageId_fkey";

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "attachments" JSONB NOT NULL,
ADD COLUMN     "parts" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."Attachment";

-- DropTable
DROP TABLE "public"."MessagePart";
