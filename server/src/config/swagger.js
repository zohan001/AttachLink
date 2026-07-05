import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AttachLink API",
      version: "1.0.0",
      description:
        "API documentation for the AttachLink internship management system.",
      contact: {
        name: "Support",
        email: "support@attachlink.com",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: { type: "object" },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            role: {
              type: "string",
              enum: [
                "student",
                "company",
                "school",
                "supervisor",
                "admin",
              ],
            },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
                accessToken: { type: "string" },
              },
            },
          },
        },
        Student: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            admissionNumber: { type: "string" },
            course: { type: "string" },
            department: { type: "string" },
            yearOfStudy: { type: "integer" },
            phone: { type: "string" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            dateOfBirth: { type: "string", format: "date" },
            nationalId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Company: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            companyName: { type: "string" },
            industry: { type: "string" },
            description: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            website: { type: "string" },
            location: { type: "string" },
            logo: { type: "string" },
            verified: { type: "boolean" },
          },
        },
        School: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            schoolName: { type: "string" },
            institutionType: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
            verified: { type: "boolean" },
          },
        },
        Supervisor: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            supervisorType: {
              type: "string",
              enum: ["academic", "industrial"],
            },
            schoolId: { type: "string" },
            companyId: { type: "string" },
            department: { type: "string" },
            position: { type: "string" },
            phone: { type: "string" },
          },
        },
        Opportunity: {
          type: "object",
          properties: {
            _id: { type: "string" },
            companyId: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            requirements: { type: "string" },
            location: { type: "string" },
            duration: { type: "string" },
            stipend: { type: "string" },
            status: {
              type: "string",
              enum: ["Open", "Closed", "Filled"],
            },
            vacancies: { type: "integer" },
            applicationDeadline: { type: "string", format: "date" },
          },
        },
        Application: {
          type: "object",
          properties: {
            _id: { type: "string" },
            studentId: { type: "string" },
            opportunityId: { type: "string" },
            companyId: { type: "string" },
            status: {
              type: "string",
              enum: [
                "Pending",
                "Shortlisted",
                "Accepted",
                "Rejected",
                "Withdrawn",
              ],
            },
            coverLetter: { type: "string" },
          },
        },
        Attachment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            studentId: { type: "string" },
            opportunityId: { type: "string" },
            companyId: { type: "string" },
            academicSupervisorId: { type: "string" },
            industrialSupervisorId: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            status: {
              type: "string",
              enum: ["Active", "Completed", "Terminated"],
            },
          },
        },
        Logbook: {
          type: "object",
          properties: {
            _id: { type: "string" },
            studentId: { type: "string" },
            attachmentId: { type: "string" },
            weekNumber: { type: "integer" },
            activities: { type: "string" },
            achievements: { type: "string" },
            challenges: { type: "string" },
            status: {
              type: "string",
              enum: ["Draft", "Submitted", "Approved", "Rejected"],
            },
            supervisorComments: { type: "string" },
          },
        },
        Evaluation: {
          type: "object",
          properties: {
            _id: { type: "string" },
            studentId: { type: "string" },
            attachmentId: { type: "string" },
            evaluatorId: { type: "string" },
            evaluatorType: {
              type: "string",
              enum: ["academic", "industrial"],
            },
            criteria: {
              type: "object",
              properties: {
                punctuality: { type: "integer", minimum: 1, maximum: 5 },
                professionalism: { type: "integer", minimum: 1, maximum: 5 },
                communication: { type: "integer", minimum: 1, maximum: 5 },
                technicalSkills: { type: "integer", minimum: 1, maximum: 5 },
                teamwork: { type: "integer", minimum: 1, maximum: 5 },
                problemSolving: { type: "integer", minimum: 1, maximum: 5 },
                adaptability: { type: "integer", minimum: 1, maximum: 5 },
                overallPerformance: {
                  type: "integer",
                  minimum: 1,
                  maximum: 5,
                },
              },
            },
            overallScore: { type: "number" },
            comments: { type: "string" },
            status: {
              type: "string",
              enum: ["Draft", "Submitted"],
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string" },
            recipientId: { type: "string" },
            type: { type: "string" },
            title: { type: "string" },
            message: { type: "string" },
            read: { type: "boolean" },
            link: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "array", items: { type: "object" } },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Students", description: "Student profile management" },
      { name: "Companies", description: "Company profile management" },
      { name: "Schools", description: "School profile management" },
      { name: "Supervisors", description: "Supervisor profile management" },
      { name: "Opportunities", description: "Internship opportunities" },
      { name: "Applications", description: "Job applications" },
      { name: "Attachments", description: "Attachment placements" },
      { name: "Logbooks", description: "Weekly logbook entries" },
      { name: "Evaluations", description: "Student evaluations" },
      { name: "Reports", description: "Aggregated reports" },
      { name: "Notifications", description: "User notifications" },
      { name: "Analytics", description: "System analytics" },
      { name: "Dashboard", description: "Role-based dashboards" },
    ],
  },
  apis: ["./src/modules/**/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
