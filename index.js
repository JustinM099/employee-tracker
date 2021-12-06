const inquirer = require('inquirer')
const mysql2 = require('mysql2')
const util = require('util')
const ct = require('console.table')
const connection = require('./db/connection')
const { query } = require('./db/connection')

const firstQuestions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What function would you like to perform?',
            choices: [
                {
                    name: 'view all departments',
                    value: 'viewDepartments'
                },
                {
                    name: 'view all roles',
                    value: 'viewRoles'
                },
                {
                    name: 'view all employees',
                    value: 'viewEmployees'
                },
                {
                    name: 'add a department',
                    value: 'addDepartment'
                },
                {
                    name: 'add a role',
                    value: 'addRole'
                },
                {
                    name: 'add an employee',
                    value: 'addEmployee'
                },
                {
                    name: 'update an employee role',
                    value: 'updateEmployeeRole'
                },
                {
                    name: 'exit',
                    value: 'exit'
                },
            ]
        }

    ]).then((response) => {
        switch (response.options) {
            case 'viewDepartments':
                viewDepartments()
                break
            case 'viewRoles':
                viewRoles()
                break
            case 'viewEmployees':
                viewEmployees()
                break
            case 'addDepartment':
                addDepartment()
                break
            case 'addRole':
                addRole()
                break
            case 'addEmployee':
                addEmployee()
                break
            case 'updateEmployeeRole':
                updateEmployeeRole()
                break
            case 'exit':
                exitFunction()
                break
        }
    })
}

const viewDepartments = () => {
    connection.promise().query(
        "SELECT * FROM department;"
    ).then(([response]) => {
        console.log("\n")
        console.table(response)
    }).then(() => firstQuestions()
    )
}

const viewRoles = () => {
    connection.promise().query(
        "SELECT * FROM role;"
    ).then(([response]) => {
        console.log("\n")
        console.table(response)
    }).then(() => firstQuestions()
    )
}

const viewEmployees = () => {
    connection.promise().query(
        "SELECT * FROM employee;"
    ).then(([response]) => {
        console.log("\n")
        console.table(response)
    }).then(() => firstQuestions()
    )
}

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            message: 'What would you like to name the new department?'
        }
    ]).then((response) => {
        connection.promise().query(
            "INSERT INTO DEPARTMENT ?", response
        ).then((response) => {
            console.log(`You've added ${response} to the department database!`)
        }).then(() => firstQuestions())
    })
}

const addRole = () => {

}

const addEmployee = () => {

}

const updateEmployeeRole = () => {

}

const exitFunction = () => {
    console.log("\n")
    console.log('Thank you. Have a nice day!')
    console.log("\n")
    process.exit()
}

const init = () => {
    firstQuestions()
}

init()
