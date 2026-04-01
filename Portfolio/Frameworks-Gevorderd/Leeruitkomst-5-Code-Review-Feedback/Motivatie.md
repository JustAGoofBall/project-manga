# Leeruitkomst 5: Code Review & Feedback

## Motivatie

Ik kan kritisch naar code kijken en hier constructieve feedback op geven. Dit vereist technische kennis, diplomatie, en het willen helpen anderen beter te worden.

### Waarom Code Reviews?

**Voordelen:**
- ✅ Bugs opsporen voor productie
- ✅ Kennisdeling in team
- ✅ Best practices toepassen
- ✅ Nieuwe ideeën introduceren
- ✅ Code quality verbeteren

### Code Review Checklist

**1. Functionaliteit**
```
[ ] Doet de code wat het moet doen?
[ ] Zijn edge cases afgehandeld?
[ ] Zijn error cases afgehandeld?
[ ] Zijn alle acceptatiecriteria vervuld?
```

**2. Code Quality**
```
[ ] Zijn namen duidelijk en beschrijvend?
[ ] Zijn functies klein en gefocust?
[ ] Is er DRY principe toegepast (no duplication)?
[ ] Is er SOLID principe toegepast?
```

**3. Performance**
```
[ ] Zijn queries optimized?
[ ] Geen N+1 query problemen?
[ ] Zijn loops efficient?
[ ] Geheugen beheer OK?
```

**4. Security**
```
[ ] Input validatie aanwezig?
[ ] SQL injection voorkomen?
[ ] Authorization checks?
[ ] Senastive data secure?
```

**5. Testing**
```
[ ] Zijn unit tests aanwezig?
[ ] Is coverage hoog genoeg?
[ ] Zijn edge cases getest?
```

**6. Maintainability**
```
[ ] Zijn comments nodig en goed?
[ ] Zijn logs descriptief?
[ ] Is error handling robuust?
```

### Feedback Geven: Constructief

**Positieve Start:**
```
✅ GOED:
"Nice implementation of the search feature!"

❌ SLECHT:
"This search code is terrible."
```

**Specifieke Observatie:**
```
✅ GOED:
"In line 45, the N+1 query issue can be solved with a JOIN."

❌ SLECHT:
"Your queries are slow."
```

**Voorstel in plaats van kritiek:**
```
✅ GOED:
"Consider using a LEFT JOIN here instead of multiple queries.
See anime.js line 32 for an example pattern we use elsewhere."

❌ SLECHT:
"This is wrong, do it differently."
```

**Motivatie geven:**
```
✅ GOED:
"Adding validation here prevents invalid data in database
and provides better error messages to users."

❌ SLECHT:
"You need validation."
```

### Code Review Voorbeeld

**Code Review I Gave:**

```
REVIEW: favoriteController.js

✅ STRENGTHS:
- Clear error handling ✓
- Proper authorization checks ✓
- Consistent response format ✓

📝 OBSERVATIONS:
1. Line 12: Query can be optimized with index on (user_id, anime_id)
   - Currently: SELECT * FROM favorites WHERE user_id = ? AND anime_id = ?
   - With index: Same logic, faster lookup
   
2. Line 18: Missing validation for anime_id
   - Consider: if (!Number.isInteger(req.params.id)) return 400;
   - See animeController.js for pattern
   
3. Line 25: Error message could be more specific
   - Current: "Error occurred"
   - Better: "Favorite already exists"
   
✅ SUGGESTIONS:
- Add test for duplicate favorite scenario
- Consider pagination if user has 10k+ favorites
- Database index recommendation for performance

Overall: 👍 Good work! With small tweaks this is production-ready.
```

**Code Review I Received:**

```
FEEDBACK ON: authController.js (from Timo)

✅ GOOD POINTS:
- JWT implementation secure ✓
- Error handling thorough ✓
- Registration validation comprehensive ✓

📝 IMPROVEMENT OPPORTUNITIES:
1. Password strength check
   - Current: length only
   - Better: Check uppercase, numbers, special chars
   - See npm package 'password-validator'
   
2. Rate limiting
   - Currently: No rate limit on login
   - Vulnerable to: Brute force attacks
   - Solution: Add express-rate-limit middleware
   
3. Test coverage
   - Currently: 70% coverage on auth tests
   - Goal: 90%+ (add edge case tests)

WHAT I DID:
✅ Added password strength validation using regex
✅ Implemented rate limiting: 5 login attempts per 15 min
✅ Added 8 more test cases → 90% coverage
```

### Learning from Feedback

**Feedback Received → Improvements Made**

| Feedback | My Response | Result |
|----------|------------|--------|
| Add password strength check | Used regex for uppercase/numbers/special chars | More secure |
| Rate limiting missing | Implemented express-rate-limit | Brute force protected |
| Low test coverage | Added edge case tests | 70% → 90% coverage |
| Confusing error messages | Made messages user-friendly | Better UX |
| Database queries slow | Added indexes, used JOINs | Performance improved |

### Giving Quality Feedback

✅ **DO:**
- Be specific (line numbers, code samples)
- Explain WHY (not just WHAT)
- Suggest solutions (not problems)
- Praise good work
- Ask questions (not statements)
- Review promptly
- Be respectful

❌ **DON'T:**
- Be vague ("this is bad")
- Be harsh ("this is terrible")
- Nitpick formatting only
- Ignore good work
- Downvote without explanation
- Take forever to review
- Be disrespectful

### Code Review Outcome

**Before Reviews:**
- Code: Individual work, potential issues hidden
- Team: Knowledge silos
- Quality: Varies greatly

**After Reviews:**
- Code: Tested by multiple eyes, issues caught early
- Team: Shared knowledge, learning together
- Quality: Consistently high standards

### My Code Review Philosophy

> "The goal is not to judge, but to help.
> Good code is written as a team, not individuals."

### Bewijslast

Zie bewijslast (1), (2), (3)
