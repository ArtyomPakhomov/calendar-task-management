/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "serialNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_serialNumber_key" ON "Task"("serialNumber");
