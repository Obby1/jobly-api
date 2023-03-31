# Jobly Backend

This is the Express backend for Jobly, version 2.

To get started: Download the code, navigate to the directory, run the following commands in CLI:

    npm init
    npm install
    psql -f jobly.sql
    psql
        \connect jobly
        \i jobly-schema.sql
        \i jobly-seed.sql

To run this:

    node server.js
    
To run the tests:

    jest -i

## API Usage Guide

Admin Login Credentials:

    Send POST request to http://localhost:3001/auth/token
    {

  "username": "testuser",
  "password": "password"

    }

Once Token is received from auth/token, copy/paste token to Auth Type "Bearer Token"

    SAMPLE TOKEN - YOUR TOKEN WILL BE DIFFERENT
    {

	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY4MDI4MTExOH0.j14bPEoXZf6dBdZq1HmaRfhuxUGtkCa7TaoOFmfYVIo"

    }

To register a new user send POST to http://localhost:3001/auth/register:

    Sample new user:
    {
          "username": "new",
          "firstName": "first",
          "lastName": "last",
          "password": "password",
          "email": "new@email.com"
     }
    
To run the tests:

    jest -i

To run the tests:

    jest -i

To run the tests:

    jest -i

To retreive information on jobs:

    jest -i

To retreive information on jobs:

    jest -i
    
To run the tests:

    jest -i

To run the tests:

    jest -i

To run the tests:

    jest -i

To retreive information on jobs:

    jest -i
