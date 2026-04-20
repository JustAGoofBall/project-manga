# 🔒 Leeruitkomst 4: Veilige Code

## Wat Ik Toon
Ik demonstreer dat ik **veilige code** schrijf door:
- JWT tokens voor authenticatie
- Bcrypt voor password hashing
- Input validatie (geen invalid data naar DB)
- Error handling (geen gevoelige info leaked)
- SQL injection prevention (parameterized queries)
- Rate limiting (brute force protection)

**Bewijs:**
- Security checklist met all implemented
- Test cases voor auth/validation
- Code voorbeelden van security patterns
- Production-ready security

## Hoe Dit In Mijn Project Zichtbaar Is
- **Auth:** JWT in [middleware/authMiddleware.js](../../../middleware/authMiddleware.js)
- **Passwords:** Bcrypt in [models/userModel.js](../../../models/userModel.js)
- **Validation:** [validators/](../../../validators/) per feature
- **Error Handling:** [middleware/errorHandler.js](../../../middleware/errorHandler.js)
- **Demonstratie:** Zie [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md)
