# Leeruitkomst 4: Veilige Code

## Motivatie

Ik schrijf veilige code door kritisch na te denken over en het toepassen van authenticatie, autorisatie, validatie en foutafhandeling. Dit vereist security awareness en best practices.

### Security Pyramid

```
                    ╱╲
                   ╱  ╲ Foutafhandeling
                  ╱────╲
                 ╱      ╲ Validatie
                ╱────────╲
               ╱          ╲ Autorisatie
              ╱────────────╲
             ╱              ╲ Authenticatie
            ╱────────────────╲
```

### 1. Authenticatie (Users Identificeren)

**Secure Password Hashing:**

```javascript
// ✅ GOED: Hash with bcrypt
const bcrypt = require('bcrypt');
const passwordHash = await bcrypt.hash(password, 10);
// costRounds=10 balans tussen security & speed

// ❌ SLECHT: Plaintext
const db = await db.query('INSERT INTO users VALUES (?, ?)', [email, password]);
```

**JWT Tokens:**

```javascript
// ✅ GOED: Signed tokens
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,  // Keep secret!
  { expiresIn: '7d' }       // Token expiry
);

// ❌ SLECHT: No expiry, compromised token forever
```

**Token Storage:**

```javascript
// ✅ GOED: localStorage (reasonable for SPA)
localStorage.setItem('token', token);

// ❌ SLECHT: Global var (exposed in console)
window.token = token;
```

### 2. Autorisatie (Users Autoriseren)

**Role-Based Access Control:**

```javascript
// ✅ GOED: Check role before action
exports.createAnime = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  // Create anime...
};

// ❌ SLECHT: No role check
exports.createAnime = async (req, res, next) => {
  // Create anime (anyone can!)
};
```

**Protected Routes Middleware:**

```javascript
// ✅ GOED: Verify token on protected routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false });
  }
};
```

### 3. Validatie (Input Santizing)

**Type Validation:**

```javascript
// ✅ GOED: Validate type
exports.validateAnimeName = (name) => {
  if (typeof name !== 'string') {
    return 'Name must be string';
  }
  return null;
};

// ❌ SLECHT: Assume correct type
const name = req.body.name;
db.query('INSERT INTO anime (name) VALUES (?)', [name]);
```

**Length Validation:**

```javascript
// ✅ GOED: Validate length
if (name.trim().length < 3 || name.length > 255) {
  return res.status(400).json({ message: 'Name must be 3-255 chars' });
}

// ❌ SLECHT: No length check
db.query('INSERT INTO anime (name) VALUES (?)', [name]);
```

**SQL Injection Prevention:**

```javascript
// ✅ GOED: Prepared statements (parameterized queries)
const [result] = await db.query(
  'SELECT * FROM users WHERE email = ?',  // ? is placeholder
  [email]                                  // parameters separate
);

// ❌ SLECHT: String concatenation (SQL injection!)
const [result] = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
// If email = `'; DROP TABLE users; --` = disaster!
```

**XSS Prevention (Frontend):**

```javascript
// ✅ GOED: React auto-escapes by default
<div>{animalName}</div>  // Safe, escaped

// ❌ SLECHT: Using dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: animalName }} />
```

### 4. Foutafhandeling

**Informative Errors (For Debugging):**

```javascript
// Log technical details for debugging
console.error('[ERROR]', {
  timestamp: new Date(),
  message: error.message,
  stack: error.stack,
  userId: req.user?.id
});
```

**Safe Error Responses (For Users):**

```javascript
// ✅ GOED: Generic message to user
res.status(500).json({
  success: false,
  message: 'An error occurred. Please try again.'
});

// ❌ SLECHT: Exposing technical details
res.status(500).json({
  success: false,
  message: 'Database connection failed at 192.168.1.1:3306'
});
```

**Graceful Degradation:**

```javascript
// ✅ GOED: Catch errors, continue safely
try {
  const result = await risky operation();
  res.json({ success: true, data: result });
} catch (error) {
  // Don't crash! Handle gracefully
  res.status(500).json({ success: false });
}

// ❌ SLECHT: Unhandled exception crashes server
const result = await riskyOperation();  // Crash if fails!
res.json({ success: true, data: result });
```

### Security Checklist

✅ **Authentication**
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens with expiry
- [ ] Token verification on protected routes

✅ **Authorization**
- [ ] Role checks (admin, user)
- [ ] Resource ownership checks
- [ ] Middleware enforces auth

✅ **Validation**
- [ ] Input type checking
- [ ] Length constraints
- [ ] Format validation (email, phone)

✅ **SQL Injection**
- [ ] Prepared statements always
- [ ] Parameters separate from SQL

✅ **Error Handling**
- [ ] No technical details in responses
- [ ] Logging for debugging
- [ ] Graceful degradation

✅ **HTTPS**
- [ ] All production traffic encrypted
- [ ] No secrets in URLs

✅ **Environment**
- [ ] Secrets in .env (not git)
- [ ] Dependencies up-to-date
- [ ] Regular security audits

### Common Vulnerabilities Prevented

| Vulnerability | Prevention |
|---------------|-----------|
| Weak passwords | Password hashing (bcrypt) |
| Brute force | Rate limiting, account lockout |
| Session hijacking | JWT expiry, HTTPS |
| SQL injection | Prepared statements |
| XSS attacks | Input/output escaping |
| CSRF | CSRF tokens (if applicable) |
| Unauthorized access | Authorization checks |
| Data leaks | Input validation, error handling |

### Bewijslast

Zie bewijslast (1), (2), (3), (4), (5)
