# DOM w JavaScript: selektory, bezpieczny tekst i zdarzenia

Zakres: browser 154.0.0.0. Materiał edukacyjny dla początkujących i osób na wczesnym poziomie średniozaawansowanym.

<a id="selection"></a>

## Selektory i brak dopasowania

DOM to Document Object Model: obiektowa reprezentacja dokumentu. `querySelector` zwraca pierwszy pasujący element albo `null`, więc przed użyciem wyniku trzeba sprawdzić jego obecność. `querySelectorAll` zwraca statyczny `NodeList`: lista nie dopisze automatycznie elementu utworzonego później.

Umieść skrypt po elementach w `body` albo użyj modułu ładowanego z odpowiednim momentem wykonania. W kompletnym przykładzie wszystkie wymagane elementy istnieją przed uruchomieniem skryptu.

<a id="safe-update"></a>

## Tekst, klasy i nowy element

`textContent` zapisuje tekst, nie interpretuje go jako HTML. Jest właściwym wyborem, gdy treść może pochodzić z formularza. `classList.add` dodaje pojedynczy token klasy, a `createElement` tworzy nowy element, który można uzupełnić i dołączyć do dokumentu.

Po kliknięciu napis przypominający znacznik pozostaje widocznym tekstem. Odczyt `innerHTML` pokaże encje, co potwierdza brak utworzonego elementu `strong`.

<a id="click-example"></a>

## Kompletny przykład z natywnym przyciskiem

Natywny element `button` można aktywować wskaźnikiem i klawiaturą. Rejestrujemy jedno zdarzenie `click`, zamiast budować zachowanie dostępne tylko po najechaniu. Przykład jest samodzielnym dokumentem do zapisania jako plik HTML i otwarcia w przeglądarce.

Po aktywacji tytuł dostaje klasę, tekst jest zapisany bez parsowania HTML, a lista ma dwa elementy. Wcześniej zachowany statyczny `NodeList` nadal ma długość jeden.

### Bezpieczna zmiana DOM po kliknięciu

```html
<!doctype html>
<html lang="pl"><meta charset="utf-8"><title>DOM</title>
<body>
<h1 id="title">Start</h1>
<button id="add" type="button">Dodaj element</button>
<ul id="list"><li>A</li></ul>
<script>
const title = document.querySelector('#title');
const initial = document.querySelectorAll('#list li');
document.querySelector('#add').addEventListener('click', () => {
  title.textContent = '<strong>Bezpieczny tekst</strong>';
  title.classList.add('updated');
  const item = document.createElement('li');
  item.textContent = 'B';
  document.querySelector('#list').appendChild(item);
  console.log(initial.length, document.querySelectorAll('#list li').length);
});
</script>
</body></html>
```

Oczekiwany wynik:

```text
Po kliknięciu: widoczny tekst <strong>Bezpieczny tekst</strong>; klasa updated; elementy listy A i B; konsola: 1 2.
```

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Materiał obejmuje wyłącznie autoryzowany zakres B3 i wskazany runtime; metadane interakcji nie są zaimplementowanym UI.
