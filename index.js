const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');

init();

function init() {
    inquirer.prompt([
        //start questions
        {
            type: 'list',
            name: 'options',
            message: 'Which would you like to view?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
        },
    ])

    .then(function(startAnswer) {

        //VIEW ALL DEPARTMENTS
        // Make a table with a list of deparments and id's: Customer Service, Developers, Marketing, Sales

        //VIEW ALL ROLES
        // Table with: role id, job title, department, and salary

        //VIEW ALL EMPLOYEES
        //Table with employee data: employee ids, first, last, job titles, departments, salaries, and managers that employees report to

        //ADD A DEPARTMENT
        //enter name of department; add to the database
        deparment();

        function deparment() {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'departName',
                    message: 'Enter a deparment name'
                }
            ])
            .then(function(deparmentAnswer) {

                //ADD A ROLE
                //enter name, salary, and depart.; role added to db
                addRole();

                function addRole() {
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'role',
                            message: 'Enter a role'
                        }, 
                        {
                            type: 'input',
                            name: 'roleDepart',
                            message: 'Enter department for the role'
                        }, 
                        {
                            type: 'input',
                            name: 'role',
                            message: 'Enter a role'
                        }
                    ])

                    .then(function(addRoleAnswers) {
                        //ADD AN EMPLOYEE
                        //enter first, last, role, and manager; add to db
                        addEmployee();

                        function addEmployee() {
                            inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'firstName',
                                    message: 'Enter employee\'s first name'
                                }, 
                                {
                                    type: 'input',
                                    name: 'lastName',
                                    message: 'Enter employee\'s last name'
                                }, 
                                {
                                    type: 'input',
                                    name: 'role',
                                    message: 'Enter a role'
                                },
                                {
                                    type: 'input',
                                    name: 'manager',
                                    message: 'Enter manager\'s name'
                                }
                            ])
                                //UPDATE AN EMPLOYEE ROLE
                                 // select an employee to update and their new role; updated to db
                        }
                    })
                }
            })
        } 
    })
}