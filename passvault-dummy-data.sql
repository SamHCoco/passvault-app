CREATE TABLE IF NOT EXISTS web (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS web_url (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  web_id INTEGER NOT NULL,
  FOREIGN KEY (web_id) REFERENCES web(id)
);

CREATE TABLE IF NOT EXISTS card (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS web_credential (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  web_url_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  FOREIGN KEY (web_url_id) REFERENCES web_url(id),
  UNIQUE (web_url_id, username)
);

CREATE TABLE IF NOT EXISTS card_credential (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  card_number TEXT NOT NULL,
  exp_date TEXT NOT NULL,
  security_code INTEGER,
  FOREIGN KEY (card_id) REFERENCES card(id),
  UNIQUE (card_id, card_number)
);

INSERT INTO card (name) VALUES
  ('NatWest'),
  ('Lloyds Bank'),
  ('Goldman'),
  ('Starling'),
  ('Revult');

INSERT INTO card_credential (card_id, card_number, exp_date, security_code) VALUES
  (1, '1111222233334444', '12/25', 123),
  (1, '1111222233335555', '01/26', 456),
  (2, '2222333344446666', '03/27', 789),
  (2, '2222333344447777', '06/28', 321),
  (3, '3333444455558888', '09/29', 654),
  (3, '3333444455559999', '12/30', 987),
  (4, '4444555566660000', '02/31', 234),
  (4, '4444555566661111', '05/32', 567),
  (5, '5555666677772222', '08/33', 890),
  (5, '5555666677773333', '11/34', 432),
  (1, '1111222233334444', '02/26', 765),
  (2, '2222333344445555', '04/27', 098),
  (3, '3333444455556666', '06/28', 321),
  (4, '4444555566667777', '08/29', 654),
  (5, '5555666677778888', '10/30', 987);

INSERT INTO web(id, name)
VALUES
    (1, 'facebook'),
    (2, 'youTube'),
    (3, 'airbnb'),
    (4, 'amazon'),
    (5, 'outlook'),
    (6, 'gmail'),
    (7, 'yahoo'),
    (8, 'cex'),
    (9, 'figma');

INSERT INTO web_url(url, web_id)
VALUES
    ("http://facebook.com", 1),
    ("http://youtube.co.uk", 2),
    ("http://airbnb.com", 3),
    ("http://amazon.ca", 4),
    ("http://outlook.com", 5),
    ("http://gmail.co.uk", 6),
    ("http://yahoo.com", 7),
    ("http://cex.co.uk", 8),
    ("http://figma.com", 9);

INSERT INTO web_credential(web_id, web_url_id, username, password)
VALUES 
    (1, 1, 'example1@example.com', 'pass123'),
    (1, 1, 'random_user12@gmail.com', 'secretpass'),
    (2, 2, 'user3@example.com', 'password123'),
    (3, 3, 'myusername87@hotmail.com', 'p@ssw0rd'),
    (4, 4, 'testuser321@yahoo.com', 'letmein2023'),
    (4, 4, 'user6@example.com', 'qwerty123'),
    (4, 4, 'john_doe@gmail.com', 'abc123'),
    (5, 5, 'user8@example.com', 'hello123'),
    (6, 6, 'jane_doe@hotmail.com', 'testpass'),
    (7, 7, 'user10@example.com', 'password321'),
    (8, 8, 'testuser11@yahoo.com', 'welcome123'),
    (9, 9, 'user12@example.com', 'letmein123');
