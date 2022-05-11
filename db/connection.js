const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Zelda321",
        database: "tracker",
    }
);

module.exports = db;