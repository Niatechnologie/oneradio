<script>
  import { onMount, onDestroy } from 'svelte';

  let { radio, audio, isPlaying, onTogglePlay, onVolumeChange } = $props();

  let status      = $state('ready');
  let statusText  = $state('Prêt');
  let volume      = $state(70);
  let isLoading   = $state(false);
  let errorMsg    = $state('');
  let imgError    = $state(false);
  let imgSrcIndex = $state(0);

  // Essaie plusieurs formats d'URL selon la structure du serveur
  const pochetteSrcs = (() => {
    const base = 'https://oneradiomobile.oneradio.ci/image';
    const srcs = [];
    if (radio.pochette) {
      if (radio.repertoire) srcs.push(`${base}/${radio.repertoire}/${radio.pochette}`);
      srcs.push(`${base}/${radio.pochette}`);
    }
    return srcs;
  })();

  const pochettePath = pochetteSrcs[0] ?? null;

  function onImgError() {
    if (imgSrcIndex + 1 < pochetteSrcs.length) {
      imgSrcIndex += 1;
    } else {
      imgError = true;
    }
  }

  function setupAudioEvents() {
    if (!audio) return;
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay',   handleCanPlay);
    audio.addEventListener('playing',   handlePlaying);
    audio.addEventListener('pause',     handlePause);
    audio.addEventListener('ended',     handleEnded);
    audio.addEventListener('error',     handleError);
    audio.addEventListener('waiting',   handleWaiting);
  }

  function handleLoadStart() { isLoading = true;  status = 'loading'; statusText = 'Chargement…'; errorMsg = ''; }
  function handleCanPlay()   { isLoading = false; }
  function handlePlaying()   { isLoading = false; status = 'playing'; statusText = 'En direct'; }
  function handlePause()     { status = 'ready';  statusText = 'En pause'; }
  function handleEnded()     { status = 'ready';  statusText = 'Terminé'; }
  function handleWaiting()   { status = 'loading'; statusText = 'Mise en mémoire…'; }
  function handleError(e)    { isLoading = false; status = 'error'; statusText = 'Erreur'; errorMsg = 'Impossible de charger le flux'; console.error(e); }

  function handleVolumeInput(e) { volume = +e.target.value; onVolumeChange(volume); }

  onMount(setupAudioEvents);
  onDestroy(() => {
    if (!audio) return;
    ['loadstart','canplay','playing','pause','ended','error','waiting'].forEach(ev => {
      audio.removeEventListener(ev, {handleLoadStart,handleCanPlay,handlePlaying,handlePause,handleEnded,handleError,handleWaiting}[`handle${ev.charAt(0).toUpperCase()+ev.slice(1)}`]);
    });
  });
</script>

<div class="rc" class:rc--playing={isPlaying}>

  <!-- Artwork -->
  <div class="rc-art">
    {#if !imgError && pochetteSrcs.length > 0}
      <img src={pochetteSrcs[imgSrcIndex]} alt={radio.designation}
           class="rc-img"
           onerror={onImgError} />
    {:else}
      <div class="rc-img-fallback">
        <i class="bi bi-broadcast"></i>
        <span>{radio.designation}</span>
      </div>
    {/if}

    <!-- LIVE badge -->
    {#if isPlaying}
      <span class="rc-live">● LIVE</span>
    {/if}
  </div>

  <!-- Infos -->
  <div class="rc-body">
    <div class="rc-name">{radio.designation}</div>
    <div class="rc-desc">{radio.description}</div>

    <!-- Status -->
    <div class="rc-status" class:rc-status--playing={status === 'playing'} class:rc-status--err={status === 'error'}>
      <span class="rc-dot"></span>
      <span>{statusText}</span>
    </div>

    <!-- Controls -->
    <div class="rc-controls">
      <button class="rc-play" class:rc-play--on={isPlaying} onclick={onTogglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Écouter'}>
        {#if isLoading}
          <span class="rc-spinner"></span>
        {:else if isPlaying}
          <i class="bi bi-pause-fill"></i>
        {:else}
          <i class="bi bi-play-fill"></i>
        {/if}
      </button>

      <div class="rc-vol">
        <i class="bi bi-volume-{volume === 0 ? 'mute' : volume < 50 ? 'down' : 'up'}-fill"></i>
        <input type="range" min="0" max="100" bind:value={volume}
               oninput={handleVolumeInput} class="rc-slider" aria-label="Volume" />
        <span class="rc-vol-val">{volume}%</span>
      </div>
    </div>

    {#if errorMsg}
      <p class="rc-err">{errorMsg}</p>
    {/if}
  </div>
</div>

<style>
  .rc {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform .25s, box-shadow .25s, border-color .25s;
    box-shadow: 0 4px 20px rgba(0,0,0,.4);
  }
  .rc:hover     { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.5); }
  .rc--playing  { border-color: #ff1919; box-shadow: 0 0 0 2px rgba(255,25,25,.25), 0 12px 36px rgba(0,0,0,.5); }

  /* Art */
  .rc-art {
    position: relative;
    width: 100%; aspect-ratio: 1;
    background: linear-gradient(135deg, #1f0000 0%, #3a0000 100%);
    overflow: hidden;
  }
  .rc-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .5s ease;
  }
  .rc--playing .rc-img { transform: scale(1.04); }
  .rc-img-fallback {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: .6rem; color: #ff1919;
    background: linear-gradient(135deg, #1a0000 0%, #2d0000 100%);
  }
  .rc-img-fallback i    { font-size: 3rem; }
  .rc-img-fallback span { font-size: .75rem; color: #888; text-align: center; padding: 0 .5rem; }

  /* LIVE badge */
  .rc-live {
    position: absolute; top: .6rem; left: .6rem;
    background: #ff1919; color: #fff;
    font-size: .65rem; font-weight: 800; letter-spacing: .06em;
    padding: .2rem .55rem; border-radius: 20px;
    animation: livePulse 1.8s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%,100% { opacity: 1; } 50% { opacity: .65; }
  }

  /* Body */
  .rc-body {
    padding: .9rem 1rem 1rem;
    display: flex; flex-direction: column; gap: .55rem;
    flex: 1;
  }

  .rc-name {
    font-size: 1rem; font-weight: 700; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rc-desc {
    font-size: .78rem; color: #888; font-style: italic; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Status */
  .rc-status {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .72rem; color: #666; background: #111;
    padding: .25rem .6rem; border-radius: 20px; width: fit-content;
  }
  .rc-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #444;
    flex-shrink: 0; transition: background .3s;
  }
  .rc-status--playing .rc-dot { background: #4caf50; animation: dotPulse 1.4s ease-in-out infinite; }
  .rc-status--err     .rc-dot { background: #f44336; }
  @keyframes dotPulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

  /* Controls */
  .rc-controls {
    display: flex; align-items: center; gap: .75rem; margin-top: .25rem;
  }

  .rc-play {
    width: 44px; height: 44px; border-radius: 50%; border: none; flex-shrink: 0;
    background: #ff1919; color: #fff; font-size: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .18s, transform .18s, box-shadow .18s;
    box-shadow: 0 4px 14px rgba(255,25,25,.35);
  }
  .rc-play:hover:not(:disabled) { background: #cc0000; transform: scale(1.08); }
  .rc-play:active:not(:disabled){ transform: scale(.95); }
  .rc-play--on { background: #fff; color: #ff1919; box-shadow: 0 4px 14px rgba(255,255,255,.15); }
  .rc-play--on:hover:not(:disabled) { background: #f0f0f0; color: #cc0000; }
  .rc-play:disabled { opacity: .7; cursor: not-allowed; }

  .rc-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    animation: spin .7s linear infinite;
    display: block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Volume */
  .rc-vol {
    flex: 1; display: flex; align-items: center; gap: .4rem;
    font-size: .85rem; color: #888;
  }
  .rc-slider {
    flex: 1; height: 4px; border-radius: 4px;
    background: #333; outline: none; -webkit-appearance: none; cursor: pointer;
    accent-color: #ff1919;
  }
  .rc-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%;
    background: #ff1919; cursor: pointer; box-shadow: 0 0 4px rgba(255,25,25,.5);
  }
  .rc-slider::-moz-range-thumb {
    width: 13px; height: 13px; border-radius: 50%;
    background: #ff1919; cursor: pointer; border: none;
  }
  .rc-vol-val { font-size: .7rem; color: #555; min-width: 2.5ch; text-align: right; }

  .rc-err { font-size: .75rem; color: #f44336; margin: 0; }
</style>
