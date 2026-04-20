# 📝 Structuur: Feedbackvragen vs Feedback

## 🎯 TL;DR

```
Leeruitkomst-X/
├── Feedbackvragen.md      ← JIJ vraagt (vragen + code links)
├── Feedback.md            ← DOCENT antwoordt
└── bewijslast/
    └── ...
```

---

## 📋 Feedbackvragen.md

**Jij schrijft dit:**
- Vragen over je code/werk
- Links naar bewijsstukken (code, tests, etc)
- Metrics/stats
- **Geen antwoorden van docent!**

**Voorbeeld inhoud:**
```markdown
# ❓ Feedbackvragen - Leeruitkomst 1

## Vraag 1: Hoe goed voldoen endpoints aan RESTful?

### 📌 Bewijslast:
- [routes/anime.js](../../..)
- [tests/anime.test.js](../../..)
- 30+ endpoints, 85% coverage

### Vragen:
- Zijn routes correct gestructureerd?
- Klopt de implementatie?
```

---

## 💬 Feedback.md

**Docent vult dit in:**
- Antwoorden op jouw vragen
- Sterke punten
- Verbeterpunten
- Concrete tips
- Cijfer/score (optioneel)

**Template die jij nu aanmaakt:**

```markdown
# 💬 Feedback - Leeruitkomst 1: API's Bouwen

*Ingevuld door: [Docent naam]*  
*Datum: [Datum]*

---

## Vraag 1: REST Endpoints

### 📍 Response Docent:

**Goed gedaan:**
- [Docent antwoord/feedback]
- [Sterke punten]

**Kan beter:**
- [Verbeterpunten]
- [Concrete tips]

**Cijfer/Score:** [8/10 of ja/nee/voldoende/onvoldoende]

---

## Vraag 2: Error Handling

### 📍 Response Docent:

**Goed gedaan:**
- [...]

**Kan beter:**
- [...]

**Cijfer/Score:** [...]

---

## 📌 Algemene Opmerkingen

[Docent schrijft hier algemene feedback/reflectie]

---

## ✅ Checklist voor Docent

- [ ] Alle vragen beantwoord
- [ ] Sterke punten vermeld
- [ ] Verbeterpunten concrete gemaakt
- [ ] Volgende stappen duidelijk

*Ingevuld op: [datum]*
```

---

## 🔄 Workflow

### 1️⃣ VÓÓr Feedback (jij)
```
Feedbackvragen.md
├── Vraag 1: [Vraag tekst]
│   └── Bewijslast: [code links]
└── Vraag 2: [Vraag tekst]
    └── Bewijslast: [code links]
```

### 2️⃣ Docent Antwoordt
- Print of screenshot Feedbackvragen.md
- Vult Feedback.md in
- Geeft score/beoordeling

### 3️⃣ JIJ documenterent
- Copy docent feedback naar Feedback.md
- Of docent vult direct in Feedback.md

---

## 💡 Best Practice

**Beide files tegelijk hebben = professioneel**

### Voor Docent:
- **Feedbackvragen.md** = "Dit moet jij beoordelen" (checklist)
- **Feedback.md** = "Dit heb ik opgeschreven" (documentatie)

### Voor Jou Later:
- **Feedbackvragen.md** = Wat ik vroeg
- **Feedback.md** = Wat zij zeiden
- **Beide samen** = Volledig bewijsvoering dat je feedback hebt gekregen

---

## 📌 Actie: Maak Feedback.md per Leeruitkomst

**Template file aanmaken per leeruitkomst:**

```powershell
# Per leeruitkomst folder een leeg Feedback.md
# Met deze structuur:

# 💬 Feedback - Leeruitkomst X

*Ingevuld door: [Docent]*  
*Datum: [Datum]*

---

## Vraag 1: [Vraag van jou]

### 📍 Response Docent:
- Goed: ...
- Beter: ...
- Score: ...

## Vraag 2: [Vraag van jou]

### 📍 Response Docent:
- Goed: ...
- Beter: ...
- Score: ...

## Algemene Opmerkingen
...
```

---

## ✅ Final Structure

```
Leeruitkomst-X/
├── Feedbackvragen.md      ← Jouw vragen (DONE ✓)
├── Feedback.md            ← Docent response (TEMPLATE hieronder)
└── bewijslast/
    ├── README.md
    ├── screenshots/
    ├── diagrams/
    └── logs/
```

Beide files = **Bewijs dat je constructieve feedback hebt**! 🎓
