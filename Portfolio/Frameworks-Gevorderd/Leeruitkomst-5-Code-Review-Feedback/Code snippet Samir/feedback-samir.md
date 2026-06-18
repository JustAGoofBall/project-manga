# Code Review — Samir (`ListController.php`)

**Reviewer:** Justin  
**Datum:** 16 juni 2026  
**Bestand:** `ListController.php`

---

## ✅ Wat goed is

- **Ownership checks** zijn aanwezig bij gevoelige acties (`assignMaterial`, `removeMaterialFromList`) — goed beveiligingsinstinct.
- `deleteList` gebruikt Eloquent netjes met een dubbele WHERE-check (id + owner) in één query.
- Comments leggen uit *waarom* iets gedaan wordt, niet alleen *wat* — dat is waardevolle documentatiestijl.

---

## ⚠️ Verbeterpunten

### 1. Debug code in productie

```php
public function createList(Request $request) {
    $listsModel = new MainList;
    $gen = $listsModel->createList();
    dd($request->user()); // ← hoort hier niet thuis
}
```

`dd()` is een debug-tool en mag nooit in productie-code staan. Als dit ooit live gaat, crasht de volledige response op dit punt. Daarnaast wordt `$gen` aangemaakt maar nergens gebruikt — dode code.

**Advies:** verwijder `dd()` en verwerk de return-waarde van `createList()` correct.

---

### 2. Geen input validatie

Bijna alle methoden lezen rechtstreeks van `$request->...` zonder te valideren:

```php
$values = ['List_name' => $request->List_name, 'List_type' => $request->List_type, ...];
```

Dit kan leiden tot ongeldige data in de database of onverwachte fouten.

**Advies:** gebruik `$request->validate([...])` zoals Laravel dat bedoelt:

```php
$request->validate([
    'List_name'  => 'required|string|max:255',
    'List_type'  => 'required|string',
    'List_color' => 'nullable|string',
]);
```

---

### 3. Inconsistente naamgeving

Methodes wisselen tussen `camelCase` en `snake_case`:

| Methode | Stijl |
|---|---|
| `addList` | camelCase |
| `input_test` | snake_case |
| `fetchLists` | camelCase |

Ook variabelenamen zijn inconsistent: `$listsModel`, `$AssignedMaterialModel`, `$model` — allemaal voor hetzelfde patroon.

**Advies:** gebruik overal `camelCase` voor methodes en variabelen — dat is de PSR-12 PHP standaard en de Laravel conventie.

---

### 4. `changeNote` staat buiten de class

```php
} // ← einde van ListController

function changeNote(Request $request) { ... } // ← losse globale functie!
```

Dit is een serieuze bug. `changeNote` is een globale PHP-functie geworden in plaats van een class-methode. Laravel kan dit nooit via routing aanroepen als controller-actie.

**Advies:** verplaats de functie naar binnen de class als methode.

---

### 5. Inconsistente response types

Sommige methodes returnen een plain string, andere een `response()->json()`:

```php
return 'An error has occured';           // string
return response()->json(['message' => 'List deleted']); // JSON
```

**Advies:** kies één stijl. Bij een API altijd `response()->json()` gebruiken, ook bij succesmeldingen.

---

### 6. Onjuiste boolean-vergelijking

```php
if ($materialCheck && $listCheck == true)
```

Door operator-precedentie wordt dit geëvalueerd als `$materialCheck && ($listCheck == true)` — `$materialCheck` wordt dus niet expliciet gecheckt.

**Advies:**

```php
if ($materialCheck === true && $listCheck === true)
```

---

## 📝 Samenvatting

| Punt | Beoordeling |
|---|---|
| Input validatie | ❌ Ontbreekt grotendeels |
| Consistente responses | ❌ Mix van string en JSON |
| Beveiligingschecks (ownership) | ✅ Aanwezig |
| Naamgeving | ⚠️ Inconsistent |
| Geen debug code in productie | ❌ `dd()` aanwezig |
| Alle code binnen de class | ❌ `changeNote` staat buiten de class |
