# AttachLink Software Architecture Document

**Project Name:** AttachLink

**Project Type:** Software as a Service (SaaS)

**Version:** 1.0.0

**Architecture:** Clean Architecture + Modular Monolith

**Author:** Zohan Ali

**Status:** In Development

---

# Table of Contents

1. Introduction
2. System Overview
3. Objectives
4. Technology Stack
5. High-Level Architecture
6. System Components
7. Backend Architecture
8. Frontend Architecture
9. Request Lifecycle
10. Database Architecture
11. Authentication & Authorization
12. Folder Structure
13. Design Principles
14. Scalability Strategy
15. Security Architecture
16. Future Architecture
17. Conclusion

---

# 1. Introduction

AttachLink is a cloud-based Internship and Industrial Attachment Management System developed to simplify communication between students, companies, schools, and supervisors.

The system digitizes the complete internship lifecycle, beginning from opportunity posting to application, attachment monitoring, evaluations, reports, and final approval.

The architecture follows Clean Architecture principles combined with a Modular Monolith structure to ensure scalability, maintainability, and ease of future migration into microservices if required.

---

# 2. System Overview

AttachLink connects four primary users:

- Students
- Companies
- Schools
- Supervisors

The platform allows each stakeholder to perform their responsibilities from a centralized system while maintaining secure access through authentication and role-based authorization.

---

# 3. Objectives

The architecture is designed to achieve the following goals:

- Scalability
- Maintainability
- Security
- High Performance
- Clean Separation of Responsibilities
- Easy Testing
- Easy Deployment
- Future Expansion

---

# 4. Technology Stack

## Frontend

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose ODM

## Authentication

- JWT
- HTTP Only Cookies
- bcrypt

## Storage

- Cloudinary

## Deployment

- Render
- MongoDB Atlas

---

# 5. High-Level Architecture

```
                +-----------------------+
                |      Vue Client       |
                +-----------+-----------+
                            |
                            |
                     HTTP/HTTPS
                            |
                            ▼
                +-----------------------+
                |    Express Server     |
                +-----------+-----------+
                            |
             -------------------------------
             |             |              |
             ▼             ▼              ▼
         Middleware    Route Layer   Validation
                            |
                            ▼
                      Controller Layer
                            |
                            ▼
                        Service Layer
                            |
                            ▼
                      Repository Layer
                            |
                            ▼
                      MongoDB Models
                            |
                            ▼
                      MongoDB Atlas
```

---

# 6. System Components

The system consists of independent modules.

- Authentication
- Students
- Companies
- Schools
- Opportunities
- Applications
- Supervisors
- Logbooks
- Reports
- Evaluations
- Notifications

Each module owns its own controllers, services, repositories, models, routes, and validators.

---

# 7. Backend Architecture

The backend follows layered architecture.

```
Client

↓

Routes

↓

Validators

↓

Controllers

↓

Services

↓

Repositories

↓

Models

↓

MongoDB
```

### Route

Receives HTTP requests and forwards them to controllers.

### Validator

Validates all incoming requests before they reach the controller.

### Controller

Handles HTTP requests and responses.

Controllers never contain business logic.

### Service

Contains all business rules and application logic.

### Repository

Responsible for database communication.

### Model

Defines MongoDB collections and schemas.

---

# 8. Frontend Architecture

The frontend follows component-based architecture using Vue 3.

Main responsibilities include:

- Routing
- State Management
- API Communication
- UI Components
- Authentication
- Dashboard Pages

The frontend communicates with the backend using REST APIs.

---

# 9. Request Lifecycle

Every request follows the same flow.

```
User

↓

Vue Frontend

↓

Express Route

↓

Validator

↓

Controller

↓

Service

↓

Repository

↓

MongoDB

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

Frontend
```

This flow must never be bypassed.

---

# 10. Database Architecture

The primary database is MongoDB Atlas.

Collections include:

- users
- students
- companies
- schools
- opportunities
- applications
- supervisors
- logbooks
- evaluations
- reports
- notifications

Relationships are maintained using ObjectId references.

---

# 11. Authentication & Authorization

Authentication is implemented using JWT.

Access Tokens:

- Lifetime: 15 minutes

Refresh Tokens:

- Lifetime: 7 days

Passwords are hashed using bcrypt before storage.

Authorization is implemented using role-based access control (RBAC).

System roles:

- Student
- Company
- School
- Supervisor
- Admin

---

# 12. Folder Structure

```
server/src

config/

core/

middlewares/

modules/

routes/

shared/

tests/
```

Each module follows:

```
module/

controllers/

services/

repositories/

models/

validators/

routes/
```

---

# 13. Design Principles

AttachLink follows:

- Clean Architecture
- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Separation of Concerns
- Modular Development

---

# 14. Scalability Strategy

The current architecture is a Modular Monolith.

Future migration to Microservices is possible by extracting modules into independent services without major changes to business logic.

Potential future services include:

- Authentication Service
- Notification Service
- File Storage Service
- Reporting Service

---

# 15. Security Architecture

Security practices include:

- JWT Authentication
- HTTP Only Cookies
- Password Hashing
- Request Validation
- Environment Variables
- Role-Based Authorization

Future improvements:

- Rate Limiting
- Helmet
- CSRF Protection
- Multi-Factor Authentication (MFA)

---

# 16. Future Architecture

Future versions of AttachLink may include:

- Mobile Application
- AI Internship Recommendation
- AI CV Analysis
- Real-Time Notifications
- Video Interviews
- Multi-Tenant Architecture
- Analytics Dashboard
- Payment Integration

---

# 17. Conclusion

AttachLink is designed using modern software engineering principles to provide a scalable, maintainable, and secure internship management platform.

The chosen architecture supports future growth while ensuring that current development remains organized and easy to maintain.

This document serves as the primary architectural reference for all future development of the AttachLink platform.