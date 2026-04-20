# ❓ Feedbackvragen - Leeruitkomst 5: Code Review & Feedback

## Vraag 1: Code Quality & Best Practices
**Hoe goed volg ik JavaScript/Node.js best practices?**

### 📌 Bewijslast in Project:
- **Code Style**: Consistent formatting, meaningful variable names
- **Comments**: JSDoc style comments in [controllers/](../../../../controllers/) en [models/](../../../../models/)
- **Error Handling**: try/catch in [controllers/](../../../../controllers/), centralized in [middleware/errorHandler.js](../../../../middleware/errorHandler.js)
- **Naming**: camelCase, descriptive names (getAllAnime, validateAnimeName, etc.)
- **Structure**: Organized folders, no god objects, single responsibility
- **Node Best Practices**: Proper async/await, middleware pattern, modular exports
- **Linting**: Could benefit from ESLint for code consistency

### Vragen:
- Zijn er code smells of anti-patterns die ik gemist heb?
- Hoe kan ik mijn code leesbaarder en maintainability beter maken?
- Zou ik ESLint/Prettier setup moeten hebben?
- Waar zijn performance bottlenecks?

---

## Vraag 2: Feedback Implementatie & Iteratie
**Hoe goed kan ik feedback ontvangen en toepassen?**

### 📌 Bewijslast in Project:
- **Progress**: Visible improvements from start (simple CRUD) to finish (complex API with tests)
- **Testing**: Added tests → shows feedback integration
- **Documentation**: README + comments → iteration on clarity
- **Code Refactoring**: MVC structure → suggests prior code review/refactoring
- **Feedback Form**: [Portfolio/Frameworks-Gevorderd/FEEDBACK-FORMULIER-VOOR-SAMIR.md](../../../../Portfolio/Frameworks-Gevorderd/FEEDBACK-FORMULIER-VOOR-SAMIR.md)
- **Openness**: Actively asking for feedback here

### Vragen:
- Wat zou jullie top 3 feedback punten zijn voor deze codebase?
- Hoe kan ik mijn codereview skills verbeteren?
- Welke feedback zou het meeste ROI hebben voor volgende project?
- Hoe kan ik beter in teams werken met code review?

---

*Sturen naar: Docent Frameworks-Gevorderd / Timo & Samir*
