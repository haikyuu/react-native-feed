--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgraphql_watch; Type: SCHEMA; Schema: -; Owner: ma
--

CREATE SCHEMA postgraphql_watch;


ALTER SCHEMA postgraphql_watch OWNER TO ma;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = postgraphql_watch, pg_catalog;

--
-- Name: notify_watchers(); Type: FUNCTION; Schema: postgraphql_watch; Owner: ma
--

CREATE FUNCTION notify_watchers() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$ begin perform pg_notify( 'postgraphql_watch', (select array_to_json(array_agg(x)) from (select schema_name as schema, command_tag as command from pg_event_trigger_ddl_commands()) as x)::text ); end; $$;


ALTER FUNCTION postgraphql_watch.notify_watchers() OWNER TO ma;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: ma
--

CREATE TABLE cities (
    name character varying(80),
    location point
);


ALTER TABLE cities OWNER TO ma;

--
-- Name: searchcities(text); Type: FUNCTION; Schema: public; Owner: ma
--

CREATE FUNCTION searchcities(search text) RETURNS SETOF cities
    LANGUAGE sql STABLE
    AS $$
select * from cities where
name ilike ('%' || search || '%')
$$;


ALTER FUNCTION public.searchcities(search text) OWNER TO ma;

--
-- Name: person; Type: TABLE; Schema: public; Owner: ma
--

CREATE TABLE person (
    id integer,
    name character varying(40) NOT NULL
);


ALTER TABLE person OWNER TO ma;

--
-- Name: post; Type: TABLE; Schema: public; Owner: ma
--

CREATE TABLE post (
    id integer NOT NULL,
    body character varying(250),
    createdat timestamp without time zone DEFAULT now(),
    image text,
    userid integer NOT NULL
);


ALTER TABLE post OWNER TO ma;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: ma
--

CREATE SEQUENCE post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE post_id_seq OWNER TO ma;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ma
--

ALTER SEQUENCE post_id_seq OWNED BY post.id;


--
-- Name: user_like_post; Type: TABLE; Schema: public; Owner: ma
--

CREATE TABLE user_like_post (
    userid integer NOT NULL,
    postid integer NOT NULL
);


ALTER TABLE user_like_post OWNER TO ma;

--
-- Name: users; Type: TABLE; Schema: public; Owner: ma
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(40) NOT NULL
);


ALTER TABLE users OWNER TO ma;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ma
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO ma;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ma
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: weather; Type: TABLE; Schema: public; Owner: ma
--

CREATE TABLE weather (
    city character varying(80),
    temp_lo integer,
    temp_hi integer,
    prcp real,
    date date
);


ALTER TABLE weather OWNER TO ma;

--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: ma
--

ALTER TABLE ONLY post ALTER COLUMN id SET DEFAULT nextval('post_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ma
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: ma
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: user_like_post user_like_post_pkey; Type: CONSTRAINT; Schema: public; Owner: ma
--

ALTER TABLE ONLY user_like_post
    ADD CONSTRAINT user_like_post_pkey PRIMARY KEY (userid, postid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ma
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: post post_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ma
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_userid_fkey FOREIGN KEY (userid) REFERENCES users(id);


--
-- Name: user_like_post user_like_post_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ma
--

ALTER TABLE ONLY user_like_post
    ADD CONSTRAINT user_like_post_postid_fkey FOREIGN KEY (postid) REFERENCES post(id) ON DELETE CASCADE;


--
-- Name: user_like_post user_like_post_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ma
--

ALTER TABLE ONLY user_like_post
    ADD CONSTRAINT user_like_post_userid_fkey FOREIGN KEY (userid) REFERENCES users(id);


--
-- Name: postgraphql_watch; Type: EVENT TRIGGER; Schema: -; Owner: ma
--

CREATE EVENT TRIGGER postgraphql_watch ON ddl_command_end
         WHEN TAG IN ('ALTER DOMAIN', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE DOMAIN', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP DOMAIN', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP SCHEMA', 'DROP TABLE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphql_watch.notify_watchers();


--
-- PostgreSQL database dump complete
--
