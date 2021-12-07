const inquirer = require('inquirer')
const util = require('util')
const ct = require('console.table')
const connection = require('./db/connection')
const figlet = require('figlet')
const { title } = require('process')



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
            type: 'input',
            name: 'name',
            message: 'What would you like to name the new department?'
        }
    ]).then((res) => {
        connection.promise().query(
            "INSERT INTO department (name) VALUES(?)", res
        ).then(() => {
            console.log(`Your update has been made!`)
        }).then(() => firstQuestions())
    })
}

const addRole = () => {
    connection.promise().query("SELECT department.id, department.name FROM department;"
    ).then(([res]) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What would you like the title for the new role to be?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What would you like the salary for the new role to be?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department is the role assigned to?',
                choices: res.map(({ id, name }) => ({ name: name, value: id }))
            }
        ]).then((res) => {
            const newRole = [`${res.title}`, `${res.salary}`, `${res.department}`]
            connection.promise().query(
                "INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)", newRole
            ).then(() => {
                console.log(`Your update has been made!`)
            }).then(() => firstQuestions())
        })
    })
}


const addEmployee = () => {
    connection.promise().query("SELECT role.id, role.title FROM role;")
        .then(([res]) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the new employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the new employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the new employee's role?",
                    choices: res.map(({ id, title }) => ({ name: title, value: id }))
                }

            ]).then((res) => {
                let newFirstName = res.first_name
                let newLastName = res.last_name
                let newRole = res.role

                connection.promise().query("SELECT employee.first_name, employee.last_name FROM employee WHERE manager_id='null';")
                    .then(([res]) => {
                        console.log(res)
                        // inquirer.prompt([
                        //     {
                        //         type: 'list',
                        //         name: 'manager',
                        //         message: "Who is the new employee's manager?",
                        //         choices: res.map(({ id, title }) => ({name: title, value: id}))
                        //     }
                        // ])
                    }).then(([res]) => {
                        let newManager = res.manager
                        const newEmployee = [newFirstName, newLastName, newRole, newManager]
                        connection.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id VALUES (?,?,?,?)", newEmployee)
                        console.log('New Employee Added!')
                    }).then(() => firstQuestions())
            })
        })
}

// .then((res) => {
//     let newFirstName = res.first_name
//     let newLastName = res.last_name
//     let newRole = res.role

//     connection.promise().query("SELECT employee.first_name, employee.last_name FROM employee WHERE manager_id='null';")
//         .then(([res]) => {
//             inquirer.prompt([
//                 {
//                     type: 'list',
//                     name: 'manager',
//                     message: "Who is the new employee's manager?",
//                     choices: res.map(({ id, title }) => ({ name: title, value: id}))
//                 }
//             ])
//         })
//         .then(([res]) => {
//             let newManager = res.manager
//             const newEmployee = [newFirstName, newLastName, newRole, newManager]
//             connection.promise().query("INSERT INTO employee SET ?", newEmployee)    
//             }
//         })
// })

const updateEmployeeRole = () => {

}

function exitFunction() {
    console.log("\n")
    console.log('Thank you. Have a nice day!')
    console.log("\n")
    process.exit()
}

const init = () => {
    ascii()
    setTimeout(function () {
        firstQuestions()
    }, 100)
}

const ascii = () => {
    figlet('EMPLOYEE TRACKER', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
}

init()
