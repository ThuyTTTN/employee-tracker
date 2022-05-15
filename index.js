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
          "Update a manager",
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
        case "Update a manager":
          updateManager();
          break;
        case "View employees by Manager":
          viewByManager();
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
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY id;",
    function (err, res) {
      console.log("CURRENT EMPLOYEES TABLE:");
      console.table(res);
      connection.query(
        "SELECT role.id AS role_id, role.title AS role_title FROM role;",
        function (err, res) {
          console.log("ROLE TABLE:");
          console.table(res);
          inquirer
            .prompt([
              {
                type: "input",
                name: "employeeId",
                message:
                  "Please use the above CURRENT EMPLOYEES TABLE as a reference to enter the ID number of the employee you are updating (If employee's new role is now a Manager position, please write: null):",
                validate: (idInput) => {
                  if (idInput) {
                    return true;
                  } else {
                    console.log("Please enter the employee's ID number!");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "newRole",
                message:
                  "Please choose a role_id number from the above ROLE TABLE that corresponds to the employee's new role title (i.e. If employee's new role is HR Manager, write 1):",
                validate: (newRoleInput) => {
                  if (newRoleInput) {
                    return true;
                  } else {
                    console.log(
                      "Please enter a role_id number from the above ROLE TABLE!"
                    );
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "newManager",
                message:
                  "Please use the above CURRENT EMPLOYEES TABLE as a reference to enter the new manager's ID number for the employee you are updating (If employee's new role is now a Manager position, please write: null):",
                validate: (newManagerInput) => {
                  if (newManagerInput) {
                    return true;
                  } else {
                    console.log("Please enter the new manager's ID number!");
                    return false;
                  }
                },
              },
            ])
            .then(function (val) {
              connection.query(
                "UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?;",
                [val.newRole, JSON.parse(val.newManager), val.employeeId],
                function (err) {
                  if (err) throw err;
                  console.table(val);
                  console.log(
                    `Employee with ID of ${val.employeeId} successfully updated!`
                  );
                  init();
                }
              );
            });
        }
      );
    }
  );
}

function updateManager() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE e.id IS NULL ORDER BY id;",
    function (err, res) {
      console.log('CURRENT MANAGERS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Please enter the ID number for the employee who needs their manager updated:",
            validate: (idInput) => {
              if (idInput) {
                return true;
              } else {
                console.log("Please enter the employee\'s ID number!");
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'newManager',
            message: "Please use the above CURRENT MANAGERS TABLE as a reference to enter the new manager\'s ID number for the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
            validate: (newManagerInput) => {
              if (newManagerInput) {
                return true;
              } else {
                console.log("Please enter the new manager\'s ID number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'UPDATE employee SET manager_id = ? WHERE id = ?;',
            [JSON.parse(val.newManager), val.employeeId],
            function (err) {
              if (err) throw err;
              console.table(val);
              console.log(`Manager for employee with ID of ${val.employeeId} successfully updated!`);
              init();
            }
          );
        });
    });
}

function viewByManager() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE e.id IS NULL ORDER BY id;",
    function (err, res) {
      console.log('CURRENT MANAGERS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "viewByManager",
            message: "Please use the above CURRENT MANAGERS TABLE as a reference to enter the manager\'s ID number (i.e. If you want to view all employees under Adaline Bowen (id = 4), write 4):",
            validate: (managerInput) => {
              if (managerInput) {
                return true;
              } else {
                console.log("Please enter the manager\'s ID number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'SELECT * FROM employee WHERE manager_id = ?;',
            [JSON.parse(val.viewByManager)],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              console.log(`You selected to view all employees under the Manager with an ID of ${val.viewByManager}!`);
              init();
            }
          );
        });
    })
}
