# Overview

`project/` directory contains typical Django project structure.
`application/` directory contains backend application code
`frontend/` directory is client-code for SPA

# Installing

`pip install -r requirements.txt`

## Seeding database

As a first-time setup, tables need to be generated for both the application and admin

`python manage.py migrate`
`./seed-db` Populates some initial members

# Running

`source .envrc` to set environment variables needed by server and frontend
`python manage.py runserver`