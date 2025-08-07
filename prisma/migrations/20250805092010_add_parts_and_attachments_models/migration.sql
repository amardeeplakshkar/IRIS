/*
  Warnings:

  - You are about to drop the column `attachments` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `parts` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "attachments",
DROP COLUMN "parts";

-- CreateTable
CREATE TABLE "public"."MessagePart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "url" TEXT,
    "metadata" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MessagePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MessagePart" ADD CONSTRAINT "MessagePart_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
