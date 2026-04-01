# 4️⃣ Leeruitkomst: Veilige Code

**Wat heb ik bereikt:**  
Ik schrijf veilige code d.m.v. kritisch nadenken en toepassen van authenticatie, autorisatie, validatie en foutafhandeling.

---

## 📋 Bewijsstuk 1: Authenticatie & Autorisatie

### ✅ Bewijs
- JWT implementation code
- Bcrypt password hashing
- Protected routes middleware
- Authorization checks

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**PASSWORD HASHING (Veilig)**
```javascript
// models/userModel.js
static async create(username, email, password) {
  // ✅ Password NOOIT plaintext opslaan!
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const [result] = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );
  return result.insertId;
}
```

**JWT TOKEN GENERATIE**
```javascript
// controllers/authController.js
const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**PROTECTED ROUTES**
```javascript
// middleware/authMiddleware.js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();
```

---

## 📋 Bewijsstuk 2: Validatie & Foutafhandeling

### ✅ Bewijs
- Input validatie regels
- SQL injection preventie
- Error messages

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**INPUT VALIDATIE**
```javascript
// validators/animeValidator.js
exports.validateAnimeName = (name) => {
  if (!name) return 'Anime name is required';
  if (typeof name !== 'string') return 'Name must be a string';
  if (name.trim().length < 3) return 'Name min 3 chars';
  return null;
};
```

**SQL INJECTION PREVENTIE**
```javascript
// ✅ GOED - Prepared statements
const [users] = await db.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
// Parameter binding is veilig!
```

---

## 📋 Bewijsstuk 3: Foutafhandeling

### ✅ Bewijs
- Error handler middleware
- Appropriate HTTP status codes
- User-friendly error messages

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**CENTRALIZED ERROR HANDLER**
```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  // ✅ Log error
  console.error('[ERROR]', err.message);
  
  // ✅ Database error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'This item already exists'
    });
  }
  
  // ✅ Default: generic error
  res.status(500).json({
    success: false,
    message: 'An error occurred'
  });
};
```

---

## 🎯 Feedback Ontvangen

### Van Timo:
[Nog in te vullen na feedback ontvangen]

---

## 🎯 Checklist Leeruitkomst 4

- [ ] Authentication code (JWT + bcrypt)
- [ ] Authorization middleware
- [ ] Validation examples
- [ ] SQL injection prevention
- [ ] Error handling
- [ ] HTTP status codes
- [ ] Feedback van Timo ontvangen

**Status:** ⏳ In Progress

---

## 💡 Reflectie

Wat heb ik geleerd?
- Veiligheid is een proces, niet een feature
- Defense in depth: meerdere lagen
- Never trust user input

Wat was moeilijk?
- [Vul in na feedback]
