<?php
// Fixed owned supplement: no SOURCE, HTTP input or external side effects.
error_reporting(E_ALL);
$probes = [
    'null-key-argument' => function () {
        $a = ['' => null];
        return ['nullArgument' => array_key_exists(null, $a), 'emptyStringArgument' => array_key_exists('', $a)];
    },
    'key-types' => function () {
        $a = [0 => 'zero', '08' => 'padded', true => 'boolean', null => 'null'];
        $keys = [];
        foreach ($a as $key => $value) $keys[] = ['key' => $key, 'type' => gettype($key), 'value' => $value];
        return $keys;
    },
    'functional-edge-cases' => function () {
        $a = ['x' => 1, 'y' => 2];
        $singleMap = array_map(fn($n) => $n * 2, $a);
        $multipleMap = array_map(fn($x, $y) => $x + $y, $a, $a);
        $emptyReduce = array_reduce([], fn($carry, $n) => $carry + $n, 0);
        $withoutInitial = array_reduce([], fn($carry, $n) => $carry + $n);
        $invalidCounts = array_count_values([1, 'one', false, 1.5]);
        $filtered = array_filter([0, '0', false, null, '', 'keep']);
        return compact('singleMap', 'multipleMap', 'emptyReduce', 'withoutInitial', 'invalidCounts', 'filtered');
    },
];
$lines = file(__FILE__); $records = [];
foreach ($probes as $id => $callback) {
    $reflection = new ReflectionFunction($callback);
    $code = implode('', array_slice($lines, $reflection->getStartLine() - 1, $reflection->getEndLine() - $reflection->getStartLine() + 1));
    $diagnostics = [];
    set_error_handler(function ($level, $message) use (&$diagnostics) { $diagnostics[] = compact('level', 'message'); return true; });
    try { $result = $callback(); } finally { restore_error_handler(); }
    $records[] = ['id' => $id, 'description' => 'Controlled version-sensitive PHP array probe: ' . $id,
        'phpVersion' => PHP_VERSION, 'code' => $code, 'codeHash' => hash('sha256', $code), 'result' => $result, 'diagnostics' => $diagnostics];
}
echo json_encode($records, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
