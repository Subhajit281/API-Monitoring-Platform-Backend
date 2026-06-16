#  API Monitoring Platform

A production-inspired backend application that continuously monitors APIs and websites, tracks uptime, records performance metrics, automatically manages incidents, and sends email notifications when services go down or recover.

---

#  Overview

In real-world applications, downtime can lead to lost revenue, poor user experience, and operational issues.

This platform helps teams monitor their APIs and services automatically.

### How It Works

```text
User Creates Project
        ↓
User Creates Monitor
        ↓
Cron Job Runs Periodically
        ↓
API Endpoint Gets Checked
        ↓
Result Stored in Database
        ↓
Success? ── Yes ──► Update Statistics
        │
        No
        │
        ▼
Create Incident
        ▼
Send Email Alert
        ▼
Continue Monitoring
        ▼
Service Recovers
        ▼
Resolve Incident
        ▼
Send Recovery Email
```

---

#  Features

##  Authentication & User Management

* User Registration
* User Login
* JWT Authentication
* Get User Profile
* Update User Profile
* Delete User Account

---

## Project Management

* Create Projects
* View All Projects
* Get Project By ID
* Update Project
* Delete Project

Projects act as containers for monitors.

---

##  Monitor Management

* Create Monitor
* Get All Monitors
* Get Monitor By ID
* Update Monitor
* Delete Monitor
* Manual Monitor Check
* Monitor Statistics

Each monitor tracks:

* URL
* HTTP Method
* Expected Status Code
* Timeout
* Check Interval
* Active Status

---

##  Automated Monitoring Engine

* Background Cron Job Execution
* Automatic API Checks
* Response Time Tracking
* Status Code Validation
* Success/Failure Detection
* Custom Monitoring Intervals

---

##  Monitoring Results

Stores every monitor execution:

* Response Time
* Status Code
* Success Status
* Error Message
* Check Timestamp

---

##  Incident Management

Automatic incident lifecycle management.

### Incident Creation

When a monitor fails:

* Incident is automatically created
* Failure count starts tracking
* Alert email is sent

### Incident Resolution

When the service recovers:

* Incident is resolved automatically
* Recovery email is sent

---

## Analytics & Statistics

Monitor statistics include:

* Total Checks
* Successful Checks
* Failed Checks
* Uptime Percentage
* Average Response Time
* Incident Count
* Last Checked Time

---

##  Email Notifications

Powered by Resend.

Notifications:

* Service Down Alert
* Service Recovery Alert

---

##  API Documentation

Swagger/OpenAPI documentation included.

Features:

* Interactive API Testing
* JWT Authorization Support
* Endpoint Documentation
* Request/Response Schemas

Available at:

```text
/api-docs
```

---

##  Security Features

* JWT Authentication
* Request Validation
* Global Error Handling
* Rate Limiting
* Auth Rate Limiting
* Protected Routes
* Ownership Verification

---

#  Tech Stack

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL
* Prisma ORM

## Authentication

* JWT (jsonwebtoken)
* bcrypt

## Validation

* Joi

## Monitoring

* Axios
* node-cron

## Email Service

* Resend

## Documentation

* Swagger UI
* Swagger JSDoc

## Security

* express-rate-limit

---

#  Major Dependencies

```json
{
  "express": "^5.x",
  "prisma": "^6.x",
  "@prisma/client": "^6.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^3.x",
  "joi": "^17.x",
  "axios": "^1.x",
  "node-cron": "^4.x",
  "resend": "^4.x",
  "swagger-ui-express": "^5.x",
  "swagger-jsdoc": "^6.x",
  "express-rate-limit": "^8.x",
  "dotenv": "^17.x"
}
```

---

#  Database Models

### User

* id
* name
* email
* password

### Project

* id
* name
* description
* userId

### Monitor

* id
* name
* url
* method
* expectedStatus
* interval
* timeout
* isActive
* projectId

### CheckResult

* id
* monitorId
* statusCode
* responseTime
* success
* errorMessage
* checkedAt

### Incident

* id
* monitorId
* status
* failureCount
* startedAt
* resolvedAt

---

# 🔌 API Endpoints

## Authentication

```http
POST   /auth/register
POST   /auth/login
GET    /auth/profile
PATCH  /auth/update
DELETE /auth/delete
```

---

## Projects

```http
POST   /projects
GET    /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
```

---

## Monitors

```http
POST   /projects/:projectId/monitors
GET    /projects/:projectId/monitors

GET    /monitors/:id
PATCH  /monitors/:id
DELETE /monitors/:id

POST   /monitors/:id/check

GET    /monitors/:id/results
GET    /monitors/:id/stats
```

---

## Incidents

```http
GET    /incidents
GET    /incidents/:id
```

---

## Dashboard

```http
GET    /dashboard/overview
```

---

#  Environment Variables

Create a `.env` file:

```env
PORT=3000

DATABASE_URL=

JWT_SECRET=

RESEND_API_KEY=
```

---

#  Installation

Clone the repository:

```bash
git clone <https://github.com/Subhajit281/API-Monitoring-Platform-Backend.git>
cd api-monitoring-platform
```

Install dependencies:

```bash
npm install
```
git 
Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

---

#  Future Improvements

* Frontend Dashboard
* Historical Charts
* Multi-channel Notifications (Slack, Discord)
* Status Pages
* Team Collaboration
* Monitor Groups
* Advanced Analytics
* WebSocket Live Updates

---

#  Project Goal

It demonstrates backend architecture, cron-based scheduling, authentication, database design, API security, incident management, monitoring workflows, and production-style API development.
