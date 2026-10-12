# Markdown: nagłówki, linki, listy i bloki kodu

Zakres: node v24.16.0. Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.

<a id="markdown-model"></a>

## Tekst źródłowy i wynik renderowania

Markdown jest tekstowym formatem zapisu, który renderer zamienia na wynik, zwykle HTML. Znak `#` na początku wiersza tworzy nagłówek, pusty wiersz rozdziela bloki, podwójne gwiazdki oznaczają mocne wyróżnienie, a zapis `[tekst](adres)` tworzy link. Czytelnik widzi efekt, ale w repozytorium nadal przechowujesz zwykły tekst.

Nie każdy parser obsługuje identyczny dialekt. W tym materiale podstawą jest CommonMark 0.31.2. Najpierw warto opanować jego rdzeń, a dopiero później korzystać z rozszerzeń platformy.

### Nagłówek, wyróżnienie i link w jednym krótkim dokumencie

```markdown
# Plan

To jest **ważne** i zawiera [link](https://example.com).
```

Oczekiwany wynik:

```text
<h1>Plan</h1>
<p>To jest <strong>ważne</strong> i zawiera <a href="https://example.com">link</a>.</p>
```

<a id="lists-and-code"></a>

## Listy, kod inline i fenced code block

Wcięcie pozwala zagnieżdżać listy. Pojedyncze backticki otaczają krótki fragment kodu w zdaniu. Dłuższy przykład umieszcza się w fenced code block: ogrodzenie ma co najmniej trzy takie same backticki albo tyldy, a opcjonalna etykieta po otwarciu może wskazać język do podświetlania.

Tyldy są wygodne, gdy artykuł sam pokazuje składnię Markdown. Jeśli znak ma być widoczny dosłownie, można poprzedzić go backslashem. Wcięcia i puste wiersze traktuj jako część składni, nie dekorację.

### Lista z jednym elementem zagnieżdżonym

```markdown
- pierwszy
  - zagnieżdżony
```

Oczekiwany wynik:

```text
<ul>
<li>pierwszy
<ul>
<li>zagnieżdżony</li>
</ul>
</li>
</ul>
```

### Blok JavaScript ogrodzony tyldami

```markdown
~~~js
console.log(1);
~~~
```

Oczekiwany wynik:

```text
<pre><code class="language-js">console.log(1);
</code></pre>
```

<a id="commonmark-and-gfm"></a>

## CommonMark a GitHub Flavored Markdown

GitHub Flavored Markdown, czyli GFM, jest ścisłym nadzbiorem CommonMark. Dodaje między innymi tabele, przekreślenie i listy zadań. Taki zapis może działać na GitHubie, lecz inny renderer ograniczony do CommonMark nie musi go rozumieć. Dlatego w dokumentacji projektu warto nazwać używany dialekt.

Niestandardowe atrybuty dopisywane do nagłówka, spotykane w materiale legacy, nie są częścią podstawowej składni CommonMark ani opisanych tu rozszerzeń GFM. Klasy CSS lub identyfikatory dodawaj tylko wtedy, gdy dokumentacja konkretnego renderera wyraźnie je obsługuje.

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Materiał obejmuje wyłącznie autoryzowany zakres B4, wskazane źródła i runtime Node; metadane interakcji nie są zaimplementowanym UI.
