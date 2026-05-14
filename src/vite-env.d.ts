
/// <reference types="vite/client" />

declare global {
	interface Window {
		__platoonSizes?: Record<string, number>;
	}
}

export {};
