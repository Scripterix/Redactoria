# Researcher 0.1 — git-local-basics

## RESEARCH SCOPE

Research Packet, nie artykuł ani zatwierdzenie publikacji. Jeden pełny materiał SOURCE.

- 277-post-8-moj-gist.md (277)

Tryb: imported-session-analysis; model: unknown-codex-session.
Request SHA-256: 36478f0726e225b323cb31d5ca17571b25962b5b12eb1c43bf52fa90e1dadc83

## RUNTIME TARGET

Git 2.21.0.windows.1; wyłącznie izolowane repozytorium lokalne i konfiguracja autora w tym repozytorium

Stan dokumentacji: 2026-10-13.

Wykonane runtime: git 2.21.0.windows.1; szczegóły w osobnym execution evidence.

## VERIFIED CLAIMS

### git-three-states

Git rozróżnia zawartość pliku w working tree, zapis przygotowany w indexie oraz wersję z bieżącego commita HEAD; status opisuje różnice między tymi obszarami. (verified; confidence: 0.98)

Evidence: [git-status/status-state](https://git-scm.com/docs/git-status), [git-add/add-index](https://git-scm.com/docs/git-add)

SOURCE: 277-post-8-moj-gist.md, body: "# git rm --cashed index.html"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

### git-two-diffs

git diff pokazuje zmiany working tree względem indexu, a git diff --cached pokazuje zmiany przygotowane w indexie względem HEAD. (verified; confidence: 0.98)

Evidence: [git-diff/diff-working-index](https://git-scm.com/docs/git-diff)

SOURCE: 277-post-8-moj-gist.md, body: "# git rm --cashed index.html"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

### git-local-history

git init tworzy lokalne repozytorium, commit zapisuje zawartość wybraną w indexie, a log pokazuje historię commitów. (verified; confidence: 0.98)

Evidence: [git-init/init-repository](https://git-scm.com/docs/git-init), [git-commit-log/commit-index](https://git-scm.com/docs/git-commit), [git-log/log-history](https://git-scm.com/docs/git-log)

SOURCE: 277-post-8-moj-gist.md, body: "# git rm --cashed index.html"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

## CLAIMS REQUIRING CORRECTION

### git-cached-spelling

Materiał legacy zawiera literówkę --cashed; poprawna opcja używana do porównania staged changes to --cached. (verified; confidence: 0.98)

Evidence: [git-diff/diff-working-index](https://git-scm.com/docs/git-diff)

SOURCE: 277-post-8-moj-gist.md, body: "# git rm --cashed index.html"

Zalecenie: Użyć jako zweryfikowanej granicy treści i przykładów.

## OUTDATED / QUESTIONABLE MATERIAL

Brak.

## CODE ISSUES

### executed-boundaries

Izolowane lokalne repozytorium potwierdziło stany ??, A, różnicę working tree, różnicę --cached oraz kolejność dwóch komunikatów w logu. (verified; confidence: 0.99)

Evidence: [git-init/init-repository](https://git-scm.com/docs/git-init), [git-status/status-state](https://git-scm.com/docs/git-status), [git-add/add-index](https://git-scm.com/docs/git-add), [git-diff/diff-working-index](https://git-scm.com/docs/git-diff), [git-commit-log/commit-index](https://git-scm.com/docs/git-commit), [git-log/log-history](https://git-scm.com/docs/git-log)

SOURCE: 277-post-8-moj-gist.md, body: "# git rm --cashed index.html"

Zalecenie: Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.

Kod: executed-probe; probes: git-local-cycle.

## state

- [git-three-states](#git-three-states): Użyć jako zweryfikowanej granicy treści i przykładów.
- [git-two-diffs](#git-two-diffs): Użyć jako zweryfikowanej granicy treści i przykładów.
- [git-cached-spelling](#git-cached-spelling): Użyć jako zweryfikowanej granicy treści i przykładów.
- [executed-boundaries](#executed-boundaries): Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.

## cycle

- [git-local-history](#git-local-history): Użyć jako zweryfikowanej granicy treści i przykładów.
- [executed-boundaries](#executed-boundaries): Finalne przykłady draftu wykonać ponownie niezależnie od próby badawczej.

## SECURITY / CAUTION NOTES

Brak.

## RECOMMENDED ARTICLE CHANGES

- CORRECT: Zmodernizować jeden materiał legacy w ograniczonym, lokalnym i sprawdzalnym zakresie. [git-three-states, git-two-diffs, git-local-history, git-cached-spelling, executed-boundaries]

## UNRESOLVED QUESTIONS


## SOURCE REGISTER

- [git-init — git-init Documentation](https://git-scm.com/docs/git-init); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:36:43.427Z; evidence: init-repository; SHA-256: 89859ac45aed72deb2ed56c80f0ad45bd643934b64492b3ce53a081f02464deb
- [git-status — git-status Documentation](https://git-scm.com/docs/git-status); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:36:43.427Z; evidence: status-state; SHA-256: 179489b2251f008a5d4b284cee81dced8afa02c6a00f356119b85b8d698c9e80
- [git-add — git-add Documentation](https://git-scm.com/docs/git-add); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:36:43.427Z; evidence: add-index; SHA-256: 1900f584fe23b29c8caea974f63111db58c903704293a6a086e317a5703081e3
- [git-diff — git-diff Documentation](https://git-scm.com/docs/git-diff); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:36:43.427Z; evidence: diff-working-index; SHA-256: 92e653c806a3852e43526eb559549ff8ac81db4c3969eafa50e8c8e0cffccf7b
- [git-commit-log — git-commit and git-log Documentation](https://git-scm.com/docs/git-commit); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:36:43.427Z; evidence: commit-index; SHA-256: 75f7427d88fc32f34d9c0c1b1e86c8aa1b09687972ac49e5d924c93933337056
- [git-log — git-log Documentation](https://git-scm.com/docs/git-log); tier 2 / official-project-runtime / technical-authority; project-documentation; pobrano 2026-10-13T19:36:43.427Z; evidence: log-history; SHA-256: a4d15a39a2f9d24a40a1151dee0200de4c2ae253771fb4a276410f26832ba544

## LIMITATIONS

- Research obejmuje jeden autoryzowany materiał SOURCE, oficjalne źródła potrzebne do zakresu oraz kontrolowane lokalne wykonanie; nie jest zgodą na publikację.

## WRITER HANDOFF

Założony runtime: Git 2.21.0.windows.1; wyłącznie izolowane repozytorium lokalne i konfiguracja autora w tym repozytorium

### Zachowaj

- Zachować praktyczny, terminalowy charakter materiału i jawne oczekiwane wyniki. [git-three-states, git-two-diffs, git-local-history]

### Popraw

- Materiał legacy zawiera literówkę --cashed; poprawna opcja używana do porównania staged changes to --cached. [git-cached-spelling]

### Nie powielaj


### Ostrożność

- Nie przedstawiać próby badawczej jako wykonania finalnego kodu artykułu. [executed-boundaries]

### Zweryfikowane przykłady

- executed-boundaries: executed-probe; git-local-cycle

STOP — następny krok wymaga decyzji człowieka.
