# Library Management API

A secure REST API backend for a college library management system.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Book catalogue management
- Admin book CRUD operations
- Borrow book requests
- Admin approval/rejection
- Return status management
- Borrowing history
- MongoDB database

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Postman

## User Roles

### USER
- Browse books
- Request books
- View own borrowing records

### ADMIN
- Add books
- Update books
- Delete books
- View all borrowing records
- Approve/reject requests
- Mark books as returned

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Books

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/books` | Public |
| GET | `/api/books/:id` | Public |
| POST | `/api/books` | ADMIN |
| PUT | `/api/books/:id` | ADMIN |
| DELETE | `/api/books/:id` | ADMIN |

### Borrowing

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/borrows` | USER |
| GET | `/api/borrows/my` | USER |
| GET | `/api/borrows` | ADMIN |
| PATCH | `/api/borrows/:id/approve` | ADMIN |
| PATCH | `/api/borrows/:id/reject` | ADMIN |
| PATCH | `/api/borrows/:id/return` | ADMIN |

## HTTP Status Codes

- 200 - Successful request
- 201 - Resource created
- 400 - Invalid request
- 401 - Authentication required/invalid
- 403 - Access denied
- 404 - Resource not found
- 409 - Conflict
- 500 - Server error

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm.cmd install