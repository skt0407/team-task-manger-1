# API Testing Guide

Base URL:

```txt
http://localhost:5000/api
```

Use Postman, Insomnia, or Thunder Client. The API sets an `accessToken` HTTP-only cookie after login/signup. If your client does not retain cookies, copy the returned token and send it as:

```txt
Authorization: Bearer <token>
```

## Auth

### Signup

```http
POST /auth/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Password123"
}
```

The first registered user becomes `ADMIN`.

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Password123"
}
```

### Current User

```http
GET /auth/me
```

## Projects

### List Projects

```http
GET /projects
```

Admins see all projects. Members see assigned projects.

### Create Project

```http
POST /projects
Content-Type: application/json

{
  "name": "Mobile App Launch",
  "description": "Prepare the launch plan for the mobile app."
}
```

Admin only.

### Add Member

```http
POST /projects/:projectId/members
Content-Type: application/json

{
  "userId": "member-user-uuid"
}
```

Admin only.

### Remove Member

```http
DELETE /projects/:projectId/members/:userId
```

Admin only.

## Tasks

### List Tasks

```http
GET /tasks?status=TODO&priority=HIGH
```

Members only see assigned tasks.

### Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Design task board",
  "description": "Create responsive task table and status workflow.",
  "dueDate": "2026-05-30T00:00:00.000Z",
  "priority": "HIGH",
  "status": "TODO",
  "projectId": "project-uuid",
  "assignedToId": "member-user-uuid"
}
```

Admin only.

### Update Task

```http
PATCH /tasks/:taskId
Content-Type: application/json

{
  "title": "Finalize task board",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```

Admin only.

### Update Task Status

```http
PATCH /tasks/:taskId/status
Content-Type: application/json

{
  "status": "DONE"
}
```

Admins can update any task. Members can update only tasks assigned to them.

### Delete Task

```http
DELETE /tasks/:taskId
```

Admin only.

## Dashboard

```http
GET /dashboard/summary
```

Returns total tasks, status counts, priority counts, overdue task count, tasks per user, and recent activity.
