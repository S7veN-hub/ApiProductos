create database apiproductos;

\c apiproductos;

create table Product_Detail (
    Product_Detail_ID int Generated Always as Identity Primary Key,
    Description varchar(255),
    Price decimal(10, 2) not null,
    Discount decimal(10, 2),
    Stock int,
    Currency char(3)
);

create table Product (
    Product_ID int Generated Always as Identity Primary Key,
    Name varchar(255) not null,
    Image varchar(255) not null,
    Product_Detail_ID int,
    Foreign Key (Product_Detail_ID) references Product_Detail(Product_Detail_ID)
);

create table User_Service (
    User_ID int Generated Always as Identity Primary Key,
    Name varchar(255) not null,
    Email varchar(255) not null unique,
    Password_Hash varchar(255) not null,
    Role varchar(255) not null
);

create table Transaction (
    Transaction_ID int Generated Always as Identity Primary Key,
    Transaction_Date timestamptz not null,
    Amount decimal(10, 2) not null,
    Currency char(3) not null,
    User_ID int,
    Foreign Key (User_ID) references User_Service(User_ID),
    Product_ID int,
    Foreign Key (Product_ID) references Product(Product_ID)
);

create table Sessions (
    Session_ID UUID Primary Key,
    User_ID int,
    Foreign Key (User_ID) references User_Service(User_ID),
    Expiration_Date timestamptz not null,
    Created_At timestamptz not null default current_timestamp,
    Refresh_Token_Hash varchar(255) not null,
    Revoked_At timestamptz
);

insert into Product_Detail (Description, Price, Discount, Stock, Currency) values
('Lirio 1', 19.99, 0.00, 100, 'USD'),
('Lirio 2', 29.99, 0.00, 50, 'USD'),
('Lirio 3', 39.99, 0.00, 25, 'USD'),
('Lirio 4', 49.99, 0.00, 10, 'USD'),
('Lirio 5', 59.99, 0.00, 5, 'USD');

insert into Product (Name, Image, Product_Detail_ID) values
('Lirio 1', './assets/images/lirios/lirio1.webp', 16),
('Lirio 2', './assets/images/lirios/lirio2.webp', 17),
('Lirio 3', './assets/images/lirios/lirio3.webp', 18),
('Lirio 4', './assets/images/lirios/lirio4.webp', 19),
('Lirio 5', './assets/images/lirios/lirio5.webp', 20);

update product
set image = '/assets/images/cactus/cactus1.webp'
where product_id = 1;

update product
set image = '/assets/images/cactus/cactus2.webp'
where product_id = 2;

update product
set image = '/assets/images/cactus/cactus3.webp'
where product_id = 3;

update product
set image = '/assets/images/cactus/cactus4.webp'
where product_id = 4;

update product
set image = '/assets/images/cactus/cactus5.webp'
where product_id = 5;

update product
set image = '/assets/images/claveles/claveles1.webp'
where product_id = 6;

update product
set image = '/assets/images/claveles/claveles2.webp'
where product_id = 7;

update product
set image = '/assets/images/claveles/claveles3.webp'
where product_id = 8;

update product
set image = '/assets/images/claveles/claveles4.webp'
where product_id = 9;

update product
set image = '/assets/images/claveles/claveles5.webp'
where product_id = 10;

update product
set image = '/assets/images/ficus/ficus1.webp'
where product_id = 11;

update product
set image = '/assets/images/ficus/ficus2.webp'
where product_id = 12;

update product
set image = '/assets/images/ficus/ficus3.webp'
where product_id = 13;

update product
set image = '/assets/images/ficus/ficus4.webp'
where product_id = 14;

update product
set image = '/assets/images/ficus/ficus5.webp'
where product_id = 15;

update product
set image = '/assets/images/lirios/lirio1.webp '
where product_id = 16;

update product
set image = '/assets/images/lirios/lirio2.webp'
where product_id = 17;

update product
set image = '/assets/images/lirios/lirio3.webp'
where product_id = 18;

update product
set image = '/assets/images/lirios/lirio4.webp'
where product_id = 19;

update product
set image = '/assets/images/lirios/lirio5.webp'
where product_id = 20;
