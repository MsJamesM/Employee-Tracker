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
      choices: [
        { name: "View all departments", value: "viewAllDepartments" },
        { name: "View employees by department", value: "viewByDepartments" },
        { name: "View all employees", value: "viewAllEmployees" },
        { name: "View all employee roles", value: "viewAllRoles" },
        { name: "Update an employee role", value: "updateRole" },
        { name: "Add a department", value: "addDepartment" },
        { name: "Add an employee", value: "addEmployee" },
        { name: "Add an employee role", value: "addRole" },
        { name: "Fire an employee", value: "fireEmployee" },
      ],
    },
  ]);

  switch (choicesMenu) {
    case "viewAllDepartments":
      viewAllDepartments();
      break;
    case "viewByDepartment":
      viewByDepartment();
      break;
    case "viewAllEmployees":
      viewAllEmployees();
      break;
    case "viewAllRoles":
      viewAllRoles();
      break;
    case "updateRole":
      updateRole();
      break;
    case "addDepartment":
      addDepartment();
      break;
    case "addEmployee":
      addEmployee();
      break;
    case "addRole":
      addRole();
      break;
    case "fireEmployee":
      fireEmployee();
      break;
    case "back":
      if (previousPrompt) {
        previousPrompt();
      } else {
        init();
      }
      break;
  }
  previousPrompt = choicesMenu === "Go back" ? previousPrompt : init;
}

// results
// VIEW DEPARTMENTS
function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      console.error("There was an error viewing departments");
      return;
    }
    console.table(results);
    init();
  });
}

// ❌ VIEW BY DEPARTMENT ❌
// grr

// VIEW EMPLOYEES
function viewAllEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee JOIN role ON role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id",
    (err, results) => {
      if (err) {
        console.error("There was an error viewing employees");
        return;
      }
      console.table(results);
      init();
    }
  );
}

// VIEW ROLES
function viewAllRoles() {
  db.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.error("There was an error viewing departments");
      return;
    }
    console.table(results);
    init();
  });
}

// UPDATE EMPLOYEE ROLE
function updateRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Provide the ID of the employee whose role you wish to update",
      },
      {
        type: "input",
        name: "roleId",
        message:
          "Provide the role ID of the employee whose role you wish to update",
      },
      {
        type: "list",
        name: "backOption",
        message: "Confirm update?",
        choices: [
          { name: "Yes, update!", value: "continue" },
          { name: "No, return to menu!", value: "back" },
        ],
      },
    ])
    .then((answers) => {
      if (answers.backOption === "back") {
        init();
      } else {
        const employeeId = answers.employeeId;
        const roleId = answers.roleId;

        db.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [roleId, employeeId],
          (err, result) => {
            if (err) {
              console.error("Error updating employee's role", err);
            } else {
              console.log("✔️ㅤEmployee's role has been successfully updated!");
            }
            init();
          }
        );
      }
    });
}

// ADD DEPARTMENT
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Provide a new department name",
      },
      {
        type: "list",
        name: "backOption",
        message: "Confirm new department?",
        choices: [
          { name: "Yes, add department!", value: "continue" },
          { name: "No, return to menu!", value: "back" },
        ],
      },
    ])
    .then((answers) => {
      if (answers.backOption === "back") {
        init();
      } else {
        const newDepartment = answers.newDepartment;

        db.query(
          "INSERT INTO department (name) VALUES (?)",
          [newDepartment],
          (err, result) => {
            if (err) {
              console.error("Error adding department", err);
            } else {
              console.log("✔️ㅤDepartment has been successfully added!");
            }
            init();
          }
        );
      }
    });
}

// ADD ROLE
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRoleTitle",
        message: "Provide a new role name",
      },
      {
        type: "input",
        name: "newRoleDepartment",
        message: "Provide the ID of the new role's department",
      },
      {
        type: "input",
        name: "newRoleSalary",
        message: "Provide a salary for the new role",
      },
      {
        type: "list",
        name: "backOption",
        message: "Confirm new role?",
        choices: [
          { name: "Yes, add role!", value: "continue" },
          { name: "No, return to menu!", value: "back" },
        ],
      },
    ])
    .then((answers) => {
      if (answers.backOption === "back") {
        init();
      } else {
        const { newRoleTitle, newRoleDepartment, newRoleSalary } = answers;
        db.query(
          "INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)",
          [newRoleTitle, newRoleDepartment, newRoleSalary],
          (err, result) => {
            if (err) {
              console.error("Error adding new role", err);
            } else {
              console.log("✔️ㅤNew role has been successfully added!");
            }
            init();
          }
        );
      }
    });
}

// FIRE EMPLOYEE
function fireEmployee() {
  db.query("SELECT * FROM employee", (err, employees) => {
    if (err) {
      console.error("There was an error retrieving employees", err);
      return;
    }

    const michaelImmunity = employees.filter(
      (employee) =>
        !(employee.first_name === "Michael" && employee.last_name === "Scott")
    );

    const employeeChoices = michaelImmunity.map(
      ({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })
    );

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee are you firing?",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "confirm",
          message: "Are you sure you want to fire this employee?",
          choices: ["Yes, fire them", "No, go back"],
        },
      ])
      .then((answers) => {
        if (answers.confirm === "Yes") {
          const employeeId = answers.employeeId;

          db.query(
            "DELETE FROM employee WHERE id = ?",
            [employeeId],
            (err, result) => {
              if (err) {
                console.error("Error firing employee", err);
              } else if (result.affectedRows > 0) {
                console.log("✔️ㅤEmployee has been fired");
              }
              init();
            }
          );
        } else {
          console.log("❌ㅤFiring cancelled");
          init();
        }
      });
  });
}
