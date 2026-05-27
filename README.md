# HireWave Job Application Platform

Modern full-stack recruitment website with a premium React/Tailwind UI, Express API, MongoDB persistence, Multer uploads, Nodemailer email notifications, OTP flow, and an authenticated admin dashboard.

## Features

- Candidate registration with validation, resume upload, profile photo upload, and success popup
- Mobile OTP endpoints with optional Twilio SMS integration and development fallback logging
- Auto-generated application IDs
- MongoDB applicant storage using Mongoose
- Admin email and applicant confirmation email through Nodemailer
- Admin login with JWT authentication
- Applicant search/filter by location, skill, and experience
- Excel and PDF applicant exports
- Dark/light mode, mobile hamburger nav, smooth animations, and floating WhatsApp contact
- Google Maps location picker when a Maps API key is configured, with geolocation fallback

## Project Structure

```text
client/   React + Vite + Tailwind frontend
server/   Node.js + Express + MongoDB backend
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Configure `server/.env` with MongoDB, SMTP, JWT, admin, and optional Twilio values.

4. Start development:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Notes

- A real MongoDB URI is required for persistent applicant/admin storage.
- A real SMTP account is required for outbound email delivery. Without SMTP settings, the backend uses Nodemailer's JSON transport for local development.
- Mobile OTP delivery uses Twilio if `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` are set. Otherwise, development mode logs the OTP and returns it in the API response.
- Google Maps requires `VITE_GOOGLE_MAPS_API_KEY` in `client/.env`.
