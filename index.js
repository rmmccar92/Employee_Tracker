const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

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
          "Update Employee",
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
        case "Update Employee":
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

const addEmployee = () => {
  let managerArr = [];
  let roleArr = [];
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, results) => {
      results.map((manager) =>
        managerArr.push(`${manager.first_name} ${manager.last_name}`)
      );
      return managerArr;
    }
  );

  db.query("SELECT * FROM role ", (err, results) => {
    if (err) throw err;
    results.map((role) => roleArr.push(`${role.title}`));
    return roleArr;
  });
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
        type: "list",
        message: "what is the employee's role?",
        name: "role",
        choices: roleArr,
      },
      {
        type: "list",
        name: "manager",
        message: "What is their manager's name?",
        choices: managerArr,
      },
    ])

    .then((res) => {
      const role_id = roleArr.indexOf(res.role) + 1;
      const manager_id = managerArr.indexOf(res.manager) + 1;

      const newEmployee = {
        first_name: res.first_name,
        last_name: res.last_name,
        manager_id: manager_id,
        role_id: role_id,
      };

      db.query("INSERT INTO employee SET ?", newEmployee, (err) => {
        if (err) throw err;
        questions();
      });
    });
};
const addRole = () => {
  let departmentArr = [];
  db.query("SELECT * FROM department;", (err, results) => {
    if (err) throw err;
    results.map((department) => departmentArr.push(`${department.name}`));
    return departmentArr;
  });
   inquirer
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

      {
        name: "department",
        type: "list",
        message: "Role Department?",
        choices: departmentArr,
      },
    ])

    .then(function (res) {
      const department_id = departmentArr.indexOf(res.department) + 1;
      const query = "INSERT INTO role SET ?";
      db.query(
        query,
        {
          title: res.job_title,
          salary: res.salary,
          department_id: department_id
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          questions();
        }
      );
    });
};

const update = () => {
  let employeeArr = [];
  let roleArr = [];

  db.query("SELECT first_name, last_name FROM employee", (err, results) => {
    results.map((employee) =>
      employeeArr.push(`${employee.first_name} ${employee.last_name}`)
    );
    return employeeArr;
  });

  db.query("SELECT * FROM role ", (err, results) => {
    if (err) throw err;
    results.map((role) => roleArr.push(`${role.title}`));
    return roleArr;
  });
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "confirm update?",
      },
      {
        type: "list",
        name: "selection",
        message: "Please select the employee to update",
        choices: employeeArr,
      },

      {
        type: "list",
        message: "what is the employee's new role?",
        name: "role",
        choices: roleArr,
      },
    ])
    .then((res) => {
      const role_id = roleArr.indexOf(res.role) + 1;
      const employee_id = employeeArr.indexOf(res.selection) + 1;

      db.query(
        `UPDATE employee SET role_id= ${role_id} WHERE id= ${employee_id} `,
        (err) => {
          if (err) throw err;
          console.table(res);
          questions();
        }
      );
    });
};
