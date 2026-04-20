# ❓ Feedbackvragen - Leeruitkomst 5: Keuzes Uitleggen Stakeholders

## Vraag 1: Technische Keuzes Communicatie
**Hoe effectief kan ik mijn technische keuzes uitleggen aan non-technische stakeholders?**

### 📌 Bewijslast in Project:
- **README.md**: [README.md](../../../../README.md) - features, architecture, quick start (non-tech friendly)
- **Portfolio Docs**: [portfolio docs/](../../../../portfolio%20docs/) - MVC-STRUCTUUR.md, AUTH-GUIDE.md (uitleggen hoe het werkt)
- **Comments in Code**: JSDoc style comments in [controllers/](../../../../controllers/), [middleware/](../../../../middleware/)
- **Features Explained**: Duidelijk gelistte endpoints en wat ze doen
- **Business Value**: API features mapped naar user needs (ratings, favorites, search)

### Vragen:
- Kan ik duidelijk maken waarom bepaalde technische keuzes beter zijn voor business?
- Hoe zou ik dit in een zakelijke setting presenteren aan non-developers?
- Welke metrics kan ik gebruiken om keuzes te justificeren?

---

## Vraag 2: Trade-offs & Compromissen
**Hoe goed weeg ik trade-offs af bij design decisions?**

### 📌 Bewijslast in Project:
- **Framework Keuze**: Express (lightweight) vs Spring/Django (heavier) - trade-off = speed vs features
- **Auth Strategy**: JWT (stateless, scalable) vs sessions (simpler, state-managed)
- **Database**: Direct SQL (performance, lower abstraction) vs ORM (safety, higher abstraction)
- **Frontend**: React SPA vs server-rendered (trade-off = complexity vs performance)
- **Testing**: Jest+Supertest (API testing) vs Selenium (e2e browser testing)

### Vragen:
- Welke compromissen heb ik gemaakt en waarom waren deze nodig?
- Zou ik bepaalde keuzes anders maken met meer informatie of resources?
- Hoe beweeg ik de voor- en nadelen af?

---

*Sturen naar: Docent Orientatie-Frameworks*
