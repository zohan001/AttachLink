# AttachLink Database Design Document

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

**Database:** MongoDB Atlas

**ODM:** Mongoose

---

# Table of Contents

1. Introduction
2. Database Overview
3. Design Principles
4. Collections
5. Collection Relationships
6. Common Fields
7. Indexing Strategy
8. Data Validation
9. Data Integrity
10. Backup & Recovery
11. Future Improvements
12. Conclusion

---

# 1. Introduction

This document describes the database architecture of AttachLink.

The database is designed to support a scalable internship and attachment management platform while maintaining data consistency, flexibility, and performance.

MongoDB Atlas is used as the primary cloud database.

---

# 2. Database Overview

Database Name

```
attachlink
```

Database Type

```
Document Database
```

ODM

```
Mongoose
```

Relationships are maintained using MongoDB ObjectId references.

---

# 3. Design Principles

The database follows these principles.

- Normalized where relationships are important.
- Embedded documents only where appropriate.
- Avoid duplicated data.
- Use ObjectId references.
- Store timestamps for every document.
- Soft delete where required.
- Index frequently searched fields.

---

# 4. Collections

The system consists of the following collections.

```
users
students
companies
schools
supervisors
opportunities
applications
logbooks
evaluations
reports
notifications
```

---

# 5. Collection Details

## 5.1 Users

Purpose

Stores authentication information for every system user.

Fields

| Field | Type | Required | Description |
|------|------|----------|-------------|
| _id | ObjectId | Yes | Primary Key |
| firstName | String | Yes | User first name |
| lastName | String | Yes | User last name |
| email | String | Yes | Unique email |
| password | String | Yes | Hashed password |
| role | String | Yes | User role |
| isVerified | Boolean | Yes | Email verification status |
| lastLogin | Date | No | Last successful login |
| createdAt | Date | Yes | Created automatically |
| updatedAt | Date | Yes | Updated automatically |

Indexes

- email (Unique)

Relationships

```
One User

↓

One Student Profile

OR

One Company Profile

OR

One School Profile

OR

One Supervisor Profile
```

---

## 5.2 Students

Purpose

Stores student profile information.

Fields

- userId
- admissionNumber
- schoolId
- course
- department
- yearOfStudy
- phone
- gender
- dateOfBirth
- nationalId
- skills
- cvUrl
- portfolioUrl
- status

Relationships

```
Student

↓

Applications

↓

Logbooks

↓

Evaluations
```

---

## 5.3 Companies

Purpose

Stores company information.

Fields

- userId
- companyName
- registrationNumber
- industry
- address
- city
- county
- website
- email
- phone
- logo
- description
- verified

Relationships

```
Company

↓

Opportunities

↓

Applications
```

---

## 5.4 Schools

Purpose

Stores institution information.

Fields

- userId
- schoolName
- abbreviation
- address
- website
- email
- phone
- county

Relationships

```
School

↓

Students

↓

Supervisors
```

---

## 5.5 Supervisors

Purpose

Stores supervisor profiles.

Fields

- userId
- schoolId
- companyId
- department
- phone
- position

Relationships

```
Supervisor

↓

Students

↓

Evaluations
```

---

## 5.6 Opportunities

Purpose

Stores internship opportunities.

Fields

- companyId
- title
- description
- location
- category
- requirements
- vacancies
- deadline
- status

Relationships

```
Company

↓

Opportunity

↓

Applications
```

---

## 5.7 Applications

Purpose

Stores internship applications.

Fields

- studentId
- opportunityId
- status
- appliedAt
- reviewedAt
- remarks

Status Values

- Pending
- Accepted
- Rejected
- Withdrawn

---

## 5.8 Logbooks

Purpose

Stores daily attachment activities.

Fields

- studentId
- supervisorId
- date
- activities
- remarks
- approved

---

## 5.9 Evaluations

Purpose

Stores student evaluations.

Fields

- studentId
- supervisorId
- companyId
- score
- comments
- recommendation

---

## 5.10 Reports

Purpose

Stores generated reports.

Fields

- title
- generatedBy
- reportType
- generatedAt
- fileUrl

---

## 5.11 Notifications

Purpose

Stores in-app notifications.

Fields

- recipientId
- title
- message
- read
- createdAt

---

# 6. Collection Relationships

```
Users
│
├── Student
│      │
│      ├── Applications
│      ├── Logbooks
│      └── Evaluations
│
├── Company
│      │
│      ├── Opportunities
│      └── Applications
│
├── School
│      │
│      └── Supervisors
│
└── Supervisor
       │
       ├── Students
       └── Evaluations
```

---

# 7. Common Fields

Every collection should include

```
createdAt

updatedAt
```

Generated automatically using

```javascript
timestamps: true
```

---

# 8. Indexing Strategy

Indexes improve search performance.

Recommended indexes

Users

- email

Students

- admissionNumber
- schoolId

Companies

- companyName

Schools

- schoolName

Applications

- studentId
- opportunityId

Notifications

- recipientId

---

# 9. Data Validation

Validation is performed in two layers.

Layer One

Request Validation

Validator Middleware

Layer Two

Database Validation

Mongoose Schema Validation

---

# 10. Backup & Recovery

Primary database

MongoDB Atlas

Automatic backups should be enabled in production.

Database restoration should be tested periodically.

---

# 11. Future Improvements

Future versions may include

- Soft Deletes
- Audit Logs
- Multi-Tenant Support
- Database Sharding
- Read Replicas
- Redis Cache
- Full Text Search

---

# 12. Conclusion

The AttachLink database is designed to be scalable, secure, and maintainable.

The schema supports the complete internship lifecycle while allowing future expansion without major redesign.