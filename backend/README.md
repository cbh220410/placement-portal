# Placement Portal Backend (Spring Boot + MySQL)

This module is the new backend for the placement portal.

## Tech stack
- Spring Boot 3
- Spring Data JPA
- MySQL 8
- BCrypt password hashing

## Prerequisites
- Java 21 or newer
- Maven 3.9 or newer
- MySQL server running locally or remotely

## Configure database
Use environment variables (recommended):

```bash
DB_URL=jdbc:mysql://localhost:3306/placement_portal?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
SERVER_PORT=8080
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173
```

If not set, defaults are used from `application.properties`.

## Run backend
From `backend/` directory:

```bash
mvn spring-boot:run
```

## Auth endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/health`

## Core portal endpoints
- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/jobs/employer?email=...`
- `GET /api/applications/student?email=...`
- `GET /api/applications/job/{jobId}`
- `POST /api/applications`
- `PATCH /api/applications/{id}/status`
- `POST /api/interviews`
- `GET /api/interviews/student?email=...`
- `GET /api/users`, `GET /api/users/students`, `DELETE /api/users/{id}`
- `PATCH /api/users/{id}/profile`
- `GET /api/dashboard/admin|employer|student`
- `GET /api/dashboard/reports`
- `GET /api/dashboard/anomalies`
- `GET /api/officer/summary`
- `GET /api/officer/student-status`
- `PATCH /api/officer/students/{id}/placement`

Example signup payload:

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "password123",
  "role": "student"
}
```
