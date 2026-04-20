# 🎯 Efficiency Clusters - Overlappende Leeruitkomsten

**Doel:** Vragen per docent efficiënt bundelen door overlap te gebruiken. Je bent niet hetzelfde dubbel aan het toelichten.

---

## 📊 CLUSTER 1: Testing & Code Quality
**Tegelijk afvinken:** ✅ **API-Basis L4** + **Frameworks-Gevorderd L1** + **Frameworks-Gevorderd L5**

**Wie?** API-Basis docent + 1 gesprek met Frameworks-Gevorderd docent

**Dezelfde bewijslast:**
- **JUnit/Jest test output** → screenshots van `npm test` (60+ tests, 85% coverage)
  - [tests/anime.test.js], [tests/auth.test.js], [tests/errors.test.js]
- **Coverage rapport** → `coverage/lcov-report/index.html` screenshot
- **Test organisatie** → Folder structure in `/tests/` toont aanpak
- **Code review feedback** → Verbetering van test coverage na feedback integratie

**Vragen stapelen:**
- API-Basis L4: "Hoe goed zijn mijn automatische tests doorgevoerd?"
- Frameworks-Gevorderd L1: "Zijn mijn tests goed geautomatiseerd en georganiseerd?"
- Frameworks-Gevorderd L5: "Hoe heb ik feedback over test quality geïntegreerd?"

---

## 📊 CLUSTER 2: Database Design & Relaties
**Tegelijk afvinken:** ✅ **API-Basis L2** + **Orientatie-Frameworks L3** + **Frameworks-Gevorderd L2**

**Wie?** Alle 3 docenten kunnen dezelfde database evidence zien

**Dezelfde bewijslast:**
- **Database schema** → [schema.sql] toont 1-to-many (anime-characters) + many-to-many (user-favorites)
- **Models implementatie** → [models/animeModel.js], [models/characterModel.js], [models/favoriteModel.js]
- **Query optimalisatie** → efficient data fetching

**Vragen stapelen:**
- Orientatie-Frameworks L3: "Hoe gebruik ik het framework om relaties goed te beheren?"
- Frameworks-Gevorderd L2: "Hoe goed zijn mijn business logic relaties ingecapsuleerd?"

---

## 📊 CLUSTER 3: Security & Authentication
**Tegelijk afvinken:** ✅ **API-Basis L2** + **Frameworks-Gevorderd L4**

**Wie?** API-Basis docent + Frameworks-Gevorderd docent

**Dezelfde bewijslast:**
- **JWT token implementatie** → [config/db.js], [middleware/authMiddleware.js]
- **Password hashing** → bcrypt in [models/userModel.js]
- **Authorization checks** → Permission validation in [controllers/]
- **Security tests** → [tests/auth.test.js] (JWT verify, password validation)
- **SQL injection protection** → Query parameterization in models

**Vragen stapelen:**
- API-Basis L2: "Zijn mijn authentication endpoints goed beveiligd?"
- Frameworks-Gevorderd L4: "Hoe veilig zijn mijn JWT tokens en permissions ingecapsuleerd?"

Zelfde authMiddleware code/tests toont veiligheid aan voor beide leeruitkomsten, toen ik de test deed.

---

## 📊 CLUSTER 4: Architecture & Code Organization
**Tegelijk afvinken:** ✅ **Orientatie-Frameworks L4** + **Frameworks-Gevorderd L3**

**Wie?** Orientatie-Frameworks docent + Frameworks-Gevorderd docent

**Dezelfde bewijslast:**
- **MVC folder structuur** → [routes/], [controllers/], [models/] layout
- **Lagenarchitectuur diagram** → Plaats in `bewijslast/diagrams/` (eenmalig)
- **Dependency injection** → Hoe models/controllers/routes gekoppeld zijn
- **Error handling centralized** → [middleware/errorHandler.js], [middleware/logger.js]

**Vragen stapelen:**
- Orientatie-Frameworks L4: "Is het structuur van de mvc correct of moet ik ergens nog op letten wat ik misschien mis?"
- Frameworks-Gevorderd L3: "Ben ik in mijn project consistent? of moet ik op een andere wijze werken van structuur."


---

## 📊 CLUSTER 5: Documentation & Communication
**Tegelijk afvinken:** ✅ **API-Basis L3** + **Orientatie-Frameworks L2** + **Orientatie-Frameworks L5**

**Wie?** API-Basis docent + Orientatie-Frameworks docent

**Dezelfde bewijslast:**
- **API documentatie** → [README.md] endpoints lijst, request/response examples
- **Guide documenten** → [AUTH-GUIDE.md], [portfolio docs/MVC-STRUCTUUR.md]
- **Code comments** → JSDoc style in [controllers/], [models/]
- **Framework justificatie** → Waarom Express? Waarom React? (doc in `bewijslast/diagrams/`)
- **Trade-off analyse** → Database choices, framework keuzes uitgelegd

**Vragen stapelen:**
- API-Basis L3: "is mijn README goed gedocumenteerd?"
- Orientatie-Frameworks L2: "Hoe goed heb ik documentatie begrepen en toegepast?"
- Orientatie-Frameworks L5: "Zijn mijn ontwerp keuzes valid die ik heb gemaakt voor het project?"

💡 **Efficiencytip:** README.md + AUTH-GUIDE.md gebruikt voor alle 3. Eenmalige framework justificatie doc.

---

## 📊 CLUSTER 6: Framework Keuzes & Decision Analysis
**Tegelijk afvinken:** ✅ **Orientatie-Frameworks L1** + **Orientatie-Frameworks L5**

**Wie?** Orientatie-Frameworks docent (zelfs gesprek!)

**Dezelfde bewijslast:**
- **Framework vergelijking** → Express vs Spring, React vs Vue analyse
- **Trade-off documenten** → Performance, complexity, learning curve
- **Architectural keuzes** → MongoDB vs SQLite, JWT vs Session reasoning

**Vragen stapelen:**
- Orientatie-Frameworks L1: "Hoe goed heb ik backend/UI frameworks geëvalueerd?"
- Orientatie-Frameworks L5: "Hoe goed kan ik mijn framework keuzes rechtvaardigen?"

💡 **Efficiencytip:** Dit zijn bijna dezelfde vragen! Combineer in 1 gesprek.

---

## 📊 CLUSTER 7: Feedback & Learning Cycle
**Tegelijk afvinken:** ✅ **Orientatie-Frameworks L6** + **Frameworks-Gevorderd L5**

**Wie?** Orientatie-Frameworks docent + Frameworks-Gevorderd docent

**Dezelfde bewijslast:**
- **Feedback verwerking logboek** → Voor/na code samples, git commits met verbeteringen
- **Leerproces reflectie** → Hoe je feedback hebt ingecorporeerd
- **Iteratieve verbetering** → Code reviews → code changes → tests → repeat

**Vragen stapelen:**
- Orientatie-Frameworks L6: "Heb ik goed mijn feedback verwerkt?"
- Frameworks-Gevorderd L5: "Hoe goed kan ik code review feedback implementeren?"

💡 **Efficiencytip:** Dezelfde feedback verwerking logboek voor beide leeruitkomsten

---

## 🗓️ DOCENT-PLANNING: Hoe effeciënt langs gaan

### **Gesprek 1: API-Basis Docent** (1x)
- **Leeruitkomsten:** L1, L2, L3, L4 (sequentieel, basis opbouwend)
- **Duration:** ~30-45 min
- **Clusters die raken:** Testing, Database, Security, Documentation
- **Bewijslast:** Alle 4 Feedbackvragen.md + screenshot van `npm test`, schema.sql

### **Gesprek 2: Orientatie-Frameworks Docent** (1x)
- **Leeruitkomsten:** L1-L6 (alle 6)
- **Duration:** ~45-60 min
- **Clusters die raken:** Database, Architecture, Documentation, Framework Keuzes, Feedback Cycle
- **Bewijslast:** Alle 6 Feedbackvragen.md + MVC diagram, framework justificatie doc
- **Tip:** L1+L5 kunnen combinerend behandeld worden

### **Gesprek 3: Frameworks-Gevorderd Docent** (1x)
- **Leeruitkomsten:** L1, L2, L3, L4, L5 (alle 5)
- **Duration:** ~45-60 min
- **Clusters die raken:** Testing, Database, Security, Architecture, Feedback Cycle
- **Bewijslast:** Alle 5 Feedbackvragen.md + coverage screenshot, lagenarchitectuur diagram
- **Tip:** L1+L5 kunnen gezamenlijk over testing/feedback gaan

---

## ✅ BEWIJSLAST-HERGEBRUIK CHECKLIST

Plaats deze files in bewijslast mappen (eenmalig):

- [ ] **ER-Diagram.png** → Cluster 2, 3
- [ ] **MVC-Architecture.png** → Cluster 4
- [ ] **Framework-Justificatie-Doc.md** → Cluster 5, 6
- [ ] **npm-test-coverage-screenshot.png** → Cluster 1
- [ ] **JUnit-Test-Output.png** → Cluster 1
- [ ] **Feedback-Verwerking-Log.md** → Cluster 7
- [ ] **Database-Optimization-Query-Examples.sql** → Cluster 2

**Voordeel:** In plaats van 15 aparte bewijslast sets, kun je veel files doen in ~6 sets en refereren naar dezelfde proof.

---

## 💡 EFFICIENCY TIPS

1. **Zelfde screenshot, meerdere docenten:** Plaats test output screenshot in 1 bewijslast map, maak shortcut/referentie in andere maps
2. **Cross-reference in Feedbackvragen.md:** "Zie ook Frameworks-Gevorderd L5 voor dezelfde bewijslast"
3. **Zelf dezelfde toelichting:** Je hoeft de MVC architectuur niet 2x uit te leggen - docenten begrijpen verwijzing
4. **Docent weet van overlap:** Zeg van te voren "deze vragen hebben overlap met ander vak"

---

## 🎯 VOORDEEL BEREKENING

- **Standaard:** 15 leeruitkomsten = 15 aparte gesprekken / materiaalpakketten
- **Met clusters:** 15 leeruitkomsten = 3 docent-gesprekken met smart bundeling
- **Materiaalreductie:** ~60% minder screenshots/diagrams nodig (veel hergebruik)
- **Tijdreductie:** ~40% sneller afgewerkt

