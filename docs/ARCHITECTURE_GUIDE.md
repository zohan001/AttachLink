# AttachLink Architecture Guide

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

**Purpose:** Development Standards & Architecture Rules

---

# Table of Contents

1. Introduction
2. Architecture Philosophy
3. Development Principles
4. Project Structure
5. Module Structure
6. Request Lifecycle
7. Layer Responsibilities
8. Coding Rules
9. Naming Conventions
10. Folder Responsibilities
11. Response Standard
12. Error Handling
13. Validation Rules
14. Authentication Rules
15. Database Rules
16. Git Workflow
17. Development Workflow
18. Code Review Checklist
19. Conclusion

---

# 1. Introduction

This guide defines the engineering standards used throughout the AttachLink project.

Every feature developed in this project must follow the rules in this document to maintain consistency, readability, scalability, and maintainability.

This guide is intended for every developer contributing to AttachLink.

---

# 2. Architecture Philosophy

AttachLink follows:

- Clean Architecture
- Modular Monolith
- SOLID Principles
- Separation of Concerns
- Layered Architecture

Each layer has one responsibility.

No layer should perform another layer's job.

---

# 3. Development Principles

The following principles apply throughout the project.

## Single Responsibility Principle

Every class or file should have one responsibility.

Example:

✔ AuthService

- Register User
- Login User
- Refresh Token

✘ AuthService

- Register User
- Upload Files
- Send Notifications

---

## Don't Repeat Yourself (DRY)

Avoid duplicate logic.

Reusable logic should be placed inside shared utilities or helpers.

---

## Keep It Simple (KISS)

Choose simple solutions over complicated ones.

Readable code is preferred over clever code.

---

## Separation of Concerns

Each layer performs only its assigned responsibility.

---

# 4. Project Structure

```
server/src/

config/

core/

middlewares/

modules/

routes/

shared/

tests/
```

Each folder has a dedicated responsibility.

---

# 5. Module Structure

Every business module follows the same layout.

```
module/

controllers/

models/

repositories/

routes/

services/

validators/
```

Example:

```
students/

controllers/

models/

repositories/

routes/

services/

validators/
```

This structure must remain consistent across all modules.

---

# 6. Request Lifecycle

Every request follows the same sequence.

```
Client

↓

Route

↓

Validator

↓

Controller

↓

Service

↓

Repository

↓

Model

↓

MongoDB
```

Responses return through the same path.

No shortcuts are allowed.

---

# 7. Layer Responsibilities

## Routes

Responsibilities:

- Register endpoints
- Attach middleware
- Call controllers

Routes must never contain business logic.

---

## Validators

Responsibilities:

- Validate requests
- Return validation errors
- Sanitize input

Validators never access the database.

---

## Controllers

Responsibilities:

- Receive request
- Call service
- Return response

Controllers never communicate directly with MongoDB.

Controllers never contain business logic.

---

## Services

Responsibilities:

- Business rules
- System logic
- Authorization decisions
- Workflow management

Services never send HTTP responses.

---

## Repositories

Responsibilities:

- Read database
- Write database
- Update database
- Delete database

Repositories never contain business rules.

---

## Models

Responsibilities:

- Define schema
- Validation
- Database indexes
- Model methods

Models should not contain application logic.

---

# 8. Coding Rules

Use:

- async/await
- Early return
- Small functions
- Meaningful variable names

Avoid:

- Nested if statements
- Duplicate logic
- Large controller methods
- Database access inside controllers

---

# 9. Naming Conventions

## Variables

camelCase

Example

```
studentProfile
```

---

## Classes

PascalCase

Example

```
StudentService
```

---

## Constants

UPPER_CASE

Example

```
JWT_SECRET
MAX_FILE_SIZE
```

---

## Controllers

```
student.controller.js
```

---

## Services

```
student.service.js
```

---

## Repositories

```
student.repository.js
```

---

## Validators

```
student.validator.js
```

---

## Models

```
student.model.js
```

---

## Routes

```
student.routes.js
```

---

# 10. Folder Responsibilities

## config

Application configuration.

---

## core

Application-wide abstractions.

---

## middlewares

Reusable middleware.

---

## modules

Business features.

---

## routes

Global route registration.

---

## shared

Reusable helpers, constants, utilities, and common functions.

---

## tests

Unit and integration tests.

---

# 11. Response Standard

Every successful response must follow this structure.

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
}
```

Every error response must follow this structure.

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": []
}
```

Every endpoint must use the same response format.

---

# 12. Error Handling

Errors should originate from the service layer.

Controllers should pass errors to the global error handler.

HTTP status codes must be meaningful.

Examples:

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

---

# 13. Validation Rules

Every incoming request must be validated.

Validation occurs before the controller.

No controller should receive unvalidated input.

---

# 14. Authentication Rules

Passwords:

- Always hashed
- Never encrypted
- Never stored in plain text

JWT:

- Access Token → 15 minutes
- Refresh Token → 7 days

Refresh Tokens are stored in HTTP-only cookies.

---

# 15. Database Rules

Controllers never access MongoDB directly.

Repositories are the only layer responsible for database operations.

Relationships should use ObjectId references.

Indexes should be created for frequently queried fields.

---

# 16. Git Workflow

Commit messages follow Conventional Commits.

Examples:

```
feat(auth): implement login

feat(student): create student profile

fix(auth): resolve password validation

refactor(student): simplify repository

docs(api): update authentication endpoints
```

---

# 17. Development Workflow

Every feature follows this process.

1. Create validator
2. Create repository
3. Create service
4. Create controller
5. Create route
6. Register route
7. Test endpoint
8. Update API documentation
9. Commit changes

No feature is complete until it has been tested and documented.

---

# 18. Code Review Checklist

Before merging code, verify:

- Route contains no business logic
- Controller contains no business logic
- Service contains business logic only
- Repository handles database access only
- Validation exists
- Responses follow project standard
- Errors are handled correctly
- Code is readable
- Documentation is updated
- Tests pass

---

# 19. Conclusion

This guide establishes the engineering standards for AttachLink.

Every contributor should follow these guidelines to ensure consistency, maintainability, scalability, and long-term success of the project.