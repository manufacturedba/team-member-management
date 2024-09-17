# Overview

`project/` directory contains a typical Django project structure and general settings.
`application/` directory contains backend application code
`frontend/` directory is client-code for web application

# Installing

## (optional) Set up virtual environment
`python -m venv venv`
---
`source .envrc` to set environment variables needed by server and frontend scripts

`./install`

## Seeding database

As a first-time setup, tables need to be generated for both the application and admin

`python manage.py migrate`

`./seed-db` Populates some initial members

## Build

Creates a production build of the frontend
    
`./build`

# Running

`python manage.py runserver`

In order to have frontend regenerate files, run commands from within the `frontend` directory

`npm start`

# Testing

Tests are broken up into server-side model and view tests and client-side presentational tests. They are in `application/tests.py` and `frontend/tests/` respectively.

`./test`

Alternatively, run test suites individually

`python manage.py test application`

`npm test` Run from frontend directory