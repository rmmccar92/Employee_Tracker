
INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Marketing'),
    ('Accounting'),
    ('Legal'),
    ('Maitenance'),
    ('Medical');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Salesperson', 75000, 2),
    ('Marketer', 85000, 3),
    ('Engineer', 95000, 1),
    ('Accountant', 100000, 4),
    ('Lawyer', 140000, 5),
    ('Executive' , 250000, NULL),
    ('Custodian',60000 , 6),
    ('Nurse', 95000, 7);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Pete', 'Otto', 1, NULL),
    ('Mike', 'Rodger', 2, 1),
    ('Ash', 'Ketchum', 3, NULL),
    ('Kevin', 'Snyder', 4, 3),
    ('Olaf', 'Tanner', 5, NULL),
    ('Al', 'Johnson', 2, 5),
    ('Sherry', 'Black', 1, NULL),
    ('Tom', 'Allen', 2, 7),
    ('Jimmy', 'Newman' , 8 , NULL);
