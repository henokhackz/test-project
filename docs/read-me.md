# User & Progress API — Offline-First Backend

This is a small backend project for managing users and their progress. It supports offline first behavior, allowing data to be temporarily stored locally if the database is unavailable, and synced later.

---

## 🛠 Technology Stack

- **Node.js** (v18+ recommended)
- **Express** — API routing
- **Prisma** — ORM for database access
- **SQLite** — Lightweight database
- **bcryptjs** — Password hashing
- **JSON files** — Local caching for offline-first support

---

## Setup Instructions

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/henokhackz/test-project.git
cd test-project
```

2. Install dependencies
   npm install

3. Set up environment variables

Create a .env file in the root folder and specify the following:

PORT=5000 # You can change this to any available port
DATABASE_URL="file:./dev.db" # Prisma SQLite DB 4. Set up Prisma

Generate Prisma client and apply initial migrations:

npx prisma generate
npx prisma migrate dev --name init

4. Set up Prisma

Generate Prisma client and apply initial migrations:

npx prisma generate
npx prisma migrate dev --name init

This will create a local SQLite database (dev.db) in your project folder.

5. Create cache files

To enable offline-first behavior, create two JSON files in the root folder:

users-cache.json

progress-cache.json

You can create empty files manually:

touch users-cache.json progress-cache.json

Ensure both files contain an empty array [] as the initial content:

[]

⚡ Running the Project

Start the server:

npm run dev

By default, it runs on:

http://localhost:5000

If you set a different PORT in .env, the server will use that instead.

API Endpoints

1. Create User

POST /users

Request Body:

{
"email":"john@gmail.com",
"password":"135345345",
"name":"john the dev"
}

Response:

"status": "success",
"message": "User created successfully",
"data": {
"user": {
"id": 3,
"name": "john the dev",
"email": "john@gmail.com"
}
}
}

offline: true means the user was saved locally because the database was unreachable.

2. Create Progress

POST /progress

Request Body:

{
"id": "1",
"lesson":"math 5",
"score":"43"
}

Response:

{
"status": "success",
"message": "progress created successfully",
"data": {
"status": "success",
"data": {
"progress": {
"id": 2,
"lesson": "math 5",
"score": 43,
"user_id": 1
}
}
}
}

If the database is unreachable, the progress will be stored in progress-cache.json and synced later.

3. Get All Progress

GET /progress

Response:

{
"status": "success",
"message": "Progress fetched successfully",
"data": {
"progresses": [
{
"id": 1,
"lesson": "math 2",
"score": 23,
"user_id": 1
},
{
"id": 2,
"lesson": "math 5",
"score": 43,
"user_id": 1
}
]
}

📝 Offline-First Behavior

When creating users or progress, if the database is unreachable, the API saves data locally in users-cache.json or progress-cache.json.

To sync cached data with the database, use the provided syncCachedUsers() or syncCachedProgress() functions.

Example: call these at server start or schedule via cron to automatically push cached data.

🔧 Password Handling

Passwords are hashed using bcryptjs before storage.

Use comparePassword(plain, hashed) to verify passwords securely.
