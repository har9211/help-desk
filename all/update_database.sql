-- Ensure base tables exist
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    issue TEXT
);

CREATE TABLE IF NOT EXISTS chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_input TEXT,
    bot_response TEXT,
    language TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO chat_logs (user_input, bot_response, language) VALUES 
('What is the water issue helpline?', 'For water issues, contact Gram Panchayat or Jal Nigam.', 'en'),
('Bijli ka problem kahan register karna hai?', 'Electricity complaints can be registered at the local Bijli Board.', 'hi'),
('What are government schemes available?', 'You can check PM-Kisan, PMAY, and other schemes at https://www.india.gov.in', 'en'),
('Swasthya seva ke liye kahan jana chahiye?', 'For health services, visit the nearest Primary Health Center (PHC).', 'hi');
