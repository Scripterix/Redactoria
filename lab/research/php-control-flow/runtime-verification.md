# B2 runtime verification

PASS: PHP 8.4.26 and 8.5.11, 8 owned probes per version, 24 exact assertions per version.

Actual local CLI; archives, binaries and PHP_VERSION checked. SOURCE not executed. stdin; -n, E_ALL, stderr diagnostics; 5s timeout, 32M memory. Checks: exact stdout (JSON result), empty stderr, exit 0. Results do not prove all PHP behaviour. No errata or unresolved runtime findings. See JSON for code hashes, timestamps, invocations and results.
