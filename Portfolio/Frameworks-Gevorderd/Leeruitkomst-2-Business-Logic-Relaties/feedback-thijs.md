# Code Review — Thijs (`BookController.php`)

**Reviewer:** Justin  
**Datum:** 16 juni 2026  
**Bestand:** `BookController.php`

---

## ✅ Wat goed is

- Nette, **consistente structuur** — alle methodes volgen hetzelfde patroon.
- Goede gebruik van `$request->validate()` in meerdere methodes.
- `review()` checkt eerst of de `UserBook` bestaat vóór hij update — correct en veilig.
- Gebruik van `updateOrCreate` in `updateProgress` is slim en clean.

---

## ⚠️ Verbeterpunten

### 1. `User::find(Auth::id())` is een onnodige extra query

```php
$user = User::find(Auth::id()); // doet twee database-queries
```

Laravel biedt `auth()->user()` of `$request->user()` — dat geeft direct de ingelogde user terug vanuit de sessie, zonder extra databasehit.

**Advies:**

```php
$user = $request->user();
// of:
$user = auth()->user();
```

---

### 2. `store()` gebruikt `$request->all()` — mass assignment risico

```php
return Book::create($request->all());
```

Als iemand een extra veld meestuurt (zoals `id` of `user_id`), wordt dat ook opgeslagen. Dit is een bekend beveiligingsrisico genaamd *mass assignment*.

**Advies:** gebruik `$request->only()` met de velden die je écht verwacht:

```php
return Book::create($request->only(['title', 'author', 'total_pages']));
```

Of zorg dat `$fillable` in het `Book`-model exact is ingesteld.

---

### 3. `addToList` heeft geen check op duplicaten

```php
$user->books()->attach($bookId);
```

`attach()` maakt altijd een nieuwe rij aan — ook als het boek al in de lijst staat. Twee keer dezelfde aanroep = twee rijen in de pivot-tabel.

**Advies:** gebruik `syncWithoutDetaching()` om duplicaten te voorkomen:

```php
$user->books()->syncWithoutDetaching([$bookId]);
```

---

### 4. Geen 404-afhandeling in `addToList`

```php
public function addToList($bookId)
{
    $user = $request->user();
    $user->books()->attach($bookId);
    ...
}
```

Als `$bookId` niet bestaat in de database, gooit Laravel een fout zonder duidelijke melding richting de gebruiker.

**Advies:**

```php
$book = Book::findOrFail($bookId); // gooit automatisch een 404 als niet gevonden
```

---

### 5. Ontbrekende namespace en imports

Het bestand begint direct met `class BookController` — geen `namespace` of `use`-statements zichtbaar. Mogelijk afgeknipt, maar voor een volledige controller hoort dit erbij:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\UserBook;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
```

**Advies:** controleer altijd of alle gebruikte classes ook geïmporteerd zijn bovenaan het bestand.

---

### 6. Inconsistente inspringing

In `updateProgress` en `review` klopt de inspringing van `validate` niet:

```php
public function updateProgress(Request $request, $bookId)
{
      $request->validate([   // ← te veel spaties
    'current_page' => 'required|integer|min:0',
      ]);
```

**Advies:** gebruik een PHP code formatter zoals **Laravel Pint** of **PHP-CS-Fixer** om dit automatisch op te lossen.

---

## 📝 Samenvatting

| Punt | Beoordeling |
|---|---|
| Input validatie | ✅ Aanwezig |
| Consistente responses | ✅ Grotendeels JSON |
| Beveiligingschecks | ⚠️ Mass assignment via `$request->all()` |
| Naamgeving | ✅ Netjes en consistent |
| Geen debug code in productie | ✅ Schoon |
| Efficiënt gebruik van Laravel | ⚠️ Onnodige extra query via `User::find(Auth::id())` |
| Duplicate prevention | ❌ Ontbreekt bij `addToList` |
