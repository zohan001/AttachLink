# AttachLink User Guide

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

---

## Student Module

### Creating a Student Profile

1. Register a new account with role `student` via `POST /api/v1/auth/register`.
2. Authenticate using the returned access token.
3. Create your student profile via `POST /api/v1/students` with your admission number, course, department, and other details.

### Managing Your Profile

- View your profile: `GET /api/v1/students/me`
- Update your profile: `PUT /api/v1/students/:id`
- Skills, CV URL, and portfolio URL can be updated after profile creation.

---

## Company Module

### Creating a Company Profile

1. Register a new account with role `company` via `POST /api/v1/auth/register`.
2. Authenticate using the returned access token.
3. Create your company profile via `POST /api/v1/companies` with your company name, industry, email, phone, and other details.

### Managing Your Profile

- View your profile: `GET /api/v1/companies/me`
- Update your profile: `PUT /api/v1/companies/:id`
- Your company will appear in public listings immediately after creation.

### Public Access

- Anyone can view company profiles: `GET /api/v1/companies` or `GET /api/v1/companies/:id`
- No authentication is required for browsing companies.

---

*More modules will be documented as development continues.*
