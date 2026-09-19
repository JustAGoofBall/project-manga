# Project Manga — Anime API

A REST API for anime, characters, ratings and favorites, with JWT login and an
admin panel. Backend is Express + SQLite; frontend is React (Vite).

![CI](https://github.com/JustAGoofBall/project-manga/actions/workflows/ci.yml/badge.svg)

---

## Quick start

```bash
npm install          # install backend dependencies
npm run seed         # fill the database with sample anime + characters
npm run seed:users   # create the demo accounts (see below)
npm run dev          # start the API on http://localhost:3000
```

Open <http://localhost:3000> and the API describes its own endpoints.

For the frontend, in a second terminal:

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Demo accounts

`npm run seed:users` creates two accounts for local testing:

| Role  | Email                   | Password       |
|-------|-------------------------|----------------|
| Admin | testadmin@example.com   | testadmin123   |
| User  | testuser@example.com    | testuser123    |

These are local development accounts only — do not deploy with them.

---

## How a request travels through the code

This is the single most useful thing to understand about the project. Every
request follows the same path, and each folder has exactly one job:

```
   HTTP request  (e.g. POST /api/anime/1/ratings)
        |
        v
  middleware/logger.js       writes the request to the console and logs/
        |
        v
  rate limiters (index.js)   blocks callers who hammer the API
        |
        v
  routes/*.js                matches the URL, and runs the auth guards
        |
        v
  controllers/*.js           validates input, decides the response
        |
        v
  models/*.js                the ONLY place that writes SQL
        |
        v
  config/db.js               the SQLite database file
```

If nothing matched the URL, or something threw, `middleware/errorHandler.js`
turns it into clean JSON instead of an HTML stack trace.

**The rule that keeps this readable:** controllers never write SQL, and models
never touch `req` or `res`. If you need a new endpoint, you add a line to a
route, a function to a controller, and a query to a model — in that order.

---

## Project structure

```
index.js                 Wires the app together. Read this first.
config/
  db.js                  Opens SQLite, creates tables, and makes SQLite
                         look like MySQL to the models (explained in-file)
  jwt.js                 The JWT secret and expiry, in one place
  data.js                Sample anime used by the seed script
  apiDocs.js             The JSON that GET / returns
routes/                  URL -> controller, plus the auth guards
controllers/             Validates input and shapes the response
models/                  All SQL lives here
validators/              Input rules; throw a 400 when input is bad
middleware/
  authMiddleware.js      Reads the token, and the admin check
  errorHandler.js        404 and 500 handling
  logger.js              Request/response logging
utils/
  validate.js            Shared validation building blocks
  sendError.js           Turns a thrown error into the right HTTP status
tests/                   Jest + supertest (138 tests)
frontend/                React app (Vite)
```

---

## Authentication

Login returns a JWT. Send it on protected routes:

```
Authorization: Bearer <your-token>
```

Endpoints are marked in three levels:

- **public** — anyone
- **[AUTH]** — any logged-in user
- **[ADMIN]** — a user with `is_admin = 1`

```bash
# register, then use the token that comes back
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123"}'
```

---

## API endpoints

### Auth
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create an account |
| POST | `/api/auth/login` | public | Log in, returns a token |
| GET | `/api/auth/me` | AUTH | Your profile |
| PUT | `/api/auth/me` | AUTH | Update your profile |
| DELETE | `/api/auth/me` | AUTH | Delete your account |

### Anime & characters
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/anime` | public | All anime, with characters |
| GET | `/api/anime/:id` | public | One anime |
| POST | `/api/anime` | ADMIN | Create an anime |
| PUT | `/api/anime/:id` | ADMIN | Rename an anime |
| DELETE | `/api/anime/:id` | ADMIN | Delete an anime |
| GET | `/api/anime/:animeId/characters` | public | Characters of an anime |
| GET | `/api/anime/:animeId/characters/:characterId` | public | One character |
| POST | `/api/anime/:animeId/characters` | ADMIN | Add a character |
| PUT | `/api/anime/:animeId/characters/:characterId` | ADMIN | Rename a character |
| DELETE | `/api/anime/:animeId/characters/:characterId` | ADMIN | Delete a character |

### Ratings & favorites
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/anime/:animeId/ratings` | public | Ratings + average score |
| POST | `/api/anime/:animeId/ratings` | AUTH | Rate an anime (1–10) |
| PUT | `/api/anime/:animeId/ratings/:ratingId` | AUTH | Update your rating |
| DELETE | `/api/anime/:animeId/ratings/:ratingId` | AUTH | Delete your rating |
| GET | `/api/ratings/me` | AUTH | Your own ratings |
| GET | `/api/favorites` | AUTH | Your favorites |
| POST | `/api/favorites/:animeId` | AUTH | Add a favorite |
| DELETE | `/api/favorites/:animeId` | AUTH | Remove a favorite |

### Search & admin
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/search?q=naruto` | public | Search anime by name |
| GET | `/api/admin/users` | ADMIN | List users |
| PUT | `/api/admin/users/:id/admin` | ADMIN | Grant/revoke admin |
| DELETE | `/api/admin/users/:id` | ADMIN | Delete a user |

### Response shape

Every response uses the same envelope, so the frontend can handle them uniformly:

```jsonc
// success
{ "success": true, "count": 2, "data": [ /* ... */ ] }

// failure
{ "success": false, "message": "Anime name is required" }
```

| Status | Meaning |
|---|---|
| 400 | The request was invalid (a validator rejected it) |
| 401 | No token, or a bad one |
| 403 | Logged in, but not allowed (e.g. not an admin) |
| 404 | No such record |
| 409 | Conflict — it already exists |
| 500 | Something broke on the server |

---

## Environment variables

Copy `.env.example` to `.env` and fill it in. `.env` is gitignored and must
never be committed.

| Variable | Required | Notes |
|---|---|---|
| `PORT` | no | Defaults to 3000 |
| `NODE_ENV` | no | `development`, `production` or `test` |
| `JWT_SECRET` | **in production** | Without it the API falls back to a default that is public in `config/jwt.js`, so anyone could forge a login token |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Testing

```bash
npm test               # all 138 tests
npm run test:watch     # re-run on change
npm run test:coverage  # coverage report in coverage/
```

Tests use a separate database file (`config/anime_test.db`), so running them
never touches your real data. Jest sets `NODE_ENV=test`, which is what
`config/db.js` checks to pick that file.

They run one file at a time (`--runInBand`), because they share that one
database and would otherwise fight over the same rows.

CI runs the backend tests plus a frontend lint and build on every push.

---

## Docker

```bash
docker compose up --build
```

- API: <http://localhost:3000>
- Frontend: <http://localhost:5173>

> **Note:** the API currently stores its data in a SQLite file, so the `db`
> (MySQL) service in `docker-compose.yaml` is not actually used by the backend
> yet. It and `schema.sql` are there for a planned move to MySQL. Until then
> you can start just the app with
> `docker compose up backend frontend`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Testing | Jest + supertest |
| Frontend | React 18 + Vite + React Router |

---

## Troubleshooting

**"No authorization token provided"** — add the header `Authorization: Bearer <token>`.

**"Invalid token" / "Token expired"** — log in again; tokens last 7 days.

**"Admin access required"** — the endpoint is admin-only. Promote a user with
`npm run seed:users`, or via `PUT /api/admin/users/:id/admin` as an existing admin.

**Tests fail after an interrupted run** — delete `config/anime_test.db` and re-run.

**Frontend shows "Kon anime niet laden"** — the backend is not running, or is on
a different port than the Vite proxy expects (see `frontend/vite.config.js`).

---

## License

MIT — see [LICENSE](LICENSE).
