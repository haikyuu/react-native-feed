CREATE TABLE users (
    id serial primary key,
    name character varying(40) NOT NULL
);

CREATE TABLE post (
    id serial primary key,
    body character varying(250),
    createdat timestamp without time zone DEFAULT now(),
    image text,
    userid int NOT NULL REFERENCES users(id)
);

CREATE TABLE user_like_post (
    userid integer NOT NULL REFERENCES users,
    postid integer NOT NULL REFERENCES post
);
INSERT INTO users (id, name) VALUES (1, 'abdellah');
