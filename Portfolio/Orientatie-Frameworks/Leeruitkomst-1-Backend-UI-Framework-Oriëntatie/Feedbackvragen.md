# ❓ Feedbackvragen - Leeruitkomst 1: Oriëntatie Backend- & UI-Frameworks

## Vraag 1: Framework Keuzes Justificatie
**Waarom zijn Express.js en React.js de juiste frameworks voor mijn project?**

### 📌 Bewijslast in Project:
- **Express Backend**: [index.js](../../../../index.js) - Express setup met middleware
- **React Frontend**: [frontend/src/App.jsx](../../../../frontend/src/App.jsx), [frontend/package.json](../../../../frontend/package.json)
- **Architecture**: MVC patroon met [routes/](../../../../routes/), [controllers/](../../../../controllers/), [models/](../../../../models/)
- **Features**: REST API (30+ endpoints), Authentication, Database relaties
- **Production Ready**: Error handling, logging, testing, security

### Vragen:
- Zijn Express en React optimale keuzes voor dit anime API project?
- Welke alternatieven had ik overwogen en waarom zijn Express/React beter?
- Hoe schalen deze frameworks naar grotere projecten?

---

## Vraag 2: Framework Integration
**Hoe goed werken Express en React samen in mijn applicatie?**

### 📌 Bewijslast in Project:
- **Backend-Frontend Split**: [/](../../../../) root project (backend) + [/frontend](../../../../frontend/) (React SPA)
- **API Communication**: Frontend fetch calls naar `http://localhost:3000/api/` endpoints
- **Auth Flow**: JWT tokens tussen Express backend en React frontend
- **CORS Setup**: [index.js](../../../../index.js) - CORS middleware configured
- **Deployment Ready**: Separate servers die onafhankelijk schalen

### Vragen:
- Is de scheiding tussen frontend en backend duidelijk?
- Hoe kan ik de communicatie tussen Express en React nog beter structureren?
- Zou ik een API gateway of BFF pattern moeten gebruiken?

---

*Sturen naar: Docent Orientatie-Frameworks*
