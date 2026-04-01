# Bewijslast Leeruitkomst 5: Keuzes Uitleggen aan Stakeholders

## Projecten

(1) Lit, J. (2026). Project Manga - Technical decisions documented in README & code comments.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Framework Selection Documented**
    - README.md "Tech Stack" section
    - Why Express (lightweight, proven, good testing)
    - Why React (component-based, performant, large ecosystem)
    - Alternatives compared (Django vs Express, Vue vs React)
    - Trade-offs: "Express is lightweight, Django is feature-rich"

(3) **Architecture Decisions**
    - MVC Pattern: `/Portfolio/Orientatie-Frameworks/Leeruitkomst-4-Structural-Design-Pattern/Motivatie.md`
    - JWT Auth: `/Portfolio/Orientatie-Frameworks/Leeruitkomst-1-Backend-UI-Framework-Oriëntatie/Motivatie.md`
    - Rate Limiting: `/index.js` (configured with comments)
    - Error Handling: `/middleware/errorHandler.js` (centralized)

(4) **Security Implementations**
    - Password hashing: `/models/userModel.js` (bcrypt with 10 rounds)
    - JWT tokens: `/middleware/authMiddleware.js` (token verification)
    - Input validation: `/validators/` directory
    - CORS configuration: `/index.js`

(5) **Communication Evidence**
    - Code comments explain WHY not just WHAT
    - README explains tech choices for non-technical readers
    - Architecture documentation for technical readers
    - Test descriptions explain implementation

(6) **Decision Trade-offs Documented**
    - File: `/Portfolio/Orientatie-Frameworks/Leeruitkomst-5-Keuzes-Uitleggen-Stakeholders/Motivatie.md`
    - JWT vs Sessions comparison
    - MVC vs Monolith comparison
    - Express vs Django comparison
    - React vs Vue comparison

## Demonstration

- Can explain to non-tech manager: "Why React?"
  → "Makes the website responsive like Netflix"

- Can explain to developer: "Why JWT?"
  → "Stateless, scales to multiple servers, no session storage needed"

## Feedback

[Nog in te vullen door Timo & Samir]
