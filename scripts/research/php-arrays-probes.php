<?php
// Trusted, fixed, side-effect-free data probes. Never execute SOURCE or HTTP input.
error_reporting(E_ALL);
$probes = [
    'keys' => function () {
        $a = [];
        $a[0] = 'int'; $a['0'] = 'string'; $a[true] = 'bool';
        $a[null] = 'null'; $a[1.5] = 'float';
        $b = [10 => 'ten']; unset($b[10]); $b[] = 'next';
        $negative = []; $negative[-5] = 'negative'; $negative[] = 'next';
        return ['castKeys' => $a, 'castKeyOrder' => array_keys($a), 'appendAfterUnset' => $b, 'negativeAppend' => $negative];
    },
    'presence' => function () {
        $a = ['null' => null, 'zero' => 0, 'text-zero' => '0', 'false' => false, 'empty' => ''];
        $rows = [];
        foreach (['missing', 'null', 'zero', 'text-zero', 'false', 'empty'] as $key) {
            $rows[$key] = ['isset' => isset($a[$key]), 'keyExists' => array_key_exists($key, $a),
                'coalesce' => $a[$key] ?? 'fallback', 'empty' => empty($a[$key])];
        }
        $missing = $a['missing'];
        return ['checks' => $rows, 'directMissing' => $missing];
    },
    'operations' => function () {
        $numbers = [1, 2, 3, 4, 5]; $last = array_pop($numbers); $first = array_shift($numbers);
        $afterShift = $numbers; unset($numbers[1]); $afterUnset = $numbers;
        $removed = array_splice($numbers, 1, 2);
        $fruits = ['apple', 'pear']; $fruits[] = 'plum';
        $pushSize = array_push($fruits, 'cherry'); $unshiftSize = array_unshift($fruits, 'peach');
        return compact('last', 'first', 'afterShift', 'afterUnset', 'removed', 'numbers', 'fruits', 'pushSize', 'unshiftSize');
    },
    'iteration' => function () {
        $a = ['x' => 1, 4 => 2]; $pairs = [];
        foreach ($a as $key => $value) $pairs[] = [$key, $value];
        foreach ($a as &$value) $value *= 2;
        unset($value); $value = 99;
        return ['pairs' => $pairs, 'afterReferenceLoop' => $a];
    },
    'merge' => function () {
        $a = [2 => 'left-number', 'x' => 'left']; $b = [2 => 'right-number', 'x' => 'right', 7 => 'seven'];
        return ['merge' => array_merge($a, $b), 'union' => $a + $b, 'replace' => array_replace($a, $b), 'leftUnchanged' => $a];
    },
    'sorting' => function () {
        $initial = ['b' => 2, 'a' => 3, 'c' => 1]; $rows = [];
        foreach (['sort', 'rsort', 'asort', 'arsort', 'ksort', 'krsort'] as $function) {
            $a = $initial; $returned = $function($a); $rows[$function] = ['array' => $a, 'keyOrder' => array_keys($a), 'return' => $returned];
        }
        return $rows;
    },
    'functional' => function () {
        $numbers = [1, 2, 3, 4, 5];
        $map = array_map(fn($n) => $n * 2, $numbers);
        $filter = array_filter($numbers, fn($n) => $n % 2 === 0);
        $reduce = array_reduce($numbers, fn($carry, $n) => $carry + $n, 0);
        $counts = array_count_values(['apple', 'pear', 'apple', 'cherry', 'pear']);
        return compact('numbers', 'map', 'filter', 'reduce', 'counts');
    },
    'extract' => function () {
        $name = 'trusted'; $untrusted = ['name' => 'overwritten'];
        $count = extract($untrusted);
        return ['name' => $name, 'createdVariables' => $count];
    },
    'forms-menu' => function () {
        $request = ['email' => ['unexpected-array'], 'name' => '<b>name</b>'];
        $email = $request['email'] ?? '';
        $escaped = htmlspecialchars($request['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $submenuItem = ['title' => 'Child', 'url' => '/child']; $active = $submenuItem['active'];
        return ['emailIsString' => is_string($email), 'validEmail' => filter_var('user@example.com', FILTER_VALIDATE_EMAIL),
            'invalidEmail' => filter_var('invalid', FILTER_VALIDATE_EMAIL), 'escaped' => $escaped, 'active' => $active];
    },
];
$lines = file(__FILE__);
$records = [];
foreach ($probes as $id => $callback) {
    $reflection = new ReflectionFunction($callback);
    $code = implode('', array_slice($lines, $reflection->getStartLine() - 1, $reflection->getEndLine() - $reflection->getStartLine() + 1));
    $diagnostics = [];
    set_error_handler(function ($level, $message) use (&$diagnostics) { $diagnostics[] = compact('level', 'message'); return true; });
    try { $result = $callback(); } finally { restore_error_handler(); }
    $records[] = ['id' => $id, 'description' => 'Controlled PHP array probe: ' . $id, 'phpVersion' => PHP_VERSION,
        'code' => $code, 'codeHash' => hash('sha256', $code), 'result' => $result, 'diagnostics' => $diagnostics];
}
echo json_encode($records, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
