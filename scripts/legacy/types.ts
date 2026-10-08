export type ParseStatus = 'ok' | 'needs-review' | 'error';

export interface InventoryRecord {
	source_id: string;
	source_path: string;
	title: string | null;
	slug: string | null;
	original_url: string | null;
	/** Source text, with no inferred timezone or date conversion. */
	original_date: string | null;
	original_author: string | null;
	categories: string[];
	tags: string[];
	/** Approximate body word count; null if the body cannot be located/decoded. */
	word_count: number | null;
	/** SHA-256 of the original file bytes, including BOM and line endings. */
	content_hash: string;
	bom_detected: boolean;
	parse_status: ParseStatus;
	warnings: string[];
	review_status: 'unreviewed';
}

export interface Inventory {
	schema_version: 1;
	articles: InventoryRecord[];
}
