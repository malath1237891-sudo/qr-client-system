
-- schema.sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  employee_number VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  barcode_token VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  visit_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clients_barcode_token ON clients(barcode_token);
CREATE INDEX idx_visits_client_id ON visits(client_id);
