CREATE TABLE `customer`
(
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(64)  NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `enabled`  BOOLEAN NOT NULL DEFAULT TRUE,
    `created_on` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `last_updated` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    unique(`email`)
);
