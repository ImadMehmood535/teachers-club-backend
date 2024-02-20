/*
  Warnings:

  - You are about to alter the column `price` on the `boxes` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `height` on the `boxes` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `length` on the `boxes` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `width` on the `boxes` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `weight` on the `boxes` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `boxes` MODIFY `price` DOUBLE NULL,
    MODIFY `height` DOUBLE NULL,
    MODIFY `length` DOUBLE NULL,
    MODIFY `width` DOUBLE NULL,
    MODIFY `weight` DOUBLE NULL;
