# Leeruitkomst 5: Keuzes & Technische Implementaties Helder Uitleggen

## Motivatie

Ik kan mijn technische keuzes en implementaties helder uitleggen aan zowel technische als niet-technische stakeholders. Dit is essentieel voor professioneel samenwerken.

### Frameworkkeuzes Uitgelegd

**Express.js Keuze**
- Voor stakeholders: "Het meest betrouwbare platform voor APIs in JavaScript"
- Voor technici: "Middleware architecture, excellent middleware ecosystem, proven at scale"
- Trade-off: "Lightweight vs feature-rich - Express is light, Django is feature-rich"

**React.js Keuze**
- Voor stakeholders: "Maken websites super responsief, gebruikt door Netflix & Facebook"
- Voor technici: "Virtual DOM, component reusability, largest ecosystem for frontend"
- Trade-off: "Learning curve vs community - React steeper but more jobs/resources"

### Architectuurkeuzes

**MVC Pattern**
- **Waarom?** Scheiden van verantwoordelijkheden = cleaner code
- **Impact:** Testen makkelijker, onderhoud sneller, teamwork efficiënter
- **Alternatief:** Monolith architecture (alles in één file)

**JWT Authentication**
- **Waarom?** Stateless, perfect voor SPAs/mobile apps
- **Impact:** Schaalbaarheid naar meerdere servers
- **Alternatief:** Session cookies (stateful, harder to scale)

### Security Decisions

**Password Hashing (bcrypt)**
- **Waarom?** Plaintext passwords = grote risico
- **Hoe?** Elk wachtwoord hashed met 10 rounds (securefast balance)
- **Onderbouwing:** Industry standard, battle-tested

**Rate Limiting**
- **Waarom?** Bescherming tegen brute force attacks
- **Implementatie:** 10 req/15min op login, 100 req/15min op API
- **Bewijs:** Hackers kunnen niet miljoen wachtwoorden proberen

**Input Validation**
- **Waarom?** SQL injection, XSS prevention
- **Hoe?** Alle inputs gevalideerd voor type/length
- **Voorbeeld:** Anime name moet string zijn, min 1 char, max 100

### Technical Decisions Documented

All decisions are:
- ✅ **Bewust:** Deliberately chosen (not random)
- ✅ **Verantwoord:** Reasoned with trade-offs
- ✅ **Gedocumenteerd:** In code, README, portfolio
- ✅ **Testen:** Validated with 60+ tests
- ✅ **Communiceerbaar:** Can explain to anyone

**Bewijslast:** Zie bewijslast (1), (2), (3), (4), (5)
