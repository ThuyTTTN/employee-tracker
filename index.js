const inquirer = require("inquirer");
require("console.table");
const db = require("./db");
const { connect } = require("./db/connection");
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
        message:
          "Select a role for the employee (1-Customer Manager, 2-Developer Manager, 3-Marketing Manager, 4-Accounting Manager, 5-Customer Service, 6-Software Developer, 7-Marketer, 8-Accountant",
        choices: ["1", "2", "3", "4", "5", "6", "7", "8"],
      },
      {
        type: "list",
        name: "manager",
        message:
          "Select the employee's manager (1-Bethany Christian, 2-Chandler Acevedo, 3-Bob Smith, 4-Sally Fields, null- Employee is Manager)",
        choices: ["1", "2", "3", "4", "null"],
      },
    ])
    .then((res) => {
      var query = connection.query(
        "INSERT INTO employee SET ? ",
        {
          first_name: res.firstName,
          last_name: res.lastName,
          manager_id: JSON.parse(res.manager),
          role_id: res.role,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
}

//UPDATE AN EMPLOYEE ROLE - select an employee to update and their new role; updated to db
function updateEmployee() {
  connection.query(
    "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      console.log(res);
      inquirer
        .prompt([
          {
            type: "list",
            name: "lastName",
            message: "What is the employee's last name? ",
            choices: function () {
              var lastName = [];
              for (let i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's new role? ",
            choices: selectRole(),
          },
        ])
        .then(function (res) {
          var roleId = selectRole().indexOf(res.role) + 1;
          connection.query(
            "UPDATE employee SET role_id = ? WHERE last_name = ?",
            [roleId, res.lastName],
            function (err) {
              if (err) throw err;
              console.table(res);
              init();
            }
          );
        });
    }
  );
}

// selectRole for the updateEmployee()
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}
