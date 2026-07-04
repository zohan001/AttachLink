# AttachLink Coding Standards

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

**Purpose:** Coding Standards and Best Practices

---

# Table of Contents

1. Introduction
2. General Principles
3. File & Folder Naming
4. JavaScript Standards
5. API Development Standards
6. Database Standards
7. Error Handling Standards
8. Logging Standards
9. Git Standards
10. Documentation Standards
11. Code Review Checklist
12. Conclusion

---

# 1. Introduction

This document defines the coding standards for the AttachLink project.

All developers must follow these standards to ensure consistency, maintainability, readability, and scalability.

---

# 2. General Principles

Every developer should follow these principles.

## Clean Code

Write code that is easy to read.

Code is read more often than it is written.

---

## Simplicity

Prefer simple solutions.

Avoid unnecessary complexity.

---

## Reusability

Do not duplicate code.

If logic is reused, move it into a shared utility or helper.

---

## Readability

Write code as if another developer will maintain it tomorrow.

---

## Consistency

Follow the same coding style throughout the project.

---

# 3. File & Folder Naming

Folders

```
controllers/
services/
repositories/
models/
validators/
routes/
```

Files

```
student.controller.js
student.service.js
student.repository.js
student.model.js
student.validator.js
student.routes.js
```

Vue Components

```
StudentCard.vue
Navbar.vue
ApplicationForm.vue
```

---

# 4. JavaScript Standards

## Variables

Use camelCase.

```javascript
const studentProfile
const applicationStatus
```

---

## Constants

Use UPPER_CASE.

```javascript
const MAX_FILE_SIZE = 5242880
const JWT_SECRET = process.env.JWT_SECRET
```

---

## Classes

Use PascalCase.

```javascript
class StudentService {}
```

---

## Functions

Use descriptive names.

Good

```javascript
calculateApplicationScore()
```

Avoid

```javascript
calc()
```

---

## Async Code

Always use async/await.

Good

```javascript
const user = await userRepository.findByEmail(email)
```

Avoid callbacks unless absolutely necessary.

---

## Function Size

Functions should generally stay below 40 lines.

If a function becomes difficult to understand, split it into smaller helper functions.

---

## Comments

Write comments only when they explain *why* something is done.

Avoid comments that simply repeat the code.

Good

```javascript
// Prevent duplicate internship applications
```

Avoid

```javascript
// Increment i
i++
```

---

# 5. API Development Standards

Every endpoint must follow this flow:

```
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

Database
```

Controllers:

- Receive request
- Call service
- Return response

Services:

- Business logic only

Repositories:

- Database access only

---

## Response Format

Success

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

All APIs must follow this structure.

---

# 6. Database Standards

Every schema should include:

```javascript
timestamps: true
```

Use ObjectId references for relationships.

Index frequently queried fields.

Avoid storing duplicate information.

Sensitive data such as passwords must never be returned in API responses.

---

# 7. Error Handling Standards

Use the global error handler.

Do not return raw stack traces to users.

Throw meaningful errors from the service layer.

Example:

```javascript
throw new Error("Email already exists")
```

---

# 8. Logging Standards

Log important events:

- User registration
- Login
- Logout
- Failed authentication
- File uploads
- Critical system errors

Never log:

- Passwords
- JWT secrets
- Refresh tokens
- API secrets

---

# 9. Git Standards

Use Conventional Commits.

Examples

```
feat(auth): implement user registration

feat(student): add student profile

fix(auth): resolve password hashing

refactor(company): simplify repository

docs(database): update collection design

test(auth): add login integration tests
```

Branch names

```
feature/authentication

feature/student-profile

bugfix/login

docs/database
```

---

# 10. Documentation Standards

Every public function should have a short description if its purpose is not obvious.

Every API endpoint must be documented.

Every module should include:

- Purpose
- Endpoints
- Validation rules
- Response examples

Documentation must be updated whenever functionality changes.

---

# 11. Code Review Checklist

Before merging code, verify:

- [ ] Naming follows project standards
- [ ] No duplicated logic
- [ ] Functions are small and readable
- [ ] Validation exists
- [ ] Business logic is only in services
- [ ] Database access is only in repositories
- [ ] Error handling follows project rules
- [ ] API responses follow the standard format
- [ ] No secrets or passwords are exposed
- [ ] Documentation has been updated
- [ ] Tests pass

---

# 12. Conclusion

These coding standards establish a consistent approach to software development across the AttachLink project.

Following these standards improves code quality, simplifies maintenance, and ensures that every contributor writes code in a predictable and professional manner.