//import mysql2
const mysql = require('mysql2')

//create mysql2 connection
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Leacocks01!',
        database: 'employee_db'
    }
)



module.exports = connection;