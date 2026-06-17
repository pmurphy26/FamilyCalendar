CREATE TABLE family (
    id SERIAL PRIMARY KEY,
    code VARCHAR(16) UNIQUE NOT NULL
);

CREATE TYPE FAMILY_INDIVIDUAL_ROLE AS ENUM ('MOM', 'DAD', 'CHILD', 'PARENT', 'GRANDPARENT', 'OTHER');

CREATE TABLE family_individuals (
    id SERIAL PRIMARY KEY,
    family_id INTEGER REFERENCES family(id) NOT NULL,
    individual_role FAMILY_INDIVIDUAL_ROLE DEFAULT 'CHILD',
    individual_name VARCHAR(255) NOT NULL,
    can_drive BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    color_str VARCHAR(255),
    image_str VARCHAR(255)
);

CREATE TABLE calendar (
    id SERIAL PRIMARY KEY,
    family_id INTEGER REFERENCES family(id) NOT NULL,
    calendar_name VARCHAR(255) NOT NULL
);

CREATE TABLE calendar_day (
    id SERIAL PRIMARY KEY,
    calendar_id INTEGER REFERENCES calendar(id) NOT NULL,
    day_day INTEGER NOT NULL,
    day_month INTEGER NOT NULL, 
    day_year INTEGER NOT NULL
);

ALTER TABLE calendar_day
ADD CONSTRAINT unique_calendar_date
UNIQUE (calendar_id, day_day, day_month, day_year);

CREATE TABLE calendar_event (
    id SERIAL PRIMARY KEY,

    calendar_day_id INTEGER REFERENCES calendar_day(id) NOT NULL,

    event_title VARCHAR(255) NOT NULL,

    event_start_hour INTEGER NOT NULL,
    event_start_minute INTEGER NOT NULL,
    event_start_is_am BOOLEAN DEFAULT false NOT NULL,

    event_end_hour INTEGER NOT NULL,
    event_end_minute INTEGER NOT NULL,
    event_end_is_am BOOLEAN DEFAULT false NOT NULL,

    event_location VARCHAR(255) NOT NULL,
    event_notes VARCHAR(1023),

    created_by_id INTEGER REFERENCES family_individuals(id) NOT NULL,
    for_id INTEGER REFERENCES family_individuals(id)
);

CREATE TABLE vehicle (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    num_people_can_fit INTEGER NOT NULL,
    family_id INTEGER REFERENCES family(id) NOT NULL
);

CREATE TABLE transportation_for_event (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicle(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES calendar_event(id) NOT NULL ON DELETE CASCADE,
    leave_at_hour INTEGER,
    leave_at_minute INTEGER, 
    leave_at_is_am BOOLEAN,
    is_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    driver_id INTEGER REFERENCES family_individuals(id) ON DELETE CASCADE
);

CREATE TABLE transportation_passengers (
    transportation_id INTEGER NOT NULL,
    passenger_id INTEGER NOT NULL,

    FOREIGN KEY (transportation_id)
        REFERENCES transportation_for_event(id)
        ON DELETE CASCADE,

    FOREIGN KEY (passenger_id)
        REFERENCES family_individuals(id)
        ON DELETE CASCADE,

    PRIMARY KEY (transportation_id, passenger_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    family_individual_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (family_individual_id) REFERENCES family_individuals(id)
);