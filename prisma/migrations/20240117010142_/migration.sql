-- CreateTable
CREATE TABLE `admin_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `verified` BOOLEAN NULL DEFAULT false,
    `address` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NULL,
    `refresh_token` VARCHAR(255) NULL,
    `ip_address` VARCHAR(255) NULL,
    `browser` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `contactId` INTEGER NULL,

    INDEX `FK_ADMIN_ID`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `admin_detail_id` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FK_ADMIN_DETAILS_ID`(`admin_detail_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `subject` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `message` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `picture` VARCHAR(255) NULL,
    `message` VARCHAR(255) NULL,
    `rating` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `featured_teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `box_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `box_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boxes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `item_name` VARCHAR(255) NULL,
    `details` VARCHAR(255) NULL,
    `price` INTEGER NULL,
    `height` INTEGER NULL,
    `length` INTEGER NULL,
    `width` INTEGER NULL,
    `weight` INTEGER NULL,
    `item_quantity` INTEGER NULL,
    `is_brand` BOOLEAN NULL,
    `type_id` INTEGER NULL,
    `image` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FK_BOX_TYPE_ID`(`type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `customer_id` VARCHAR(191) NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `number` VARCHAR(255) NULL,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `tax_amount` DOUBLE NULL,
    `shipping_cost` DOUBLE NULL,
    `gross_amount` DOUBLE NULL,
    `net_amount` DOUBLE NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribes_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscribe_id` INTEGER NULL,
    `selected_brand_id` INTEGER NULL,
    `box_id` INTEGER NULL,
    `shipper_id` INTEGER NULL,
    `quantity` INTEGER NULL,
    `delivery_address` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `postal_code` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `number` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `tax_amount` DOUBLE NULL,
    `shipping_cost` DOUBLE NULL,
    `gross_amount` DOUBLE NULL,
    `net_amount` DOUBLE NULL,
    `createdAt` DATETIME(3) NULL,
    `placed` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dispatched` DATETIME(3) NULL,
    `transit` DATETIME(3) NULL,
    `delivered` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `selected_brand_id` INTEGER NULL,
    `box_id` INTEGER NULL,
    `shipper_id` INTEGER NULL,
    `quantity` INTEGER NULL,
    `delivery_address` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `postal_code` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_boxes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `box_id` INTEGER NULL,
    `max_quantity` INTEGER NULL,
    `donated_quantity` INTEGER NULL DEFAULT 0,
    `status` BOOLEAN NULL DEFAULT false,
    `deleted` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FK_BOX_ID`(`box_id`),
    INDEX `FK_USER_ID`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstname` VARCHAR(255) NULL,
    `lastname` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `postal_code` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `otp` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `is_verified` BOOLEAN NULL DEFAULT false,
    `is_featured` BOOLEAN NULL DEFAULT false,
    `is_sponsored` BOOLEAN NULL DEFAULT false,
    `requirement_description` LONGTEXT NULL,
    `requirement_details` VARCHAR(255) NULL,
    `requirements` VARCHAR(255) NULL,
    `current_institute` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_details_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_views` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `viewer_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FK_PROFILE_VIEW_ID`(`viewer_id`),
    INDEX `FK_USERS_ID`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `ip_address` VARCHAR(255) NULL,
    `browser` VARCHAR(255) NULL,
    `refresh_token` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FK_USER_SESSION_ID`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_sessions` ADD CONSTRAINT `FK_ADMIN_ID` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `fk_admin_details_id` FOREIGN KEY (`admin_detail_id`) REFERENCES `admin_details`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `featured_teachers` ADD CONSTRAINT `featured_teachers_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boxes` ADD CONSTRAINT `FK_BOX_TYPE_ID` FOREIGN KEY (`type_id`) REFERENCES `box_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `subscribes` ADD CONSTRAINT `subscribes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribes_details` ADD CONSTRAINT `subscribes_details_selected_brand_id_fkey` FOREIGN KEY (`selected_brand_id`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribes_details` ADD CONSTRAINT `subscribes_details_subscribe_id_fkey` FOREIGN KEY (`subscribe_id`) REFERENCES `subscribes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribes_details` ADD CONSTRAINT `subscribes_details_box_id_fkey` FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_selected_brand_id_fkey` FOREIGN KEY (`selected_brand_id`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_box_id_fkey` FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_boxes` ADD CONSTRAINT `FK_BOX_ID` FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_boxes` ADD CONSTRAINT `FK_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_views` ADD CONSTRAINT `FK_PROFILE_VIEW_ID` FOREIGN KEY (`viewer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_profile_views` ADD CONSTRAINT `FK_USERS_ID` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `FK_USER_SESSION_ID` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
