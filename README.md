
QR Client System - Ready-to-run project (Backend + Simple Frontend)
=================================================================

What's included
- backend/       : Node.js + Express backend (APIs, QR generation)
- frontend/      : Simple static HTML/JS pages (scan -> login -> client)
- schema.sql     : PostgreSQL schema to create tables
- seed.sql       : Optional seed data (admin employee + sample client)
- .env.example   : Environment variable template
- README.md      : This file

Quick local run (manual, no Docker)
1. Install Node.js (>=16) and PostgreSQL.
2. Create a Postgres database and run `schema.sql`:
   psql -U youruser -d yourdb -f schema.sql
3. (Optional) run `seed.sql` to insert sample admin and client (update password hash if needed).
4. Configure `.env` in backend folder (copy .env.example -> .env) and set DATABASE_URL and JWT_SECRET and SITE_URL.
5. Install backend deps:
   cd backend
   npm install
6. Start backend:
   npm start
   (server listens on PORT env or 4000)
7. Open frontend files from `frontend/` in a browser (or serve them via simple static server).
   Example: npx http-server frontend -p 3000

Notes
- This is a starter project to get you up and running. For production, use HTTPS, set strong JWT_SECRET, and run behind a proper host (Render/Vercel/DigitalOcean).
- If you want, I can convert the frontend into a React app (separate) — tell me and I'll prepare that next.
