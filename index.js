//imports
const inquirer = require('inquirer')
const util = require('util')
const ct = require('console.table')
const connection = require('./db/connection')
const figlet = require('figlet')


//asks the initial questions
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

//view all departments
const viewDepartments = () => {
    connection.promise().query(
        "SELECT * FROM department;"
    ).then(([response]) => {
        console.log("\n")
        console.table(response)
    }).then(() => firstQuestions()
    )
}

//view all roles
const viewRoles = () => {
    connection.promise().query(
        "SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department on role.department_id = department.id;"
    ).then(([response]) => {
        console.log("\n")
        console.table(response)
    }).then(() => firstQuestions()
    )
}

//view all employees
const viewEmployees = () => {
    connection.promise().query(
        "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary as Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN employee manager on manager.id = employee.manager_id LEFT JOIN department ON role.department_id = department.id;"
    ).then(([response]) => {
        console.log("\n")
        console.table(response)
    }).then(() => firstQuestions()
    )
}

//add a department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What would you like to name the new department?'
        }
    ]).then((res) => {
        const newDepartment = res.name
        connection.promise().query(
            "INSERT INTO department (name) VALUES(?)", newDepartment
        ).then(() => {
            console.log('\n', '\n', `Your update has been made!`, '\n', '\n')
        }).then(() => firstQuestions())
    })
}

//add a role
const addRole = () => {
    connection.promise().query("SELECT department.name, department.id FROM department;"
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
                choices: res.map(({ name, id }) => ({ name: name, value: id }))
            }
        ]).then((res) => {
            const newRole = [`${res.title}`, `${res.salary}`, `${res.department}`]
            connection.promise().query(
                "INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)", newRole
            ).then(() => {
                console.log('\n', '\n', `Your update has been made!`, '\n', '\n')
            }).then(() => firstQuestions())
        })
    })
}

//add a new employee
const addEmployee = () => {
    connection.promise().query("SELECT role.title, role.id FROM role;")
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
                    choices: res.map(({ title, id }) => ({ name: title, value: id }))
                }

            ]).then((res) => {
                let newFirstName = res.first_name
                let newLastName = res.last_name
                let newRole = res.role

                connection.promise().query("SELECT employee.first_name, employee.last_name, employee.id FROM employee WHERE manager_id IS NULL;")
                    .then(([res]) => {
                        console.log(res)
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: "Who is the new employee's manager?",
                                choices: res.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }))
                            }
                        ]).then((res) => {
                            let newManager = res.manager
                            const newEmployee = [`${newFirstName}`, `${newLastName}`, `${newRole}`, `${newManager}`]
                            console.log(newEmployee)
                            connection.promise().query(
                                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", newEmployee
                            ).then(console.log('\n', '\n', 'New Employee Added!', '\n', '\n')
                            ).then(() => firstQuestions())

                        })
                    })
            })
        })
}

//update an employee role
const updateEmployeeRole = () => {
    connection.promise().query("SELECT * from employee")
        .then(([res]) => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: `Whose role would you like to update?`,
                    choices: res.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}))
                }
            ]).then((res) => {
                const updatedEmployee = res.employee
                connection.promise().query("SELECT role.id, role.title FROM role")
                .then(([res]) => {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'viewRoles',
                            message: 'What would you like their new role to be?',
                            choices: res.map(({title, id}) => ({name: title, value: id}))
                        }
                    ]).then((res) => {
                        connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [res.viewRoles, updatedEmployee]
                        ).then(console.log('\n', '\n', 'Employee role updated!', '\n', '\n')
                        ).then(() => firstQuestions())
                    })
                })

            })
        })
}

//exit
function exitFunction() {
    console.log("\n")
    console.log('Thank you. Have a nice day!')
    console.log("\n")
    process.exit()
}

//init
const init = () => {
    ascii()
    setTimeout(function () {
        firstQuestions()
    }, 100)
}

//ascii intro
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
