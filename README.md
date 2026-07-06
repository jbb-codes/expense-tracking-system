# Expense Tracking System

A MEAN stack greenfield group project for WEB-450 at Bellevue University.

## Server Setup

The server connects to a shared MongoDB Atlas cluster using a connection string that must not be committed to git. Instead of a real `.env` file, the repo includes `server/.env.example` — a template listing the required environment variables with placeholder values.

To set up your own local `.env`:

1. Copy the example file: `cp server/.env.example server/.env`
2. Open `server/.env` and replace the `<username>` and `<password>` placeholders in `MONGODB_URI` with the real Atlas credentials (ask a teammate if you don't have them). The cluster URL and database name are already filled in.
3. Install dependencies: `cd server && npm install`
