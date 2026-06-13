<script>
  import { onMount } from 'svelte';

  let isVisible     = $state(false);
  let comediens     = $state([]);
  let prochains     = $state([]);
  let loadingHum    = $state(true);
  let loadingSpec   = $state(true);

  const BASE= 'https://adminradio.oneradio.ci/radio_one';

  onMount(async () => {
    isVisible = true;

    // Humoristes
    try {
      const res  = await fetch(`${BASE}/humoristes.php`);
      const data = await res.json();
      if (data.success) {
        comediens = data.humoristes.map(h => ({
          id:          h.id,
          photo:       h.photo,
          nom:         h.nom_artiste || `${h.prenom} ${h.nom}`.trim(),
          description: h.description,
          video:       h.video,
          reseaux:     h.reseaux_sociaux || {},
        }));
      }
    } catch (e) { console.warn('Erreur humoristes:', e); }
    finally { loadingHum = false; }

    // Prochains spectacles
    try {
      const res  = await fetch(`${BASE}/prochains-spectacles.php?limit=6`);
      const data = await res.json();
      if (data.success) prochains = data.prochains;
    } catch (e) { console.warn('Erreur spectacles:', e); }
    finally { loadingSpec = false; }
  });

  function fmtDate(str) {
    return new Date(str).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  function fmtHeure(str) {
    return new Date(str).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  const STATUT_STYLE = {
    'planifié': { bg: '#e8f5e9', color: '#2e7d32', icon: 'bi-check-circle-fill' },
    'complet':  { bg: '#fce4ec', color: '#c62828', icon: 'bi-x-circle-fill'     },
    'annulé':   { bg: '#f5f5f5', color: '#757575', icon: 'bi-dash-circle-fill'  },
    'reporté':  { bg: '#fff3e0', color: '#e65100', icon: 'bi-clock-history'     },
  };

  const RESEAUX = [
    { key: 'facebook',  icon: 'bi-facebook',  color: '#1877f2' },
    { key: 'instagram', icon: 'bi-instagram',  color: '#e1306c' },
    { key: 'tiktok',    icon: 'bi-tiktok',     color: '#010101' },
    { key: 'youtube',   icon: 'bi-youtube',    color: '#ff0000' },
    { key: 'twitter',   icon: 'bi-twitter-x',  color: '#000'    },
  ];
</script>

<svelte:head>
  <title>ONE COMEDY CLUB – One Radio</title>
  <meta name="description" content="ONE COMEDY CLUB, la plateforme humoristique officielle de One Radio. Stand-up, live, radio, digital et formation en Côte d'Ivoire et en Afrique." />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

<!-- Hero -->
<div class="occ-hero">
  <div class="occ-hero-inner">
    <p class="occ-tagline">La scène de l'humour ivoirien</p>
  </div>
</div>

<main class="occ-main" class:visible={isVisible}>

  <!-- ── Prochains spectacles ── -->
  {#if !loadingSpec}
    {#if prochains.length > 0}
    <section class="occ-section" class:visible={isVisible}>
      <div class="occ-section-header">
        <h2><i class="bi bi-ticket-perforated-fill" style="color:var(--occ-yellow);margin-right:.4rem;"></i>Prochains spectacles</h2>
      </div>

      <div class="spec-grid">
        {#each prochains as s}
          {@const st = STATUT_STYLE[s.statut] ?? STATUT_STYLE['planifié']}
          <a href="/events/one-comedy-club/spectacles/{s.spectacle.id}" class="spec-card">
            {#if s.spectacle.affiche}
              <div class="spec-affiche-wrap">
                <img src={s.spectacle.affiche} alt={s.spectacle.titre} class="spec-affiche" />
                <span class="spec-statut-badge" style="background:{st.bg};color:{st.color};">
                  <i class="bi {st.icon}"></i> {s.statut}
                </span>
              </div>
            {:else}
              <div class="spec-affiche-placeholder">
                <i class="bi bi-ticket-perforated"></i>
                <span class="spec-statut-badge spec-statut-badge--no-img" style="background:{st.bg};color:{st.color};">
                  <i class="bi {st.icon}"></i> {s.statut}
                </span>
              </div>
            {/if}

            <div class="spec-body">
              <div class="spec-humoriste">
                {#if s.humoriste.photo}
                  <img src={s.humoriste.photo} alt={s.humoriste.nom_artiste} class="spec-hum-avatar" />
                {/if}
                <span>{s.humoriste.nom_artiste || `${s.humoriste.prenom} ${s.humoriste.nom}`.trim()}</span>
              </div>

              <h3 class="spec-titre">{s.spectacle.titre}</h3>

              <div class="spec-info">
                <div class="spec-info-item">
                  <i class="bi bi-calendar3"></i>
                  <span>{fmtDate(s.date_heure)} à {fmtHeure(s.date_heure)}</span>
                </div>
                {#if s.lieu || s.ville}
                <div class="spec-info-item">
                  <i class="bi bi-geo-alt-fill"></i>
                  <span>{[s.lieu, s.ville].filter(Boolean).join(' — ')}</span>
                </div>
                {/if}
                {#if s.prix}
                <div class="spec-info-item">
                  <i class="bi bi-ticket-perforated"></i>
                  <span>{s.prix.toLocaleString('fr-FR')} FCFA</span>
                </div>
                {/if}
              </div>

              {#if s.spectacle.lien_billet && s.statut !== 'complet' && s.statut !== 'annulé'}
                <a href={s.spectacle.lien_billet} target="_blank" rel="noopener"
                   class="spec-btn" onclick={(e) => e.stopPropagation()}>
                  Réserver <i class="bi bi-arrow-right-short"></i>
                </a>
              {:else if s.statut === 'complet'}
                <span class="spec-btn spec-btn--disabled">Complet</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </section>
    {/if}
  {/if}

  <!-- ── Activités ── -->
  <section class="occ-section" class:visible={isVisible}>
    <div class="occ-section-header">
      <h2>Nos activités</h2>
    </div>
    <div class="occ-activities-grid">
      <div class="occ-activity-card">
        <div class="occ-activity-icon"><i class="bi bi-mic-fill"></i></div>
        <h3>Stand-up</h3>
        <p>Des soirées stand-up avec les meilleurs comédiens ivoiriens et africains.</p>
        <div class="occ-formats">
          <span class="occ-format-badge">Live</span>
          <span class="occ-format-badge">Scène ouverte</span>
        </div>
      </div>
      <div class="occ-activity-card">
        <div class="occ-activity-icon"><i class="bi bi-broadcast"></i></div>
        <h3>Radio</h3>
        <p>Des chroniques humoristiques sur One Radio, chaque semaine.</p>
        <div class="occ-formats">
          <span class="occ-format-badge">FM</span>
          <span class="occ-format-badge">Podcast</span>
        </div>
      </div>
      <div class="occ-activity-card">
        <div class="occ-activity-icon"><i class="bi bi-mortarboard-fill"></i></div>
        <h3>Formation</h3>
        <p>Ateliers et formations pour les artistes humoristes émergents.</p>
        <div class="occ-formats">
          <span class="occ-format-badge">Atelier</span>
          <span class="occ-format-badge">Coaching</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Ambition ── -->
  <div class="occ-ambition" class:visible={isVisible}>
    <div class="occ-ambition-icon"><i class="bi bi-globe2"></i></div>
    <h2>Notre ambition</h2>
    <p>Faire rayonner <strong>l'humour ivoirien</strong> à travers toute l'Afrique et au-delà, en créant une plateforme de référence pour les artistes et les passionnés de comédie.</p>
  </div>

  <!-- ── Contact ── -->
  <div class="occ-contact" class:visible={isVisible}>
    <h2><i class="bi bi-envelope-fill"></i> Nous contacter</h2>
    <div class="occ-contact-grid">
      <div class="occ-contact-item">
        <i class="bi bi-envelope"></i>
        <a href="mailto:contact@oneradio.ci">contact@oneradio.ci</a>
      </div>
      <div class="occ-contact-item">
        <i class="bi bi-telephone"></i>
        <span>+225 05 01 877 877</span>
      </div>
      <div class="occ-contact-item">
        <i class="bi bi-geo-alt"></i>
        <span>Abidjan, Côte d'Ivoire</span>
      </div>
    </div>
  </div>

</main>

<style>
  :root {
    --occ-yellow:      #ff0000;
    --occ-yellow-dark: #ec0202;
    --occ-dark:        #1a0a00;
    --occ-dark2:       #2a1800;
    --occ-white:       #ffffff;
    --occ-text:        #1a1a1a;
    --occ-muted:       #555555;
    --occ-radius:      0.75rem;
  }

  /* ── Hero 2── */
  .occ-hero {
    background: linear-gradient(135deg, var(--occ-dark) 0%, rgb(0, 0, 0)100%);
    padding: 2rem 1.25rem;
    text-align: center;
  }
  .occ-tagline {
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    color: var(--occ-yellow);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* ── Layout ── */
  .occ-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── Animations ── */
  .occ-section, .occ-ambition, .occ-contact {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }
  .occ-section.visible, .occ-ambition.visible, .occ-contact.visible {
    opacity: 1; transform: translateY(0);
  }

  /* ── En-têtes ── */
  .occ-section-header { display:flex; align-items:center; gap:0.6rem; margin-bottom:1.25rem; }
  .occ-section-header h2 {
    font-size: 1.35rem; font-weight: 700; color: var(--occ-text); position: relative;
  }
  .occ-section-header h2::after {
    content:''; position:absolute; bottom:-4px; left:0;
    width:40px; height:3px; background:var(--occ-yellow); border-radius:2px;
  }

  /* ── Loader ── */
  .occ-loader { display:flex; justify-content:center; padding:2rem; }
  .occ-spinner {
    width:36px; height:36px; border:3px solid #f0f0f0;
    border-top-color:var(--occ-yellow-dark); border-radius:50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .occ-empty { color:var(--occ-muted); font-size:.95rem; }

  /* ── Spectacles ── */
  .spec-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  .spec-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 16px rgba(0,0,0,.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform .22s, box-shadow .22s;
    text-decoration: none;
    color: inherit;
  }
  .spec-card:hover { transform:translateY(-4px); box-shadow:0 8px 28px rgba(0,0,0,.13); }

  .spec-affiche-wrap { position:relative; }
  .spec-affiche {
    width:100%; height:220px; object-fit:cover; display:block;
  }
  .spec-affiche-placeholder {
    height:120px; background:#f5f1e8;
    display:flex; align-items:center; justify-content:center;
    font-size:2.5rem; color:#ff0000; position:relative;
  }
  .spec-statut-badge {
    position:absolute; top:.6rem; right:.6rem;
    font-size:.7rem; font-weight:700; padding:.25rem .65rem;
    border-radius:20px; display:inline-flex; align-items:center; gap:.3rem;
  }
  .spec-statut-badge--no-img { position:static; margin-top:.5rem; }

  .spec-body { padding:1rem 1.15rem 1.25rem; display:flex; flex-direction:column; flex:1; }

  .spec-humoriste {
    display:flex; align-items:center; gap:.5rem;
    font-size:.78rem; font-weight:600; color:var(--occ-muted);
    text-transform:uppercase; letter-spacing:.04em; margin-bottom:.4rem;
  }
  .spec-hum-avatar {
    width:24px; height:24px; border-radius:50%; object-fit:cover;
    border:1.5px solid #eee;
  }

  .spec-titre {
    font-size:1.05rem; font-weight:700; color:var(--occ-text);
    margin:0 0 .75rem;
  }

  .spec-info { display:flex; flex-direction:column; gap:.35rem; margin-bottom:.9rem; }
  .spec-info-item {
    display:flex; align-items:flex-start; gap:.45rem;
    font-size:.83rem; color:var(--occ-muted);
  }
  .spec-info-item i { color:var(--occ-yellow-dark); flex-shrink:0; margin-top:.1rem; }

  .spec-btn {
    display:inline-flex; align-items:center; gap:.3rem;
    background:var(--occ-yellow); color:var(--occ-white);
    font-size:.82rem; font-weight:700; padding:.45rem 1rem;
    border-radius:8px; text-decoration:none; width:fit-content; margin-top:auto;
    transition:background .18s;
  }
  .spec-btn:hover { background:var(--occ-yellow-dark); }
  .spec-btn--disabled {
    background:#f0f0f0; color:#999; cursor:default;
    display:inline-flex; align-items:center;
    font-size:.82rem; font-weight:700; padding:.45rem 1rem;
    border-radius:8px; width:fit-content; margin-top:auto;
  }

  /* ── Comédiens ── */
  .comedy-program {
    display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;
  }
  .comedy-card {
    background: #fff; border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
    width: 300px; display: flex; flex-direction: column;
    align-items: center; padding: 1.5rem 1rem 1rem;
    text-decoration: none; color: inherit;
    transition: transform .22s, box-shadow .22s;
  }
  .comedy-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.13); }
  .comedy-card img {
    width:240px; height:360px; object-fit:cover;
    border-radius:14px; margin-bottom:1rem;
    box-shadow:0 4px 16px rgba(0,0,0,.10); background:#eee;
  }
  .comedy-avatar {
    width:120px; height:120px; border-radius:50%;
    background:var(--occ-yellow-dark); color:#fff;
    display:flex; align-items:center; justify-content:center;
    font-size:2.8rem; font-weight:700; margin-bottom:1rem;
  }
  .comedy-card .nom { font-size:1.2rem; font-weight:700; margin-bottom:.4rem; text-align:center; }
  .comedy-card .description {
    font-size:.9rem; color:var(--occ-muted); margin-bottom:.9rem;
    text-align:center; line-height:1.5;
  }

  /* Réseaux sociaux */
  .social-links {
    display:flex; gap:.6rem; margin-bottom:.85rem; flex-wrap:wrap; justify-content:center;
  }
  .social-link {
    width:34px; height:34px; border-radius:50%; background:#f5f5f5;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:1rem; text-decoration:none;
    transition:background .18s, transform .18s;
  }
  .social-link:hover { background:#ebebeb; transform:scale(1.1); }

  .footer { width:100%; border-top:1px solid #eee; padding-top:.7rem; margin-top:auto; text-align:center; }
  .video-link {
    color:var(--occ-yellow-dark); font-size:.88rem; font-weight:600;
    text-decoration:none; display:inline-flex; align-items:center; gap:.35rem;
  }
  .video-link:hover { text-decoration:underline; }

  /* ── Activités ── */
  .occ-activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.25rem;
  }
  .occ-activity-card {
    background:#fff; border-radius:var(--occ-radius); padding:1.5rem;
    box-shadow:0 2px 12px rgba(0,0,0,.07); border-top:4px solid var(--occ-yellow);
    transition:transform .25s, box-shadow .25s;
  }
  .occ-activity-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.11); }
  .occ-activity-icon { font-size:2rem; margin-bottom:.75rem; color:var(--occ-yellow-dark); }
  .occ-activity-card h3 { font-size:1.05rem; font-weight:700; color:var(--occ-text); margin-bottom:.5rem; }
  .occ-activity-card p  { font-size:.9rem; color:var(--occ-muted); line-height:1.5; margin-bottom:1rem; }
  .occ-formats { display:flex; flex-wrap:wrap; gap:.4rem; }
  .occ-format-badge {
    background:#f0f0f0; color:#333; font-size:11px;
    padding:3px 10px; border-radius:20px; font-weight:500;
  }

  /* ── Ambition ── */
  .occ-ambition {
    background: linear-gradient(135deg, var(--occ-dark) 0%, #1a0a00 100%);
    border-radius:var(--occ-radius); padding:3rem 2rem; text-align:center;
  }
  .occ-ambition-icon { font-size:2.5rem; margin-bottom:.75rem; color:var(--occ-yellow); }
  .occ-ambition h2  { font-size:1.5rem; font-weight:700; color:#fff; margin-bottom:.75rem; }
  .occ-ambition p   { font-size:1.05rem; color:#ccc; line-height:1.7; max-width:600px; margin:0 auto; }
  .occ-ambition strong { color:var(--occ-yellow); }

  /* ── Contact ── */
  .occ-contact { background:var(--occ-dark2); border-radius:var(--occ-radius); padding:2rem; }
  .occ-contact h2 { font-size:1.3rem; font-weight:700; color:#fff; margin-bottom:1.25rem; }
  .occ-contact h2 i { color:var(--occ-yellow); margin-right:.4rem; }
  .occ-contact-grid { display:flex; flex-wrap:wrap; gap:1.25rem; }
  .occ-contact-item { display:flex; align-items:center; gap:.6rem; font-size:.95rem; color:#ccc; }
  .occ-contact-item i { color:var(--occ-yellow); font-size:1rem; }
  .occ-contact-item a { color:var(--occ-yellow); text-decoration:none; font-weight:500; }
  .occ-contact-item a:hover { text-decoration:underline; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .occ-hero { padding:1.5rem 1rem  }
    .spec-grid { grid-template-columns: 1fr; }
    .occ-activities-grid { grid-template-columns: 1fr; }
    .occ-ambition { padding:2rem 1.25rem; }
    .comedy-card { width:100%; max-width:340px; }
    .comedy-card img { width:100%; height:auto; aspect-ratio:2/3; }
  }
</style>
