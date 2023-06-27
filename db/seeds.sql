INSERT INTO department (name)
VALUES ("Management"),
        ("Customer Service and Relations"),
        ("Sales"),
        ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 77000, 4),
    ("Assistant to the Regional Manager", 75000, 1),
    ("Customer Service Specialist", 69000, 2),
    ("Head of Accounting", 78000, 4),
    ("Quality Assurance", 70000, 2),
    ("Regional Manager", 100000, 1),
    ("Receptionist", 55000, 2),
    ("Salesperson", 75000, 3),
    ("Supplier Relations", 69000, 2),
    ("Warehouse Foreman", 69000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andy", "Bernard", 8, 10),
    ("Angela", "Martin", 4, 10),
    ("Creed", "Bratton", 5, 10),
    ("Daryll", "Philbin", 10, 10),
    ("Dwight", "Schrute", 2, 10),
    ("Jim", "Halpert", 8, 10),
    ("Kevin", "Malone", 1, 10),
    ("Kelly", "Kapoor", 3, 10),
    ("Meredith", "Palmer", 9, 10),
    ("Michael", "Scott", 6, NULL),
    ("Oscar", "Martinez", 1, 10),
    ("Pamela", "Beesly", 7, 10),
    ("Phyllis", "Vance", 8, 10),
    ("Stanley", "Hudson", 8, 10);
