<script>
  import { onMount, onDestroy } from 'svelte';
  import RadioCard from './RadioCard.svelte';

  const API_URL = 'https://adminradio.oneradio.ci/liste_webradio.php';

  let radios          = $state([]);
  let loading         = $state(true);
  let error           = $state(null);
  let currentPlayingId = $state(null);
  let audioPlayers    = $state({});

  async function loadRadios() {
    try {
      loading = true; error = null;
      const res  = await fetch(API_URL);
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      radios = data;
      data.forEach(radio => {
        const audio = new Audio();
        audio.preload = 'none';
        audio.volume  = 0.7;
        audioPlayers[radio.id] = { audio, url: radio.lien };
      });
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleTogglePlay(radioId) {
    const player = audioPlayers[radioId];
    if (!player) return;
    if (currentPlayingId && currentPlayingId !== radioId) stopRadio(currentPlayingId);
    const { audio } = player;
    if (audio.paused) {
      if (!audio.src) audio.src = player.url;
      audio.play().catch(console.error);
      currentPlayingId = radioId;
    } else {
      audio.pause();
      currentPlayingId = null;
    }
  }

  function stopRadio(radioId) {
    const p = audioPlayers[radioId];
    if (p?.audio) { p.audio.pause(); p.audio.currentTime = 0; }
  }

  function handleVolumeChange(radioId, volume) {
    const p = audioPlayers[radioId];
    if (p?.audio) p.audio.volume = volume / 100;
  }

  onMount(loadRadios);
  onDestroy(() => {
    Object.values(audioPlayers).forEach(p => { if (p.audio) { p.audio.pause(); p.audio.src = ''; } });
  });
</script>

<svelte:head>
  <title>Webradios – One Radio</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

<div class="wr-page">

  <!-- Hero -->
  <div class="wr-hero">
    <div class="wr-hero-glow"></div>
    <div class="wr-hero-inner">
    
      <h1>Nos Webradios</h1>
   
    </div>
    <p class="wr-subtitle">Écoutez les belles sonorités du monde, sélectionnées selon vos goûts du moment.</p>
  </div>

  <!-- Grille -->
  <div class="wr-body">
    {#if loading}
      <div class="wr-loading">
        <span class="wr-spinner"></span>
        <p>Chargement des radios…</p>
      </div>
    {:else if error}
      <div class="wr-error">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <p>{error}</p>
        <button onclick={loadRadios} class="wr-retry">Réessayer</button>
      </div>
    {:else}
      <div class="wr-grid">
        {#each radios as radio (radio.id)}
          <RadioCard
            {radio}
            audio={audioPlayers[radio.id]?.audio}
            isPlaying={currentPlayingId === radio.id}
            onTogglePlay={() => handleTogglePlay(radio.id)}
            onVolumeChange={(v) => handleVolumeChange(radio.id, v)}
          />
        {/each}
      </div>
    {/if}

    <!-- CTA -->
    <div class="wr-cta">
      <div class="wr-cta-icon"><i class="bi bi-broadcast-pin"></i></div>
      <div class="wr-cta-body">
        <p>Nous mettons à votre disposition des <strong>webradios personnalisées</strong>. Contactez notre service technique pour des solutions <strong>clé en main</strong>.</p>
        <a href="tel:+2250501877877" class="wr-cta-btn">
          <i class="bi bi-telephone-fill"></i> (+225) 05 01 877 877
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .wr-page {
    min-height: 60vh;
    background: #f8f8f8;
    color: #222;
    font-family: 'Roboto', sans-serif;
  }

  /* Hero */
  .wr-hero {
    background: linear-gradient(180deg, #fff0f0 0%, #f8f8f8 100%);
    padding: 2.5rem 1.25rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
  }
  .wr-hero-glow {
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 400px; height: 200px;
    background: radial-gradient(ellipse, rgba(255,25,25,.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .wr-hero-inner {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center; gap: .75rem;
    margin-bottom: .75rem;
  }
  .wr-hero h1 {
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    font-weight: 800; color: #111; margin: 0;
    letter-spacing: .03em;
  }
  .wr-subtitle {
    position: relative; z-index: 1;
    font-size: .9rem; color: #666; line-height: 1.6; max-width: 420px; margin: 0 auto;
  }

  /* Animated bars */
  @keyframes wave {
    0%,100% { transform: scaleY(1); }
    50%      { transform: scaleY(2.2); }
  }
  .wr-bars { display: flex; align-items: flex-end; gap: 3px; height: 26px; }
  .wr-bars--flip { transform: scaleX(-1); }
  .bar {
    display: inline-block; width: 4px; border-radius: 2px;
    background: #ff1919; transform-origin: bottom;
  }
  .bar:nth-child(1) { animation: wave .9s ease-in-out infinite 0s;    height: 12px; }
  .bar:nth-child(2) { animation: wave .9s ease-in-out infinite .15s;  height: 20px; }
  .bar:nth-child(3) { animation: wave .9s ease-in-out infinite .3s;   height: 10px; }
  .bar:nth-child(4) { animation: wave .9s ease-in-out infinite .45s;  height: 18px; }
  .bar:nth-child(5) { animation: wave .9s ease-in-out infinite .6s;   height: 14px; }

  /* Body */
  .wr-body {
    max-width: 1200px; margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
  }

  /* Grid */
  .wr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: .85rem;
  }

  /* Loading */
  .wr-loading {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; padding: 4rem; color: #888;
  }
  .wr-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid #ddd; border-top-color: #ff1919;
    animation: spin .7s linear infinite; display: block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Error */
  .wr-error {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; padding: 4rem; text-align: center; color: #888;
  }
  .wr-error i { font-size: 2.5rem; color: #ff1919; }
  .wr-retry {
    padding: .55rem 1.5rem; background: #ff1919; color: #fff;
    border: none; border-radius: 2rem; font-weight: 700; cursor: pointer;
    transition: background .18s;
  }
  .wr-retry:hover { background: #cc0000; }

  /* CTA */
  .wr-cta {
    display: flex; align-items: center; gap: 1.25rem;
    background: linear-gradient(135deg, #fff0f0, #ffe8e8);
    border: 1px solid #ffcccc; border-radius: 14px;
    padding: 1.5rem 1.75rem; margin-top: 2.5rem;
  }
  .wr-cta-icon { font-size: 2.2rem; color: #ff1919; flex-shrink: 0; }
  .wr-cta-body { display: flex; flex-direction: column; gap: .75rem; }
  .wr-cta-body p { font-size: .9rem; color: #555; line-height: 1.6; margin: 0; }
  .wr-cta-body strong { color: #111; }
  .wr-cta-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    background: #ff1919; color: #fff; font-weight: 700; font-size: .9rem;
    padding: .5rem 1.25rem; border-radius: 2rem; text-decoration: none;
    width: fit-content; transition: background .18s, transform .18s;
  }
  .wr-cta-btn:hover { background: #cc0000; transform: scale(1.03); }

  @media (max-width: 600px) {
    .wr-grid { grid-template-columns: 1fr; }
    .wr-cta  { flex-direction: column; padding: 1.25rem; }
  }
</style>
