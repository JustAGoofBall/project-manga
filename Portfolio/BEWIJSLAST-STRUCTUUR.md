# 📁 Bewijslast Structuur - Portfolio

## Nieuwe Opzet Per Leeruitkomst

```
Portfolio/vak/Leeruitkomst-X/
├── Feedbackvragen.md          ← BEWIJSLAST #1: Vragen met links naar code
└── bewijslast/                ← BEWIJSLAST #2: Visuele & aanvullende bewijzen
    ├── screenshots/           (test output, coverage, endpoints)
    ├── diagrams/              (ERD, architectuur, flow)
    └── logs/                  (test results, build output)
```

---

## 🎯 Feedbackvragen.md = Bewijslast

**Type**: Vragen + Code Links + Metrieke

Elke vraag bevat:
- 📌 **Bewijslast in Project**: [routes/anime.js](../../..), [tests/anime.test.js](../../..) 
- 📊 **Metrics**: "60+ tests", "85% coverage", "30+ endpoints"
- 📝 **Evidence Files**: Links naar concrete code/tests

**Voordeel**: Docenten kunnen direct in code kijken, interactief, up-to-date

---

## 📸 bewijslast/ Folder = Visuele Bewijzen

Per leeruitkomst andere bewijven nodig:

### API-Basis
```
bewijslast/
├── screenshots/
│   ├── endpoints-list.png          # Screenshot van alle endpoints
│   ├── test-results.png            # npm test output
│   ├── test-coverage-report.png    # coverage/lcov-report screenshot
│   └── postman-collection.png      # API requests screenshot
├── diagrams/
│   ├── api-endpoints-tree.png      # Alle endpoints visueel
│   └── request-response-flow.png   # Request/response diagram
└── logs/
    ├── test-output.txt             # Volledige test output
    └── coverage-report.json        # Coverage metrieke
```

### Orientatie-Frameworks
```
bewijslast/
├── diagrams/
│   ├── MVC-architecture.png        # MVC structuur diagram
│   ├── express-react-flow.png      # Backend-frontend communicatie
│   └── database-schema.png         # ER diagram
├── screenshots/
│   ├── framework-features-used.png # Express/React features
│   └── project-structure.png       # Folder structuur
└── code-examples/
    ├── middleware-example.md       # Code snippet van middleware
    └── component-example.md        # React component snippet
```

### Frameworks-Gevorderd
```
bewijslast/
├── screenshots/
│   ├── test-coverage-80%.png       # Coverage rapport
│   ├── test-cases-breakdown.png    # Alle tests categorieën
│   ├── security-features.png       # Bcrypt, JWT, validation
│   └── code-quality-metrics.png    # ESLint, structure
├── diagrams/
│   ├── layered-architecture.png    # Models/Controllers/Routes
│   ├── database-relations.png      # Database relaties
│   └── security-flow.png           # Auth flow diagram
└── logs/
    ├── full-test-results.txt       # 60+ tests passing
    └── coverage-full-report.json   # Detailed coverage
```

---

## 🎬 Hoe Screenshot Maken?

### Coverage Report PNG
```powershell
# 1. Open coverage/lcov-report/index.html in browser
# 2. Print/Screenshot
# 3. Save als bewijslast/screenshots/coverage.png
```

### Test Output PNG
```powershell
# 1. npm test
# 2. Screenshot terminal met alle tests groen ✓
# 3. Save als bewijslast/screenshots/test-results.png
```

### Database Schema
```sql
-- Exporteer schema.sql als image
-- Of maak diagram in: dbdiagram.io, lucidchart, draw.io
-- Export als PNG
```

---

## 📋 Per Leeruitkomst: Minimale Bewijslast

| Leeruitkomst | Feedbackvragen.md | Screenshots | Diagrams | Logs |
|---|---|---|---|---|
| API-Basis-1 | ✅ Links naar endpoints/controllers | Test output | Endpoint tree | - |
| API-Basis-2 | ✅ Links naar models/queries | Query example | Database schema | - |
| API-Basis-3 | ✅ Links naar frontend/API | Frontend integration | Flow diagram | - |
| API-Basis-4 | ✅ Links naar tests | Coverage report | Test breakdown | test.txt |
| Orientatie-1 | ✅ Links naar Express/React | Framework comparison | MVC diagram | - |
| Orientatie-2 | ✅ Links naar docs usage | Code examples | - | - |
| Orientatie-3 | ✅ Links naar models/queries | Query examples | Database schema | - |
| Orientatie-4 | ✅ Links naar architecture | Patterns used | MVC diagram | - |
| Orientatie-5 | ✅ Links naar README/comments | Trade-offs table | Architecture | - |
| Orientatie-6 | ✅ Links naar progression | Project stages | Timeline | - |
| Frameworks-1 | ✅ Links naar tests | Coverage report | Test categories | test-results.txt |
| Frameworks-2 | ✅ Links naar relaties | Schema diagram | ER diagram | - |
| Frameworks-3 | ✅ Links naar layers | Code example | Layer diagram | - |
| Frameworks-4 | ✅ Links naar security | Security checklist | Auth flow | - |
| Frameworks-5 | ✅ Links naar code quality | Code metrics | Patterns | - |

---

## ✅ Action Items

**Per Leeruitkomst:**
1. ✅ Feedbackvragen.md (DONE - jij hebt dit al!)
2. ⬜ Maak `bewijslast/` folder
3. ⬜ Screenshot coverage/test output
4. ⬜ Maak diagram (MVC, ERD, flow, etc.)
5. ⬜ Voeg relevante logs toe

---

## 💡 Pro Tip

**Feedbackvragen.md is het startpunt:**
- Docent leest vraag
- Klikt op link → ziet code/test
- Ziet ook screenshot/diagram in bewijslast/
- Kan meteen feedback geven: "Goed bij deze metric, beter bij die metric"

= **Sterker bewijsvoering** ✨
