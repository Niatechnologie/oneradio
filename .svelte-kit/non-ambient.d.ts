
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/contact" | "/events" | "/events/[eventId]" | "/news" | "/news/[newsId]" | "/notrecite" | "/notrecite/[magId]" | "/parieur" | "/podcasts" | "/podcasts/[podcastsId]" | "/programme" | "/webradio";
		RouteParams(): {
			"/events/[eventId]": { eventId: string };
			"/news/[newsId]": { newsId: string };
			"/notrecite/[magId]": { magId: string };
			"/podcasts/[podcastsId]": { podcastsId: string }
		};
		LayoutParams(): {
			"/": { eventId?: string; newsId?: string; magId?: string; podcastsId?: string };
			"/contact": Record<string, never>;
			"/events": { eventId?: string };
			"/events/[eventId]": { eventId: string };
			"/news": { newsId?: string };
			"/news/[newsId]": { newsId: string };
			"/notrecite": { magId?: string };
			"/notrecite/[magId]": { magId: string };
			"/parieur": Record<string, never>;
			"/podcasts": { podcastsId?: string };
			"/podcasts/[podcastsId]": { podcastsId: string };
			"/programme": Record<string, never>;
			"/webradio": Record<string, never>
		};
		Pathname(): "/" | "/contact" | "/contact/" | "/events" | "/events/" | `/events/${string}` & {} | `/events/${string}/` & {} | "/news" | "/news/" | `/news/${string}` & {} | `/news/${string}/` & {} | "/notrecite" | "/notrecite/" | `/notrecite/${string}` & {} | `/notrecite/${string}/` & {} | "/parieur" | "/parieur/" | "/podcasts" | "/podcasts/" | `/podcasts/${string}` & {} | `/podcasts/${string}/` & {} | "/programme" | "/programme/" | "/webradio" | "/webradio/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/robots.txt" | string & {};
	}
}