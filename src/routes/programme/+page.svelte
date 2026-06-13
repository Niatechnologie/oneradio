<script>
  import { onMount } from 'svelte';

  let { data } = $props();
  const scheduleData = data.programme;

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  function getCurrentDay() {
    return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][new Date().getDay()];
  }

  let selectedDay = $state(getCurrentDay());
  let now = $state(new Date());

  onMount(() => {
    const t = setInterval(() => { now = new Date(); }, 30000);
    return () => clearInterval(t);
  });

  function isOnAir(hdebut, hfin) {
    if (selectedDay !== getCurrentDay()) return false;
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= toMin(hdebut) && cur < toMin(hfin);
  }

  const categoryIcon = {
    'Culture':   'bi-music-note-beamed',
    'Politique': 'bi-megaphone-fill',
    'talk':      'bi-people-fill',
    'Sport':     'bi-trophy-fill',
    'Info':      'bi-newspaper',
    'Religion':  'bi-star-fill',
  };

  function getCatIcon(cat) {
    return categoryIcon[cat] ?? 'bi-broadcast';
  }
</script>

<svelte:head>
  <title>Émissions – One Radio</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

<div class="pg-page">

  <!-- Hero -->
  <div class="pg-hero">
    <div class="pg-hero-glow"></div>
    <div class="pg-hero-inner">
      <i class="bi bi-broadcast-pin pg-hero-icon"></i>
      <div>
        <h1>Nos Émissions</h1>
        <p>Programme hebdomadaire de One Radio</p>
      </div>
    </div>
    <div class="pg-hero-contact">
      <a href="tel:+2250501877877" class="pg-phone">
        <i class="bi bi-telephone-fill"></i> (+225) 05 01 877 877
      </a>
      <div class="pg-socials">
        <a href="https://wa.me/2250501877877"                                target="_blank" rel="noopener" class="pg-soc pg-soc-wa"  aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
        <a href="https://www.facebook.com/oneradioci"                        target="_blank" rel="noopener" class="pg-soc pg-soc-fb"  aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="https://www.youtube.com/@oneradiocotedivoire6837"           target="_blank" rel="noopener" class="pg-soc pg-soc-yt"  aria-label="YouTube"><i class="bi bi-youtube"></i></a>
        <a href="https://www.tiktok.com/@oneradioci?_r=1&_t=ZS-95MxlXMAaPv" target="_blank" rel="noopener" class="pg-soc pg-soc-tt"  aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
      </div>
    </div>
  </div>

  <!-- Onglets jours -->
  <div class="pg-tabs-wrap">
    <nav class="pg-tabs">
      {#each weekDays as day}
        <button class="pg-tab" class:pg-tab--active={selectedDay === day} onclick={() => selectedDay = day}>
          <span class="pg-tab-short">{day.slice(0,3)}</span>
          <span class="pg-tab-full">{day}</span>
          {#if day === getCurrentDay()}<span class="pg-tab-dot"></span>{/if}
        </button>
      {/each}
    </nav>
  </div>

  <!-- Liste émissions -->
  <div class="pg-body">
    <div class="pg-list">
      {#if scheduleData[selectedDay]?.length}
        {#each scheduleData[selectedDay] as program}
          {@const live = isOnAir(program.hdebut, program.hfin)}
          <div class="pg-card" class:pg-card--live={live}>

            {#if live}
              <div class="pg-live-badge">
                <span class="pg-live-dot"></span> EN COURS DE DIFFUSION
              </div>
            {/if}

            <div class="pg-card-inner">

              <!-- Pochette -->
              <div class="pg-pochette" class:pg-pochette--live={live}>
                <img src="https://adminradio.oneradio.ci/emissions/{program.photo}"
                     alt={program.designation}
                     onerror={(e) => e.currentTarget.style.display='none'} />
                <div class="pg-pochette-fallback"><i class="bi bi-mic-fill"></i></div>
              </div>

              <!-- Infos -->
              <div class="pg-info">
                <h3 class="pg-title">{program.designation}</h3>
                <div class="pg-meta">
                  <span class="pg-presenter"><i class="bi bi-person-fill"></i> {program.presentateur}</span>
                  <span class="pg-cat"><i class="bi {getCatIcon(program.categorie)}"></i> {program.categorie}</span>
                </div>
                <p class="pg-desc">{@html program.description}</p>
              </div>

              <!-- Horaire -->
              <div class="pg-time" class:pg-time--live={live}>
                <i class="bi bi-clock-fill"></i>
                <span class="pg-time-val">{program.hdebut}</span>
                <span class="pg-time-sep">—</span>
                <span class="pg-time-val">{program.hfin}</span>
              </div>

            </div>
          </div>
        {/each}
      {:else}
        <div class="pg-empty">
          <i class="bi bi-calendar-x"></i>
          <p>Aucune émission ce jour.</p>
        </div>
      {/if}
    </div>
  </div>

</div>

<style>
  .pg-page { background: #f8f8f8; min-height: 60vh; }

  /* ── Hero ── */
  .pg-hero {
    background: linear-gradient(135deg, #110000 0%, #1a0000 60%, #2d0000 100%);
    padding: 1.75rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
    position: relative; overflow: hidden;
  }
  .pg-hero-glow {
    position: absolute; top: -60px; left: 30%; transform: translateX(-50%);
    width: 400px; height: 200px;
    pointer-events: none;
  }
  .pg-hero-inner {
    display: flex; align-items: center; gap: 1rem; position: relative; z-index: 1;
  }
  .pg-hero-icon { font-size: 2.2rem; color: #ff1919; }
  .pg-hero-inner h1 { font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0; }
  .pg-hero-inner p  { font-size: .8rem; color: #888; margin: 0; }

  .pg-hero-contact {
    display: flex; flex-direction: column; align-items: flex-end; gap: .5rem;
    position: relative; z-index: 1;
  }
  .pg-phone {
    display: inline-flex; align-items: center; gap: .4rem;
    color: #fff; font-weight: 700; font-size: .95rem; text-decoration: none;
    transition: color .18s;
  }
  .pg-phone i { color: #ff1919; }
  .pg-phone:hover { color: #ff6666; }

  .pg-socials { display: flex; gap: .4rem; }
  .pg-soc {
    width: 30px; height: 30px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-size: .85rem; text-decoration: none;
    transition: transform .18s, background .18s;
  }
  .pg-soc:hover { transform: scale(1.12); }
  .pg-soc-wa { color:#ffffff; } .pg-soc-wa:hover { background:#25d366; color:#fff; }
  .pg-soc-fb { color:#ffffff; } .pg-soc-fb:hover { background:#1877f2; color:#fff; }
  .pg-soc-yt { color:#ffffff; } .pg-soc-yt:hover { background:#ff0000; color:#fff; }
  .pg-soc-tt { color:#ffffff;    } .pg-soc-tt:hover { background:#333; color:#fff; }

  /* ── Tabs ── */
  .pg-tabs-wrap {
    background: #fff; border-bottom: 1px solid #eee;
    padding: .5rem 1.25rem;
    position: sticky; top: 0; z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
  }
  .pg-tabs {
    max-width: 860px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(7, 1fr);
    gap: .25rem;
  }
  .pg-tab {
    padding: .55rem .25rem; border: none; background: none; cursor: pointer;
    border-radius: 8px; font-size: .82rem; font-weight: 600; color: #888;
    transition: background .18s, color .18s;
    position: relative; display: flex; flex-direction: column; align-items: center; gap: .15rem;
  }
  .pg-tab:hover { background: #f5f5f5; color: #333; }
  .pg-tab--active { background: #ff1919; color: #fff !important; }
  .pg-tab-short { display: block; }
  .pg-tab-full  { display: none; }
  .pg-tab-dot   {
    width: 5px; height: 5px; border-radius: 50%; background: currentColor;
    position: absolute; bottom: .25rem;
  }
  .pg-tab--active .pg-tab-dot { background: rgba(255,255,255,.7); }

  @media (min-width: 640px) {
    .pg-tab-short { display: none; }
    .pg-tab-full  { display: block; }
  }

  /* ── Body ── */
  .pg-body {
    max-width: 860px; margin: 0 auto;
    padding: 1.5rem 1.25rem 4rem;
  }
  .pg-list { display: flex; flex-direction: column; gap: .75rem; }

  /* ── Cards ── */
  .pg-card {
    background: #fff; border-radius: 12px;
    border: 1px solid #eee;
    box-shadow: 0 1px 6px rgba(0,0,0,.05);
    overflow: hidden;
    transition: box-shadow .2s, transform .2s;
  }
  .pg-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); transform: translateY(-1px); }
  .pg-card--live {
    border-color: #ff1919;
    background: linear-gradient(135deg, #fff8f8 0%, #fff 70%);
    box-shadow: 0 0 0 2px rgba(255,25,25,.15), 0 4px 16px rgba(0,0,0,.08);
  }

  .pg-live-badge {
    display: flex; align-items: center; gap: .4rem;
    background: #ff1919; color: #fff;
    font-size: .65rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    padding: .3rem 1rem;
  }
  .pg-live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #fff;
    animation: liveBlink 1.1s ease-in-out infinite; flex-shrink: 0;
  }
  @keyframes liveBlink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.2;transform:scale(.65)} }

  .pg-card-inner {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: .9rem 1rem;
  }

  /* Pochette */
  .pg-pochette {
    width: 72px; height: 72px; border-radius: 10px; overflow: hidden;
    flex-shrink: 0; background: #f0f0f0; position: relative;
    border: 2px solid #eee;
  }
  .pg-pochette--live { border-color: #ff1919; }
  .pg-pochette img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    position: relative; z-index: 1;
  }
  .pg-pochette-fallback {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; color: #ff1919; background: #f9f0f0; z-index: 0;
  }

  /* Infos */
  .pg-info { flex: 1; min-width: 0; }
  .pg-title {
    font-size: 1rem; font-weight: 700; color: #111;
    margin: 0 0 .3rem; line-height: 1.25;
  }
  .pg-meta {
    display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: .4rem;
  }
  .pg-presenter, .pg-cat {
    display: inline-flex; align-items: center; gap: .3rem;
    font-size: .75rem; color: #888;
  }
  .pg-presenter i, .pg-cat i { color: #ff1919; font-size: .72rem; }
  .pg-desc {
    font-size: .8rem; color: #666; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    margin: 0;
  }

  /* Horaire */
  .pg-time {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: .1rem; flex-shrink: 0; min-width: 64px;
    background: #f5f5f5; border-radius: 10px;
    padding: .5rem .65rem; text-align: center;
  }
  .pg-time--live { background: #ff1919; color: #fff; }
  .pg-time i { font-size: .75rem; color: #999; }
  .pg-time--live i { color: rgba(255,255,255,.7); }
  .pg-time-val { font-size: .9rem; font-weight: 700; color: #111; line-height: 1.1; }
  .pg-time--live .pg-time-val { color: #fff; }
  .pg-time-sep { font-size: .65rem; color: #bbb; }
  .pg-time--live .pg-time-sep { color: rgba(255,255,255,.6); }

  /* Empty */
  .pg-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: .75rem; padding: 4rem; color: #ccc; text-align: center;
  }
  .pg-empty i { font-size: 3rem; }

  @media (max-width: 560px) {
    .pg-hero { flex-direction: column; align-items: flex-start; padding: 1.25rem 1rem; }
    .pg-hero-contact { align-items: flex-start; }
    .pg-card-inner { gap: .65rem; }
    .pg-pochette { width: 56px; height: 56px; }
  }
</style>
