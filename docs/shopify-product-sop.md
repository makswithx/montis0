# SOP: Dodavanje parfema u Shopify Admin

## 1. Osnovni podaci proizvoda

| Polje | Opis | Primjer |
|-------|------|---------|
| **Title** | Naziv parfema | `Sauvage Eau de Parfum` |
| **Vendor** | Brend (koristi se za filter) | `Dior` |
| **Description** | Opis parfema | Tekst opisa |
| **Product Type** | Samo informativno, NE koristi se za filtere | `Perfume` |

---

## 2. Varijante (Size = veličina)

Dodaj **Option name**: `Size`

| Vrijednost |
|------------|
| `30ml` |
| `50ml` |
| `75ml` |
| `100ml` |
| `150ml` |

Za svaku varijantu postavi **Price** i **Compare at price** (ako ima popust).

⚠️ **VAŽNO**: Veličina je ISKLJUČIVO varijanta. **NE dodavati tagove poput `size_50`!**

---

## 3. Tagovi (OBAVEZNO za filtere)

Dodaj tagove u polje **Tags** koristeći **lowercase** format:

| Kategorija | Format taga | Vrijednosti |
|------------|-------------|-------------|
| **Spol** | `gender_*` | `gender_men`, `gender_women`, `gender_unisex` |
| **Tip parfema** | `type_*` | `type_edp`, `type_edt`, `type_parfum`, `type_extrait` |
| **Sezona** | `season_*` | `season_summer`, `season_spring`, `season_autumn`, `season_winter` |
| **Signature** | `signature_true` | Samo ako je dio signature kolekcije |

### ⚠️ VAŽNO: Konzistentnost formata

- ✅ Koristiti: `type_edp` (lowercase)
- ❌ NE koristiti: `type_EDP` (uppercase)
- ❌ NE miješati: `type_EDP` + `type_edp`

**Nekonzistentni tagovi će razbiti filtere!**

### Primjer tagova za jedan proizvod:
```
gender_men, type_edp, season_summer
```

---

## 4. Slike

- Prva slika = glavna slika proizvoda
- Dodaj do 5 slika za galeriju

---

## 5. Checklist prije objave

- [ ] Vendor (brend) ispravno upisan
- [ ] Varijante s veličinama (30ml, 50ml, itd.) - **NE tagovi!**
- [ ] Cijene za sve varijante
- [ ] Tag za spol: `gender_men` / `gender_women` / `gender_unisex`
- [ ] Tag za tip (lowercase!): `type_edp` / `type_edt` / `type_parfum`
- [ ] Tag za sezonu (opcionalno): `season_summer` itd.
- [ ] Tag `signature_true` (ako pripada signature kolekciji)
- [ ] Barem jedna slika
- [ ] **Provjeri da su svi tagovi lowercase!**

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

## 7. Što se NE koristi za filtriranje

| Polje | Status |
|-------|--------|
| Product Type | ❌ Samo informativno |
| Metafields | ❌ Samo informativno |
| Size tagovi (`size_50`) | ❌ NE koristiti - Size je varijanta! |

---

## 8. Sažetak tag formata

```
gender_men | gender_women | gender_unisex
type_edp | type_edt | type_parfum | type_extrait
season_summer | season_spring | season_autumn | season_winter
signature_true
```

**Sve lowercase. Bez iznimki.**
