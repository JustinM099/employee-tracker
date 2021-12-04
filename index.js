const inquirer = require('inquirer')
const { inherits } = require('util')
const database = require('./db/index.js')





const firstQuestions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What function would you like to perform?',
            choices: [
                {name: '',
                 value: ''
                },
            ]
        }
    ])
}

init()

//view all departments, view all roles, view all employees, add a department, add a role, add an employee, update employee role