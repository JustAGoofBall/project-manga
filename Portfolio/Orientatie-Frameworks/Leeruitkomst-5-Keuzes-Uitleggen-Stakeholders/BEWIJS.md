# 5️⃣ Leeruitkomst: Keuzes & Technische Implementaties Helder Uitleggen

**Wat heb ik bereikt:**  
Ik kan mijn keuzes, ontwerpbeslissingen en technische implementaties helder uitleggen aan zowel technische als niet-technische stakeholders.

---

## 📋 Bewijsstuk 1: Frameworkkeuzes Uitgelegd (Voor Iedereen Begrijpelijk)

### ✅ Bewijs
- Technical choices explained clearly
- Both technical & non-technical audience
- Trade-offs considered
- Professional communication

### 📝 Mijn Uitleg

---

## **KEUZE 1: Express.js als Backend Framework**

### 🎯 **Für Stakeholders (Niet-technisch):**

**"Waarom Express.js?"**

Express.js is het `meest gebruikte platform` voor het bouwen van APIs in JavaScript. Het is als het `WordPress van Node.js` - zeer betrouwbaar en stabiel.

**Voordelen voor het project:**
- ✅ **Betrouwbaarheid** - Miljoenen websites gebruiken het
- ✅ **Snelheid** - Zeer snel response times
- ✅ **Ondersteuning** - Groot community, veel tutorials
- ✅ **Onderhoud** - Makkelijk voor toekomstige developers

**Kosten-baten:**
- Cost: Gratis, open-source
- Benefit: Professional, production-ready application
- Risk: Laag - zeer stabiel framework

---

### 💻 **Voor Technici (Technisch):**

**Technische voordelen:**
- Middleware-based architecture (composable pipelines)
- Express Router for modular routing
- Easy integration with middleware libraries
- Lightweight (~40kb) with no bloat
- Excellent performance under load

**Trade-offs made:**
```
Alternative: Django (Python)
❌ Overkill for simple API
❌ Different team skill set
❌ Heavier framework

Alternative: Fastify (Node.js)
❌ Newer, less battle-tested
❌ Smaller community
❌ vs Express: Similar performance

CHOSEN: Express.js
✅ Best community support
✅ Easy to learn & extend
✅ Stable & predictable
✅ Project timeline friendly
```

---

## **KEUZE 2: React.js als Frontend Framework**

### 🎯 **Für Stakeholders (Niet-technisch):**

**"Waarom React?"**

React is het `meest populaire framework` voor websites-die-je-aanklikt. Het maakt de website `snel` en `responsief` - als je knop klikt, reageert direct.

**Voordelen:**
- ✅ **Gebruikersexperiëntie** - Zeer snel en smooth
- ✅ **Professioneel** - Gebruikt door Netflix, Facebook, Instagram
- ✅ **Ondersteuning** - Enorme community & jobs
- ✅ **Toekomstbestendig** - Actief developed, altijd updates

---

### 💻 **Voor Technici (Technisch):**

**Architectural Advantages:**
- Component-based architecture (reusability)
- Virtual DOM optimization (performance)
- Declarative UI (clear intent)
- React Router v6 (dynamic routing)
- Context API (state management without Redux)
- React DevTools (excellent debugging)

**Performance Analysis:**
```javascript
// Virtual DOM prevents unnecessary re-renders
const MemoizedComponent = React.memo(MyComponent);

// Effects run efficiently
useEffect(() => {
  fetchData(); // Only on mount
}, []); // Empty dependency = run once

// Lazy loading for code splitting
const AdminPanel = React.lazy(() => import('./AdminPanel'));
```

**Trade-offs:**
```
Alternative: Vue.js
✅ Easier learning curve
❌ Smaller ecosystem
❌ Fewer job opportunities

Alternative: Svelte
❌ Newer, less mature
❌ Smaller community
❌ vs React: Niche adoption

CHOSEN: React
✅ Industry standard
✅ Best job market
✅ Largest community
✅ Most libraries/tools
```

---

## **KEUZE 3: SQLite + bessere-sqlite3 als Database**

### 🎯 **Fur Stakeholders:**

**"Waarom SQLite?"**

SQLite is het "Excel-spreadsheetje" van databases - alles in één bestand, makkelijk om mee te werken, perfect voor middelgrote projecten.

**Voordelen:**
- ✅ **Eenvoudig** - Geen setup vereist
- ✅ **Zeker** - Alle data in één veilig bestand
- ✅ **Snel genoeg** - Voor dit project meer dan voldoende

---

### 💻 **For Developers:**

**Technical Rationale:**
- File-based (portable, easy backup)
- ACID compliance (data integrity)
- Foreign key constraints supported
- SQL syntax identical to MySQL/PostgreSQL (future migration easy)
- better-sqlite3 provides synchronous API (simpler code)

**Deployment scenario:**
```
Development: SQLite ✓
Staging: SQLite or PostgreSQL ✓
Production: PostgreSQL or MySQL (drop-in replacement)

Migration path exists if needed:
SQLite → PostgreSQL migration trivial
(SQL syntax 99% compatible)
```

---

## 📋 Bewijsstuk 2: Architectuurkeuzes Uitgelegd

### ✅ Bewijs
- Architecture choices explained
- Benefits demonstrated
- Trade-offs acknowledged

### 📝 Mijn Uitleg

---

## **ARCHITECTUURKEUZE: MVC Pattern**

### 🎯 **Fur Stakeholders:**

**"Waarom MVC architecture?"**

MVC is als een restaurant met drie afdelingen:
- 🔵 **Keuken (Model)** - Maakt het eten (data)
- 🟢 **Bediening (Controller)** - Neemt orders an, stuurt naar keuken
- 🟡 **Tafels (View)** - Waar klanten hun eten eten

Duidelijk afdelingen = duidelijk verantwoordelijkheden = minder chaos.

**Voordelen:**
- ✅ **Onderhoudbaar** - Makkelijk bugs fixen
- ✅ **Schaalbaar** - Makkelijk features toevoegen
- ✅ **Teamable** - Developers kunnen parallel werken
- ✅ **Toekomstbestendig** - Standaard industrie

---

### 💻 **For Developers:**

**Decoupling Benefits:**

```javascript
// Model (Database layer) - Testable in isolation
class AnimeModel {
  static async create(name) {
    // Only database logic
    return db.insert('INSERT INTO anime ... ');
  }
}

// Can test without Express:
const newId = await AnimeModel.create("Naruto");
assert(newId > 0);

---

// Controller (Business logic) - Can mock Model
class AnimeController {
  static async createAnime(req, res) {
    const id = await AnimeModel.create(req.body.name);
    res.json({ id });
  }
}

// Can test with mocked Model:
const mockModel = { create: () => 42 };
const req = { body: { name: 'Test' } };
const res = { json: (data) => ... };
await AnimeController.createAnime(req, res);

---

// Route (URL mapping) - Maps URLs to Controller
router.post('/anime', AnimeController.createAnime);

// Complete separation = high testability
```

---

## **IMPLEMENTATIEKEUZE: JWT Authentication**

### 🎯 **Fur Stakeholders:**

**"Waarom JWT voor login?"**

JWT is als een "bezoekerskaartje" dat je krijgt als je binnenkomt:
- Je laat je ID zien (login)
- We geven je een kaartje
- Je toont het kaartje bij elke deur
- Kaartje verloopt na een week

**Voordelen:**
- ✅ **Veilig** - Kan niet vervalst worden
- ✅ **Handig** - Geen database-lookups nodig
- ✅ **Modern** - Standaard voor mobiele apps
- ✅ **Stateless** - Server hoeft niet alles te onthouden

---

### 💻 **For Developers:**

**Implementation Details:**

```javascript
// Login: Generate JWT
const user = await User.getByEmail(email);
const isValid = await bcrypt.compare(password, user.password_hash);

if (isValid) {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token });
}

// Protected request: Verify JWT
const token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // Now available for controller

// Token expires: Must re-login (security feature)
// Refresh token pattern (optional): Use refresh tokens
```

**Security Trade-offs:**

```
JWT Pros:
✅ Stateless (scalable to multiple servers)
✅ No session storage needed
✅ Self-contained (user info in token)
✅ Easy for mobile apps / SPAs

JWT Cons:
❌ Revocation is harder (token stays valid until expiry)
❌ Token size can be larger than session ID

Alternative: Sessions
✅ Easier revocation
❌ Stateful (doesn't scale as well)
❌ Requires session storage

CHOSEN: JWT
✅ Better for modern SPAs
✅ Better for mobile apps
✅ Simpler deployment
✅ More secure for this use case
```

---

## 📋 Bewijsstuk 3: Security Decisions Explained

### ✅ Bewijs
- Security choices justified
- Risk/benefit analysis shown
- Best practices applied

### 📝 Mijn Uitleg

---

## **SECURITY CHOICE 1: Password Hashing**

### 🎯 **Fur Stakeholders:**

**"We hash alle wachtwoorden"**

Wachtwoorden worden "gemengd" met zout - zelfs wij kunnen de originele wachtwoorden niet zien. Dit beschermt jóu als onze database gehackt wordt.

---

### 💻 **For Developers:**

```javascript
// Registration - Hash password
const hashedPassword = await bcrypt.hash(password, 10);
// 10 = "rounds" (difficulty factor)
// Result: $2b$10$N9qo8uLO... (irreversible)

// Login - Compare with hash
const isMatch = await bcrypt.compare(inputPassword, user.password_hash);
// Returns true/false without revealing password

// Cannot be reversed:
// Password hash =/=> Original password
// bcrypt is designed to be slow = brute force resistant
```

**Trade-off:**
```
Stronger: bcrypt with 12 rounds
❌ Slower (good for security, bad for performance)
✅ More resistant to brute force

Chosen: bcrypt with 10 rounds
✅ ~100ms per hash (acceptable)
✅ Still highly secure
✅ Performance vs security balance
```

---

## **SECURITY CHOICE 2: Rate Limiting**

### 🎯 **Fur Stakeholders:**

**"We beperken hoe veel requests per minuut"**

Rate limiting is als "max 5 pogingen om in te loggen per 15 minuten". Dit stopt hackers die miljoenen wachtwoorden automatisch proberen.

---

### 💻 **For Developers:**

```javascript
// General limit: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: () => process.env.NODE_ENV !== 'production'
});

// Auth limit: Stricter - 10 per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);
```

---

## **TESTING DECISION: Jest + Supertest**

### 🎯 **Fur Stakeholders:**

**"We testen alles automatisch"**

60+ automatische tests draaien elke keer als code changed. Dit wekt op als code kapot gaat - vóór het naar production gaat.

---

### 💻 **For Developers:**

```javascript
// Jest - Testing framework
describe('POST /api/auth/login', () => {
  it('should return token on valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should fail with invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'wrong' });
    
    expect(response.status).toBe(401);
  });
});

// Supertest - API testing helper
// Makes HTTP requests in tests
// Tests actual request/response cycle
// 60+ tests all passing = confidence in code
```

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Wat Ik Geleerd Heb:**

1. **Technical decisions need business justification**
   - Not just "because it's cool"
   - Real trade-offs exist
   - Best choice depends on context

2. **Communication is key**
   - Explain to techies differently than stakeholders
   - Both need to understand WHY
   - Shows professional thinking

3. **Security matters**
   - Many choices I made were security-focused
   - JWT vs sessions, hashing, rate limiting
   - Security is not optional

4. **Architecture influences everything**
   - MVC wasn't random choice
   - Made code testable & maintainable
   - Scaling up later will be easier

**Vaardigheden Opgebouwd:**
- ✅ Technical decision making
- ✅ Risk/benefit analysis
- ✅ Stakeholder communication
- ✅ Professional justification
- ✅ Security awareness
