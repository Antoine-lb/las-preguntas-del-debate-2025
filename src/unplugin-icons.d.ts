// Type definitions for unplugin-icons virtual modules
declare module '~icons/*' {
	import { SvelteComponent } from 'svelte';
	export default class extends SvelteComponent<Record<string, any>> {}
}
