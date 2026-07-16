<script>
  import { onMount, onDestroy } from 'svelte';
  import logo from '$lib/img/logo.svg';

  let { radio, audio, isPlaying, onTogglePlay, onVolumeChange } = $props();

  let status      = $state('ready');
  let statusText  = $state('Prêt');
  let volume      = $state(70);
  let isLoading   = $state(false);
  let errorMsg    = $state('');
  let imgError    = $state(false);
  let imgSrcIndex = $state(0);

  const pochetteSrcs = (() => {
    const srcs = [];
    if (radio.pochette) {
      srcs.push(`https://adminradio.oneradio.ci/webradios/${radio.pochette}`);
    }
    return srcs;
  })();

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

  <!-- Pochette -->
  <div class="rc-art">
    {#if !imgError && pochetteSrcs.length > 0}
      <img src={pochetteSrcs[imgSrcIndex]} alt={radio.designation} class="rc-img" onerror={onImgError} />
    {:else}
      <div class="rc-img-fallback"><img src={logo} alt={radio.designation} class="rc-logo-fallback" /></div>
    {/if}
    {#if isPlaying}<span class="rc-live">● LIVE</span>{/if}

    <button class="rc-play" class:rc-play--on={isPlaying} onclick={onTogglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Écouter'}>
      {#if isLoading}
        <span class="rc-spinner"></span>
      {:else if isPlaying}
        <i class="bi bi-pause-fill"></i>
      {:else}
        <i class="bi bi-play-fill"></i>
      {/if}
    </button>
  </div>

  <!-- Infos + contrôles -->
  <div class="rc-body">
    <div class="rc-top">
      <div class="rc-name">{radio.designation}</div>
      <div class="rc-status" class:rc-status--playing={status === 'playing'} class:rc-status--err={status === 'error'}>
        <span class="rc-dot"></span><span>{statusText}</span>
      </div>
    </div>

    <div class="rc-desc">{radio.description}</div>

    <div class="rc-vol">
      <i class="bi bi-volume-{volume === 0 ? 'mute' : volume < 50 ? 'down' : 'up'}-fill"></i>
      <input type="range" min="0" max="100" bind:value={volume} oninput={handleVolumeInput} class="rc-slider" aria-label="Volume" />
    </div>

    {#if errorMsg}<p class="rc-err">{errorMsg}</p>{/if}
  </div>
</div>

<style>
  .rc {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    width: 230px;
    overflow: hidden;
    transition: transform .22s, box-shadow .22s, border-color .22s;
    box-shadow: 0 2px 12px rgba(0,0,0,.35);
  }
  .rc:hover    { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.5); }
  .rc--playing { border-color: #ff1919; box-shadow: 0 0 0 2px rgba(255,25,25,.2), 0 8px 24px rgba(0,0,0,.5); }

  /* Pochette */
  .rc-art {
    position: relative;
    width: 230px; height: 230px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #1f0000 0%, #3a0000 100%);
    overflow: hidden;
  }
  .rc-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .4s ease;
  }
  .rc:hover .rc-img { transform: scale(1.06); }
  .rc-img-fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #1a0000 0%, #2d0000 100%);
  }
  .rc-logo-fallback { width: 55%; height: 55%; object-fit: contain; }

  /* Play overlay */
  .rc-art::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%);
    pointer-events: none;
  }

  /* LIVE badge */
  .rc-live {
    position: absolute; top: .6rem; left: .6rem; z-index: 2;
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
    padding: .8rem .9rem .9rem;
    display: flex; flex-direction: column; gap: .4rem;
  }
  .rc-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
  .rc-name { font-size: .9rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rc-desc {
    font-size: .72rem; color: #888; font-style: italic; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Status */
  .rc-status {
    display: inline-flex; align-items: center; gap: .3rem;
    font-size: .65rem; color: #666; flex-shrink: 0;
  }
  .rc-dot { width: 6px; height: 6px; border-radius: 50%; background: #444; flex-shrink: 0; }
  .rc-status--playing .rc-dot { background: #4caf50; animation: dotPulse 1.4s ease-in-out infinite; }
  .rc-status--err     .rc-dot { background: #f44336; }
  @keyframes dotPulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

  /* Play button, centered over the artwork */
  .rc-play {
    position: absolute; top: 50%; left: 50%; z-index: 3;
    transform: translate(-50%, -50%);
    width: 52px; height: 52px; border-radius: 50%; border: none;
    background: #ff1919; color: #fff; font-size: 1.3rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .18s, transform .18s;
    box-shadow: 0 4px 14px rgba(0,0,0,.4);
  }
  .rc-play:hover:not(:disabled)  { background: #cc0000; transform: translate(-50%, -50%) scale(1.08); }
  .rc-play:active:not(:disabled) { transform: translate(-50%, -50%) scale(.95); }
  .rc-play--on { background: #fff; color: #ff1919; }
  .rc-play--on:hover:not(:disabled) { background: #f0f0f0; }
  .rc-play:disabled { opacity: .7; cursor: not-allowed; }

  .rc-spinner {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    animation: spin .7s linear infinite; display: block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Volume */
  .rc-vol { display: flex; align-items: center; gap: .35rem; color: #555; font-size: .8rem; }
  .rc-slider {
    flex: 1; height: 3px; border-radius: 4px;
    background: #333; outline: none; -webkit-appearance: none; cursor: pointer;
    accent-color: #ff1919;
  }
  .rc-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 11px; height: 11px; border-radius: 50%;
    background: #ff1919; cursor: pointer;
  }
  .rc-slider::-moz-range-thumb { width: 11px; height: 11px; border-radius: 50%; background: #ff1919; cursor: pointer; border: none; }

  .rc-err { font-size: .7rem; color: #f44336; margin: 0; }
</style>
