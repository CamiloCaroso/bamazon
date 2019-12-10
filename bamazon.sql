-- bamazon --

DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(20) NULL,
    department_name VARCHAR(20) NULL,
    price DECIMAL(10, 2) NULL,
    stock_quantity INTEGER NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Canon", "Cameras", 599.99, 24),
("Nikon", "Cameras", 399.99, 31),
("Beats", "Headphones", 199.99, 18),
("Sony", "Headphones", 279.99, 27),
("Acer", "Laptops", 219.00, 37),
("Dell", "Laptops", 299.99, 11),
("IPad", "Tablets", 799.99, 40),
("Samsung", "Tablets", 179.99, 22),
("Nintendo Switch", "Video Games", 299.99, 45),
("BlackBerry", "Cell Phones", 99.99, 1);

SELECT * FROM products;