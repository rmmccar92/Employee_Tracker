DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;


-- department names and department ids
CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
);

-- job title, role id, the department that role belongs to, and the salary for that role
CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  job_title VARCHAR(60),
  salary INT NOT NULL,
  department_title VARCHAR(100),
  FOREIGN KEY (department_title)
  REFERENCES department(department_name)
  ON DELETE SET NULL
);

-- employee ids, first names, last names, job titles, departments, salaries, and managers
CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  employee_first_name VARCHAR(30) NOT NULL,
  employee_last_name VARCHAR(30) NOT NULL,
  role_title VARCHAR(100),
  department_title VARCHAR(100),
  -- manager possibly a new table with just managers
  -- Link to role table for job title and salary
  role VARCHAR(30) NOT NULL,
  FOREIGN KEY (role_title) 
  REFERENCES role(job_title) 
  ON DELETE SET NULL
  FOREIGN KEY (department_title)
  REFERENCES department(department_name)
  ON DELETE SET NULL
);

