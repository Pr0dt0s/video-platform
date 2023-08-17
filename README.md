# Video Platform

This project consists in two parts: [the backend](/backend/README.md) and [the frontend](/frontend/README.md).

The project is structured as a mono repo, you can install the dependencies globally runing `npm install` from any folder inside the project.

To run the development environment, create a new file `./backend/.env` with the same contents as the file [/backend/sample.env](/backend/sample.env) changing the corresponding values to your own environment. There is even a `docker-compose.yml` to spin up a POSTGRES container for development and testing purposes.

> This project is still in development!

### Project Status

Tasks:

- [x] Create base projects
- [ ] Backend Server
  - [x] Create initial tests for requested requirements
  - [x] Handle User Routes
  - [ ] Handle Video Routes
- [ ] Frontend Server

Currently all the User routes are being handled correctly, and all tests are passing, I was going to implement the rest of the server functionality, mainly handling the video routes, before starting the front end development.

