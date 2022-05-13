const inquirer = require("inquirer");
require("console.table");
const db = require("./db");
const connection = require("./db/connection");

init();

function init() {
  inquirer
    .prompt([
      //start questions
      {
        type: "list",
        name: "options",
        message: "Which would you like to view?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee",
          "Done",
        ],
      },
    ])

    .then(function (startAnswer) {
      switch (startAnswer.options) {
        case "View all departments":
          //run the view departments function
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee":
          updateEmployee();
          break;
        default:
          process.exit();
      }
    });
}

function viewAllDepartments() {
  db.findDepartments()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => init());
}

function viewAllRoles() {
  db.findRoles()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => init());
}

function viewAllEmployees() {
  db.findEmployees()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => init());
}

//ADD A DEPARTMENT- enter name of department; add to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What Department would you like to add?",
        validate: (departInput) => {
          if (departInput) {
            return true;
          } else {
            console.log("Please provide a department name");
            return false;
          }
        },
      },
    ])
    .then(function (res) {
      var query = connection.query(
        "INSERT INTO department SET ? ",
        {
          name: res.name,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          console.log(`A department was successfully added.`);
          init();
        }
      );
    });
}

//ADD A ROLE - enter name, salary, and depart.; role added to db
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter a role",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter salary amount for the role",
      },
      {
        type: "list",
        name: "department",
        message: "Select which Department the role is in",
        choices: ["Customer Service", "Engineering", "Marketing", "Finance"],
      },
    ])
    .then((answer) => {
      connection.query(
        "SELECT id FROM department WHERE ?",
        { name: answer.department },
        (err, idRes) => {
          if (err) throw err;
          const [{ id }] = idRes;
          connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: id,
          });
          console.table(answer);
          console.log("A role was successfully added.");
          init();
        }
      );
    });
}

//ADD AN EMPLOYEE - enter first, last, role, and manager; add to db
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name",
      },
      {
        type: "list",
        name: "role",
        message: "Select a role for the employee",
        choices: [
          "Customer Service Rep",
          "Software Developer",
          "Marketer",
          "Accountant",
        ],
      },
      {
        type: "list",
        name: "manager",
        message: "Select the employee's manager",
        choices: [
          "Bethany Christian",
          "Chandler Acevedo",
          "Bob Smith",
          "Sally Fields",
        ],
      },
    ])
    .then((answer) => {
      connection.query(
        "SELECT title FROM role WHERE ?",
        { title: answer.role },
        (err, roleRes) => {
          if (err) throw err;
          const [{ roleTitle }] = roleRes;
          connection.query("INSERT INTO employee SET ?", {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleTitle,
            manager_id: answer.manager_id,
          });
          console.table(answer);
          console.log("A role was successfully added.");
          init();
        }
      );
    });
}

//UPDATE AN EMPLOYEE ROLE - select an employee to update and their new role; updated to db
function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "name",
        message: "What is the employee's name? ",
        choices: ['Bethany Christian', 'Chandler Acevedo', 'Bob Smith', 'Sally Fields', 'Mariella Lewis', 'Lola Morris', 'Shelly Dixon', 'Yasir Sargent']
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's new title? ",
        choices: ['Customer Service', 'Software Developer', 'Marketer', 'Accountant'],
      },
    ])
    .then((answer) => {
      connection.query(
        "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", {name: answer.role}, (err, roleRes) => {
          if (err) throw err;
          const [{roleId}] = roleRes
          connection.query('INSERT INTO employee SET ?', {
            name:  answer.lastName,
            title: roleId,
          })
          console.table(answer);
          init();
         
            }
          );
        }
      );
    };



