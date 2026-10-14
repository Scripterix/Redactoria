# PHP arrays clarity pass 2 — runtime verification

Status: PASS

Article: `content/articles/tablice-w-php.md`
Article SHA-256: `4deb6d03abfc89a75626233854198c821770206cec67662736fbebdedd9810ec`
Examples: 23; runtimes: 2; executions: 46.

## PHP 8.4.26

PASS: 23/23 examples; actual local CLI, `-n`, stdin.
Executable SHA-256: `9c9c7cdb2ec112cf39498dd1a77b56eacac482487182066920f1bcd209091898`.

- PASS — Lista: automatyczne klucze całkowite — code `159b13c4d842b3a35374b18a7af6e04821977bbb8d06777bff390a8e4239a1f6`
- PASS — Nazwane klucze — code `b3573982f0a831fe44a97933265546834f8ed5c03997312c583a6392e92d99ea`
- PASS — Stan tablicy krok po kroku — code `794c5486d8e2dbe9ececff9ce7abc0ca6f506ac4fc9d60307f86f618bc9219e5`
- PASS — Typy wartości w danych użytkownika — code `016a676df453f3afb81442e56adaea04904c09062e003f38c565894c02ce5c9d`
- PASS — Odczyt z dwóch poziomów — code `b29446491025f5acdca6f730e374443537ec9a20e4ee54fb8077a152f2e07ff7`
- PASS — Przejście po wartościach — code `09c0cdc9066bbbbf426b9f05f74010032335c3715bfbbfa8857f9a80f0855c50`
- PASS — Przejście po kluczach i wartościach — code `4f6f8063bb418d4f0b876630173220d4287d52bde6c5f0900eaf8cfe5fcd203d`
- PASS — Istniejący null a brak pola — code `fb725323d53ec46697256c93c2ed07837305965712acd668f016dc41a19aea89`
- PASS — Dodanie jednego elementu — code `8ee28e8954ab81c60e926050dbf8ceeafa7cec32c85c2e8ca9d435ca0b1559fc`
- PASS — Usunięcie jednego elementu — code `3f4c2285fa97eae84d9d0f1a6c4d31ffb5c12a3366100a44de0412b02f006f1e`
- PASS — Funkcje operujące na końcu tablicy — code `df4aa6d1aaaf38cc2adaf89133461da0976dee37072cd3bdc8bedb67e957af10`
- PASS — Funkcje operujące na początku tablicy — code `a3f2d6430221d60f749c25e3fb80db99be1e0e459ea4b716b8a8444491362fcf`
- PASS — Usunięcie fragmentu przez array_splice — code `ab2f63773948809773da679a302de6d8976f12ecf86193e04044019525b4839a`
- PASS — Kolizja po konwersji klucza — code `719c4e55f9dc907549437b1ff443caca934964ff79defcacc0823394d9e6c86c`
- PASS — Trzy operacje na tej samej parze danych — code `0647efb331bc4f0ebec89caa64e59af70fcf75a94e597736faddc6f5ea45e294`
- PASS — sort zmienia klucze, asort je zachowuje — code `2835b071aef28e8f681c49faa309db0d5379aa461d7d3b94e5c9e4c58671689a`
- PASS — Podwojenie liczb — code `a1f0fd2c5a496d68a039f1a968abdf70e5b0196872bb234a33bc92b9edb3b3ae`
- PASS — Parzyste liczby z zachowaniem kluczy — code `1fe52cacb10b19741ad0f56a7f147bd1a85dbd8e6fa9045760a00783bfcd53b6`
- PASS — Sumowanie z początkowym akumulatorem — code `f749d048879855d59c2d20ff7861f370f83fc0610b8535d37139ca720e541cb6`
- PASS — Liczenie powtarzających się owoców — code `b1e1383895b7d4314a0f4ced43c04603bc115dddfdadb9e9fb13ed70d09a9a4d`
- PASS — Zagnieżdżona opcja i opcjonalny stan menu — code `96505c833af5c255cda68382cfa4be6a29f04607d064850800ede5d780ec1b23`
- PASS — Najpierw sprawdź typ, potem waliduj — code `1a98769218baf047e3a16ff7f1d2e51a791f194821e65e8549a93c8d57254076`
- PASS — Demonstracja nadpisania, nie wzorzec dla formularza — code `edb9e397628bb4a6f043143912ef2a607a9a78deaa587247a4ebea2199578255`

## PHP 8.5.11

PASS: 23/23 examples; actual local CLI, `-n`, stdin.
Executable SHA-256: `d256e5d6bfd86905f336bf39b2f4a68d3fde0faabbce3080330de9600cd8e6c4`.

- PASS — Lista: automatyczne klucze całkowite — code `159b13c4d842b3a35374b18a7af6e04821977bbb8d06777bff390a8e4239a1f6`
- PASS — Nazwane klucze — code `b3573982f0a831fe44a97933265546834f8ed5c03997312c583a6392e92d99ea`
- PASS — Stan tablicy krok po kroku — code `794c5486d8e2dbe9ececff9ce7abc0ca6f506ac4fc9d60307f86f618bc9219e5`
- PASS — Typy wartości w danych użytkownika — code `016a676df453f3afb81442e56adaea04904c09062e003f38c565894c02ce5c9d`
- PASS — Odczyt z dwóch poziomów — code `b29446491025f5acdca6f730e374443537ec9a20e4ee54fb8077a152f2e07ff7`
- PASS — Przejście po wartościach — code `09c0cdc9066bbbbf426b9f05f74010032335c3715bfbbfa8857f9a80f0855c50`
- PASS — Przejście po kluczach i wartościach — code `4f6f8063bb418d4f0b876630173220d4287d52bde6c5f0900eaf8cfe5fcd203d`
- PASS — Istniejący null a brak pola — code `fb725323d53ec46697256c93c2ed07837305965712acd668f016dc41a19aea89`
- PASS — Dodanie jednego elementu — code `8ee28e8954ab81c60e926050dbf8ceeafa7cec32c85c2e8ca9d435ca0b1559fc`
- PASS — Usunięcie jednego elementu — code `3f4c2285fa97eae84d9d0f1a6c4d31ffb5c12a3366100a44de0412b02f006f1e`
- PASS — Funkcje operujące na końcu tablicy — code `df4aa6d1aaaf38cc2adaf89133461da0976dee37072cd3bdc8bedb67e957af10`
- PASS — Funkcje operujące na początku tablicy — code `a3f2d6430221d60f749c25e3fb80db99be1e0e459ea4b716b8a8444491362fcf`
- PASS — Usunięcie fragmentu przez array_splice — code `ab2f63773948809773da679a302de6d8976f12ecf86193e04044019525b4839a`
- PASS — Kolizja po konwersji klucza — code `719c4e55f9dc907549437b1ff443caca934964ff79defcacc0823394d9e6c86c`
- PASS — Trzy operacje na tej samej parze danych — code `0647efb331bc4f0ebec89caa64e59af70fcf75a94e597736faddc6f5ea45e294`
- PASS — sort zmienia klucze, asort je zachowuje — code `2835b071aef28e8f681c49faa309db0d5379aa461d7d3b94e5c9e4c58671689a`
- PASS — Podwojenie liczb — code `a1f0fd2c5a496d68a039f1a968abdf70e5b0196872bb234a33bc92b9edb3b3ae`
- PASS — Parzyste liczby z zachowaniem kluczy — code `1fe52cacb10b19741ad0f56a7f147bd1a85dbd8e6fa9045760a00783bfcd53b6`
- PASS — Sumowanie z początkowym akumulatorem — code `f749d048879855d59c2d20ff7861f370f83fc0610b8535d37139ca720e541cb6`
- PASS — Liczenie powtarzających się owoców — code `b1e1383895b7d4314a0f4ced43c04603bc115dddfdadb9e9fb13ed70d09a9a4d`
- PASS — Zagnieżdżona opcja i opcjonalny stan menu — code `96505c833af5c255cda68382cfa4be6a29f04607d064850800ede5d780ec1b23`
- PASS — Najpierw sprawdź typ, potem waliduj — code `1a98769218baf047e3a16ff7f1d2e51a791f194821e65e8549a93c8d57254076`
- PASS — Demonstracja nadpisania, nie wzorzec dla formularza — code `edb9e397628bb4a6f043143912ef2a607a9a78deaa587247a4ebea2199578255`

## Boundary

- Each fenced PHP example paired with its expected-output block was executed independently through actual local CLI stdin.
- Exact stdout, empty stderr and exit code 0 were required; this is not a web-server, security or cross-platform test.
- The executable hashes must match the official PHP 8.4.26 and 8.5.11 binaries recorded by the existing approved runtime evidence.
