CREATE TABLE Family (
    id SERIAL PRIMARY KEY
);

CREATE TYPE FAMILY_INDIVIDUAL_ROLE AS ENUM ('MOM', 'DAD', 'CHILD', 'PARENT', 'GRANDPARENT', 'OTHER');

CREATE TABLE FamilyIndividuals (
    id SERIAL PRIMARY KEY,
    familyID INTEGER REFERENCES Family(id) NOT NULL,
    role FAMILY_INDIVIDUAL_ROLE DEFAULT 'CHILD',
    name VARCHAR(255) NOT NULL,
    canDrive BOOLEAN DEFAULT false,
    canEdit BOOLEAN DEFAULT false
);

CREATE TABLE Calendar (
    id SERIAL PRIMARY KEY,
    familyID INTEGER REFERENCES Family(id) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE CalendarDay (
    id SERIAL PRIMARY KEY,
    calendarID INTEGER REFERENCES Calendar(id) NOT NULL,
    dayDay INTEGER NOT NULL,
    dayMonth INTEGER NOT NULL, 
    dayYear INTEGER NOT NULL
);

CREATE TABLE CalendarEvent (
    id SERIAL PRIMARY KEY,
    calendarDayID INTEGER REFERENCES CalendarDay(id) NOT NULL,
    eventTitle VARCHAR(255) NOT NULL,
    eventHour INTEGER NOT NULL,
    eventMinute INTEGER NOT NULL, 
    eventIsAM BOOLEAN DEFAULT false NOT NULL,
    eventLocation VARCHAR(255) NOT NULL,
    eventNotes VARCHAR(1023),
    createdByID INTEGER REFERENCES FamilyIndividuals(id) NOT NULL,
    forID INTEGER REFERENCES FamilyIndividuals(id)
);

CREATE TABLE Vehicle (
    id SERIAL PRIMARY KEY,
    vehicleName VARCHAR(255) NOT NULL,
    numPeopleCanFit INTEGER NOT NULL,
    familyID INTEGER REFERENCES Family(id) NOT NULL
);

CREATE TABLE TransportationForEvent (
    id SERIAL PRIMARY KEY,
    vehicleID INTEGER REFERENCES Vehicle(id),
    eventID INTEGER REFERENCES calendarevent(id) NOT NULL,
    leaveAtHour INTEGER,
    leaveAtMinute INTEGER, 
    leaveAtIsAM BOOLEAN,
    driverID INTEGER REFERENCES FamilyIndividuals(id)
);