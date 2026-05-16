# TeamFlow - Team Task Manager

TeamFlow is a production-style Team Task Manager built for an interview assignment. It uses a separated Next.js frontend and Express API backend with PostgreSQL, Prisma, JWT authentication, role-based authorization, project membership, task assignment, dashboard analytics, and Railway-ready deployment.

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT in HTTP-only cookies, bcrypt password hashing
- API/state: Axios and TanStack React Query
- Deployment: Railway

## Architecture

```txt
team-task-manager/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── utils/
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── providers/
    └── types/
```

The backend follows a modular route-controller-service structure. Controllers keep HTTP concerns thin, services hold business rules, schemas validate requests with Zod, and middlewares handle authentication, validation, errors, and authorization.

## Core Features

- Signup, login, logout, and current-user session
- Password hashing with bcrypt
- JWT authentication through secure HTTP-only cookies
- Admin and Member roles
- Admin project and task management
- Member access to assigned projects and assigned tasks
- Project member add/remove workflow
- Task creation, deletion, assignment, status update, filtering, priority, and due dates
- Overdue task highlighting
- Dashboard analytics and recent activity

## Local Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

Seed users:

```txt
admin@teamtask.com / Password123
member@teamtask.com / Password123
```

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

## Environment Variables

Backend:

```env
DATABASE_URL=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=
JWT_EXPIRES_IN=7d
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Railway Deployment

1. Push the repository to GitHub.
2. Create a Railway PostgreSQL database.
3. Deploy the backend from the `backend` directory.
4. Add backend environment variables in Railway.
5. Run:

```bash
npx prisma migrate deploy
```

6. Deploy the frontend from the `frontend` directory.
7. Set:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

8. Update backend `CLIENT_URL` to the public frontend URL.
9. Test signup, login, project creation, member assignment, task creation, task status updates, and dashboard metrics.

## Interview Talking Points

- The app uses a clean separation between frontend and backend for simpler deployment and clearer responsibilities.
- Prisma models enforce project membership and task relationships directly at the database layer.
- JWT is stored in an HTTP-only cookie to avoid exposing the token to frontend JavaScript.
- Role-based authorization is enforced on the backend, not just hidden in the UI.
- Members can only update their own assigned task status, while admins manage projects, members, and tasks.
- Dashboard analytics are calculated server-side so the frontend stays focused on presentation.
