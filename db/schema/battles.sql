CREATE TABLE IF NOT EXISTS battles (
    battleID INTEGER PRIMARY KEY,
    firstUserID TEXT,
    secondUserID TEXT,
    battleData TEXT
);

CREATE TABLE IF NOT EXISTS users (
    userID TEXT PRIMARY KEY,
    score TEXT
);