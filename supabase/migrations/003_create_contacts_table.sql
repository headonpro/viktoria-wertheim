-- Create contacts table for SV Viktoria Wertheim
-- This table stores contact person information for the club

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  order_position INT NOT NULL DEFAULT 999,
  department VARCHAR(50) CHECK (department IN ('general', 'board', 'sports', 'youth', 'finance', 'facilities')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX idx_contacts_order ON contacts(order_position, role);
CREATE INDEX idx_contacts_department ON contacts(department);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
CREATE POLICY "Public can view contacts" ON contacts 
  FOR SELECT USING (is_active = true);

-- Apply updated_at trigger
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON contacts TO anon, authenticated;

-- Insert initial contact data
INSERT INTO contacts (role, name, email, phone, order_position, department) VALUES
-- General contact
('Geschäftsstelle', 'SV Viktoria Wertheim 1921 e.V.', 'info@viktoria-wertheim.de', '+49 9342 1234', 1, 'general'),

-- Board members
('1. Vorsitzender', 'Michael Weber', 'vorsitzender@viktoria-wertheim.de', '+49 9342 2345', 2, 'board'),
('2. Vorsitzender', 'Stefan Müller', 'stellvertreter@viktoria-wertheim.de', '+49 9342 3456', 3, 'board'),
('Kassenwart', 'Thomas Schmidt', 'kassenwart@viktoria-wertheim.de', '+49 9342 4567', 4, 'finance'),
('Schriftführer', 'Klaus Fischer', 'schriftfuehrer@viktoria-wertheim.de', '+49 9342 5678', 5, 'board'),

-- Sports department
('Sportlicher Leiter', 'Andreas Bauer', 'sport@viktoria-wertheim.de', '+49 9342 6789', 6, 'sports'),
('Trainer 1. Mannschaft', 'Thomas Müller', NULL, '+49 9342 7890', 7, 'sports'),
('Trainer 2. Mannschaft', 'Andreas Schmidt', NULL, '+49 9342 8901', 8, 'sports'),

-- Youth department
('Jugendleiter', 'Peter Wagner', 'jugend@viktoria-wertheim.de', '+49 9342 9012', 9, 'youth'),
('Jugendtrainer U19', 'Marco Klein', NULL, NULL, 10, 'youth'),
('Jugendtrainer U17', 'Robert Meyer', NULL, NULL, 11, 'youth'),

-- Other roles
('Platzwart', 'Hans Zimmermann', 'platzwart@viktoria-wertheim.de', '+49 9342 0123', 12, 'facilities'),
('Pressewart', 'Julia Becker', 'presse@viktoria-wertheim.de', '+49 9342 1230', 13, 'board');

-- Create a view for easier access to contacts by department
CREATE OR REPLACE VIEW contacts_by_department AS
SELECT 
  c.*,
  CASE 
    WHEN department = 'general' THEN 'Allgemein'
    WHEN department = 'board' THEN 'Vorstand'
    WHEN department = 'sports' THEN 'Sport'
    WHEN department = 'youth' THEN 'Jugend'
    WHEN department = 'finance' THEN 'Finanzen'
    WHEN department = 'facilities' THEN 'Anlagen'
    ELSE 'Sonstige'
  END as department_name
FROM contacts c
WHERE is_active = true
ORDER BY order_position, role;

-- Grant permissions for view
GRANT SELECT ON contacts_by_department TO anon, authenticated;