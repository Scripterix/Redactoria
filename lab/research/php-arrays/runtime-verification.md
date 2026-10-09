# PHP 8.4 / 8.5 runtime verification

Status: PASS

Research Packet SHA-256: 3437fb991ebd1707c0ca04092a2143ade10704dd1168749eff694d3b4d0a3a42

## PHP 8.4.26

PASS — 60/60 assertions; 12 actual probes.

Official archive: [8.4.26](https://downloads.php.net/~windows/releases/archives/php-8.4.26-nts-Win32-vs17-x64.zip); published checksum: [PHP downloads](https://www.php.net/downloads.php?os=windows&version=8.4).
ZIP SHA-256: da68394f9193b7f6b89d0c76861a4034ae10efee7fd55a7255d8118c2acf70d7; executable SHA-256: 9c9c7cdb2ec112cf39498dd1a77b56eacac482487182066920f1bcd209091898.

Executed 2026-10-09T08:38:55.832Z → 2026-10-09T08:38:56.200Z, CLI -n, no php.ini, no SOURCE execution.

- keys: diagnostics 8192: Implicit conversion from float 1.5 to int loses precision; code SHA-256 36b31b97e8e548b90228ab8a338d6340c0950326b2ab5bd1e6bf476d46bcf8d0
- presence: diagnostics 2: Undefined array key "missing"; code SHA-256 b8bad8edb6ef8322b6d445742cbcfec2b5b0ec6c84d654efbc7bc8c6d11754f7
- operations: diagnostics none; code SHA-256 0f8a38add8b3ebb8dd3c453fe6e9e8c4f5175ef85ee4c68312ef657155af45b1
- iteration: diagnostics none; code SHA-256 c15c3481fd6c1a688cdc4178b691f3e8ac0817edca5bb9120c92a22c0d99de74
- merge: diagnostics none; code SHA-256 9274bda74a7bbc0b5406378b34c0c8c837ede455e06d38cdfe0e04899ab3009c
- sorting: diagnostics none; code SHA-256 5a599cf4a0f358b79450dc4edc9e8e4e2273e97da9d5e3d1f73b542626dc606d
- functional: diagnostics none; code SHA-256 22667b7414863a7e5378ed7db68d2ce901f0c1e77e2bd69305443f40302b2723
- extract: diagnostics none; code SHA-256 045b9b2997a8859348a814aaad6db2115bbbf71df7caee4e12ae8759fe2a2ce9
- forms-menu: diagnostics 2: Undefined array key "active"; code SHA-256 f32d2c2f3f8bbb6ab6315c98facba92e7be8400f3367e62c43c477959de025a9
- null-key-argument: diagnostics none; code SHA-256 555d8599ea8f090f87e32e40795df7c8316812d36611aab4b199b57e2eb963f4
- key-types: diagnostics none; code SHA-256 0fbcde48bac8b9269b793249675f4ea85b7caaac0165d50aead69894738862cc
- functional-edge-cases: diagnostics 2: array_count_values(): Can only count string and integer values, entry skipped; 2: array_count_values(): Can only count string and integer values, entry skipped; code SHA-256 5cfb9a5a3881cd83780d930ec79c2f91273903a480374e2656abb4ef6e207650


## PHP 8.5.11

PASS — 60/60 assertions; 12 actual probes.

Official archive: [8.5.11](https://downloads.php.net/~windows/releases/archives/php-8.5.11-nts-Win32-vs17-x64.zip); published checksum: [PHP downloads](https://www.php.net/downloads.php?os=windows&version=8.5).
ZIP SHA-256: 0ea96e0d2b9b737a6036f05cf4e95c49313faa6d0f27bd97edb2742503f0c043; executable SHA-256: d256e5d6bfd86905f336bf39b2f4a68d3fde0faabbce3080330de9600cd8e6c4.

Executed 2026-10-09T08:38:56.387Z → 2026-10-09T08:38:56.714Z, CLI -n, no php.ini, no SOURCE execution.

- keys: diagnostics 8192: Using null as an array offset is deprecated, use an empty string instead; 8192: Implicit conversion from float 1.5 to int loses precision; code SHA-256 36b31b97e8e548b90228ab8a338d6340c0950326b2ab5bd1e6bf476d46bcf8d0
- presence: diagnostics 2: Undefined array key "missing"; code SHA-256 b8bad8edb6ef8322b6d445742cbcfec2b5b0ec6c84d654efbc7bc8c6d11754f7
- operations: diagnostics none; code SHA-256 0f8a38add8b3ebb8dd3c453fe6e9e8c4f5175ef85ee4c68312ef657155af45b1
- iteration: diagnostics none; code SHA-256 c15c3481fd6c1a688cdc4178b691f3e8ac0817edca5bb9120c92a22c0d99de74
- merge: diagnostics none; code SHA-256 9274bda74a7bbc0b5406378b34c0c8c837ede455e06d38cdfe0e04899ab3009c
- sorting: diagnostics none; code SHA-256 5a599cf4a0f358b79450dc4edc9e8e4e2273e97da9d5e3d1f73b542626dc606d
- functional: diagnostics none; code SHA-256 22667b7414863a7e5378ed7db68d2ce901f0c1e77e2bd69305443f40302b2723
- extract: diagnostics none; code SHA-256 045b9b2997a8859348a814aaad6db2115bbbf71df7caee4e12ae8759fe2a2ce9
- forms-menu: diagnostics 2: Undefined array key "active"; code SHA-256 f32d2c2f3f8bbb6ab6315c98facba92e7be8400f3367e62c43c477959de025a9
- null-key-argument: diagnostics 8192: Using null as the key parameter for array_key_exists() is deprecated, use an empty string instead; code SHA-256 555d8599ea8f090f87e32e40795df7c8316812d36611aab4b199b57e2eb963f4
- key-types: diagnostics 8192: Using null as an array offset is deprecated, use an empty string instead; code SHA-256 0fbcde48bac8b9269b793249675f4ea85b7caaac0165d50aead69894738862cc
- functional-edge-cases: diagnostics 2: array_count_values(): Can only count string and integer values, entry skipped; 2: array_count_values(): Can only count string and integer values, entry skipped; code SHA-256 5cfb9a5a3881cd83780d930ec79c2f91273903a480374e2656abb4ef6e207650


## Version-sensitive results

Negative-key append: key -4 after assigning -5 to an empty array on both target runtimes (the historical 8.2.4 run had key 0).

array_key_exists(null, ...): existing empty-string key returns true on both; PHP 8.5 additionally emits E_DEPRECATED. Passing "" avoids that diagnostic. Array element value null remains a separate matter.

## Required packet addendum / erratum

PHP 8.5 also deprecates null as an array offset ($array[null]), not only the array_key_exists key argument. The original packet describes the conversion but omits this wider deprecation. Use an explicit empty-string key instead; null values are still valid.

Evidence: [PHP 8.5 migration — deprecated features](https://www.php.net/manual/en/migration85.deprecated.php), captured separately in runtime-source-supplement.json, plus actual keys/key-types/null-key-argument diagnostics.

Initial run: runtime-verification-initial.json retains 8.4 PASS and 8.5 FAIL (58/60), caused by the omitted null-offset deprecation. Expected diagnostics were corrected only after official documentation verification; no original packet or observation was rewritten.

All requested operations are covered by output assertions, including key order, mutations, return values and expected warnings.

## Boundary / original evidence

snippets: final Writer-authored standalone examples and a complete form handler do not exist yet; not claimed tested.

- Fixed controlled probes, not execution of SOURCE Markdown or final Writer output.
- Tested exact Windows x64 NTS builds, not every patch/OS/SAPI or a web application security audit.
- Expected warnings/deprecations are captured and asserted, not suppressed as success. Original research artifacts remain unchanged.

This supplement resolves target-runtime execution only when Status is PASS. It does not rewrite the original packet or start Writer/Critic.
