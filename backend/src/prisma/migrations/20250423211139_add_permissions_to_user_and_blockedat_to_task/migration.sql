-- CreateEnum
CREATE TYPE "UserPermission" AS ENUM ('BLOCK_TASKS', 'ALL');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "blockedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "UserPermission"[];
