// connecting
const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

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
        { name: "View all employees", value: "viewAllEmployees" },
        { name: "View all employee roles", value: "viewAllRoles" },
        { name: "Update an employee role", value: "updateRole" },
        { name: "Add a department", value: "addDepartment" },
        { name: "Add an employee", value: "addEmployee" },
        { name: "Add an employee role", value: "addRole" },
        { name: "Fire an employee", value: "fireEmployee" },
        { name: "Lay off department", value: "layOffDepartment" },
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
    case "layOffDepartment":
      layOffDepartment();
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

// view departments
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

// view employees
function viewAllEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id",
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

// view roles
function viewAllRoles() {
  db.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id",
    (err, results) => {
      if (err) {
        console.error("There was an error viewing roles");
        return;
      }
      console.table(results);
      init();
    }
  );
}

// update roles
function updateRole() {
  db.query(
    "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee",
    (err, employeeResults) => {
      if (err) {
        console.error("There was an error retrieving employees", err);
        init();
        return;
      }

      const employeeChoices = employeeResults.map((employee) => ({
        name: employee.name,
        value: employee.id,
      }));

      db.query("SELECT id, title FROM role", (err, roleResults) => {
        if (err) {
          console.error("There was an error retrieving roles", err);
          init();
          return;
        }

        const roleChoices = roleResults.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "employeeId",
              message: "Select the employee whose role you wish to update",
              choices: employeeChoices,
            },
            {
              type: "list",
              name: "roleId",
              message: "Select the new role for the employee",
              choices: roleChoices,
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
                    console.log(
                      "✔️ㅤEmployee's role has been successfully updated!"
                    );
                  }
                  init();
                }
              );
            }
          });
      });
    }
  );
}

// add department
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
              console.error("There was an error adding department", err);
            } else {
              console.log("✔️ㅤDepartment has been successfully added!");
            }
            init();
          }
        );
      }
    });
}

// add role
function addRole() {
  db.query("SELECT id, name FROM department", (err, results) => {
    if (err) {
      console.error("There was an error retrieving departments", err);
      init();
      return;
    }

    const departmentChoices = results.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "newRoleTitle",
          message: "Provide a new role name",
        },
        {
          type: "list",
          name: "newRoleDepartment",
          message: "Choose the department for the new role",
          choices: departmentChoices,
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
                console.error("There was an error adding new role", err);
              } else {
                console.log("✔️ㅤNew role has been successfully added!");
              }
              init();
            }
          );
        }
      });
  });
}

// add employee
function addEmployee() {
  const roleQuery = "SELECT title AS role FROM role";
  const managerQuery =
    "SELECT CONCAT(first_name, ' ', last_name) AS manager_name FROM employee WHERE manager_id IS NULL";

  db.query(roleQuery, (err, roleResults) => {
    if (err) {
      console.error("There was an error retrieving roles", err);
      init();
      return;
    }

    const roleChoices = roleResults.map((role) => role.role);

    db.query(managerQuery, (err, managerResults) => {
      if (err) {
        console.error("There was an error retrieving managers", err);
        init();
        return;
      }

      const managerChoices = managerResults.map(
        (manager) => manager.manager_name
      );

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the new employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the new employee's last name?",
          },
          {
            type: "list",
            name: "roleName",
            message: "Choose the role for the new employee",
            choices: roleChoices,
          },
          {
            type: "list",
            name: "managerName",
            message: "Choose the manager for the new employee",
            choices: managerChoices,
          },
          {
            type: "list",
            name: "backOption",
            message: "Confirm new employee?",
            choices: [
              { name: "Yes, add employee!", value: "continue" },
              { name: "No, return to menu!", value: "back" },
            ],
          },
        ])
        .then((answers) => {
          if (answers.backOption === "back") {
            init();
          } else {
            const { firstName, lastName, roleName, managerName } = answers;

            db.query(
              "SELECT id FROM role WHERE title = ?",
              [roleName],
              (err, roleResult) => {
                if (err || roleResult.length === 0) {
                  console.error("There was an error retrieving role", err);
                  init();
                  return;
                }

                const roleId = roleResult[0].id;

                db.query(
                  "SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?",
                  [managerName],
                  (err, managerResult) => {
                    if (err || managerResult.length === 0) {
                      console.error(
                        "There was an error retrieving manager name",
                        err
                      );
                      init();
                      return;
                    }

                    const managerId = managerResult[0].id;

                    db.query(
                      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                      [firstName, lastName, roleId, managerId],
                      (err, result) => {
                        if (err) {
                          console.error(
                            "There was an error adding new employee",
                            err
                          );
                        } else {
                          console.log(
                            "✔️ㅤEmployee has been successfully added!"
                          );
                        }
                        init();
                      }
                    );
                  }
                );
              }
            );
          }
        });
    });
  });
}

// fire employee
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
          choices: [
            { name: "Yes, fire them", value: "Yes" },
            { name: "No, go back", value: "No" },
          ],
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
                console.error("There was an error firing employee", err);
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

// lay off department
function layOffDepartment() {
  db.query("SELECT * FROM department", (err, departments) => {
    if (err) {
      console.error("There was an error retrieving departments", err);
      return;
    }

    const departmentImmunity = departments.filter(
      (department) => !(department.name === "Management")
    );

    const departmentChoices = departmentImmunity.map(({ id, name }) => ({
      name: `${name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department are you laying off?",
          choices: departmentChoices,
        },
        {
          type: "list",
          name: "confirm",
          message: "Are you sure you want to fire all these people?",
          choices: [
            { name: "Yes, fire them all", value: "Yes" },
            { name: "No, go back", value: "No" },
          ],
        },
      ])
      .then((answers) => {
        if (answers.confirm === "Yes") {
          const departmentId = answers.departmentId;

          db.query(
            "DELETE FROM department WHERE id = ?",
            [departmentId],
            (err, result) => {
              if (err) {
                console.error("There was an error removing department", err);
              } else if (result.affectedRows > 0) {
                console.log("✔️ㅤDepartment layoff successful");
              }
              init();
            }
          );
        } else {
          console.log("❌ㅤDepartment layoff cancelled");
          init();
        }
      });
  });
}
