# 🗂️ Opruiminstructies - Portfolio Herstructurering

## ✅ NIEUW: Wat je houdt

**Per leeruitkomst folder:**
```
Leeruitkomst-X/
├── Feedbackvragen.md          ← ENIGE .md file (vragen + code links)
└── bewijslast/
    ├── README.md              ← Gids wat erin moet
    ├── screenshots/           ← PNG/JPG files
    ├── diagrams/              ← PNG/JPG files  
    └── logs/                  ← TXT/JSON files
```

---

## 🗑️ OUD: Files om te archiveren

Deze files zijn verouderd en kunnen weg:

```
❌ BEWIJS.md              → In Feedbackvragen.md (linkjes naar code)
❌ Bewijslast.md          → In bewijslast/ folder
❌ Feedback.md            → Docent vult dit in
⚠️ Motivatie.md           → Optioneel houden of archiveren
❌ Feedbackvragen         → Oude file zonder extension (leeg)
```

---

## 📋 Hoe Opruimen?

### Optie 1: Delete (als je zeker bent)
```powershell
# Per folder (in PowerShell in de leeruitkomst folder)
rm BEWIJS.md, Bewijslast.md, Feedback.md, Motivatie.md
```

### Optie 2: Archive (veiliger - als je later wilt teruggaan)
```powershell
# 1. Maak archive folder in Portfolio/
mkdir Portfolio/_archive

# 2. Move oude files
mv Portfolio/API-Basis/Leeruitkomst-1/*/@(BEWIJS|Bewijslast|Feedback|Motivatie).md Portfolio/_archive/

# 3. Alle oude files zijn nu in _archive/
```

### Optie 3: Per folder (handmatig)
1. Open folder in Explorer
2. Delete: `BEWIJS.md`, `Bewijslast.md`, `Feedback.md`, `Motivatie.md`
3. Houd: `Feedbackvragen.md` + `bewijslast/` folder

---

## ⚡ Snelle Cleanup (Aanbevolen)

**Verwijder per vak:**
- API-Basis/ (alle 4 leeruitkomsten)
- Orientatie-Frameworks/ (alle 6 leeruitkomsten)
- Frameworks-Gevorderd/ (alle 5 leeruitkomsten)

Van elke folder: **alleen deze files VERWIJDEREN:**
- ❌ Bewijslast.md
- ❌ BEWIJS.md  
- ❌ Feedback.md
- ❌ Motivatie.md
- ❌ Feedbackvragen (oude file zonder .md)

**Alles ander laten staan** (Feedbackvragen.md + bewijslast/ folder)

---

## ✓ Check na Cleanup

Elke leeruitkomst folder moet hiermee uitzien:
```
✓ Feedbackvragen.md          (vragen + code links)
✓ bewijslast/
  ✓ README.md
  ✓ screenshots/ (empty, ready for your PNG/JPG)
  ✓ diagrams/   (empty, ready for your diagrams)
  ✓ logs/       (empty, ready for your logs)
```

---

**Klaar om to doen? DIT KAN JE ZELF DOEN ZONDER CODE EDITS!**
