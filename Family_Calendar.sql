--
-- PostgreSQL database dump
--

\restrict lT2wgZAJXRKVb5MJr5VubuMeyHAe20fc4rr9NoVKuahn0o28ccYVjODc7VNB7EJ

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: family_individual_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.family_individual_role AS ENUM (
    'MOM',
    'DAD',
    'CHILD',
    'OTHER'
);


ALTER TYPE public.family_individual_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calendar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar (
    id integer NOT NULL,
    family_id integer CONSTRAINT calendar_familyid_not_null NOT NULL,
    calendar_name character varying(255) CONSTRAINT calendar_name_not_null NOT NULL
);


ALTER TABLE public.calendar OWNER TO postgres;

--
-- Name: calendar_day; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_day (
    id integer NOT NULL,
    calendar_id integer NOT NULL,
    day_day integer NOT NULL,
    day_month integer NOT NULL,
    day_year integer NOT NULL
);


ALTER TABLE public.calendar_day OWNER TO postgres;

--
-- Name: calendar_day_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_day_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_day_id_seq OWNER TO postgres;

--
-- Name: calendar_day_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_day_id_seq OWNED BY public.calendar_day.id;


--
-- Name: calendar_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_event (
    id integer NOT NULL,
    calendar_day_id integer NOT NULL,
    event_title character varying(255) NOT NULL,
    event_start_hour integer NOT NULL,
    event_start_minute integer NOT NULL,
    event_start_is_am boolean DEFAULT false NOT NULL,
    event_end_hour integer NOT NULL,
    event_end_minute integer NOT NULL,
    event_end_is_am boolean DEFAULT false NOT NULL,
    event_location character varying(255) NOT NULL,
    event_notes character varying(1023),
    created_by_id integer NOT NULL,
    for_id integer
);


ALTER TABLE public.calendar_event OWNER TO postgres;

--
-- Name: calendar_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_event_id_seq OWNER TO postgres;

--
-- Name: calendar_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_event_id_seq OWNED BY public.calendar_event.id;


--
-- Name: calendar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_id_seq OWNER TO postgres;

--
-- Name: calendar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_id_seq OWNED BY public.calendar.id;


--
-- Name: family; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.family (
    id integer NOT NULL,
    code character varying(16) NOT NULL
);


ALTER TABLE public.family OWNER TO postgres;

--
-- Name: family_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.family_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.family_id_seq OWNER TO postgres;

--
-- Name: family_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.family_id_seq OWNED BY public.family.id;


--
-- Name: family_individuals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.family_individuals (
    id integer NOT NULL,
    family_id integer NOT NULL,
    individual_role public.family_individual_role DEFAULT 'CHILD'::public.family_individual_role,
    individual_name character varying(255) NOT NULL,
    can_drive boolean DEFAULT false,
    can_edit boolean DEFAULT false,
    color_str character varying(255),
    image_str character varying(255)
);


ALTER TABLE public.family_individuals OWNER TO postgres;

--
-- Name: family_individuals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.family_individuals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.family_individuals_id_seq OWNER TO postgres;

--
-- Name: family_individuals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.family_individuals_id_seq OWNED BY public.family_individuals.id;


--
-- Name: transportation_for_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transportation_for_event (
    id integer NOT NULL,
    vehicle_id integer,
    event_id integer NOT NULL,
    leave_at_hour integer,
    leave_at_minute integer,
    leave_at_is_am boolean,
    is_arrival boolean DEFAULT false NOT NULL,
    driver_id integer
);


ALTER TABLE public.transportation_for_event OWNER TO postgres;

--
-- Name: transportation_for_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transportation_for_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transportation_for_event_id_seq OWNER TO postgres;

--
-- Name: transportation_for_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transportation_for_event_id_seq OWNED BY public.transportation_for_event.id;


--
-- Name: transportation_passengers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transportation_passengers (
    transportation_id integer NOT NULL,
    passenger_id integer NOT NULL
);


ALTER TABLE public.transportation_passengers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    family_individual_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle (
    id integer NOT NULL,
    vehicle_name character varying(255) CONSTRAINT vehicle_vehiclename_not_null NOT NULL,
    num_people_can_fit integer CONSTRAINT vehicle_numpeoplecanfit_not_null NOT NULL,
    family_id integer CONSTRAINT vehicle_familyid_not_null NOT NULL
);


ALTER TABLE public.vehicle OWNER TO postgres;

--
-- Name: vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_id_seq OWNER TO postgres;

--
-- Name: vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_id_seq OWNED BY public.vehicle.id;


--
-- Name: calendar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar ALTER COLUMN id SET DEFAULT nextval('public.calendar_id_seq'::regclass);


--
-- Name: calendar_day id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_day ALTER COLUMN id SET DEFAULT nextval('public.calendar_day_id_seq'::regclass);


--
-- Name: calendar_event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_event ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_id_seq'::regclass);


--
-- Name: family id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family ALTER COLUMN id SET DEFAULT nextval('public.family_id_seq'::regclass);


--
-- Name: family_individuals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_individuals ALTER COLUMN id SET DEFAULT nextval('public.family_individuals_id_seq'::regclass);


--
-- Name: transportation_for_event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_for_event ALTER COLUMN id SET DEFAULT nextval('public.transportation_for_event_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle ALTER COLUMN id SET DEFAULT nextval('public.vehicle_id_seq'::regclass);


--
-- Data for Name: calendar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar (id, family_id, calendar_name) FROM stdin;
0	0	Murphy Family Calendar
2	4	test calendar
3	5	My calendar
4	6	My calendar
5	7	My calendar
6	8	My calendar
7	9	My calendar
8	10	My calendar
9	11	My calendar
10	12	My calendar
11	13	My calendar
\.


--
-- Data for Name: calendar_day; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_day (id, calendar_id, day_day, day_month, day_year) FROM stdin;
1	0	24	6	2026
2	0	14	6	2026
3	0	15	6	2026
5	0	22	6	2026
6	0	17	6	2026
7	0	19	6	2026
9	10	16	6	2026
10	0	16	6	2026
11	0	18	6	2026
12	0	23	6	2026
13	0	27	6	2026
14	0	26	6	2026
15	0	25	6	2026
16	0	29	6	2026
17	0	2	7	2026
18	0	10	6	2026
19	0	4	7	2026
20	0	3	7	2026
21	0	6	7	2026
22	0	13	7	2026
23	0	20	7	2026
24	0	27	7	2026
25	0	3	8	2026
26	0	2	6	2026
27	0	9	6	2026
28	0	30	6	2026
29	0	7	7	2026
30	0	14	7	2026
31	0	21	7	2026
32	0	28	7	2026
33	0	25	5	2026
34	0	1	6	2026
35	0	8	6	2026
36	0	7	4	2026
37	0	7	5	2026
38	0	7	6	2026
39	0	7	8	2026
40	0	20	6	2026
\.


--
-- Data for Name: calendar_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_event (id, calendar_day_id, event_title, event_start_hour, event_start_minute, event_start_is_am, event_end_hour, event_end_minute, event_end_is_am, event_location, event_notes, created_by_id, for_id) FROM stdin;
13	3	Soccer	4	30	f	6	0	f	Annie Sullivan	\N	2	6
2	1	Soccer	4	30	f	6	0	f	Annie Sullivan	\N	2	2
9	7	Town Practice	4	30	f	6	0	f	King Street	\N	2	6
19	6	School	8	0	t	2	30	f	Annie Sullivan	\N	2	6
6	2	Soccer Game	1	0	f	12	0	f	Home	\N	2	2
30	12	Test	5	0	f	12	0	f	a		2	3
31	13	T	7	0	f	12	0	f	a		2	3
32	14	T1	1	0	f	12	0	f	A		2	2
33	15	T2	1	0	f	12	0	f	a		2	4
34	16	Final Test	5	0	f	12	0	f	a		2	5
37	19	A test	4	0	f	12	0	f	a		2	2
38	11	Test	5	0	f	12	0	f	Test L		2	3
39	15	Test	5	0	f	12	0	f	Test L		2	3
40	17	Test	5	0	f	12	0	f	Test L		2	3
20	6	School	8	30	t	2	0	f	Xaverian	\N	2	3
41	7	Test Event	4	0	f	5	0	f	Anywhere		2	2
42	14	Test Event	4	0	f	5	0	f	Anywhere		2	2
43	20	Test Event	4	0	f	5	0	f	Anywhere		2	2
4	3	Club Practice	4	0	f	12	0	f	Home	\N	2	3
5	5	Doctors appointment	5	0	f	6	0	f	Home	\N	2	4
10	9	Johny II practice	2	0	f	12	0	f	Somewhere over the rainbow	\N	19	19
11	9	Test Event	6	0	f	12	0	f	S	\N	19	16
49	3	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
50	21	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
51	22	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
15	6	Soccer	6	30	f	8	0	f	Annie Sullivan		2	3
14	2	Soccer	6	30	t	8	0	f	Annie Sullivan	\N	2	5
52	24	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
53	5	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
54	25	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
55	16	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
56	23	Leave for work	4	30	t	5	30	t	Charlotte Airport		2	5
84	29	Test monthly event	12	0	f	12	0	f	Test location		2	6
85	36	Test monthly event	12	0	f	12	0	f	Test location		2	6
86	38	Test monthly event	12	0	f	12	0	f	Test location		2	6
87	37	Test monthly event	12	0	f	12	0	f	Test location		2	6
88	39	Test monthly event	12	0	f	12	0	f	Test location		2	6
89	29	Peter recurring event	12	0	f	12	0	f	Test		2	2
90	36	Peter recurring event	12	0	f	12	0	f	Test		2	2
91	39	Peter recurring event	12	0	f	12	0	f	Test		2	2
92	38	Peter recurring event	12	0	f	12	0	f	Test		2	2
93	37	Peter recurring event	12	0	f	12	0	f	Test		2	2
21	7	Soccer	6	30	f	8	30	f	Ashland HS	\N	2	2
96	40	Test Event V	10	0	t	12	0	f	Somewhere		2	4
95	19	Test Event V	10	0	t	12	0	f	Somewhere		2	4
94	13	Test Event V	10	0	t	12	0	f	Somewhere	\N	2	4
36	18	Final Test	7	0	f	12	0	f	a	\N	2	3
8	11	Club Practice	5	30	f	7	0	f	Dacey Field	\N	2	6
29	10	Test Event	4	0	f	12	0	f	a	\N	2	2
\.


--
-- Data for Name: family; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.family (id, code) FROM stdin;
0	A7F9-KD3P-2QX1
4	GCR8-QTW1-0NNB
5	N0IE-9OKH-YAQU
6	SZGF-IVK1-8VRV
7	MR33-YGT3-QMGF
8	4C65-UTDC-YBK4
9	TCSO-8DEG-SUTX
10	ZSZ1-O8SO-PVX3
11	DKUH-BFR1-IEE3
12	5UNU-B4UH-M0AA
13	A6Q7-LGBO-HRS3
\.


--
-- Data for Name: family_individuals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.family_individuals (id, family_id, individual_role, individual_name, can_drive, can_edit, color_str, image_str) FROM stdin;
2	0	CHILD	Peter	t	t	#90D5FF	\N
3	0	CHILD	Brendan	t	f	#fcba03	\N
4	0	MOM	Elizabeth	t	f	#f003fc	\N
6	0	CHILD	Kevin	f	f	#34eb37	\N
7	4	DAD	test parent	t	t	90D5FF	\N
9	6	CHILD	test User	t	t	\N	\N
10	7	CHILD	test User	t	t	\N	\N
11	8	CHILD	Test User_0	f	t	\N	\N
12	9	CHILD	Test User_0	f	t	\N	\N
13	10	CHILD	Test User_1	f	t	\N	\N
14	11	CHILD	test User_2	f	t	\N	\N
16	12	CHILD	Johnny's Kid	f	f	\N	\N
15	12	DAD	Johnny Test	f	t	\N	\N
17	12	CHILD	Test User with fam	f	t	\N	\N
18	12	CHILD	Johnny Jr.	t	f	\N	\N
19	12	CHILD	Johnny II	t	f	#33dbb1	\N
20	13	DAD	Lionel Messi	f	t	#3498db	\N
5	0	DAD	Dad	t	f	#FF0000	\N
\.


--
-- Data for Name: transportation_for_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transportation_for_event (id, vehicle_id, event_id, leave_at_hour, leave_at_minute, leave_at_is_am, is_arrival, driver_id) FROM stdin;
105	1	21	6	0	f	f	2
108	2	96	9	30	t	t	4
107	2	95	9	30	t	t	4
106	2	94	9	30	t	t	4
1	1	4	\N	\N	\N	t	3
3	1	4	\N	\N	\N	f	3
6	2	5	\N	\N	\N	f	4
4	2	9	\N	\N	\N	t	3
5	2	9	\N	\N	\N	f	3
8	1	19	\N	\N	\N	f	4
17	1	36	\N	\N	\N	t	3
18	1	36	\N	\N	\N	f	3
15	1	31	\N	\N	\N	f	3
109	1	8	\N	\N	\N	t	2
19	1	37	\N	\N	\N	t	2
20	1	37	\N	\N	\N	f	2
21	2	20	\N	\N	\N	f	3
22	2	20	\N	\N	\N	t	3
23	2	38	\N	\N	\N	f	3
24	2	40	\N	\N	\N	f	3
25	2	39	\N	\N	\N	f	3
26	2	39	\N	\N	\N	f	3
27	2	40	\N	\N	\N	f	3
28	2	38	\N	\N	\N	f	3
29	6	41	\N	\N	\N	f	2
30	6	42	\N	\N	\N	f	2
31	6	43	\N	\N	\N	f	2
7	1	8	\N	\N	\N	f	3
110	2	29	\N	\N	\N	t	2
14	2	29	\N	\N	\N	f	2
43	6	49	\N	\N	\N	t	5
42	6	49	\N	\N	\N	f	5
46	6	55	\N	\N	\N	t	5
47	6	51	\N	\N	\N	f	5
45	6	50	\N	\N	\N	f	5
44	6	55	\N	\N	\N	f	5
48	6	53	\N	\N	\N	f	5
50	6	56	\N	\N	\N	f	5
51	6	56	\N	\N	\N	t	5
49	6	53	\N	\N	\N	t	5
52	6	52	\N	\N	\N	f	5
53	6	52	\N	\N	\N	t	5
54	6	54	\N	\N	\N	f	5
55	6	54	\N	\N	\N	t	5
56	6	50	\N	\N	\N	t	5
57	6	51	\N	\N	\N	t	5
100	1	84	\N	\N	\N	f	2
103	1	88	\N	\N	\N	f	2
101	1	87	\N	\N	\N	f	2
104	1	85	\N	\N	\N	f	2
102	1	86	\N	\N	\N	f	2
\.


--
-- Data for Name: transportation_passengers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transportation_passengers (transportation_id, passenger_id) FROM stdin;
4	6
5	6
18	6
18	4
7	6
110	6
14	6
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, family_individual_id, created_at) FROM stdin;
1	pmurphy26	$2b$10$cOyODyCPPrMeCXv5xzkja.87F5SPDjlcpq2hRVps/UAvtx18DIKwW	2	2026-06-13 14:23:01.087409
2	test_user	$2b$10$bVSVrTkXQ8GSnF1BLImGPOAVMXTqkhRKcQLUe8dMktDz2lz0gkmpC	7	2026-06-16 18:02:06.960878
3	test_no_fam	$2b$10$lYPtixIgfyc5LKb8Dk/bhuB0HO7kAGb.Y2Gc533rUhWqJ9F.2TNQ2	10	2026-06-16 21:24:43.112198
4	test_no_fam_0	$2b$10$fvXDlGD.z2gXkoQBCPZhxefZU5BQgmqpYzBOWWqZOokGceOhcK.ri	11	2026-06-16 23:11:42.285964
5	test_user_0	$2b$10$QnqoE6QKqam8zjebjPNFIueoPCKdN2vACIOvDXS/8vuRSSFMtCotG	12	2026-06-16 23:13:46.793434
6	test_user_1	$2b$10$3.2GPJ4C4ZFfvz0UWzNokOfW5hlW6fgiBIGJfCHmbJHYFO2Tgw0Ju	13	2026-06-16 23:21:39.449017
7	test_user_2	$2b$10$9XCLPMCuV6x0B.IKAQFhiu6k6W0JsuGqMxraWBj.i6V9ohEmpS5a2	14	2026-06-16 23:21:59.12767
8	test_user_3	$2b$10$lNdLFdBQ/EVBJDPSvIGPEOjCEmI7bPzozyGwVLy3TdO36wnUfPm8O	15	2026-06-16 23:28:07.581246
9	test_user_with_fam	$2b$10$ERGE.UVxUSE9qt6QtmH40ujFuzOTMOGT9OV5mLcYPVXqF8Hg3OmJC	17	2026-06-16 23:43:43.210745
10	test_user_4	$2b$10$aoOWEg9sk0inm1GGfRXbU.5UOBbtDqdlvQ5aINEbwD575WZ2GhfOa	18	2026-06-16 23:46:53.535246
11	test_user_5	$2b$10$Qp85wNGhd0QxnQPXq6j91uf3KGZl8pWi/mz47v2UqVsbBZfKP/3q6	19	2026-06-16 23:52:09.185225
12	test_user_6	$2b$10$SP2rfGkkGu4I9pSEAuNXXOCE9i4akrp4MvqKoP9zUOotbvR810VSG	20	2026-06-16 23:56:39.531905
13	new user	$2b$10$G8FRSvaZdN22n8Jg943Gx.ukto7J3xIL78Ywhw9aZHXpWk.g11JAO	\N	2026-06-19 12:06:06.858767
\.


--
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle (id, vehicle_name, num_people_can_fit, family_id) FROM stdin;
1	The minivan	8	0
2	Palisade	7	0
6	Rover	5	0
\.


--
-- Name: calendar_day_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_day_id_seq', 40, true);


--
-- Name: calendar_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_event_id_seq', 96, true);


--
-- Name: calendar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_id_seq', 11, true);


--
-- Name: family_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.family_id_seq', 13, true);


--
-- Name: family_individuals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.family_individuals_id_seq', 20, true);


--
-- Name: transportation_for_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transportation_for_event_id_seq', 110, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_id_seq', 6, true);


--
-- Name: calendar_day calendar_day_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_day
    ADD CONSTRAINT calendar_day_pkey PRIMARY KEY (id);


--
-- Name: calendar_event calendar_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_pkey PRIMARY KEY (id);


--
-- Name: calendar calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar
    ADD CONSTRAINT calendar_pkey PRIMARY KEY (id);


--
-- Name: family family_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family
    ADD CONSTRAINT family_code_key UNIQUE (code);


--
-- Name: family_individuals family_individuals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_individuals
    ADD CONSTRAINT family_individuals_pkey PRIMARY KEY (id);


--
-- Name: family family_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family
    ADD CONSTRAINT family_pkey PRIMARY KEY (id);


--
-- Name: transportation_for_event transportation_for_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_for_event
    ADD CONSTRAINT transportation_for_event_pkey PRIMARY KEY (id);


--
-- Name: transportation_passengers transportation_passengers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_passengers
    ADD CONSTRAINT transportation_passengers_pkey PRIMARY KEY (transportation_id, passenger_id);


--
-- Name: calendar_day unique_calendar_date; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_day
    ADD CONSTRAINT unique_calendar_date UNIQUE (calendar_id, day_day, day_month, day_year);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vehicle vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (id);


--
-- Name: calendar_day calendar_day_calendar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_day
    ADD CONSTRAINT calendar_day_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendar(id);


--
-- Name: calendar_event calendar_event_calendar_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_calendar_day_id_fkey FOREIGN KEY (calendar_day_id) REFERENCES public.calendar_day(id);


--
-- Name: calendar_event calendar_event_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.family_individuals(id);


--
-- Name: calendar_event calendar_event_for_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_event
    ADD CONSTRAINT calendar_event_for_id_fkey FOREIGN KEY (for_id) REFERENCES public.family_individuals(id);


--
-- Name: calendar calendar_familyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar
    ADD CONSTRAINT calendar_familyid_fkey FOREIGN KEY (family_id) REFERENCES public.family(id);


--
-- Name: family_individuals family_individuals_family_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_individuals
    ADD CONSTRAINT family_individuals_family_id_fkey FOREIGN KEY (family_id) REFERENCES public.family(id);


--
-- Name: transportation_for_event transportation_for_event_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_for_event
    ADD CONSTRAINT transportation_for_event_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.family_individuals(id) ON DELETE CASCADE;


--
-- Name: transportation_for_event transportation_for_event_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_for_event
    ADD CONSTRAINT transportation_for_event_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.calendar_event(id) ON DELETE CASCADE;


--
-- Name: transportation_for_event transportation_for_event_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_for_event
    ADD CONSTRAINT transportation_for_event_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(id) ON DELETE CASCADE;


--
-- Name: transportation_passengers transportation_passengers_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_passengers
    ADD CONSTRAINT transportation_passengers_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.family_individuals(id) ON DELETE CASCADE;


--
-- Name: transportation_passengers transportation_passengers_transportation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transportation_passengers
    ADD CONSTRAINT transportation_passengers_transportation_id_fkey FOREIGN KEY (transportation_id) REFERENCES public.transportation_for_event(id) ON DELETE CASCADE;


--
-- Name: users users_family_individual_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_family_individual_id_fkey FOREIGN KEY (family_individual_id) REFERENCES public.family_individuals(id);


--
-- Name: vehicle vehicle_familyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_familyid_fkey FOREIGN KEY (family_id) REFERENCES public.family(id);


--
-- PostgreSQL database dump complete
--

\unrestrict lT2wgZAJXRKVb5MJr5VubuMeyHAe20fc4rr9NoVKuahn0o28ccYVjODc7VNB7EJ

