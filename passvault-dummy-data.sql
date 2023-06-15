--/data/user/0/host.exp.exponent/files/ExperienceData/%40anonymous%2Fpassvault-app-25ae6e89-190e-4e7f-bda6-f123b7409272/SQLite

CREATE TABLE IF NOT EXISTS web (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS card (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS web_credential (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  web_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  FOREIGN KEY (web_id) REFERENCES web(id)
);

CREATE TABLE IF NOT EXISTS card_credential (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  card_number TEXT NOT NULL,
  exp_date TEXT NOT NULL,
  security_code INTEGER,
  FOREIGN KEY (card_id) REFERENCES card(id)
);

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



INSERT INTO card(id, name)
VALUES 
    (1, 'Visa'),
    (2, 'MasterCard');

INSERT INTO card_credential(id, card_id, card_number, exp_date, security_code)
VALUES 
    (1, 1, '4916078932158762', '2023-08-01', 123),
    (2, 2, '3782456012345670', '2024-05-01', 456),
    (3, 1, '5246183250764219', '2023-12-01', 789),
    (4, 2, '6011508098745632', '2024-09-01', 234),
    (5, 1, '4123678456327850', '2023-10-01', 567);