# Podstawy Pythona: wartości, warunki, pętle i funkcje

Zakres: cli 3.14.5, cli 3.11.9. Materiał dla początkujących i osób na poziomie średnim.

<a id="values-lists"></a>

## Wartości, typy i listy

Python przechowuje wartości różnych typów, między innymi liczby, napisy i listy. `type(value).__name__` pozwala zobaczyć nazwę typu. Lista zachowuje kolejność, jej pierwszy element ma indeks `0`, a slicing `lista[1:]` zwraca nową listę od indeksu 1 do końca.

Przypisanie wiąże nazwę z wartością. Nie trzeba deklarować typu przed pierwszym przypisaniem, ale kod nadal powinien jasno określać, jakich danych oczekuje.

### Typ napisu, pierwszy element i fragment listy

```python
name = "Ada"
scores = [2, 4, 6]
print(type(name).__name__)
print(scores[0])
print(scores[1:])
```

Oczekiwany wynik:

```text
str
2
[4, 6]
```

<a id="conditions-range"></a>

## Warunek i pętla range

`if`, `elif` i `else` wybierają jedną gałąź. Blok jest wyznaczony wcięciem, dlatego linie należące do warunku muszą mieć spójne wcięcie.

`range(-1, 2)` tworzy wartości -1, 0 i 1; koniec 2 jest wyłączony. Pętla `for` przechodzi po każdej z nich. Ten przykład obejmuje gałąź ujemną, zero i gałąź dodatnią.

### Trzy gałęzie dla wartości z range

```python
for number in range(-1, 2):
    if number > 0:
        label = "positive"
    elif number < 0:
        label = "negative"
    else:
        label = "zero"
    print(number, label)
```

Oczekiwany wynik:

```text
-1 negative
0 zero
1 positive
```

<a id="function-return"></a>

## Funkcja zwraca wynik

`def` rozpoczyna definicję funkcji. Parametr `values` przyjmuje listę przekazaną przy wywołaniu. `return` kończy funkcję i oddaje obliczony wynik; dopiero `print` wypisuje go na standardowe wyjście.

Funkcja poniżej używa jawnej wartości początkowej `0`, dzięki czemu dla pustej listy również zwróci zero.

### Suma listy zwracana z funkcji

```python
def total(values):
    result = 0
    for value in values:
        result += value
    return result

print(total([2, 4, 6]))
print(total([]))
```

Oczekiwany wynik:

```text
12
0
```

---

Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.

- Przykłady dotyczą czystego Pythona 3.14 i 3.11. Nie obejmują sieci, bibliotek zewnętrznych, scrapingu, AI ani Pythona 2.
