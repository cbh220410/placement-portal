# Placement Portal

React frontend with an in-progress migration to a Spring Boot + MySQL backend.

## Project structure
- `src/` React frontend (Vite)
- `backend/` Spring Boot API (new)
- `server/` legacy Node mock backend (can be ignored while migrating)

## Frontend setup
```bash
npm install
npm run dev
```

Optional frontend environment file (`.env`):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

If Spring backend is unavailable, pages fall back to local demo storage.

## Backend setup (Spring + MySQL)
See full backend guide in [backend/README.md](backend/README.md).

Quick start:
```bash
cd backend
mvn spring-boot:run
```

Default API base URL:
`http://localhost:8080`
