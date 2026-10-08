import { createHash } from 'node:crypto';

/** Deterministic JSON for system contracts; arrays retain semantic order. */
export function stableJson(value: unknown): string {
	function order(item: unknown): unknown {
		if (Array.isArray(item)) return item.map(order);
		if (item && typeof item === 'object') {
			return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
				.map(([key, child]) => [key, order(child)]));
		}
		return item;
	}
	return JSON.stringify(order(value), null, 2) + '\n';
}

export function hashJson(value: unknown): string {
	return createHash('sha256').update(stableJson(value)).digest('hex');
}
