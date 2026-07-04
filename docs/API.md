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

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /opportunities | Create opportunity | Yes | Company |
| GET | /opportunities | List/search opportunities | No | Public |
| GET | /opportunities/my | My company's opportunities | Yes | Company |
| GET | /opportunities/:id | Get opportunity by ID | No | Public |
| PUT | /opportunities/:id | Update opportunity | Yes | Owner, Admin |
| DELETE | /opportunities/:id | Delete opportunity | Yes | Admin |
| PATCH | /opportunities/:id/publish | Publish opportunity | Yes | Owner, Admin |
| PATCH | /opportunities/:id/close | Close opportunity | Yes | Owner, Admin |

---

### Create Opportunity

**POST /opportunities**

**Request Body**

```json
{
    "title": "Software Engineer Intern",
    "description": "Join our engineering team...",
    "category": "ICT",
    "internshipType": "Internship",
    "location": "Nairobi",
    "workMode": "Hybrid",
    "vacancies": 3,
    "applicationDeadline": "2026-08-30",
    "duration": "3 months",
    "requirements": ["Degree in Computer Science", "JavaScript skills"],
    "responsibilities": ["Write code", "Attend standups"],
    "skills": ["JavaScript", "Node.js", "React"],
    "benefits": ["Certification", "Stipend"],
    "salary": 30000,
    "currency": "KES"
}
```

**Success Response (201 Created)**

```json
{
    "success": true,
    "message": "Opportunity created successfully.",
    "data": {
        "_id": "...",
        "companyId": "...",
        "title": "Software Engineer Intern",
        "description": "Join our engineering team...",
        "category": "ICT",
        "internshipType": "Internship",
        "location": "Nairobi",
        "workMode": "Hybrid",
        "vacancies": 3,
        "applicationDeadline": "2026-08-30T00:00:00.000Z",
        "duration": "3 months",
        "requirements": ["Degree in Computer Science", "JavaScript skills"],
        "responsibilities": ["Write code", "Attend standups"],
        "skills": ["JavaScript", "Node.js", "React"],
        "benefits": ["Certification", "Stipend"],
        "salary": 30000,
        "currency": "KES",
        "status": "Draft",
        "published": false,
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

**Validation Rules**

- title required (max 200 chars)
- description required
- category required
- internshipType must be Industrial Attachment, Internship, Graduate Trainee, or Apprenticeship
- location required
- workMode must be On-site, Hybrid, or Remote
- vacancies required, minimum 1
- applicationDeadline required, must be in the future
- duration required
- requirements required, at least 1
- responsibilities, skills, benefits optional arrays
- salary optional, must be positive
- currency optional

**Possible Errors**

| Status | Description |
|--------|-------------|
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden (non-company users) |
| 500 | Internal Server Error |

---

### List / Search Opportunities

**GET /opportunities** (Public)

Supports query parameters for search, filtering, sorting, and pagination.

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| search | String | Search in title, description, skills |
| location | String | Filter by location |
| category | String | Filter by category |
| workMode | String | Filter by work mode (On-site, Hybrid, Remote) |
| status | String | Filter by status (Draft, Open, Closed, Expired) |
| sort | String | Sort: newest, oldest, deadline |
| page | Number | Page number (default: 1) |
| limit | Number | Results per page (default: 10) |

**Example**

```
GET /opportunities?search=Software&location=Nairobi&category=ICT&workMode=Hybrid&sort=newest&page=1&limit=10
```

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Opportunities retrieved successfully.",
    "data": {
        "opportunities": [
            {
                "_id": "...",
                "companyId": {
                    "_id": "...",
                    "companyName": "Tech Corp Ltd",
                    "logo": "",
                    "city": "Nairobi",
                    "industry": "Technology"
                },
                "title": "Software Engineer Intern",
                "location": "Nairobi",
                "workMode": "Hybrid",
                "vacancies": 3,
                "status": "Open",
                ...
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 1,
            "pages": 1
        }
    }
}
```

Note: Draft opportunities are hidden from public listings.

---

### Get My Company's Opportunities

**GET /opportunities/my**

Returns all opportunities created by the authenticated company, most recent first.

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Your opportunities retrieved successfully.",
    "data": [...]
}
```

---

### Get Opportunity By ID

**GET /opportunities/:id** (Public)

**Success Response (200 OK)**

Same shape as a single opportunity from the list, with companyId populated.

---

### Update Opportunity

**PUT /opportunities/:id**

All fields optional. Only the owner company or an admin can update.

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Opportunity updated successfully.",
    "data": {...}
}
```

---

### Delete Opportunity

**DELETE /opportunities/:id**

Admin only.

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Opportunity deleted successfully."
}
```

---

### Publish Opportunity

**PATCH /opportunities/:id/publish**

Sets `published: true` and `status: Open`. Cannot publish if deadline is in the past.

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Opportunity published successfully.",
    "data": {
        "published": true,
        "status": "Open",
        ...
    }
}
```

---

### Close Opportunity

**PATCH /opportunities/:id/close**

Sets `status: Closed`. Applications can no longer be accepted.

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Opportunity closed successfully.",
    "data": {
        "status": "Closed",
        ...
    }
}
```

---

## Applications

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /applications | Apply to opportunity | Yes | Student |
| GET | /applications | List all applications | Yes | Admin |
| GET | /applications/my | My applications | Yes | Student |
| PATCH | /applications/:id/withdraw | Withdraw application | Yes | Student (owner) |
| GET | /applications/company | Company's applications | Yes | Company |
| GET | /applications/company/:opportunityId | Filter by opportunity | Yes | Company |
| PATCH | /applications/:id/status | Update application status | Yes | Company |
| DELETE | /applications/:id | Delete application | Yes | Admin |

---

### Apply to Opportunity

**POST /applications**

**Request Body**

```json
{
    "opportunityId": "...",
    "coverLetter": "I am writing to express my strong interest in this position...",
    "cvUrl": "https://example.com/cv.pdf"
}
```

**Success Response (201 Created)**

```json
{
    "success": true,
    "message": "Application submitted successfully.",
    "data": {
        "_id": "...",
        "studentId": "...",
        "opportunityId": "...",
        "companyId": "...",
        "coverLetter": "...",
        "status": "Pending",
        "appliedAt": "...",
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

**Validation Rules**

- opportunityId required, valid MongoID
- coverLetter required, minimum 50 characters
- cvUrl optional, must be valid URL

**Business Rules**

- Only students can apply
- Student profile must exist
- Opportunity must be Open
- Deadline must not have passed
- Cannot apply twice to the same opportunity (unless previous application was Withdrawn)

**Possible Errors**

| Status | Description |
|--------|-------------|
| 400 | Validation error / Closed or expired opportunity |
| 401 | Unauthorized |
| 403 | Forbidden (non-student) |
| 404 | Student or opportunity not found |
| 409 | Already applied |
| 500 | Internal Server Error |

---

### List All Applications

**GET /applications** (Admin only)

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "All applications retrieved successfully.",
    "data": [...]
}
```

---

### My Applications

**GET /applications/my** (Student only)

Returns the authenticated student's applications, most recent first.

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Your applications retrieved successfully.",
    "data": [
        {
            "_id": "...",
            "studentId": {
                "_id": "...",
                "userId": {
                    "_id": "...",
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "john@example.com"
                }
            },
            "opportunityId": {
                "_id": "...",
                "title": "Software Engineer Intern",
                "location": "Nairobi",
                "applicationDeadline": "...",
                "status": "Open"
            },
            "companyId": {
                "_id": "...",
                "companyName": "Tech Corp Ltd",
                "logo": ""
            },
            "status": "Under Review",
            "coverLetter": "...",
            "appliedAt": "...",
            "feedback": "",
            "shortlisted": false
        }
    ]
}
```

---

### Withdraw Application

**PATCH /applications/:id/withdraw** (Student owner only)

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Application withdrawn successfully.",
    "data": {
        "status": "Withdrawn",
        ...
    }
}
```

Cannot withdraw if status is Accepted or Rejected.

---

### Company's Applications

**GET /applications/company** (Company only)

Returns all applications for the authenticated company's opportunities.

**GET /applications/company/:opportunityId** (Company only)

Filter applications by a specific opportunity.

---

### Update Application Status

**PATCH /applications/:id/status** (Company owner only)

**Request Body**

```json
{
    "status": "Shortlisted",
    "feedback": "Great profile, impressive skills"
}
```

**Valid Status Flow**

```
Pending → Under Review → Shortlisted → Interview Scheduled → Accepted
                          ↘               ↘
                          Rejected         Rejected
```

**Allowed Status Values**

| Status | Description |
|--------|-------------|
| Under Review | Company is reviewing |
| Shortlisted | Candidate moved forward |
| Interview Scheduled | Interview booked |
| Accepted | Offer given |
| Rejected | Not moving forward |

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Application status updated to \"Shortlisted\".",
    "data": {
        "status": "Shortlisted",
        "shortlisted": true,
        "reviewedAt": "...",
        "reviewedBy": "...",
        "feedback": "Great profile, impressive skills",
        ...
    }
}
```

---

### Delete Application

**DELETE /applications/:id** (Admin only)

**Success Response (200 OK)**

```json
{
    "success": true,
    "message": "Application deleted successfully."
}
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