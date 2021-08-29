const mysql = require("mysql2");
const inquirer = require("inquirer");



const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
);

db.connect((err) => {
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
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Employees",
          "View All Roles",
          "Add Department",
          "Add Employee",
          "Add Role",
          "Update Employee Role",
        ],
      },
    ])
    .then((data) => {
      switch (data.action) {
        case "View All Departments":
          allDepartments();
          break;
        case "View All Employees":
          allEmployees();
          break;
        case "View All Roles":
          allRoles();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee Role":
          update();
          break;
      }
    });
};

const allDepartments = () => {
  const query = `SELECT * FROM department`;
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    questions();
  });
};

const allEmployees = () => {
  const query = `SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  department.name AS department,
  role.salary,
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM
  employee
LEFT JOIN role on employee.role_id = role.id
LEFT JOIN department on role.department_id = department.id
LEFT JOIN employee manager on manager.id = employee.manager_id;`;
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    questions();
  });
};

const allRoles = () => {
  const query = `SELECT * FROM role`;
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    questions();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Department Name?",
      },
    ])
    .then(function (res) {
      const query = "INSERT INTO department SET ?";
      db.query(
        query,
        {
          name: res.name,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          questions();
        }
      );
    });
};

// TODO: This function is broken find out why the managerArr and roleArr break the function or find a different way to do the same thing.

const addEmployee = () => {
  let managerArr = [];
  let roleArr = [];
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, results) => {
      results.map(manager =>
        managerArr.push(`${manager.first_name} ${manager.last_name}`)
      );
      return managerArr;
    }
  );

  db.query(
    "SELECT * FROM role ", (err, results) => {
    if (err) throw err;
    results.map(role => roleArr.push(`${role.title}`));
    return roleArr;
  })
  inquirer
  .prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "first_name",
    },
    {
      type: "input",
      message: "what is the employee's last name?",
      name: "last_name",
    },
    {
      type: "rawlist",
      message: "what is the employee's role?",
      name: "role",
      choices: roleArr,
    },
    {
      name: "manager",
      message: "What is their manager's name?",
      type: "rawlist",
      choices: managerArr,
    },
  ])
  // TODO: doesn't seem to be inserting properly
    .then(function(res) {
      const roleId = selectRole().indexOf(res.role) + 1;
      const managerId = selectManager().indexOf(val.choice) + 1;
      db.query("INSERT INTO employee SET ?", {
          first_name: res.first_name,
          last_name: res.last_name,
          manager_id: managerId,
          role_id: roleId
      }, function(err) {
          if (err) throw err
          console.table(res)
          questions()
      })
  })
};
const addRole = () => {
  return inquirer
    .prompt([
      {
        name: "job_title",
        type: "input",
        message: "Job Title?",
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter the salary for specified role.",
      },
    ])

    .then(function (res) {
      (db.query = `INSERT INTO role SET ?`),
        {
          title: res.job_title,
          salary: res.salary,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          questions();
        };
    });
};

// const update = () => {};

