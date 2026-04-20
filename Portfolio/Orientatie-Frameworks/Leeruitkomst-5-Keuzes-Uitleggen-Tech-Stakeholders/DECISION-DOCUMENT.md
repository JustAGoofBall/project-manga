# 💡 Architectural Decisions & Rationale

## For Non-Technical Stakeholders (简单版)

### Q: Why did you build it this way?

**Answer:**
I built the Manga API with a **client-server architecture**. Think of it like a restaurant:
- **Backend (Express.js)** = The kitchen (prepares orders = data)
- **Frontend (React)** = The dining area (where customers interact)
- **Database (MySQL)** = The pantry (stores ingredients = data)

The frontend and backend talk via requests, just like waiters delivering orders!

---

### Q: Why use Express.js instead of [something else]?

**Answer:**
Express.js is like using a **proven recipe**:
- ✅ **Simple** - Doesn't overwhelm beginners
- ✅ **Industry standard** - Used by companies like Netflix, Uber, PayPal
- ✅ **Lots of help available** - Thousands of tutorials online
- ✅ **Fast development** - Build features quickly

(Other options like Flask are also good, but Express.js is the right choice for our needs)

---

### Q: Is the data safe?

**Answer:**
Yes, multiple layers of protection:
1. **Password Protection** - Passwords are encrypted (can't be hacked easily)
2. **Authentication** - Users must log in to access their data
3. **Encryption** - Sensitive data is scrambled

Think of it like: your house has a lock, only you have the key, and valuables are in a safe.

---

## For Technical Stakeholders (Detailed)

### Architectural Decision 1: Backend Framework

**Decision:** Express.js (not Fastify, NestJS, or Koa)

**Rationale:**
```
Requirements:
  - RESTful API development
  - Middleware support
  - Easy to learn & scale
  - Adequate performance for current load
  - Large ecosystem

Options Considered:
  ✗ Fastify    - Better performance but overkill, added complexity
  ✗ NestJS     - Enterprise features not needed yet, steep learning curve
  ✓ Express.js - Perfect fit, proven in production, excellent docs
  ✗ Koa        - Smaller community, fewer resources
```

**Trade-offs:**
- Express.js is less performant than Fastify per se, but more than adequate
- NestJS would provide better type safety with TypeScript, but adds complexity

**Implementation:**
[index.js](../../../index.js) - Express app initialization
[routes/](../../../routes/) - 8 route files demonstrating Express capabilities

---

### Architectural Decision 2: Database Choice

**Decision:** MySQL with mysql2/promise (not MongoDB, PostgreSQL, or Firebase)

**Rationale:**
```
Project Characteristics:
  - Structured, relational data (anime → characters)
  - ACID compliance required (user favorites, ratings)
  - No unstructured document needs
  - Standard relational queries sufficient

Options Considered:
  ✗ MongoDB     - NoSQL good for unstructured, but overkill here
  ✗ PostgreSQL  - Excellent, but MySQL sufficient + better for learning
  ✓ MySQL       - Perfect for structured, relational data + good performance
  ✗ Firebase    - Vendor lock-in, costs increase with scale
```

**Trade-offs:**
- PostgreSQL has more advanced features, but MySQL is simpler
- MongoDB flexibility not needed for well-defined schema
- Firebase would simplify infrastructure but loses control

**Schema Design:**
[schema.sql](../../../schema.sql) - Shows relational design

```
anime 1──→ M characters
user  1──→ M ratings
user  1──→ M favorites
      ↑
      └── with anime
```

---

### Architectural Decision 3: Authentication Method

**Decision:** JWT + Bcrypt (not Session cookies or OAuth)

**Rationale:**
```
Requirements:
  - Stateless API (scalable)
  - Mobile-friendly authentication
  - Standard industry practice
  - Work with separate frontend/backend

Options Considered:
  ✗ Sessions   - Stateful, not ideal for REST APIs
  ✓ JWT        - Stateless, scalable, modern standard
  ✗ OAuth 2.0  - Good for 3rd party integrations, overkill for this project
```

**Implementation Strategy:**
1. User registers/logs in → receives JWT token
2. Frontend stores token in localStorage
3. Frontend sends token in every request header
4. Backend verifies token (no database lookup needed!)

**Code:**
- [middleware/authMiddleware.js](../../../middleware/authMiddleware.js) - Token verification
- [models/userModel.js](../../../models/userModel.js) - Bcrypt password hashing
- [controllers/authController.js](../../../controllers/authController.js) - Token generation

---

### Architectural Decision 4: Frontend Framework

**Decision:** React with Vite (not Vue, Angular, Svelte)

**Rationale:**
```
Project Needs:
  - Component-based UI
  - Responsive, interactive interface
  - Good learning resources
  - Large ecosystem

Market Data:
  - React: 40% market share
  - Vue: 20% market share
  - Angular: 15% market share

Options Considered:
  ✓ React    - Largest ecosystem, most jobs, best docs
  ✗ Vue      - Easier learning curve, but smaller community
  ✗ Angular  - Too complex for this scale
  ✗ Svelte   - Innovative, but immature ecosystem
```

**Tooling Choice:**
- Used **Vite** instead of Create React App
  - Vite: 10-100x faster build times
  - CRA: Slower, more opinionated

**Project Structure:**
[frontend/src/](../../../frontend/src/) directory shows React best practices

---

### Architectural Decision 5: API Structure

**Decision:** RESTful API (not GraphQL or gRPC)

**Rationale:**
```
REST Advantages for this project:
  ✅ Simpler to learn & implement
  ✅ Better caching (use HTTP cache headers)
  ✅ Standard HTTP status codes
  ✅ Perfect for CRUD operations
  ✅ Built-in security (CORS, HTTPS)

GraphQL Advantages (but not needed):
  - Fine-grained data queries
  - Perfect for complex relationships
  - But adds complexity for simple CRUD

Decision: REST is appropriate for this project scale
```

**URL Structure:**
```
Resource-based endpoints:
  GET    /api/anime           (list)
  GET    /api/anime/:id       (detail)
  POST   /api/anime           (create)
  PUT    /api/anime/:id       (update)
  DELETE /api/anime/:id       (delete)
```

---

### Architectural Decision 6: Error Handling

**Decision:** Centralized error handler middleware

**Rationale:**
```
Without centralized handler:
  ❌ Every controller catches errors -> inconsistent responses
  ❌ Hard to add global error handling
  ❌ Difficult to log all errors

With centralized handler:
  ✅ Consistent error response format
  ✅ Easy to add logging/monitoring
  ✅ One place to modify error behavior
```

**Implementation:**
[middleware/errorHandler.js](../../../middleware/errorHandler.js)

```javascript
// All errors follow this format:
{
  success: false,
  message: "Human-readable error",
  status: 400|401|404|500
}
```

---

## 🎯 Decision Making Process Used

For each major decision:

1. **Identify Requirements** - What does the project need?
2. **List Options** - What are the alternatives?
3. **Compare Trade-offs** - Pros/cons of each
4. **Choose Best Fit** - Considering team skills, timeline, scale
5. **Implement** - Follow best practices for chosen solution
6. **Document** - Why this choice was made

---

## 📊 Summary Table

| Decision | Choice | Why | Alternative |
|---|---|---|---|
| Backend Framework | Express.js | Simple, industry standard | Fastify, NestJS |
| Database | MySQL | Relational data perfect | MongoDB, PostgreSQL |
| Authentication | JWT + Bcrypt | Stateless, scalable | Sessions, OAuth |
| Frontend | React | Largest ecosystem | Vue, Angular |
| API Style | REST | Simple for CRUD | GraphQL, gRPC |
| Error Handling | Centralized middleware | Consistency | Per-controller handling |

---

## ✅ Conclusion

**Each decision:**
- ✅ Was intentional (not accidental)
- ✅ Is justified (documented rationale)
- ✅ Follows industry standards (not experimental)
- ✅ Is appropriate for project scale
- ✅ Can be explained to stakeholders
