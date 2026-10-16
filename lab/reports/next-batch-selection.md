# Next batch selection — foundations

Status: **APPROVED FOR LAB PIPELINE ONLY** · 2026-10-16

## Decision

The next three are the three highest shared structural gaps in Knowledge Gap 0.2:

1. **PHP od pierwszego skryptu: wartości, zmienne, typy, operatory i CLI**
   (`php-language-foundation`, `CREATE_NEW`, context source `977`). It is the entry
   layer required by the public PHP control-flow and arrays lessons.
2. **JavaScript od pierwszego uruchomienia: wartości, zmienne, typy i operatory**
   (`javascript-language-foundation`, `CREATE_NEW`, context source `542`). It is the
   shared entry layer assumed by public conditions, arrays and DOM lessons.
3. **Funkcje JavaScript: parametry, return i callbacki**
   (`javascript-functions-callbacks`, `MODERNIZE`, source `281`). It introduces the
   function model those three JavaScript lessons already use.

Run A found the same P1/HIGH order without Strategic Memory; Run B retained it.
Strategic Memory was used only to confirm sequencing, never to turn a historical
priority into factual evidence. The next not-selected topic remains HTML/selectors
before DOM, also P1/HIGH.

## Why the origin distinction matters

Sources `977` and `542` demonstrate that the required entry lessons do **not**
already exist as a bounded legacy tutorial. They remain context evidence for a
genuine `CREATE_NEW` decision. Only source `281` supplies a usable function/callback
core, so its path is `MODERNIZE`/focused `REWRITE`.

The structured report in `next-batch-selection.json` records exact hashes, scopes,
prerequisites, duplicate checks, confidence and authority plan. This selection
authorizes work in LAB through publication candidates only. It does not authorize
CONTENT, publication, Git, push or deployment.
