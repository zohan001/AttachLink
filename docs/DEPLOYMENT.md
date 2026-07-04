# AttachLink Deployment Guide

**Project:** AttachLink – Internship & Attachment Management Platform

**Version:** 1.0.0

**Deployment Type:** Full Stack SaaS

---

# Table of Contents

1. Introduction
2. Deployment Architecture
3. Development Environment
4. Production Environment
5. Backend Deployment
6. Frontend Deployment
7. Database Configuration
8. Environment Variables
9. File Storage
10. Domain & SSL
11. Monitoring & Logging
12. Backup Strategy
13. CI/CD Pipeline
14. Deployment Checklist
15. Troubleshooting
16. Conclusion

---

# 1. Introduction

This document explains how AttachLink is deployed in both development and production environments.

The deployment process is designed to ensure reliability, security, scalability, and maintainability.

---

# 2. Deployment Architecture

```
                Users
                   │
                   ▼
          ┌──────────────────┐
          │ Vue 3 Frontend   │
          │ (Vercel/Netlify) │
          └────────┬─────────┘
                   │ HTTPS
                   ▼
          ┌──────────────────┐
          │ Express API      │
          │ (Render)         │
          └────────┬─────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 MongoDB Atlas          Cloudinary
 Database               File Storage
```

---

# 3. Development Environment

Frontend

```
Vue 3
Vite
Port: 5173
```

Backend

```
Node.js
Express.js
Port: 5000
```

Database

```
MongoDB Atlas
```

Run frontend

```bash
npm run dev
```

Run backend

```bash
npm run dev
```

---

# 4. Production Environment

Frontend

```
Vercel
```

Backend

```
Render
```

Database

```
MongoDB Atlas
```

Storage

```
Cloudinary
```

---

# 5. Backend Deployment

Requirements

- Node.js LTS
- Environment Variables
- MongoDB Atlas Connection
- Cloudinary Configuration

Build Command

```bash
npm install
```

Start Command

```bash
npm start
```

Health Check

```
GET /health
```

---

# 6. Frontend Deployment

Build

```bash
npm run build
```

Generated files

```
dist/
```

Deploy the generated build to Vercel or Netlify.

---

# 7. Database Configuration

Database Provider

```
MongoDB Atlas
```

Connection String

```
MONGO_URI=<connection-string>
```

Recommended Settings

- Enable TLS
- Enable backups
- Restrict IP access
- Use least-privilege database users

---

# 8. Environment Variables

Backend

```
NODE_ENV=production

PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CLIENT_URL=
```

Frontend

```
VITE_API_URL=
```

Never commit `.env` files.

---

# 9. File Storage

Cloudinary stores:

- Company logos
- Student CVs
- Student profile photos
- Reports
- Attachments

Do not store uploads inside the application server in production.

---

# 10. Domain & SSL

Production should use HTTPS.

Example

Frontend

```
https://app.attachlink.com
```

Backend

```
https://api.attachlink.com
```

Enable SSL certificates.

---

# 11. Monitoring & Logging

Monitor:

- API uptime
- CPU usage
- Memory usage
- Error rates
- Response times

Recommended tools

- Render Logs
- MongoDB Atlas Monitoring
- UptimeRobot

---

# 12. Backup Strategy

Database

- Automatic daily backups
- Weekly restore verification

Cloudinary

- Enable asset backups where available

Source Code

- GitHub repository
- Protected main branch

---

# 13. CI/CD Pipeline

Recommended workflow

```
Developer

↓

GitHub Repository

↓

GitHub Actions

↓

Run Tests

↓

Build Application

↓

Deploy Backend

↓

Deploy Frontend
```

Deployment should occur only after successful tests.

---

# 14. Deployment Checklist

Before deployment, verify:

- Environment variables configured
- MongoDB connected
- Cloudinary configured
- HTTPS enabled
- CORS configured
- JWT secrets configured
- Application builds successfully
- Health endpoint responds correctly
- Database backups enabled

---

# 15. Troubleshooting

## MongoDB Connection Failure

Check:

- Connection string
- IP whitelist
- Database user credentials

---

## CORS Errors

Verify:

- CLIENT_URL
- CORS middleware configuration

---

## JWT Errors

Verify:

- JWT_SECRET
- JWT_REFRESH_SECRET

---

## Upload Errors

Verify:

- Cloudinary credentials
- File size limits
- Supported file types

---

# 16. Conclusion

This deployment guide provides the standard deployment process for AttachLink.

Following this guide ensures that deployments remain secure, repeatable, and reliable across development, staging, and production environments.