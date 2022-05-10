INSERT INTO department (name)
VALUES 
    ('Customer Service'),
    ('Developers'),
    ('Marketing'),
    ('Sales');

INSERT INTO roles (title, salary, dapartment_id)
VALUES 
    ('Customer Service Rep', 40000, 1),
    ('Software Developer', 110000, 2),
    ('Marketer', 90000, 3),
    ('Customer Manager', 75000, 1),
    ('Developer Manager', 90000, 2),
    ('Marketing Manager', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  
    ('Mariella', 'Lewis', ?, 1),
    ('Lola', 'Morris', ?, 1),
    ('Shelly', 'Dixon', ?, 2),
    ('Yasir', 'Sargent', ?, 2),
    ('Bethany', 'Christian', ?, 3),
    ('Chandler', 'Acevedo', ?, 3);
