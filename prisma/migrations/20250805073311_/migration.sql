/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_clerkId_key" ON "public"."Chat"("clerkId");
