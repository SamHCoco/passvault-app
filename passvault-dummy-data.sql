--/data/user/0/host.exp.exponent/files/ExperienceData/%40anonymous%2Fpassvault-app-25ae6e89-190e-4e7f-bda6-f123b7409272/SQLite

CREATE TABLE IF NOT EXISTS web (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS card (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS web_credential (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  web_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  FOREIGN KEY (web_id) REFERENCES web(id),
  UNIQUE (web_id, username)
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
  ('Card 1'),
  ('Card 2'),
  ('Card 3'),
  ('Card 4'),
  ('Card 5');

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
    (1, 'Facebook'),
    (2, 'YouTube'),
    (3, 'AirBnB'),
    (4, 'Amazon'),
    (5, 'Outlook'),
    (6, 'Gmail'),
    (7, 'Yahoo'),
    (8, 'CeX'),
    (9, 'Figma');

INSERT INTO web_credential(web_id, username, password)
VALUES 
    (1, 'example1@example.com', 'pass123'),
    (1, 'random_user12@gmail.com', 'secretpass'),
    (2, 'user3@example.com', 'password123'),
    (3, 'myusername87@hotmail.com', 'p@ssw0rd'),
    (4, 'testuser321@yahoo.com', 'letmein2023'),
    (4, 'user6@example.com', 'qwerty123'),
    (4, 'john_doe@gmail.com', 'abc123'),
    (5, 'user8@example.com', 'hello123'),
    (6, 'jane_doe@hotmail.com', 'testpass'),
    (7, 'user10@example.com', 'password321'),
    (8, 'testuser11@yahoo.com', 'welcome123'),
    (9, 'user12@example.com', 'letmein123');
