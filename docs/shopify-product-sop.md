# SOP: Dodavanje parfema u Shopify Admin

## 1. Osnovni podaci proizvoda

| Polje | Opis | Primjer |
|-------|------|---------|
| **Title** | Naziv parfema | `Sauvage Eau de Parfum` |
| **Vendor** | Brend (koristi se za filter) | `Dior` |
| **Description** | Opis parfema | Tekst opisa |
| **Product Type** | Tip proizvoda | `Perfume` |

---

## 2. Varijante (Size = veličina)

Dodaj **Option name**: `Size`

| Vrijednost | Format |
|------------|--------|
| `30ml` | |
| `50ml` | |
| `75ml` | |
| `100ml` | |
| `150ml` | |

Za svaku varijantu postavi **Price** i **Compare at price** (ako ima popust).

---

## 3. Tagovi (OBAVEZNO za filtere)

Dodaj tagove u polje **Tags** koristeći sljedeći format:

| Kategorija | Format taga | Vrijednosti |
|------------|-------------|-------------|
| **Spol** | `gender_*` | `gender_men`, `gender_women`, `gender_unisex` |
| **Tip parfema** | `type_*` | `type_EDP`, `type_EDT`, `type_Parfum`, `type_Extrait` |
| **Sezona** | `season_*` | `season_summer`, `season_spring`, `season_autumn`, `season_winter` |
| **Signature** | `signature_true` | Samo ako je dio signature kolekcije |

### Primjer tagova za jedan proizvod:
```
gender_men, type_EDP, season_summer
```

---

## 4. Slike

- Prva slika = glavna slika proizvoda
- Dodaj do 5 slika za galeriju

---

## 5. Checklist prije objave

- [ ] Vendor (brend) ispravno upisan
- [ ] Varijante s veličinama (30ml, 50ml, itd.)
- [ ] Cijene za sve varijante
- [ ] Tag za spol: `gender_men` / `gender_women` / `gender_unisex`
- [ ] Tag za tip: `type_EDP` / `type_EDT` / `type_Parfum`
- [ ] Tag za sezonu (opcionalno): `season_summer` itd.
- [ ] Tag `signature_true` (ako pripada signature kolekciji)
- [ ] Barem jedna slika

---

## 6. Automatsko svrstavanje

Kada su tagovi ispravno postavljeni, proizvod se automatski pojavljuje u:

| Kolekcija | Uvjet |
|-----------|-------|
| Muški parfemi | `gender_men` tag |
| Ženski parfemi | `gender_women` tag |
| Unisex parfemi | `gender_unisex` tag |
| Signature kolekcija | `signature_true` tag |
| Ljetna kolekcija | `season_summer` tag |
| Bestselleri | Automatski po prodaji |
| Novo | Automatski po datumu objave |

---

## 7. Napomene

- **Metafields** se mogu koristiti za dodatne informativne podatke (notes_family, itd.), ali **NE koriste se za filtriranje**
- Svi filteri rade isključivo preko **tagova** i **vendor** polja
- Veličina (Size) je **varijanta**, ne tag
