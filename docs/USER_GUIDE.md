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

## Application Module

### For Students — Applying

1. Browse open opportunities and find a position.
2. Apply via `POST /api/v1/applications` with the opportunity ID and a cover letter.
3. Track your applications: `GET /api/v1/applications/my`
4. Withdraw an application: `PATCH /api/v1/applications/:id/withdraw`

### Application Status Lifecycle

Your application progresses through these stages:

```
Pending → Under Review → Shortlisted → Interview Scheduled → Accepted
                                                            → Rejected
```

- **Pending** — Submitted, awaiting review.
- **Under Review** — Company is evaluating your profile.
- **Shortlisted** — You've been shortlisted for the next stage.
- **Interview Scheduled** — Interview has been arranged.
- **Accepted** — Congratulations! You've been accepted.
- **Rejected** — Not selected for this position.
- **Withdrawn** — You withdrew your application.

### For Companies — Reviewing Applications

1. View all applicants: `GET /api/v1/applications/company`
2. Filter by opportunity: `GET /api/v1/applications/company/:opportunityId`
3. Update status: `PATCH /api/v1/applications/:id/status`
4. Provide feedback to candidates along with status updates.

---

*More modules will be documented as development continues.*
