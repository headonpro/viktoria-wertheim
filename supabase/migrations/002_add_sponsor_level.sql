-- Add level column to sponsors table
ALTER TABLE sponsors ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'silver' CHECK (level IN ('premium', 'gold', 'silver'));

-- Update existing sponsors with appropriate levels
UPDATE sponsors SET level = 'premium' WHERE name IN ('Sparkasse Tauberfranken', 'Autohaus Müller');
UPDATE sponsors SET level = 'gold' WHERE name IN ('Bäckerei Schmidt', 'Getränke Wagner', 'Elektro Weber');
UPDATE sponsors SET level = 'silver' WHERE level = 'silver';