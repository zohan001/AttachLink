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

## Opportunity Module

### For Companies — Posting Opportunities

1. Ensure you have a company profile first.
2. Create an opportunity via `POST /api/v1/opportunities` with title, description, category, location, vacancies, deadline, requirements, and other details.
3. Opportunities start as **Draft** — hidden from students.
4. When ready, publish via `PATCH /api/v1/opportunities/:id/publish`.
5. Close applications via `PATCH /api/v1/opportunities/:id/close`.

### Managing Your Opportunities

- List your opportunities: `GET /api/v1/opportunities/my`
- Edit an opportunity: `PUT /api/v1/opportunities/:id`

### For Students — Browsing Opportunities

- Browse all open opportunities: `GET /api/v1/opportunities`
- Search by keyword: `GET /api/v1/opportunities?search=Software`
- Filter by location: `GET /api/v1/opportunities?location=Nairobi`
- Pagination supported: `?page=1&limit=10`

---

*More modules will be documented as development continues.*
