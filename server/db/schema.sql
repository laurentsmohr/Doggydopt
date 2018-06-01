CREATE DATABASE destroys_dogslife;

USE destroys_dogslife;

CREATE TABLE breeds(
    id int NOT NULL AUTO_INCREMENT,
    breed varchar(255) NOT NULL,
    weight_avg int,
    shedding varchar(255),
    grooming varchar(255),
    exercise varchar(255),
    biddability varchar(255),
    prey_drive varchar(255),
    barking varchar(255),
    PRIMARY KEY (ID)
);