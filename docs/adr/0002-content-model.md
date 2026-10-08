# ADR 0002: Lokalne, walidowane kolekcje treści

- Status: przyjęta
- Data: 2026-10-08

## Kontekst

Redactoria EDU potrzebuje treści czytelnych zarówno dla człowieka, jak i dla
przyszłych narzędzi analizujących pochodzenie, stan review oraz decyzje redakcyjne.
Treść nie może być zaszyta w komponentach UI.

## Decyzja

- Zatwierdzone treści przechowujemy w głównym katalogu `content/`.
- Astro ładuje je przez build-time Content Collections zdefiniowane w
  `src/content.config.ts`.
- Pierwsze kolekcje to `articles` i `topics`.
- Artykuły pozostają w Markdown; dane tematów mogą korzystać z YAML lub JSON.
- Każdy artykuł posiada jawny status, daty, autora, temat, źródła, pochodzenie,
  review i podstawowe dane automatyzacji.
- Pola dotyczące przyszłych etapów są opcjonalne lub mają bezpieczne wartości
  domyślne. Brakujących danych źródłowych nie uzupełniamy fikcyjnymi wartościami.

Katalog główny `content/`, zamiast `src/content/`, jest świadomym wyborem. Ułatwia
przyszłym narzędziom pracę z treścią bez zależności od struktury komponentów strony,
a loader Astro pozwala wskazać tę lokalizację jawnie.

## Konsekwencje

- Niepoprawne metadane zatrzymują build.
- Publiczna treść ma przewidywalny, typowany model.
- Materiał z LAB wymaga jawnego utworzenia wpisu w `content/articles/`.
- Migracja starego korpusu zachowa proweniencję bez modyfikacji oryginałów.
