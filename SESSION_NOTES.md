# Session Notes

## Session 1 – Project Initialization & Auth Module

**Modules Built:**
- Core Express app setup (server.js)
- User model & auth (register, login, logout, refresh-token, me)
- Error handling infrastructure (custom errors, error middleware)
- Request validation (express-validator + validate middleware)
- JWT access + refresh token strategy with Redis blacklist

---

## Session 2 – Students Module

**Modules Built:**
- Student model (admissionNumber, course, department, yearOfStudy, etc.)
- CRUD endpoints (create, getAll, getById, getByUserId, update, delete)
- `/students/me` route placed before `/:id`
- One student profile per user, profile requires student role
- Auth: roles enforced; update requires owner or admin; delete requires admin

---

## Session 3 – Companies Module

**Modules Built:**
- Company model (companyName, industry, email, phone, etc.)
- CRUD endpoints (create, getAll, getById, getByUserId/me, update, delete)
- `/companies/me` route placed before `/:id`
- Company profile requires company role, one per user
- Only owner or admin can update; only admin can delete

**Architecture Decisions:**
- Service-layer validation for business logic (unique name lookup)
- Move to populated userId references for cleaner responses
- Doc reduction: nested routes instead of separate endpoint sections

---

## Session 4 – Opportunities Module

**Modules Built:**
- Opportunity model (companyId, title, description, category, location, etc.)
- Full CRUD + publish/close endpoints
- Public listing with search, filtering, pagination
- Search index on title, description, skills
- Company profile must exist before creating opportunities
- Draft opportunities hidden from public
- Deadline validation on publish
- Application count tracking via virtuals and static methods

---

## Session 5 – Applications Module

**Modules Built:**
- Application model (studentId, opportunityId, companyId, status, etc.)
- Apply, withdraw, list (admin/my/company), status update, delete
- Business rules: student must exist, opportunity must be Open & not expired, no duplicate active applications
- Status flow with transition validation
- Application count updated on Opportunity when status changes
- Company profile auto-resolved from opportunity in service layer
- Fixed race condition: opportunity lookup before companyId extraction

---

## Session 6 – Schools Module

**Modules Built:**
- School model (schoolName, abbreviation, institutionType, email, phone, etc.)
- Standard CRUD pattern following Companies/Students structure
- `/schools/me` route placed before `/:id`
- Institution types: University, TVET, College, High School, Training Institute
- One school profile per user, requires school role
- Only owner or admin can update; only admin can delete

---

## Session 7 – Supervisor Module

**Modules Built:**
- Supervisor model (userId, supervisorType, schoolId, companyId, department, phone, position)
- Two distinct types: **academic** (belongs to school) and **industrial** (belongs to company)
- Conditional validation: academic requires schoolId, industrial requires companyId
- Standard CRUD + `/supervisors/me` profile endpoint
- supervisor role required to create profile, one profile per user
- Owner/admin can update; admin can delete
- Service-layer validation for school/company existence

**Pending (next):** Architecture review, then Attachments module (new domain entity between Application and Logbook)
