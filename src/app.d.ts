import type { DehydratedState } from '@tanstack/svelte-query';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			dehydrated: DehydratedState;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
