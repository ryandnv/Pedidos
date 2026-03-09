SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `orders` (
  `orderId` varchar(255) NOT NULL,
  `value` float NOT NULL,
  `creationDate` datetime NOT NULL,
  PRIMARY KEY (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `items` (
  `orderId` varchar(255) NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` float NOT NULL,
  KEY `orderId` (`orderId`),
  CONSTRAINT `items_ibfk_1`
    FOREIGN KEY (`orderId`)
    REFERENCES `orders` (`orderId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nick` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `orders` (`orderId`, `value`, `creationDate`)
VALUES ('v10089015vdb-01', 2.5, '2026-03-08 01:00:00');

INSERT INTO `items` (`orderId`, `productId`, `quantity`, `price`)
VALUES ('v10089015vdb-01', 1, 1, 5);