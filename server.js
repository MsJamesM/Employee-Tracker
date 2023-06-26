require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  console.log(`Connected to the employee database.`)
);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");

  // Read the seeds.sql file and execute the queries
  const fs = require("fs");
  const seedsSQL = fs.readFileSync("seeds.sql", "utf8");

  connection.query(seedsSQL, (err, results) => {
    if (err) {
      console.error("Error executing seeds.sql:", err);
    } else {
      console.log("Seeds executed successfully");
    }
  });
});
