/** Owned controlled probes, not extracted SOURCE code. Expectations are assertions, not simulated execution. */
export const probes = [
 { id: 'conditions', description: 'elseif order, equality and assignment', body: `
$score = 74;
$branch = '';
if ($score >= 90) { $branch = 'top'; }
elseif ($score >= 60) { $branch = 'pass'; }
else { $branch = 'retry'; }
$assigned = 0;
$assignmentCondition = (bool)($assigned = 5);
$result = ['branch' => $branch, 'loose' => 5 == '5', 'strict' => 5 === '5', 'assignmentCondition' => $assignmentCondition, 'assigned' => $assigned, 'different' => 5 !== '5'];`,
 expected: { branch: 'pass', loose: true, strict: false, assignmentCondition: true, assigned: 5, different: true } },
 { id: 'truthiness', description: 'Scalar false values, empty array, true nonempty strings', body: `
$result = array_map(static fn($value) => (bool)$value, [false, 0, 0.0, '', '0', [], null, '00', 'false', -1]);`,
 expected: [false, false, false, false, false, false, false, true, true, true] },
 { id: 'logic', description: 'Short-circuit and and/or precedence relative to assignment', body: `
$calls = 0;
$right = static function () use (&$calls) { $calls++; return true; };
$falseAnd = false && $right();
$trueOr = true || $right();
$a = true && false;
$b = true and false;
$c = false || true;
$d = false or true;
$result = ['calls' => $calls, 'falseAnd' => $falseAnd, 'trueOr' => $trueOr, 'andSymbol' => $a, 'andWord' => $b, 'orSymbol' => $c, 'orWord' => $d, 'not' => !false];`,
 expected: { calls: 0, falseAnd: false, trueOr: true, andSymbol: false, andWord: true, orSymbol: true, orWord: false, not: true } },
 { id: 'choices', description: 'Switch loose match/fallthrough, match strict/default/unhandled, ternary', body: `
$value = '1';
switch ($value) { case 1: $switch = 'number'; break; default: $switch = 'other'; }
$match = match ($value) { 1 => 'number', default => 'other' };
$fallthrough = '';
switch (1) { case 1: $fallthrough .= 'A'; case 2: $fallthrough .= 'B'; break; }
$unhandled = false;
try { match ('missing') { 'known' => 1 }; } catch (UnhandledMatchError $error) { $unhandled = true; }
$result = ['switch' => $switch, 'match' => $match, 'fallthrough' => $fallthrough, 'unhandled' => $unhandled, 'ternary' => true ? 'yes' : 'no'];`,
 expected: { switch: 'number', match: 'other', fallthrough: 'AB', unhandled: true, ternary: 'yes' } },
 { id: 'loops', description: 'While/do-while minimum, for bounds, sum with explicit increment', body: `
$while = 0; while (false) { $while++; }
$do = 0; do { $do++; } while (false);
$sequence = []; for ($i = 0; $i < 3; $i++) { $sequence[] = $i; }
$i = 1; $sum = 0; while ($i <= 10) { $sum += $i; $i++; }
$result = ['while' => $while, 'do' => $do, 'for' => $sequence, 'sum' => $sum];`,
 expected: { while: 0, do: 1, for: [0, 1, 2], sum: 55 } },
 { id: 'foreach', description: 'Value/key iteration, empty array, no reference mutation', body: `
$items = ['first' => 'Anna', 'second' => 'Tomek']; $pairs = [];
foreach ($items as $key => $value) { $pairs[] = [$key, $value]; $value = 'changed'; }
$empty = 0; foreach ([] as $value) { $empty++; }
$result = ['pairs' => $pairs, 'unchanged' => $items, 'empty' => $empty];`,
 expected: { pairs: [['first', 'Anna'], ['second', 'Tomek']], unchanged: { first: 'Anna', second: 'Tomek' }, empty: 0 } },
 { id: 'flow', description: 'Continue vs break; return ends function but not caller', body: `
$visited = [];
for ($i = 1; $i <= 6; $i++) { if ($i === 2) { continue; } if ($i === 5) { break; } $visited[] = $i; }
function label(int $score): string { if ($score >= 60) { return 'pass'; } return 'retry'; }
$result = ['visited' => $visited, 'passed' => label(70), 'retry' => label(40), 'callerContinues' => true];`,
 expected: { visited: [1, 3, 4], passed: 'pass', retry: 'retry', callerContinues: true } },
 { id: 'beginner-pitfalls', description: 'Accidental semicolon empty if statement and reversed threshold order', body: `
$ran = false;
if (false); { $ran = true; }
$score = 95;
if ($score >= 60) { $branch = 'pass'; } elseif ($score >= 90) { $branch = 'top'; } else { $branch = 'retry'; }
$result = ['emptyIfStillRunsFollowingBlock' => $ran, 'wrongOrder' => $branch];`,
 expected: { emptyIfStillRunsFollowingBlock: true, wrongOrder: 'pass' } },
] as const;
