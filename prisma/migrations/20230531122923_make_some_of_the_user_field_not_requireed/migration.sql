-- AlterTable
ALTER TABLE `Role` MODIFY `desc` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `first_name` VARCHAR(191) NULL,
    MODIFY `last_name` VARCHAR(191) NULL;
