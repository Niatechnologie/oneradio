<script>
  import { onMount } from 'svelte';
  import loader from '$lib/img/loader.gif'
  import Pagination from "../pagination.svelte";

  let items        = $state([]);
  let isLoading    = $state(true);
  let error        = $state(null);
  let currentPage  = $state(1);
  let itemsPerPage = $state(6);
  let totalItems   = $state(0);

  async function loadData() {
    isLoading = true; error = null;
    try {
      const [pag, all] = await Promise.all([
        fetch(`https://adminradio.oneradio.ci/radio_one/events.php?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`https://adminradio.oneradio.ci/radio_one/allevents.php`)
      ]);
      if (!pag.ok) throw new Error(`Erreur ${pag.status}`);
      const [pagData, allData] = await Promise.all([pag.json(), all.json()]);
      items      = pagData || [];
      totalItems = Array.isArray(allData) ? allData.length : 0;
    } catch (e) {
      error = e;
    } finally {
      isLoading = false;
    }
  }

  async function handlePageChange(event) {
    currentPage = event.detail.page;
    if (event.detail.itemsPerPage) itemsPerPage = event.detail.itemsPerPage;
    await loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(loadData);
</script>

<svelte:head>
  <title>Événements – One Radio</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

<div class="ev-page">

  <!-- Hero -->
  <div class="ev-hero">
    <div class="ev-hero-glow"></div>
    <div class="ev-hero-content">
      <span class="ev-hero-tag"><i class="bi bi-calendar-event-fill"></i> Agenda</span>
      <h1>Événements</h1>
      <p>Retrouvez tous nos événements, spectacles et soirées exclusives.</p>
    </div>
  </div>

  <main class="ev-main">

    <!-- ── IN HOUSE ── -->
    <section class="ev-section">
      <div class="ev-section-head">
        <h2><i class="bi bi-stars"></i> Événements In House</h2>
        <span class="ev-section-badge">Exclusif</span>
      </div>

      <div class="inhouse-grid">

        <!-- ORMA -->
        <article class="ih-card ih-card--orma">
          <div class="ih-card-bg">
            <div class="ih-card-icon"><i class="bi bi-trophy-fill"></i></div>
          </div>
          <div class="ih-card-body">
            <h3>ONE RADIO MUSIC AWARD</h3>
            <p class="ih-sub">La grande messe annuelle de la musique urbaine et africaine</p>
            <p class="ih-desc">
              Le <strong>ORMA</strong> est un événement musical majeur dédié à la célébration,
              la valorisation et la reconnaissance des talents musicaux en Côte d'Ivoire et en Afrique.
            </p>
            <div class="ih-chips">
              <span>Trophées</span>
              <span>Live</span>
              <span>Concert</span>
              <span>Tapis rouge</span>
            </div>
            <div class="ih-meta">
              <span><i class="bi bi-calendar3"></i> Vendredi 04 Décembre</span>
              <span><i class="bi bi-geo-alt-fill"></i> Lieu à confirmer</span>
            </div>
            <a href="/events/awards" class="ih-btn ih-btn--orma">
              Découvrir <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </article>

        <!-- ONE COMEDY CLUB -->
        <article class="ih-card ih-card--occ">
          <div class="ih-card-bg">
            <div class="ih-card-icon"><i class="bi bi-emoji-laughing-fill"></i></div>
          </div>
          <div class="ih-card-body">
            <h3>ONE COMEDY CLUB</h3>
            <p class="ih-sub">La plateforme humoristique officielle de One Radio</p>
            <p class="ih-desc">
              <strong>ONE COMEDY CLUB</strong> est dédié à la découverte, la production et la promotion
              des talents du stand-up en Côte d'Ivoire et en Afrique.
            </p>
            <div class="ih-chips">
              <span>Open mic</span>
              <span>One man show</span>
              <span>Academy</span>
              <span>Radio</span>
            </div>
            <div class="ih-meta">
              <span><i class="bi bi-calendar3"></i> Soirées régulières</span>
              <span><i class="bi bi-geo-alt-fill"></i> Abidjan &amp; Afrique</span>
            </div>
            <a href="/events/one-comedy-club" class="ih-btn ih-btn--occ">
              Découvrir <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </article>

        <!-- ONE SPORT -->
        <article class="ih-card ih-card--sport">
          <div class="ih-card-bg">
            <div class="ih-card-icon"><i class="bi bi-dribbble"></i></div>
          </div>
          <div class="ih-card-body">
            <h3>ONE SPORT</h3>
            <p class="ih-sub">La billetterie officielle des matchs et événements sportifs</p>
            <p class="ih-desc">
              <strong>ONE SPORT</strong> est la plateforme dédiée à la vente de tickets pour les matchs
              et événements sportifs majeurs en Côte d'Ivoire et dans la sous-région.
            </p>
            <div class="ih-chips">
              <span>Tickets en ligne</span>
              <span>Accès rapide</span>
              <span>Grands événements</span>
              <span>Paiement sécurisé</span>
            </div>
            <div class="ih-meta">
              <span><i class="bi bi-calendar3"></i> Prochains matchs</span>
              <span><i class="bi bi-geo-alt-fill"></i> Stades partenaires</span>
            </div>
            <a href="/events/one-sport" class="ih-btn ih-btn--sport">
              Acheter un ticket <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </article>

      </div>
    </section>

    <!-- ── OTHERS ── -->
    <section class="ev-section">
      <div class="ev-section-head">
        <h2><i class="bi bi-calendar3"></i> Autres événements</h2>
      </div>

      <Pagination {currentPage} {totalItems} {itemsPerPage}
        maxVisiblePages={5} showInfo={false} showFirstLast={true}
        on:pageChange={handlePageChange} />

      {#if isLoading}
        <div class="ev-loading">
          <img src={loader} alt="chargement" />
        </div>
      {:else if error}
        <div class="ev-error">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <p>Erreur : {error.message}</p>
        </div>
      {:else if items.length === 0}
        <div class="ev-empty">
          <i class="bi bi-calendar-x"></i>
          <p>Aucun événement pour le moment.</p>
        </div>
      {:else}
        <div class="ev-grid">
          {#each items as event}
            <article class="ev-card">
              <a href="/events/{event.slug}" class="ev-card-img-wrap">
                <img src="https://adminradio.oneradio.ci/cropavatar/img/{event.photo}"
                     alt={event.titre} class="ev-card-img" />
                <span class="ev-card-cat">{event.categorie}</span>
              </a>
              <div class="ev-card-body">
                <div class="ev-card-meta">
                  <i class="bi bi-calendar3"></i>
                  <span>{event.datepub}</span>
                </div>
                <h3 class="ev-card-title">
                  <a href="/events/{event.slug}">{event.titre}</a>
                </h3>
                <a href="/events/{event.slug}" class="ev-card-link">
                  Voir plus <i class="bi bi-arrow-right-short"></i>
                </a>
              </div>
            </article>
          {/each}
        </div>
      {/if}

      <Pagination {currentPage} {totalItems} {itemsPerPage}
        maxVisiblePages={5} showInfo={false} showFirstLast={true}
        on:pageChange={handlePageChange} />
    </section>

  </main>
</div>

<style>
  .ev-page { background: #fff; min-height: 60vh; }

  /* ── Hero ── */
  .ev-hero {
    background: linear-gradient(135deg, #110000 0%, #1a0000 50%, #2d0000 100%);
    padding: 3rem 1.5rem 2.5rem;
    text-align: center;
    position: relative; overflow: hidden;
    border-bottom: 3px solid #ff1919;
  }
  .ev-hero-glow {
    position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 500px; height: 260px;
    background: radial-gradient(ellipse, rgba(255,25,25,.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .ev-hero-content { position: relative; z-index: 1; }
  .ev-hero-tag {
    display: inline-flex; align-items: center; gap: .4rem;
    background: rgba(255,25,25,.15); color: #ff6666;
    border: 1px solid rgba(255,25,25,.3);
    font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .3rem .85rem; border-radius: 20px; margin-bottom: .85rem;
  }
  .ev-hero h1 {
    font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 900;
    color: #fff; margin: 0 0 .6rem; letter-spacing: .02em;
  }
  .ev-hero p { font-size: .95rem; color: #999; max-width: 460px; margin: 0 auto; line-height: 1.6; }

  /* ── Layout ── */
  .ev-main { max-width: 1300px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }

  .ev-section { margin-bottom: 3rem; }
  .ev-section-head {
    display: flex; align-items: center; gap: .75rem;
    margin-bottom: 1.5rem; padding-bottom: .75rem;
    border-bottom: 2px solid #f0f0f0;
  }
  .ev-section-head h2 {
    font-size: 1.3rem; font-weight: 800; color: #111;
    display: flex; align-items: center; gap: .45rem; margin: 0;
  }
  .ev-section-head h2 i { color: #ff1919; }
  .ev-section-badge {
    margin-left: auto;
    background: #ff1919; color: #fff;
    font-size: .7rem; font-weight: 800; letter-spacing: .07em; text-transform: uppercase;
    padding: .2rem .65rem; border-radius: 20px;
  }

  /* ── In House grid ── */
  .inhouse-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .ih-card {
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,.1);
    display: flex; flex-direction: column;
    transition: transform .25s, box-shadow .25s;
    border: 1px solid #f0f0f0;
  }
  .ih-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(0,0,0,.15); }

  /* Gradient tops */
  .ih-card-bg {
    height: 140px; display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .ih-card--orma  .ih-card-bg { background: linear-gradient(135deg, #1a1a1a 0%, #2d0000 50%, #cc0000 100%); }
  .ih-card--occ   .ih-card-bg { background: linear-gradient(135deg, #0f0020 0%, #1a0040 50%, #3d0080 100%); }
  .ih-card--sport .ih-card-bg { background: linear-gradient(135deg, #001a00 0%, #003300 50%, #005500 100%); }
  .ih-card-icon { font-size: 3.5rem; opacity: .85; }
  .ih-card--orma  .ih-card-icon { color: #ffd700; }
  .ih-card--occ   .ih-card-icon { color: #f5c518; }
  .ih-card--sport .ih-card-icon { color: #66ff66; }

  /* Card body */
  .ih-card-body {
    padding: 1.25rem 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: .6rem; flex: 1;
    background: #fff;
  }

  .ih-badge {
    display: inline-block; font-size: .65rem; font-weight: 800;
    letter-spacing: .08em; text-transform: uppercase;
    padding: .2rem .6rem; border-radius: 20px;
    background: #ffd700; color: #1a1a1a; width: fit-content;
  }
  .ih-badge--occ   { background: #f5c518; color: #121212; }
  .ih-badge--sport { background: #28a745; color: #fff; }

  .ih-card-body h3 {
    font-size: 1.05rem; font-weight: 800; color: #111; margin: 0; line-height: 1.2;
  }
  .ih-sub  { font-size: .8rem; color: #888; font-style: italic; margin: 0; }
  .ih-desc { font-size: .85rem; color: #555; line-height: 1.55; margin: 0; }
  .ih-desc strong { color: #111; }

  .ih-chips {
    display: flex; flex-wrap: wrap; gap: .35rem;
  }
  .ih-chips span {
    display: inline-flex; align-items: center; gap: .3rem;
    background: #f5f5f5; color: #444;
    font-size: .72rem; padding: .22rem .6rem; border-radius: 20px; font-weight: 500;
  }
  .ih-chips i { color: #ff1919; font-size: .7rem; }

  .ih-meta {
    display: flex; flex-wrap: wrap; gap: .75rem; margin-top: auto; padding-top: .25rem;
  }
  .ih-meta span {
    display: inline-flex; align-items: center; gap: .35rem;
    font-size: .78rem; color: #777; font-weight: 500;
  }
  .ih-meta i { color: #ff1919; }

  .ih-btn {
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .55rem 1.15rem; border-radius: 2rem;
    font-size: .85rem; font-weight: 700; text-decoration: none;
    width: fit-content; transition: all .2s ease;
    margin-top: .25rem;
  }
  .ih-btn--orma  { background: linear-gradient(135deg,#ff1919,#cc0000); color:#fff; }
  .ih-btn--orma:hover  { background: linear-gradient(135deg,#cc0000,#990000); transform:scale(1.04); box-shadow:0 4px 14px rgba(255,25,25,.35); }
  .ih-btn--occ   { background: linear-gradient(135deg,#f5c518,#d4a800); color:#121212; }
  .ih-btn--occ:hover   { background: linear-gradient(135deg,#d4a800,#a07800); transform:scale(1.04); }
  .ih-btn--sport { background: linear-gradient(135deg,#28a745,#1e7e34); color:#fff; }
  .ih-btn--sport:hover { background: linear-gradient(135deg,#1e7e34,#155724); transform:scale(1.04); }

  /* ── Others grid ── */
  .ev-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    margin: 1.25rem 0;
  }

  .ev-card {
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 14px rgba(0,0,0,.08);
    background: #fff; border: 1px solid #eee;
    display: flex; flex-direction: column;
    transition: transform .22s, box-shadow .22s;
  }
  .ev-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,.13); }

  .ev-card-img-wrap { position: relative; overflow: hidden; display: block; }
  .ev-card-img {
    width: 100%; height: 200px; object-fit: cover; display: block;
    transition: transform .35s ease;
  }
  .ev-card:hover .ev-card-img { transform: scale(1.04); }
  .ev-card-cat {
    position: absolute; top: .6rem; left: .6rem;
    background: #ff1919; color: #fff;
    font-size: .65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    padding: .2rem .6rem; border-radius: 20px;
  }

  .ev-card-body { padding: 1rem 1.1rem 1.25rem; display: flex; flex-direction: column; flex: 1; gap: .45rem; }
  .ev-card-meta {
    display: flex; align-items: center; gap: .35rem;
    font-size: .75rem; color: #aaa;
  }
  .ev-card-meta i { color: #ff1919; }
  .ev-card-title {
    font-size: .97rem; font-weight: 700; color: #111; margin: 0; line-height: 1.35;
  }
  .ev-card-title a { text-decoration: none; color: inherit; }
  .ev-card-title a:hover { color: #ff1919; }
  .ev-card-link {
    display: inline-flex; align-items: center; gap: .2rem;
    color: #ff1919; font-size: .82rem; font-weight: 700;
    text-decoration: none; margin-top: auto; width: fit-content;
    transition: gap .18s;
  }
  .ev-card-link:hover { gap: .45rem; }

  /* States */
  .ev-loading {
    display: flex; justify-content: center; padding: 3rem;
  }
  .ev-error, .ev-empty {
    display: flex; flex-direction: column; align-items: center; gap: .75rem;
    padding: 3rem; color: #bbb; text-align: center;
  }
  .ev-error i { font-size: 2.5rem; color: #ff1919; }
  .ev-empty i  { font-size: 2.5rem; color: #ddd; }

  /* Responsive */
  @media (max-width: 960px) {
    .inhouse-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .inhouse-grid { grid-template-columns: 1fr; }
    .ev-grid      { grid-template-columns: 1fr; }
    .ev-hero      { padding: 2rem 1rem 1.75rem; }
  }
</style>
