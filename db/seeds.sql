INSERT INTO department (name)
VALUES ("Administration"), 
        ("Sales"),
        ("Accounting"),
        ("Customer Service and Relations");

INSERT INTO role (title, salary, department_id)
VALUES ("Regional Manager", 100000, 1)
    ("Assistant to the Regional Manager", 70000, 1)
    ("Co-manager", 100000, 1)
    ("Office Administrator", 60000, 1)
    ("Receptionist", 54000, 4)
    ("Salesperson", 70000, 2),
    ("Head of Accounting", 98000, 3),
    ("Accountant", 94000, 3),
    ("Quality Assurance", 63000, 4),
    ("Supplier Relations", 62000, 4),
    ("Customer Service Specialist", 62000, 4),
    ("Warehouse Foreman", 66000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, NULL),
    ("Dwight", "Schrute", 1), /* also 2 */
    ("Pamela", "Beesly", 4), /* also 1 */
    ("Jim", "Halpert", 2), /* also 1 */
    ("Andy", "Bernard", 2),
    ("Stanley", "Hudson", 2),
    ("Phyllis", "Vance", 2),
    ("Angela", "Martin", 3),
    ("Oscar", "Martinez", 3),
    ("Kevin", "Malone", 3),
    ("Creed", "Bratton", 4),
    ("Meredith", "Palmer", 4),
    ("Kelly", "Kapoor", 4),
    ("Daryll", "Philbin", 1);