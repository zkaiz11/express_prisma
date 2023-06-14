/*
  Warnings:

  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role_id`,
    ADD COLUMN `role` INTEGER NOT NULL DEFAULT 2931;
