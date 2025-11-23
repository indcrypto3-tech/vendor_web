# Vendor Backend

Run instructions and sample commands for the Express + Mongoose backend used by the Flutter app.

Local setup

- Copy `.env.example` to `.env` and set values.
- Install dependencies:

```
cd backend
npm install
```

- Run locally:

```
npm run dev
```

Run tests

```
cd backend
npm test
```

Local Docker (deprecated)

This project was refactored for serverless deployment on Vercel. A Dockerfile and
docker-compose used to exist for local development; they're kept in the repo for
reference but are no longer required or used for production deployments on Vercel.
Use the Vercel setup described below and MongoDB Atlas for the database.
API endpoints

- `POST /auth/send-otp` — body `{ phone, countryCode, recaptchaToken? }` → `{ success, verificationSent, requestId, expiresAt }`
- `POST /auth/verify-otp` — body `{ phone, otp, requestId? }` → `{ success, token, userId, expiresAt }`
- `POST /vendors` — create vendor (Authorization `Bearer <token>`) body: `{ businessName, businessAddress, categories, services }`
- `PUT /vendors/:id` — update vendor (Authorization required)
- `GET /vendors/:id` — fetch vendor (Authorization required)

Sample curl (send-otp)

```
curl -X POST http://localhost:3000/auth/send-otp -H "Content-Type: application/json" -d '{"phone":"5551234567","countryCode":"+1"}'
```

Sample verify

```
curl -X POST http://localhost:3000/auth/verify-otp -H "Content-Type: application/json" -d '{"phone":"5551234567","otp":"1234","requestId":"<from-send>"}'
```

Pointing Flutter to the API

For Android emulator use `http://10.0.2.2:3000` as the base URL.


Acceptance checklist

- `npm install` runs successfully in `backend/`.
- `npm run test` runs the included tests (uses in-memory mongo).

Vercel deployment (serverless)

- This repo includes a serverless wrapper at `backend/api/index.js` and a `vercel.json` at the repo root. The wrapper uses `serverless-http` and a cached Mongoose connection suitable for serverless environments.
- On Vercel set the following Environment Variables: `MONGO_URI`, `JWT_SECRET`, `OTP_TTL_SECONDS`.
- Vercel will run `npm install` at the repo root which triggers `postinstall` to run `npm install` inside `backend/` (this repo includes a root `package.json` for that purpose). You can also set the Project > Root Directory to `backend` instead.

Deploy with Vercel CLI from the repo root:

```
npm i -g vercel
vercel login
vercel --prod
```

Notes:
- Use MongoDB Atlas for `MONGO_URI`.
- For Android emulator testing, point to the Vercel deployment URL.
