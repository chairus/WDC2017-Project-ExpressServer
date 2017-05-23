var Client = require('mariasql');

var mariadb = new Client({
    host: 'localhost',
    user: 'cyrus06',
    password: 'Tqbfjotld-06'
});

// CREATE DATABASE FOR THE WEB APP
console.log('CONNECTING TO DATABASE...');
mariadb.query('CREATE DATABASE IF NOT EXISTS wdc_web_app', function(err, newDB) {
    if (err) {
        throw err;
    }
    // USE THE NEWLY CREATED DATABASE
    mariadb.query('USE wdc_web_app', function(err, result) {
        if (err) {
            throw err;
        }
        // CREATE USERS TABLE
        /*
        *   id: INT
        *   username: VARCHAR
        *   password: VARCHAR
        */
        mariadb.query('CREATE TABLE IF NOT EXISTS users(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100) UNIQUE, password VARCHAR(255) NOT NULL, googleID VARCHAR(255) DEFAULT NULL)', function(err, users) {
            if (err) {
                throw err;
            }
            // CREATE JOURNAL ENTRIES TABLE
            /*
            *   id: INT
            *   title: TINYTEXT
            *   content: TEXT
            *   timestamp: DATETIME
            *   user_id: INT REFEERENCES users(id)
            */
            mariadb.query('CREATE TABLE IF NOT EXISTS journal_entries(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, title TINYTEXT, content TEXT, timestamp DATETIME, user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)', function(err, journal_entries) {
                if (err) {
                    throw err;
                }
                console.log('CONNECTING TO DATABASE...SUCCESS');
            });
        });
    });

});

module.exports = mariadb;
