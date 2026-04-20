# ❓ Feedbackvragen - Leeruitkomst 4: Veilige Code

## Vraag 1: Security Best Practices
**Hoe goed staan mijn security measures op?**

### 📌 Bewijslast in Project:
- **Password Hashing**: [controllers/authController.js](../../../../controllers/authController.js) - bcrypt with salt rounds
- **JWT Tokens**: [middleware/authMiddleware.js](../../../../middleware/authMiddleware.js) - JWT verification + expiration
- **SQL Injection Protection**: [models/](../../../../models/) - Parameterized queries (? placeholders)
- **Authorization**: [routes/anime.js](../../../../routes/anime.js) - adminMiddleware on PUT/POST/DELETE
- **Error Handling**: [middleware/errorHandler.js](../../../../middleware/errorHandler.js) - doesn't expose sensitive info
- **CORS**: [index.js](../../../../index.js) - CORS configured
- **Input Validation**: [validators/](../../../../validators/) - prevents XSS, injection

### Vragen:
- Waar zijn nog vulnerabilities in mijn code? (SQL injection, XSS, CSRF?)
- Heb ik alle edge cases van security afgedekt?
- Hoe kan ik mijn authentication/authorization nog verbeteren?

---

## Vraag 2: Secrets & Sensitive Data Management
**Hoe beveilig ik gevoelige data en environment variables?**

### 📌 Bewijslast in Project:
- **Environment Usage**: JWT_SECRET in [middleware/authMiddleware.js](../../../../middleware/authMiddleware.js) uit process.env
- **.env Pattern**: Code expects .env file (not in git)
- **Error Messages**: [controllers/](../../../../controllers/) - generic error messages, geen stack traces exposed
- **Logging**: [middleware/logger.js](../../../../middleware/logger.js) - logs without sensitive data
- **Database Config**: [config/db.js](../../../../config/db.js) - connection details uit process.env

### Vragen:
- Exposeer ik secrets ergens in mijn code of logs?
- Hoe kan ik environment setup beter documenteren?
- Welke additional security measures zou ik moeten implementeren?
- Zou ik dependency scanning moeten gebruiken?

---

*Sturen naar: Docent Frameworks-Gevorderd / Timo & Samir*
