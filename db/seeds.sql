USE employee_db;

INSERT INTO department (name)
VALUES ("Developers"),
       ("HR"),
       ("Accounting"),
       ("Sales"),
       ("Logistics");
     
    
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Developer', 125000, 1),
       ('Junior Developer', 75000, 1),
       ('Mid-Level Developer', 100000, 1),
       ('HR Manager', 100000, 2),
       ('Senior Accountant', 75000, 3),
       ('Accounting Assistant', 45000, 3),
       ('Sales Manager', 100000, 4),
       ('Salesperson', 60000, 4),
       ('Warehouse Manager', 90000, 5),
       ('Warehouse Employee', 40000, 5);
  
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Johnson", 1, NULL),
       ("Steve", "Samson", 2, 1),
       ("Susan", "Smith", 3, 1),
       ("Richard", "Little", 4, NULL),
       ("Sven", "Sorensen", 5, NULL)
       ("Roberta", "Burquist", 6, 5),
       ("Stephanie", "Gosling", 7, NULL),
       ("Chris", "Oaks", 8, 7),
       ("Stephen", "Gording", 9, NULL),
       ("Tyler", "Jones", 10, 9)

