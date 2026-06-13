<script>
  import { onMount } from 'svelte';
  import img_p from '$lib/img/parieur.png';

  let isVisible = $state(false);
  let copySuccess = $state(false);
  let toastVisible = $state(false);
  let popupBlocked = $state(false);

  const PROMO_CODE = 'OA7245400';
  const AKWABET_URL = 'https://akwabet.com/prematch';

  onMount(() => { isVisible = true; });

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  function copierCode() {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      copySuccess = true;
      setTimeout(() => { copySuccess = false; }, 2000);
    }).catch(() => { fallbackCopy(PROMO_CODE); });
  }

  function ouvrirAkwabet() {
    try { navigator.clipboard.writeText(PROMO_CODE).catch(() => {}); }
    catch(e) { try { fallbackCopy(PROMO_CODE); } catch(e2) {} }

    const popup = window.open(AKWABET_URL, 'akwabet_popup',
      'width=1000,height=700,left=100,top=60,scrollbars=yes,resizable=yes');

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      popupBlocked = true; toastVisible = false;
    } else {
      toastVisible = true; popupBlocked = false;
      setTimeout(() => { toastVisible = false; }, 5000);
    }
  }
</script>

<svelte:head>
  <title>One Radio - Super Parieur</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
</svelte:head>

<div class="sp-page">

  <!-- Hero -->
  <div class="sp-hero">
    <div class="sp-hero-inner">
      <div class="sp-hero-text">
        <div class="sp-hero-label">
          <i class="bi bi-broadcast-pin"></i> One Radio
        </div>
        <h1>Super Parieur</h1>
        <p>Les analyses qui transforment tes pronostics en gains</p>
      </div>
      <img src={img_p} alt="Super Parieur" class="sp-hero-img" />
    </div>
  </div>

  <!-- Body -->
  <div class="sp-body">

    <!-- Steps -->
    <section class="sp-section">
      <h2 class="sp-section-title">
        <i class="bi bi-list-check"></i> Comment participer ?
      </h2>
      <div class="sp-grid">

        <!-- Step 1: Promo -->
        <div class="sp-card sp-card--promo" class:visible={isVisible}>
          <div class="sp-card-head">
            <span class="sp-step-num">1</span>
            <span class="sp-badge">Offre exclusive</span>
            <h3>Bonus de bienvenue +100%</h3>
            <p>Utilisez le code ci-dessous sur Akwabet</p>
          </div>
          <div class="sp-card-body">
            <div class="sp-code-box">
              <div class="sp-code-label">
                <i class="bi bi-tag"></i> Code promo
              </div>
              <div class="sp-code-val">{PROMO_CODE}</div>
              <button class="sp-btn-copy" class:copied={copySuccess} onclick={copierCode}>
                {#if copySuccess}
                  <i class="bi bi-check-lg"></i> Copié
                {:else}
                  <i class="bi bi-clipboard"></i> Copier
                {/if}
              </button>
            </div>
            <ul class="sp-avantages">
              <li><i class="bi bi-check2-circle"></i> Bonus de 100% sur votre premier dépôt</li>
              <li><i class="bi bi-check2-circle"></i> Offre valable 48h après inscription</li>
              <li><i class="bi bi-check2-circle"></i> Collez le code dans le champ "Code promo"</li>
            </ul>
            <button class="sp-btn-open" onclick={ouvrirAkwabet}>
              <i class="bi bi-box-arrow-up-right"></i> Ouvrir Akwabet
            </button>
            <p class="sp-hint">
              <i class="bi bi-info-circle"></i> Le code sera copié automatiquement dans votre presse-papier
            </p>
            {#if toastVisible}
              <div class="sp-toast">
                <i class="bi bi-clipboard-check"></i>
                Code copié ! Collez avec <strong>Ctrl+V</strong> dans le champ "Code promo" sur Akwabet.
              </div>
            {/if}
            {#if popupBlocked}
              <div class="sp-popup-blocked">
                <i class="bi bi-exclamation-triangle"></i>
                Fenêtre bloquée —
                <a href={AKWABET_URL} target="_blank" rel="noopener">Ouvrir Akwabet</a>
                puis coller <strong>{PROMO_CODE}</strong>.
              </div>
            {/if}
          </div>
        </div>

        <!-- Step 2: Timing -->
        <div class="sp-card sp-card--timing" class:visible={isVisible}>
          <span class="sp-step-num sp-step-num--abs">2</span>
          <div class="sp-timing-icon"><i class="bi bi-ticket-perforated"></i></div>
          <h3>Fais ton pari</h3>
          <p>Place tes pronostics sur les matchs de ton choix</p>
          <div class="sp-timing-block">
            <div class="sp-timing-head">
              <i class="bi bi-clock"></i> Horaires de diffusion
            </div>
            <div class="sp-timing-pills">
              <span class="sp-pill">10h30</span>
              <span class="sp-pill">12h30</span>
              <span class="sp-pill">14h30</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Winner -->
    <div class="sp-winner" class:visible={isVisible}>
      <i class="bi bi-award sp-winner-icon"></i>
      <div class="sp-winner-text">
        <h2>Deviens le Super Parieur du jour</h2>
        <p>Celui qui fait le plus de <strong>gros pronostics gagnants</strong> devient le <strong>Super Parieur</strong> du jour !</p>
      </div>
    </div>

    <!-- Warning -->
    <div class="sp-warning" class:visible={isVisible}>
      <i class="bi bi-shield-exclamation sp-warning-icon"></i>
      <div>
        <h3>Rappel important</h3>
        <p>Sans le code promo <strong>{PROMO_CODE}</strong>, ta participation n'est pas valable !</p>
      </div>
    </div>

    <!-- CTA -->
    <div class="sp-cta" class:visible={isVisible}>
      <i class="bi bi-broadcast-pin sp-cta-icon"></i>
      <h2>Super Parieur – One Radio</h2>
      <p>Le jeu qui transforme tes pronostics en gains !</p>
    </div>

  </div>
</div>

<style>
  .sp-page { background: #f8f8f8; min-height: 60vh; }

  /* ── Hero ── */
  .sp-hero {
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    position: relative; overflow: hidden;
  }
  .sp-hero::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent 0%, #ff1919 25%, #ff4444 50%, #ff1919 75%, transparent 100%);
  }
  .sp-hero-inner {
    max-width: 860px; margin: 0 auto;
    padding: 2rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  }
  .sp-hero-label {
    display: inline-flex; align-items: center; gap: .4rem;
    color: #aaa;
    font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    margin-bottom: .5rem;
  }
  .sp-hero-label i { color: #ff1919; }
  .sp-hero-text h1 {
    font-size: 2rem; font-weight: 800; color: #111;
    margin: 0 0 .35rem; letter-spacing: .02em;
  }
  .sp-hero-text p { font-size: .88rem; color: #888; margin: 0; }
  .sp-hero-img { height: 160px; width: auto; object-fit: contain; opacity: .9; flex-shrink: 0; }

  /* ── Body ── */
  .sp-body {
    max-width: 860px; margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    display: flex; flex-direction: column; gap: 1.5rem;
  }

  /* ── Section title ── */
  .sp-section-title {
    font-size: 1rem; font-weight: 700; color: #222;
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: .4rem;
  }
  .sp-section-title i { color: #ff1919; }

  /* ── Grid ── */
  .sp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  /* ── Cards base ── */
  .sp-card {
    background: #fff;
    border: 1px solid #e8e8e8; border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.05);
    overflow: hidden;
    opacity: 0; transform: translateY(16px);
    transition: opacity .4s ease, transform .4s ease, box-shadow .2s;
  }
  .sp-card.visible { opacity: 1; transform: translateY(0); }
  .sp-card:nth-child(2) { transition-delay: .1s; }
  .sp-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.09); }

  /* Step number */
  .sp-step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 50%;
    background: #ff1919; color: #fff;
    font-size: .72rem; font-weight: 700; flex-shrink: 0;
  }
  .sp-step-num--abs { position: absolute; top: 1rem; right: 1rem; }

  /* ── Promo card ── */
  .sp-card--promo { text-align: left; }

  .sp-card-head {
    background: #f8f8f8;
    border-bottom: 1px solid #eee;
    padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: .3rem;
  }
  .sp-card-head .sp-step-num { margin-bottom: .1rem; }
  .sp-badge {
    display: inline-block; width: fit-content;
    background: rgba(255,25,25,.1); color: #cc0000;
    font-size: .65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    padding: 2px 9px; border-radius: 20px;
  }
  .sp-card-head h3 { color: #111; font-size: 1rem; font-weight: 700; margin: 0; }
  .sp-card-head p { color: #888; font-size: .78rem; margin: 0; }

  .sp-card-body { padding: 1.25rem 1.5rem; }

  .sp-code-box {
    border: 1.5px dashed #ddd; border-radius: 10px;
    padding: .85rem 1rem; margin-bottom: .9rem;
    display: flex; align-items: center; flex-wrap: wrap; gap: .5rem;
  }
  .sp-code-label {
    font-size: .68rem; color: #999; text-transform: uppercase; letter-spacing: .05em;
    display: flex; align-items: center; gap: .2rem; white-space: nowrap;
  }
  .sp-code-label i { color: #ff1919; }
  .sp-code-val {
    flex: 1; text-align: center;
    font-size: 1.3rem; font-weight: 800; letter-spacing: .22em;
    color: #111; font-family: monospace;
  }
  .sp-btn-copy {
    background: none; border: 1px solid #ddd; border-radius: 6px;
    padding: 5px 10px; font-size: .72rem; cursor: pointer;
    color: #555; display: inline-flex; align-items: center; gap: .25rem;
    transition: border-color .15s, color .15s; white-space: nowrap;
  }
  .sp-btn-copy:hover { border-color: #ff1919; color: #ff1919; }
  .sp-btn-copy.copied { border-color: #22c55e; color: #16a34a; }

  .sp-avantages { list-style: none; padding: 0; margin: 0 0 1rem; }
  .sp-avantages li {
    display: flex; align-items: center; gap: .5rem;
    font-size: .8rem; color: #555; padding: .28rem 0;
  }
  .sp-avantages li i { color: #ff1919; font-size: .78rem; flex-shrink: 0; }

  .sp-btn-open {
    width: 100%; padding: .75rem 1rem;
    background: #ff1919; color: #fff;
    font-size: .88rem; font-weight: 600;
    border: none; border-radius: 8px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    transition: background .15s;
  }
  .sp-btn-open:hover { background: #cc0000; }

  .sp-hint {
    font-size: .7rem; color: #bbb; text-align: center;
    margin-top: .55rem; display: flex; align-items: center; justify-content: center; gap: .25rem;
  }

  .sp-toast {
    margin-top: .75rem;
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
    padding: .65rem .9rem; font-size: .78rem; color: #166534;
    display: flex; align-items: flex-start; gap: .35rem;
  }
  .sp-popup-blocked {
    margin-top: .75rem;
    background: #fefce8; border: 1px solid #fde68a; border-radius: 8px;
    padding: .65rem .9rem; font-size: .78rem; color: #92400e;
    display: flex; align-items: flex-start; gap: .35rem; flex-wrap: wrap;
  }
  .sp-popup-blocked a { color: #92400e; font-weight: 600; }

  /* ── Timing card ── */
  .sp-card--timing {
    padding: 2rem 1.5rem; text-align: center; position: relative;
    display: flex; flex-direction: column; align-items: center; gap: .7rem;
  }
  .sp-timing-icon {
    font-size: 1.75rem; color: #ff1919;
    width: 52px; height: 52px; border-radius: 50%;
    background: #fff5f5; border: 1px solid #ffd0d0;
    display: flex; align-items: center; justify-content: center;
  }
  .sp-card--timing h3 { font-size: 1.05rem; font-weight: 700; color: #111; margin: 0; }
  .sp-card--timing p { font-size: .82rem; color: #777; margin: 0; line-height: 1.5; }
  .sp-timing-block {
    width: 100%; border-top: 1px solid #f0f0f0; padding-top: .75rem; margin-top: .1rem;
  }
  .sp-timing-head {
    font-size: .75rem; color: #999;
    display: flex; align-items: center; justify-content: center; gap: .3rem; margin-bottom: .55rem;
  }
  .sp-timing-head i { color: #ff1919; }
  .sp-timing-pills { display: flex; justify-content: center; gap: .45rem; flex-wrap: wrap; }
  .sp-pill {
    background: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 20px;
    padding: .28rem .8rem; font-size: .83rem; font-weight: 600; color: #333;
  }

  /* ── Winner ── */
  .sp-winner {
    display: flex; align-items: flex-start; gap: 1.25rem;
    background: #fff; border: 1px solid #e8e8e8; border-radius: 12px;
    padding: 1.4rem 1.75rem; box-shadow: 0 2px 8px rgba(0,0,0,.05);
    opacity: 0; transform: translateY(16px);
    transition: opacity .4s ease .18s, transform .4s ease .18s;
  }
  .sp-winner.visible { opacity: 1; transform: translateY(0); }
  .sp-winner-icon { font-size: 1.9rem; color: #ff1919; flex-shrink: 0; margin-top: .1rem; }
  .sp-winner-text h2 { font-size: 1rem; font-weight: 700; color: #111; margin: 0 0 .35rem; }
  .sp-winner-text p { font-size: .85rem; color: #666; line-height: 1.6; margin: 0; }
  .sp-winner-text strong { color: #ff1919; }

  /* ── Warning ── */
  .sp-warning {
    display: flex; align-items: flex-start; gap: 1rem;
    background: #fff; border: 1px solid #e8e8e8; border-left: 4px solid #ff1919;
    border-radius: 8px; padding: 1.15rem 1.5rem;
    opacity: 0; transform: translateY(16px);
    transition: opacity .4s ease .28s, transform .4s ease .28s;
  }
  .sp-warning.visible { opacity: 1; transform: translateY(0); }
  .sp-warning-icon { font-size: 1.3rem; color: #ff1919; flex-shrink: 0; margin-top: .05rem; }
  .sp-warning h3 { font-size: .9rem; font-weight: 700; color: #111; margin: 0 0 .2rem; }
  .sp-warning p { font-size: .82rem; color: #666; margin: 0; }
  .sp-warning strong { color: #ff1919; }

  /* ── CTA ── */
  .sp-cta {
    background: #fff;
    border: 1px solid #e8e8e8; border-radius: 12px; padding: 2.5rem 2rem;
    text-align: center;
    position: relative; overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,.05);
    opacity: 0; transform: translateY(16px);
    transition: opacity .4s ease .38s, transform .4s ease .38s;
  }
  .sp-cta::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent 0%, #ff1919 25%, #ff4444 50%, #ff1919 75%, transparent 100%);
  }
  .sp-cta.visible { opacity: 1; transform: translateY(0); }
  .sp-cta-icon { font-size: 1.6rem; color: #ff1919; display: block; margin-bottom: .65rem; }
  .sp-cta h2 { font-size: 1.15rem; font-weight: 800; margin: 0 0 .4rem; letter-spacing: .02em; color: #111; }
  .sp-cta p { font-size: .85rem; color: #888; margin: 0; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .sp-hero-inner { flex-direction: column; align-items: flex-start; padding: 1.5rem 1rem; }
    .sp-hero-img { display: none; }
    .sp-hero-text h1 { font-size: 1.5rem; }
    .sp-body { padding: 1.5rem 1rem 3rem; }
    .sp-grid { grid-template-columns: 1fr; }
    .sp-code-box { flex-direction: column; }
    .sp-code-val { font-size: 1.1rem; }
    .sp-winner { flex-direction: column; gap: .75rem; padding: 1.25rem; }
    .sp-cta { padding: 1.75rem 1.25rem; }
  }
</style>
