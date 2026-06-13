<script>
  let { data } = $props();

  const h = data.humoriste;

  const STATUT_STYLE = {
    'planifié': { bg:'#e8f5e9', color:'#2e7d32', icon:'bi-check-circle-fill' },
    'complet':  { bg:'#fce4ec', color:'#c62828', icon:'bi-x-circle-fill'     },
    'annulé':   { bg:'#f5f5f5', color:'#757575', icon:'bi-dash-circle-fill'  },
    'reporté':  { bg:'#fff3e0', color:'#e65100', icon:'bi-clock-history'     },
  };

  const RESEAUX = [
    { key:'facebook',  icon:'bi-facebook',  color:'#1877f2', label:'Facebook'  },
    { key:'instagram', icon:'bi-instagram', color:'#e1306c', label:'Instagram' },
    { key:'tiktok',    icon:'bi-tiktok',    color:'#010101', label:'TikTok'    },
    { key:'youtube',   icon:'bi-youtube',   color:'#ff0000', label:'YouTube'   },
    { key:'twitter',   icon:'bi-twitter-x', color:'#000',    label:'X'         },
  ];

  function fmtDate(str) {
    return new Date(str).toLocaleDateString('fr-FR', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
  }
  function fmtHeure(str) {
    return new Date(str).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  }

  const reseaux = h?.reseaux_sociaux || {};
  const prochains = (data.spectacles || []).filter(s =>
    s.prochaine_date && new Date(s.prochaine_date) >= new Date()
  );
</script>

<svelte:head>
  <title>{h ? h.nom_artiste || `${h.prenom} ${h.nom}` : 'Humoriste'} – ONE COMEDY CLUB</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

{#if !h}
  <div class="not-found">
    <i class="bi bi-emoji-frown"></i>
    <p>Humoriste introuvable.</p>
    <a href="/events/one-comedy-club">← Retour</a>
  </div>
{:else}
<div class="hum-page">

  <!-- Hero humoriste -->
  <div class="hum-hero">
    <div class="hum-hero-inner">
      {#if h.photo}
        <img src={h.photo} alt={h.nom_artiste} class="hum-photo" />
      {:else}
        <div class="hum-avatar">{(h.nom_artiste || h.nom || '?').charAt(0).toUpperCase()}</div>
      {/if}

      <div class="hum-info">
        <h1 class="hum-nom">{h.nom_artiste || `${h.prenom} ${h.nom}`.trim()}</h1>
        {#if h.nom_artiste && (h.prenom || h.nom)}
          <p class="hum-civil">{`${h.prenom} ${h.nom}`.trim()}</p>
        {/if}

        {#if h.description}
          <p class="hum-desc">{h.description}</p>
        {/if}

        <!-- Réseaux sociaux -->
        {#if Object.keys(reseaux).some(k => reseaux[k])}
          <div class="hum-reseaux">
            {#each RESEAUX as r}
              {#if reseaux[r.key]}
                <a href={reseaux[r.key]} target="_blank" rel="noopener"
                   class="reseau-btn" title={r.label} style="background:{r.color};">
                  <i class="bi {r.icon}"></i>
                </a>
              {/if}
            {/each}
          </div>
        {/if}

        {#if h.video}
          <a href={h.video} target="_blank" rel="noopener" class="video-btn">
            <i class="bi bi-play-circle-fill"></i> Voir la vidéo
          </a>
        {/if}
      </div>
    </div>
  </div>

  <!-- Biographie -->
  {#if h.biographie}
    <section class="hum-section">
      <h2 class="section-title">Biographie</h2>
      <div class="hum-bio">{h.biographie}</div>
    </section>
  {/if}

  <!-- Spectacles -->
  {#if data.spectacles && data.spectacles.length > 0}
    <section class="hum-section">
      <h2 class="section-title">
        <i class="bi bi-ticket-perforated-fill"></i> Spectacles
      </h2>
      <div class="spec-grid">
        {#each data.spectacles as s}
          {@const st = STATUT_STYLE[s.prochaine_statut ?? 'planifié'] ?? STATUT_STYLE['planifié']}
          <a href="/events/one-comedy-club/spectacles/{s.id}" class="spec-card">
            {#if s.affiche}
              <img src={s.affiche} alt={s.titre} class="spec-img" />
            {:else}
              <div class="spec-img-placeholder"><i class="bi bi-ticket-perforated"></i></div>
            {/if}
            <div class="spec-body">
              <h3 class="spec-titre">{s.titre}</h3>
              {#if s.prochaine_date}
                <div class="spec-date">
                  <i class="bi bi-calendar3"></i>
                  {fmtDate(s.prochaine_date)} à {fmtHeure(s.prochaine_date)}
                </div>
                {#if s.prochaine_lieu || s.prochaine_ville}
                  <div class="spec-lieu">
                    <i class="bi bi-geo-alt-fill"></i>
                    {[s.prochaine_lieu, s.prochaine_ville].filter(Boolean).join(' — ')}
                  </div>
                {/if}
                <span class="spec-statut" style="background:{st.bg};color:{st.color};">
                  <i class="bi {st.icon}"></i> {s.prochaine_statut ?? 'planifié'}
                </span>
              {:else}
                <span class="spec-no-date">Pas de prochaine date</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}

</div>
{/if}

<style>
  .not-found {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:40vh; gap:1rem; color:#aaa;
  }
  .not-found i { font-size:3rem; }
  .not-found a { color:#db0303; font-weight:600; text-decoration:none; }

  .hum-page { max-width:1000px; margin:0 auto; padding:1.5rem 1.25rem 4rem; }

  .breadcrumb {
    display:flex; align-items:center; gap:.5rem;
    font-size:.82rem; color:#888; margin-bottom:2rem;
  }
  .breadcrumb a { color:#db0303; text-decoration:none; font-weight:600; }
  .breadcrumb a:hover { text-decoration:underline; }
  .breadcrumb i { font-size:.65rem; }

  /* Hero */
  .hum-hero {
    background:#313131;
    border-radius:16px; padding:2rem; margin-bottom:2.5rem;
  }
  .hum-hero-inner { display:flex; gap:2rem; align-items:flex-start; flex-wrap:wrap; }
  .hum-photo {
    width:200px; height:280px; object-fit:cover;
    border-radius:14px; box-shadow:0 8px 28px rgba(0,0,0,.4); flex-shrink:0;
  }
  .hum-avatar {
    width:180px; height:180px; border-radius:50%;
    background:#db0303; color:#fff; font-size:4rem; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .hum-info { flex:1; min-width:200px; }
  .hum-nom { font-size:clamp(1.5rem,4vw,2.2rem); font-weight:800; color:#fff; margin:0 0 .25rem; }
  .hum-civil { color:#ff0000; font-size:.95rem; margin:0 0 1rem; }
  .hum-desc { color:#ccc; font-size:.95rem; line-height:1.6; margin-bottom:1.25rem; }

  .hum-reseaux { display:flex; gap:.6rem; margin-bottom:1rem; flex-wrap:wrap; }
  .reseau-btn {
    width:38px; height:38px; border-radius:50%; color:#fff;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:1rem; text-decoration:none;
    transition:transform .18s, opacity .18s;
  }
  .reseau-btn:hover { transform:scale(1.12); opacity:.88; }

  .video-btn {
    display:inline-flex; align-items:center; gap:.4rem;
    background:#ff0000; color:#1a0a00; font-weight:700;
    padding:.5rem 1.1rem; border-radius:8px; text-decoration:none; font-size:.88rem;
    transition:background .18s;
  }
  .video-btn:hover { background:#db0303; }

  /* Sections */
  .hum-section { margin-bottom:2.5rem; }
  .section-title {
    font-size:1.25rem; font-weight:700; color:#1a1a1a;
    margin-bottom:1.25rem; padding-bottom:.5rem;
    border-bottom:3px solid #ff0000; display:inline-flex;
    align-items:center; gap:.5rem;
  }
  .hum-bio {
    font-size:.97rem; color:#444; line-height:1.75;
    background:#fff; border-radius:12px; padding:1.5rem;
    box-shadow:0 2px 12px rgba(0,0,0,.06);
    white-space:pre-line;
  }

  /* Spectacles */
  .spec-grid {
    display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1.25rem;
  }
  .spec-card {
    background:#fff; border-radius:12px; overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,.08); text-decoration:none; color:inherit;
    transition:transform .22s, box-shadow .22s; display:flex; flex-direction:column;
  }
  .spec-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.13); }
  .spec-img { width:100%; height:180px; object-fit:cover; }
  .spec-img-placeholder {
    height:100px; background:#f5f1e8; display:flex; align-items:center;
    justify-content:center; font-size:2rem; color:#db0303;
  }
  .spec-body { padding:.9rem 1rem 1rem; display:flex; flex-direction:column; gap:.4rem; flex:1; }
  .spec-titre { font-size:1rem; font-weight:700; color:#1a1a1a; margin:0 0 .3rem; }
  .spec-date, .spec-lieu {
    font-size:.8rem; color:#666; display:flex; align-items:center; gap:.4rem;
  }
  .spec-date i, .spec-lieu i { color:#db0303; }
  .spec-statut {
    font-size:.7rem; font-weight:700; padding:.2rem .6rem;
    border-radius:20px; display:inline-flex; align-items:center; gap:.3rem; width:fit-content;
    margin-top:.3rem;
  }
  .spec-no-date { font-size:.8rem; color:#aaa; font-style:italic; }

  @media (max-width:640px) {
    .hum-hero-inner { flex-direction:column; align-items:center; text-align:center; }
    .hum-reseaux { justify-content:center; }
    .spec-grid { grid-template-columns:1fr; }
  }
</style>
