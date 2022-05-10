const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        passwork: "Zelda321",
        database: "tracker",
    },
    console.log("Connected to the tracker database")
);

module.exports = db;