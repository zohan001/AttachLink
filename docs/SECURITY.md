# AttachLink Security Architecture

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

**Document Type:** Security Design Document

---

# Table of Contents

1. Introduction
2. Security Objectives
3. Security Principles
4. Authentication
5. Authorization
6. Password Security
7. JWT Security
8. Session Management
9. API Security
10. Database Security
11. File Upload Security
12. Environment Variables
13. Input Validation
14. Logging & Monitoring
15. Security Headers
16. Rate Limiting
17. Future Security Enhancements
18. Security Checklist

---

# 1. Introduction

Security is a fundamental part of AttachLink.

This document defines the security standards that every feature must follow to protect users, data, and system resources.

---

# 2. Security Objectives

The security architecture aims to provide:

- Confidentiality
- Integrity
- Availability
- Accountability
- Privacy
- Secure Authentication
- Secure Authorization

---

# 3. Security Principles

AttachLink follows these principles:

- Least Privilege
- Defense in Depth
- Zero Trust
- Secure by Default
- Validate Every Request
- Never Trust Client Input

---

# 4. Authentication

Authentication is implemented using JSON Web Tokens (JWT).

Two tokens are used.

## Access Token

Purpose

- Access protected APIs

Lifetime

```
15 Minutes
```

## Refresh Token

Purpose

- Generate new Access Tokens

Lifetime

```
7 Days
```

Refresh Tokens are stored inside HTTP-only cookies.

---

# 5. Authorization

Role-Based Access Control (RBAC) is implemented.

Supported Roles

- Student
- Company
- School
- Supervisor
- Admin

Authorization checks occur after authentication.

Every protected route verifies permissions before executing business logic.

---

# 6. Password Security

Passwords must:

- Be hashed using bcrypt
- Never be encrypted
- Never be stored in plain text

Minimum requirements:

- Minimum 8 characters
- Uppercase letter
- Lowercase letter
- Number

Passwords are never returned in API responses.

---

# 7. JWT Security

JWT payloads should contain only the minimum required information.

Example

```json
{
  "id": "userId",
  "role": "student"
}
```

JWT secrets are stored in environment variables.

JWT tokens must never be hardcoded.

---

# 8. Session Management

Users remain authenticated using:

- Access Token
- Refresh Token

Logout invalidates the refresh token.

Expired access tokens require a valid refresh token.

---

# 9. API Security

Every protected endpoint requires authentication.

Sensitive endpoints also require authorization.

Example

```
POST /opportunities
```

Requires Company role.

```
POST /applications
```

Requires Student role.

```
GET /admin/users
```

Requires Admin role.

---

# 10. Database Security

MongoDB Atlas is used.

Security measures include:

- Password-protected database users
- TLS encryption
- IP Access List
- Principle of least privilege

Sensitive fields are excluded from default queries where appropriate.

---

# 11. File Upload Security

Allowed file types:

- PDF
- DOCX
- PNG
- JPG
- JPEG

Maximum upload size should be configured.

Uploaded files should be scanned and validated.

Executable files are not allowed.

Files are stored using Cloudinary.

---

# 12. Environment Variables

Sensitive configuration is stored in the `.env` file.

Examples

```
MONGO_URI

JWT_SECRET

JWT_REFRESH_SECRET

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET
```

The `.env` file must never be committed to Git.

---

# 13. Input Validation

Every request must be validated.

Validation occurs before controllers.

Validation includes:

- Required fields
- Email format
- Password strength
- ObjectId validation
- File validation

---

# 14. Logging & Monitoring

Security-related events should be logged.

Examples:

- Login
- Logout
- Password Reset
- Failed Login Attempts
- Account Lock
- Permission Denied

Passwords and tokens must never appear in logs.

---

# 15. Security Headers

The production server should use Helmet to configure security headers.

Examples include:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

---

# 16. Rate Limiting

Rate limiting protects against brute-force attacks.

Recommended limits:

Authentication Routes

```
5 Requests / Minute
```

General API

```
100 Requests / Minute
```

---

# 17. Future Security Enhancements

Future versions may include:

- Multi-Factor Authentication (MFA)
- Email Verification
- Password Reset via Email
- Device Management
- Login Notifications
- Session Revocation
- Audit Logs
- CAPTCHA
- Web Application Firewall (WAF)

---

# 18. Security Checklist

Before deployment, verify:

- Passwords are hashed
- JWT secrets are configured
- HTTPS is enabled
- HTTP-only cookies are used
- Validation exists
- Authorization exists
- Rate limiting is enabled
- Helmet is enabled
- Environment variables are secure
- Sensitive data is excluded from API responses
- Database backups are configured

---

# Conclusion

Security is a continuous process.

Every new feature added to AttachLink must follow the security standards defined in this document to ensure the confidentiality, integrity, and availability of the platform.