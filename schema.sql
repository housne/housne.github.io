DROP TABLE IF EXISTS comments;
CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, author TEXT NOT NULL, email TEXT NOT NULL, website TEXT, body TEXT NOT NULL, post_slug TEXT NOT NULL);

DROP TABLE IF EXISTS reactions;
CREATE TABLE IF NOT EXISTS reactions (id INTEGER PRIMARY KEY, type INTEGER NOT NULL, post_slug TEXT NOT NULL);