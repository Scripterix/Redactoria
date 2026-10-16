---
title: "Git lokalnie: status, staging, commit i historia"
description: "Praktyczne podstawy lokalnego Git: working tree, staging, status, diff, commit i krótka historia zmian."
slug: git-lokalnie
featuredImage: ../../src/assets/git-lokalnie.webp
featuredAlt: Chłopak przenosi kartę pliku ze stołu roboczego przez staging do rozgałęzionej historii wersji.
status: published
created: 2026-10-14T00:00:00.000Z
updated: 2026-10-14T00:00:00.000Z
domain: programming
topic: web
author:
  type: ai-assisted
  name: Scripterix
sources:
  - title: git-init Documentation
    url: https://git-scm.com/docs/git-init
    publisher: Git
  - title: git-status Documentation
    url: https://git-scm.com/docs/git-status
    publisher: Git
  - title: git-add Documentation
    url: https://git-scm.com/docs/git-add
    publisher: Git
  - title: git-diff Documentation
    url: https://git-scm.com/docs/git-diff
    publisher: Git
  - title: git-commit Documentation
    url: https://git-scm.com/docs/git-commit
    publisher: Git
  - title: git-log Documentation
    url: https://git-scm.com/docs/git-log
    publisher: Git
origin:
  type: wordpress-export
  source_id: "277"
  original_url: https://opengateweb.com/posts/8-post-gist/
  original_date: 2025-02-13T00:00:00.000Z
  original_author: Scripterix
review:
  status: approved
  reviewer: human — B5 publication authorization
  confidence: 1
automation:
  generated: true
  last_checked: 2026-10-14T00:00:00.000Z
  update_priority: normal
redactoria:
  decision: rewrite
  modernization: major
---
# Git lokalnie: status, staging, commit i historia

Zakres: cli 2.21.0.windows.1. Materiał dla początkujących i osób na poziomie średnim.

<a id="three-states"></a>

## Working tree, index i HEAD

W lokalnym repozytorium warto rozdzielić trzy obrazy pliku. Working tree to plik, który właśnie edytujesz. Index, nazywany też staging area, przechowuje treść przygotowaną do następnego commita. HEAD wskazuje bieżący commit, czyli ostatni zapis historii na aktualnej gałęzi.

`git status` opisuje różnice między tymi obszarami. `git add` nie zapisuje historii: kopiuje bieżącą treść pliku do indexu. Jeżeli po `git add` ponownie zmienisz plik, część staged i nowa zmiana w working tree mogą istnieć jednocześnie.

<a id="init-status"></a>

## Nowe repozytorium i pierwszy status

Utwórz pusty katalog ćwiczenia i plik `note.txt` z wierszem `pierwsza wersja`. Następnie wykonaj poniższe polecenia w tym katalogu. `git init` tworzy lokalne repozytorium; nie zakłada konta i nie wysyła niczego do GitHub.

Format `--short` skraca wynik statusu. Dwa znaki zapytania oznaczają plik untracked: Git widzi go w working tree, ale nie ma go jeszcze w indexie ani historii.

### Inicjalizacja i status istniejącego pliku note.txt

```shell
git init --quiet
git status --short
```

Oczekiwany wynik:

```text
?? note.txt
```

<a id="diff-and-stage"></a>

## Zmiana przed i po git add

Po pierwszym commicie dopisz do `note.txt` wiersz `druga linia`. Zwykły `git diff` porównuje working tree z indexem. Po `git add note.txt` ta sama treść znajduje się w indexie, dlatego oglądasz ją przez `git diff --cached`.

Opcja nazywa się `--cached`, nie `--cashed`. Wariant `--numstat` pokazuje zwięzłe liczby dodanych i usuniętych wierszy; tutaj jedna linia została dodana i żadna usunięta.

### Ta sama zmiana przed i po stagingu

```shell
git diff --numstat -- note.txt
git add note.txt
git diff --cached --numstat -- note.txt
```

Oczekiwany wynik:

```text
1	0	note.txt
1	0	note.txt
```

<a id="commit-log"></a>

## Commit i krótka historia

Commit zapisuje wersję przygotowaną w indexie. Do lokalnego ćwiczenia ustaw nazwę i e-mail autora wyłącznie w tym repozytorium przez `git config user.name` oraz `git config user.email`; nie zmieniaj konfiguracji globalnej.

Po drugim commicie `git log -2` ogranicza wynik do dwóch wpisów, a format `%s` pokazuje same tematy komunikatów. Najnowszy commit jest pierwszy.

### Drugi commit i dwa komunikaty historii

```shell
git add note.txt
git commit --quiet -m "Druga wersja"
git log -2 --pretty=format:"%s"
```

Oczekiwany wynik:

```text
Druga wersja
Pierwsza wersja
```

---

- Ćwiczenie dotyczy jednego lokalnego repozytorium. Nie obejmuje GitHub, Gist, push, merge, stash, reset --hard ani konfiguracji globalnej.
