import { writable } from 'svelte/store';

// true while a webradio (or any other secondary audio source) is playing —
// the main layout player listens to this to pause itself and resume when it clears.
export const externalAudioPlaying = writable(false);
