
-- seed.sql
-- WARNING: Change password hashes in production.
INSERT INTO employees (name, employee_number, password_hash, role)
VALUES ('Admin User', 'EMP001', '$2b$10$zqJ1wzQk0lY8x6fQ2Q2hruo2wqf3J1zK3aE9s1b6YJ8vQh2b4Zp1K', 'admin');
-- The above hash corresponds to password: admin123  (change it!)

INSERT INTO clients (name, phone, barcode_token)
VALUES ('Sample Client', '+966500000000', 'sampletoken123');
