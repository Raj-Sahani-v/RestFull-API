CREATE TABLE users_node(
    id varchar(50) unique primary key,
    username varchar(30) unique not null,
    email varchar(50) unique not null,
    password varchar(30) not null
);