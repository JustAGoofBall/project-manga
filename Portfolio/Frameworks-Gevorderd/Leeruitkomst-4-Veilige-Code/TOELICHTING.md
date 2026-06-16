# 🔒 Leeruitkomst 4: Veilige Code
*Ik schrijf veilige code d.m.v. kritisch nadenken en toepassen van authenticatie, autorisatie, validatie en foutafhandeling.*

## Wat Ik Toon
Ik demonstreer dat ik **veiligheid op alle lagen** implementeer:
- **Authentication:** JWT tokens (7-day expiry, signed secret)
- **Authorization:** Role-based access control (admin flag, user ownership checks)
- **Password Security:** Bcrypt hashing (10 salt rounds, never plaintext)
- **Input Validation:** Whitelist validation before database
- **SQL Injection Prevention:** Parameterized queries (no string interpolation)
- **Error Handling:** No sensitive information leaked
- **Test Coverage:** Security scenarios tested (20+ security tests)

**Statistieken:**
- **Protection Layers:** 5 (JWT, Bcrypt, Parameterized Queries, Validation, Error Handling)
- **Security Tests:** 20+ tests for auth/validation/authorization
- **Vulnerabilities:** 0 known (OWASP Top 10 covered)

## Hoe Dit In Mijn Project Zichtbaar Is
- **JWT Authentication:** [middleware/authMiddleware.js](../../../middleware/authMiddleware.js) - Token verification & expiry
- **Password Hashing:** [models/userModel.js](../../../models/userModel.js) - Bcrypt with 10 salt rounds
- **Input Validation:** [validators/](../../../validators/) (5 validators) - Whitelist validation
- **SQL Injection Prevention:** All models use parameterized queries
- **Authorization:** [routes/](../../../routes/) - Admin-only routes & user ownership checks
- **Error Handling:** [middleware/errorHandler.js](../../../middleware/errorHandler.js) - Consistent, safe responses
- **Tests:** [tests/auth.test.js](../../../tests/auth.test.js) + [tests/errors.test.js](../../../tests/errors.test.js)
- **Demonstratie:** Zie [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md) voor complete implementation checklist
