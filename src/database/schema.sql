CREATE DATABASE final_project;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, 
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    cpf TEXT DEFAULT NULL UNIQUE,
    phone_number TEXT DEFAULT NULL
);

DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL ,
    cpf TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT,
    address2 TEXT,
    zip_code TEXT,
    district TEXT,
    city TEXT,
    state TEXT,
    user_id INTEGER REFERENCES users (id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS charges;

    CREATE TABLE charges (
        id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
        description TEXT NOT NULL,
        due_date DATE NOT NULL,
        status SMALLINT DEFAULT 1,
        value INTEGER NOT null,
        user_id INTEGER REFERENCES users (id),
        client_id INTEGER REFERENCES clients (id)
    );