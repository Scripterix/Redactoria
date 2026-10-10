export interface StaticSitePage {
	title: string;
	description: string;
	href: `/${string}`;
}

export const STATIC_SITE_PAGES: readonly StaticSitePage[] = [
	{
		title: 'Strona główna',
		description: 'Punkt wejścia do Redactorii EDU i najważniejszych materiałów.',
		href: '/',
	},
	{
		title: 'Artykuły',
		description: 'Wszystkie opublikowane materiały edukacyjne.',
		href: '/artykuly/',
	},
	{
		title: 'Tematy',
		description: 'Obszary wiedzy rozwijane w Redactorii.',
		href: '/tematy/',
	},
	{
		title: 'O projekcie',
		description: 'Proces redakcyjny, granice systemu i kierunek rozwoju.',
		href: '/o-projekcie/',
	},
	{
		title: 'Szukaj',
		description: 'Wyszukaj artykuły, tematy i publiczne strony projektu.',
		href: '/szukaj/',
	},
	{
		title: 'Mapa strony',
		description: 'Pełny spis publicznych stron, tematów i artykułów.',
		href: '/mapa-strony/',
	},
] as const;
