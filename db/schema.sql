DROP DATABASE IF EXISTS tracker;
CREATE DATABASE tracker;
USE tracker;

-- DROP TABLE IF EXISTS employees;
-- DROP TABLE IF EXISTS roles;
-- DROP TABLE IF EXISTS departments;


CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);