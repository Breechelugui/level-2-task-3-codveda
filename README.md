# Level 2 Task 3 — MongoDB CRUD API

A RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** that demonstrates database integration, model relationships, indexing, and data validation.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose ORM
- dotenv

## Project Structure

```
├── app.js                  # Entry point
├── .env                    # Environment variables (not committed)
└── src/
    ├── config/
    │   └── db.js           # MongoDB connection
    ├── models/
    │   ├── User.js         # User schema with validation & indexing
    │   └── Post.js         # Post schema with User ref & text index
    └── routes/
        ├── users.js        # User CRUD endpoints
        └── posts.js        # Post CRUD endpoints
```

## Features

- **Models & Relationships** — `Post.author` references `User` via ObjectId, resolved with `.populate()`
- **Data Validation** — enforced at schema level (required fields, min/max length, email regex, age range); `runValidators: true` on updates
- **Database Indexing**
  - `User`: compound index on `{ name, email }`
  - `Post`: compound index on `{ author, published }`
  - `Post`: text index on `{ title, content }` for full-text search
- **Pagination** — all list endpoints support `?page=` and `?limit=`
- **Global Error Handler** — formats Mongoose `ValidationError` into readable messages

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

### Installation

```bash
git clone https://github.com/Breechelugui/level-2-task-3-codveda.git
cd level-2-task-3-codveda
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/codveda_db
```

### Run

```bash
npm start
```

## API Endpoints

### Users

| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| POST   | `/api/users`     | Create a user        |
| GET    | `/api/users`     | Get all users        |
| GET    | `/api/users/:id` | Get a user by ID     |
| PUT    | `/api/users/:id` | Update a user        |
| DELETE | `/api/users/:id` | Delete a user        |

### Posts

| Method | Endpoint         | Description                        |
|--------|-----------------|-------------------------------------|
| POST   | `/api/posts`     | Create a post                       |
| GET    | `/api/posts`     | Get all posts (supports filters)    |
| GET    | `/api/posts/:id` | Get a post by ID (populated author) |
| PUT    | `/api/posts/:id` | Update a post                       |
| DELETE | `/api/posts/:id` | Delete a post                       |

#### Post Query Params

| Param    | Example                        | Description              |
|----------|-------------------------------|--------------------------|
| `search` | `?search=hello`               | Full-text search         |
| `author` | `?author=<user_id>`           | Filter by author         |
| `page`   | `?page=2&limit=5`             | Pagination               |

## Example Requests

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","age":28}'

# Create a post (replace <user_id> with actual ID)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World","content":"This is my first post content here","author":"<user_id>"}'

# Full-text search
curl "http://localhost:3000/api/posts?search=hello"

# Filter by author with pagination
curl "http://localhost:3000/api/posts?author=<user_id>&page=1&limit=5"
```

## Validation Rules

### User
| Field  | Rules                                      |
|--------|--------------------------------------------|
| name   | Required, 2–50 characters                  |
| email  | Required, unique, valid email format       |
| age    | Optional, 0–120                            |

### Post
| Field   | Rules                                     |
|---------|-------------------------------------------|
| title   | Required, max 100 characters              |
| content | Required, min 10 characters               |
| author  | Required, must be a valid User ObjectId   |
| tags    | Optional array of strings                 |
