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
          break;
        case "Add an employee":
          break;
        case "Update an employee":
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

function addDepartment() {
  inquirer
    .prompt([
      //start questions
      {
        type: "input",
        name: "addDepart",
        message: "Enter department name",
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
      const sql = `INSERT INTO department SET ?`;
      const params = [res.addDepart];

      connection.query(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: "success",
          data: row,
        });
      });
      // console.log(res.addDepart);
    });
}

//ADD A DEPARTMENT
//enter name of department; add to the database

//ADD A ROLE
//enter name, salary, and depart.; role added to db
//     addRole(); function addRole() {
//                     inquirer.prompt([
//                         {
//                             type: 'input',
//                             name: 'role',
//                             message: 'Enter a role'
//                         },
//                         {
//                             type: 'input',
//                             name: 'roleDepart',
//                             message: 'Enter department for the role'
//                         },
//                         {
//                             type: 'input',
//                             name: 'role',
//                             message: 'Enter a role'
//                         }
//                     ])

//
//                         //ADD AN EMPLOYEE
//                         //enter first, last, role, and manager; add to db
//                         addEmployee();

//                         function addEmployee() {
//                             inquirer.prompt([
//                                 {
//                                     type: 'input',
//                                     name: 'firstName',
//                                     message: 'Enter employee\'s first name'
//                                 },
//                                 {
//                                     type: 'input',
//                                     name: 'lastName',
//                                     message: 'Enter employee\'s last name'
//                                 },
//                                 {
//                                     type: 'input',
//                                     name: 'role',
//                                     message: 'Enter a role'
//                                 },
//                                 {
//                                     type: 'input',
//                                     name: 'manager',
//                                     message: 'Enter manager\'s name'
//                                 }
//                             ])
//                                 //UPDATE AN EMPLOYEE ROLE
//                                  // select an employee to update and their new role; updated to db
