const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

// connecting
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "employees_db",
});

db.connect((err) => {
  if (err) {
    console.error("There was an error connecting to the database");
    return;
  }
  console.log("Successfully connected to the database");
  init();
});

// prompts
async function init() {
  const { choicesMenu } = await inquirer.prompt([
    {
      type: "list",
      name: "choicesMenu",
      message: "Please choose from the list",
      choices: [{ name: "View all employees", value: "viewAllEmployees" }],
    },
  ]);

  switch (choicesMenu) {
    case "viewAllEmployees":
      viewAllEmployees();
      break;
  }
}

// results
function viewAllEmployees() {
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) {
      console.error("There was an error viewing employees");
      return;
    }
    console.table(results);
    init();
  });
}
