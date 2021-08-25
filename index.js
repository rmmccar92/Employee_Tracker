const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '429UXxw@w48zE',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

dbConnection.connect(err => {
    if (err) {
      throw err;
    }
    console.log("Connected to database");
    questions();
  });

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const questions = () => {
  return inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
          "View all Departments",
          "View All Employees",
          "View All Roles",
          "Add Department",
          "Add Employee",
          "Add Role",
          "Update Employee Role",
          "Quit",]
      },
      
      {
        type: 'input',
        name: 'firstName',
        message: 'Please enter the first name of this employee',
        when: (data) => data.action === 'Add Employee',
    },
      
      {
        type: 'input',
        name: 'lastName',
        message: 'Please enter the last name of this employee',
        when: (data) => data.action === 'Add Employee',
    },


  ])

}