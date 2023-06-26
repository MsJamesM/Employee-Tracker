INSERT INTO department (name)
VALUES ("Management"),
        ("Sales"),
        ("Accounting"),
        ("Customer Service and Relations");

INSERT INTO role (title, salary, department_id)
VALUES ("Regional Manager", 100000, 1),
    ("Assistant to the Regional Manager", 75000, 2),
    ("Receptionist", 55000, 3),
    ("Salesperson", 75000, 4),
    ("Head of Accounting", 78000, 5),
    ("Accountant", 77000, 6),
    ("Quality Assurance", 70000, 7),
    ("Supplier Relations", 69000, 8),
    ("Customer Service Specialist", 69000, 9),
    ("Warehouse Foreman", 69000, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, NULL),
    ("Dwight", "Schrute", 2, 1),
    ("Pamela", "Beesly", 3, 1),
    ("Jim", "Halpert", 4, 1),
    ("Andy", "Bernard", 4, 1),
    ("Stanley", "Hudson", 4, 1),
    ("Phyllis", "Vance", 4, 1),
    ("Angela", "Martin", 5, 1),
    ("Oscar", "Martinez", 6, 1),
    ("Kevin", "Malone", 6, 1),
    ("Creed", "Bratton", 7, 1),
    ("Meredith", "Palmer", 8, 1),
    ("Kelly", "Kapoor", 9, 1),
    ("Daryll", "Philbin", 10, 1);