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
    Password varchar(255) not null,
    Role varchar(255) not null
);

create table Transaction (
    Transaction_ID int Generated Always as Identity Primary Key,
    Transaction_Date date not null,
    Amount decimal(10, 2) not null,
    Currency char(3) not null,
    User_ID int,
    Foreign Key (User_ID) references User_Service(User_ID),
    Product_ID int,
    Foreign Key (Product_ID) references Product(Product_ID)
);

insert into Product (Name, Image) values
(),
(),
(),
(),
();

insert into Product_Detail (Description, Price, Discount, Stock, Currency) values
(),
(),
(),
(),
();