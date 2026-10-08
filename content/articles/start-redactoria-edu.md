---
title: "Start pilota Redactoria EDU"
description: "Dlaczego budujemy statyczną bazę wiedzy i jak oddzielamy źródła, LAB oraz opublikowane treści."
slug: "start-redactoria-edu"
status: published
created: 2026-10-08
updated: 2026-10-08
domain: software-engineering
topic: redactoria
author:
  type: ai-assisted
  name: Redactoria
sources: []
origin:
  type: native
review:
  status: approved
  reviewer: Scripterix
  confidence: 1
automation:
  generated: false
  last_checked: null
  update_priority: normal
redactoria:
  decision: keep
  modernization: none
---

Redactoria EDU jest pierwszym praktycznym pilotem systemu do rozwijania i utrzymywania
wyspecjalizowanych serwisów wiedzy. Zaczynamy od niewielkiej, statycznej strony o
programowaniu, web developmencie, sztucznej inteligencji i software engineeringu.

## Trzy oddzielne przestrzenie

Źródłowy korpus, materiały robocze w LAB i publiczne artykuły nie są tym samym.
Oryginały pozostają niezmienione, LAB służy do analizy i przygotowania propozycji,
a na stronę trafiają dopiero materiały zatwierdzone w review.

## Małe i sprawdzalne kroki

Każda większa zmiana powinna przejść walidację treści oraz produkcyjny build Astro.
Git zapisuje jej historię, a publikacja nigdy nie jest automatycznym skutkiem pracy
narzędzia lub przyszłego agenta.
