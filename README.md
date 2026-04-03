## Project Description

This is a passion project that I have created to showcase some of my full stack development skills. It is a calendar application that allows users to create and keep track of events, along with specific details about each event like who it is for, who is driving, what car is being taken, etc.

The frontend is built with React and Vite, and the backend is Node.js and Express server, using PostgreSQL as the database. Both the front end and the back end are written in typescript.

This project isn't 100% complete. There are still a few small bugs and the backend for passengers hasn't been set up yet, but it's functional so I wanted to get it up.

## To run

Backend:

1. Navigate to the backend directory
2. npm run build
3. npm start

Frontend:

1. Navigate to the frontend directory
2. npm run dev

To create database:

1. Login and Connect to psql
   psql -U username -p portNumber
2. navigate to backend/src/database within psql
3. \i create.sql
4. (optional, creates basic user, family, etc.) \i run.sql
