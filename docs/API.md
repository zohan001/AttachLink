# AttachLink API Documentation

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

**API Version:** v1

**Base URL (Development):**

```
http://localhost:5000/api/v1
```

---

# Table of Contents

1. Introduction
2. API Standards
3. Authentication
4. Authentication Endpoints
5. Response Format
6. HTTP Status Codes
7. Error Responses
8. Future Endpoints
9. API Versioning

---

# 1. Introduction

This document describes the REST API used by AttachLink.

The API enables communication between the Vue frontend and the Express backend.

All endpoints return JSON responses.

---

# 2. API Standards

## Base URL

```
http://localhost:5000/api/v1
```

Production URL will be updated after deployment.

---

## Request Format

Content Type

```
application/json
```

---

## Authentication

Protected endpoints require a valid JWT Access Token.

Example

```
Authorization: Bearer <access_token>
```

---

# 3. Authentication Module

Current Status

✅ Implemented

Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register a new account |
| POST | /auth/login | Login user |
| POST | /auth/logout | Logout user |
| POST | /auth/refresh-token | Refresh Access Token |
| GET | /auth/me | Get current user |

---

# 4. Authentication Endpoints

---

## Register User

### Endpoint

```
POST /auth/register
```

### Description

Creates a new user account.

---

### Request Body

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "student"
}
```

---

### Success Response

**201 Created**

```json
{
    "success": true,
    "message": "Account created successfully",
    "accessToken": "<jwt>",
    "user": {
        "id": "...",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "student"
    }
}
```

---

### Validation Rules

- firstName required
- lastName required
- valid email
- unique email
- password minimum 8 characters
- role required

---

### Possible Errors

| Status | Description |
|---------|-------------|
|400|Validation Error|
|409|Email already exists|
|500|Internal Server Error|

---

## Login

### Endpoint

```
POST /auth/login
```

### Description

Authenticates an existing user.

---

### Request Body

```json
{
    "email":"john@example.com",
    "password":"Password123"
}
```

---

### Success Response

```json
{
    "success": true,
    "message":"Login successful",
    "accessToken":"<jwt>",
    "user":{
        "id":"...",
        "firstName":"John",
        "lastName":"Doe",
        "email":"john@example.com",
        "role":"student"
    }
}
```

---

### Possible Errors

| Status | Description |
|---------|-------------|
|400|Validation Error|
|401|Invalid credentials|
|500|Internal Server Error|

---

## Logout

### Endpoint

```
POST /auth/logout
```

### Description

Logs out the current authenticated user.

---

### Success Response

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

## Refresh Token

### Endpoint

```
POST /auth/refresh-token
```

### Description

Issues a new Access Token using a valid Refresh Token.

---

### Success Response

```json
{
    "success": true,
    "accessToken":"<jwt>"
}
```

---

## Current User

### Endpoint

```
GET /auth/me
```

### Description

Returns the currently authenticated user.

---

### Success Response

```json
{
    "success": true,
    "data": {
        "id":"...",
        "firstName":"John",
        "lastName":"Doe",
        "email":"john@example.com",
        "role":"student"
    }
}
```

---

# 5. Response Format

Every successful response follows this structure.

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Errors

```json
{
    "success": false,
    "message":"...",
    "errors":[]
}
```

---

# 6. HTTP Status Codes

| Code | Meaning |
|------|---------|
|200|Success|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Failed|
|500|Internal Server Error|

---

# 7. Error Responses

Example

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field":"email",
            "message":"Email is required"
        }
    ]
}
```

---

# 8. Future Modules

The following endpoints will be documented as development continues.

## Students

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /students | Create student profile | Yes | Student |
| GET | /students | List all students | Yes | Admin, School, Company |
| GET | /students/me | Get own profile | Yes | Student |
| GET | /students/:id | Get student by ID | Yes | Student, Admin, School, Supervisor |
| PUT | /students/:id | Update student profile | Yes | Owner, Admin |
| DELETE | /students/:id | Delete student profile | Yes | Admin |

---

### Create Student Profile

**POST /students**

**Request Body**

```json
{
    "admissionNumber": "ADM001",
    "course": "Computer Science",
    "department": "Computing",
    "yearOfStudy": 3,
    "phone": "0712345678",
    "gender": "male",
    "dateOfBirth": "2000-01-15",
    "nationalId": "ID123456"
}
```

**Success Response (201 Created)**

```json
{
    "success": true,
    "message": "Student profile created successfully.",
    "data": {
        "_id": "...",
        "userId": "...",
        "admissionNumber": "ADM001",
        "course": "Computer Science",
        "department": "Computing",
        "yearOfStudy": 3,
        "phone": "0712345678",
        "gender": "male",
        "dateOfBirth": "2000-01-15T00:00:00.000Z",
        "nationalId": "ID123456",
        "skills": [],
        "cvUrl": "",
        "portfolioUrl": "",
        "status": "active",
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

**Validation Rules**

- admissionNumber required, unique
- course required
- department required
- yearOfStudy between 1 and 6
- phone required
- gender must be male, female, or other
- dateOfBirth required (ISO 8601)
- nationalId required

**Possible Errors**

| Status | Description |
|--------|-------------|
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 409 | Profile or admission number already exists |
| 500 | Internal Server Error |

---

### Get All Students

**GET /students**

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Students retrieved successfully.",
    "data": [...]
}
```

---

### Get My Profile

**GET /students/me**

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Profile retrieved successfully.",
    "data": {
        "_id": "...",
        "userId": {
            "_id": "...",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "avatar": ""
        },
        "admissionNumber": "ADM001",
        "course": "Computer Science",
        ...
    }
}
```

---

### Get Student By ID

**GET /students/:id**

**Success Response (200 OK)**

Same shape as Get My Profile.

---

### Update Student Profile

**PUT /students/:id**

**Request Body** (all fields optional)

```json
{
    "yearOfStudy": 4,
    "skills": ["JavaScript", "Python", "Node.js"],
    "phone": "0798765432"
}
```

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Student profile updated successfully.",
    "data": {...}
}
```

---

### Delete Student Profile

**DELETE /students/:id**

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Student profile deleted successfully."
}
```

---

## Companies

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /companies | Create company profile | Yes | Company |
| GET | /companies | List all companies | No | Public |
| GET | /companies/me | Get own profile | Yes | Company |
| GET | /companies/:id | Get company by ID | No | Public |
| PUT | /companies/:id | Update company profile | Yes | Owner, Admin |
| DELETE | /companies/:id | Delete company profile | Yes | Admin |

---

### Create Company Profile

**POST /companies**

**Request Body**

```json
{
    "companyName": "Tech Corp Ltd",
    "industry": "Technology",
    "email": "info@techcorp.com",
    "phone": "0711111111",
    "registrationNumber": "REG001",
    "address": "123 Tech Street",
    "city": "Nairobi",
    "county": "Nairobi",
    "website": "https://techcorp.com",
    "description": "A leading tech company"
}
```

**Success Response (201 Created)**

```json
{
    "success": true,
    "message": "Company profile created successfully.",
    "data": {
        "_id": "...",
        "userId": "...",
        "companyName": "Tech Corp Ltd",
        "industry": "Technology",
        "email": "info@techcorp.com",
        "phone": "0711111111",
        "registrationNumber": "REG001",
        "address": "123 Tech Street",
        "city": "Nairobi",
        "county": "Nairobi",
        "website": "https://techcorp.com",
        "description": "A leading tech company",
        "logo": "",
        "verified": false,
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

**Validation Rules**

- companyName required, unique, 2–100 characters
- industry required
- email valid email
- phone required
- website optional, must be valid URL if provided
- registrationNumber optional
- address, city, county optional

**Possible Errors**

| Status | Description |
|--------|-------------|
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 409 | Profile or company name already exists |
| 500 | Internal Server Error |

---

### Get All Companies

**GET /companies** (Public)

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Companies retrieved successfully.",
    "data": [
        {
            "_id": "...",
            "userId": {
                "_id": "...",
                "firstName": "John",
                "lastName": "Doe",
                "email": "john@example.com",
                "avatar": ""
            },
            "companyName": "Tech Corp Ltd",
            "industry": "Technology",
            ...
        }
    ]
}
```

---

### Get My Profile

**GET /companies/me**

**Success Response (200 OK)**

Same shape as Get All Companies but returns only the authenticated user's company.

---

### Get Company By ID

**GET /companies/:id** (Public)

**Success Response (200 OK)**

Same shape as Get All Companies.

---

### Update Company Profile

**PUT /companies/:id**

**Request Body** (all fields optional)

```json
{
    "description": "Updated description",
    "website": "https://new-website.com",
    "city": "Mombasa"
}
```

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Company profile updated successfully.",
    "data": {...}
}
```

---

### Delete Company Profile

**DELETE /companies/:id**

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Company profile deleted successfully."
}
```

---

## Schools

```
/schools
```

---

## Opportunities

```
/opportunities
```

---

## Applications

```
/applications
```

---

## Supervisors

```
/supervisors
```

---

## Logbooks

```
/logbooks
```

---

## Evaluations

```
/evaluations
```

---

## Reports

```
/reports
```

---

## Notifications

```
/notifications
```

---

# 9. API Versioning

AttachLink follows URI Versioning.

Current version

```
/api/v1
```

Future versions

```
/api/v2

/api/v3
```

Older versions will remain available during migration periods to maintain backward compatibility.

---

# Conclusion

This document serves as the official API reference for AttachLink.

It should be updated whenever a new endpoint is added, modified, or removed to ensure that the documentation remains synchronized with the implementation.