<script>
  let { data } = $props();
  const s = data.spectacle;

  const STATUT_STYLE = {
    'planifié': { bg:'#e8f5e9', color:'#2e7d32', icon:'bi-check-circle-fill', label:'Planifié' },
    'complet':  { bg:'#fce4ec', color:'#c62828', icon:'bi-x-circle-fill',     label:'Complet'  },
    'annulé':   { bg:'#f5f5f5', color:'#757575', icon:'bi-dash-circle-fill',  label:'Annulé'   },
    'reporté':  { bg:'#fff3e0', color:'#e65100', icon:'bi-clock-history',     label:'Reporté'  },
  };

  function fmtDate(str) {
    return new Date(str).toLocaleDateString('fr-FR', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
  }
  function fmtHeure(str) {
    return new Date(str).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  }

  const humoriste     = s?.humoriste;
  const humNom        = humoriste ? (humoriste.nom_artiste || `${humoriste.prenom} ${humoriste.nom}`.trim()) : '';
  const datesAVenir   = (s?.dates ?? []).filter(d => !d.passe);
  const datesPassees  = (s?.dates ?? []).filter(d => d.passe);
</script>

<svelte:head>
  <title>{s ? s.titre : 'Spectacle'} – ONE COMEDY CLUB</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

{#if !s}
  <div class="not-found">
    <i class="bi bi-emoji-frown"></i>
    <p>Spectacle introuvable.</p>
    <a href="/events/one-comedy-club">← Retour au Comedy Club</a>
  </div>
{:else}
<div class="spec-page">

  <!-- Breadcrumb -->
  <div class="breadcrumb">
    <a href="/events/one-comedy-club">ONE COMEDY CLUB</a>
    <i class="bi bi-chevron-right"></i>
    {#if humoriste}
      <a href="/events/one-comedy-club/{humoriste.id}">{humNom}</a>
      <i class="bi bi-chevron-right"></i>
    {/if}
    <span>{s.titre}</span>
  </div>

  <div class="spec-layout">

    <!-- Colonne gauche : affiche + humoriste -->
    <aside class="spec-aside">
      {#if s.affiche}
        <img src={s.affiche} alt={s.titre} class="spec-affiche" />
      {:else}
        <div class="spec-affiche-placeholder"><i class="bi bi-ticket-perforated"></i></div>
      {/if}

      {#if humoriste}
        <a href="/events/one-comedy-club/{humoriste.id}" class="hum-mini-card">
          {#if humoriste.photo}
            <img src={humoriste.photo} alt={humNom} class="hum-mini-photo" />
          {:else}
            <div class="hum-mini-avatar">{humNom.charAt(0).toUpperCase()}</div>
          {/if}
          <div>
            <div class="hum-mini-nom">{humNom}</div>
            <div class="hum-mini-link">Voir le profil <i class="bi bi-arrow-right-short"></i></div>
          </div>
        </a>
      {/if}
    </aside>

    <!-- Colonne droite : infos + dates -->
    <div class="spec-main">
      <h1 class="spec-titre">{s.titre}</h1>

      {#if s.description}
        <p class="spec-desc">{s.description}</p>
      {/if}

      <!-- Dates à venir -->
      {#if datesAVenir.length > 0}
        <h2 class="dates-title">
          <i class="bi bi-calendar3-event-fill"></i> Dates à venir
        </h2>
        <div class="dates-list">
          {#each datesAVenir as d}
            {@const st = STATUT_STYLE[d.statut] ?? STATUT_STYLE['planifié']}
            <div class="date-card">
              <div class="date-card-top">
                <div class="date-datetime">
                  <div class="date-day">{fmtDate(d.date_heure)}</div>
                  <div class="date-hour"><i class="bi bi-clock"></i> {fmtHeure(d.date_heure)}</div>
                </div>
                <span class="date-statut" style="background:{st.bg};color:{st.color};">
                  <i class="bi {st.icon}"></i> {st.label}
                </span>
              </div>

              <div class="date-card-mid">
                {#if d.lieu || d.ville}
                  <div class="date-info-item">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span>{[d.lieu, d.ville].filter(Boolean).join(' — ')}</span>
                  </div>
                {/if}
                {#if d.places_dispo !== null}
                  <div class="date-info-item">
                    <i class="bi bi-people-fill"></i>
                    <span>{d.places_dispo} places disponibles</span>
                  </div>
                {/if}
                {#if d.prix !== null}
                  <div class="date-info-item">
                    <i class="bi bi-ticket-perforated"></i>
                    <span>{d.prix.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                {/if}
              </div>

              {#if s.lien_billet && d.statut !== 'complet' && d.statut !== 'annulé'}
                <a href={s.lien_billet} target="_blank" rel="noopener" class="billet-btn">
                  <i class="bi bi-ticket-perforated-fill"></i> Réserver ma place
                </a>
              {:else if d.statut === 'complet'}
                <span class="billet-btn billet-btn--disabled">Complet</span>
              {:else if d.statut === 'annulé'}
                <span class="billet-btn billet-btn--annule">Annulé</span>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-dates">
          <i class="bi bi-calendar-x"></i>
          <p>Aucune date à venir pour ce spectacle.</p>
        </div>
      {/if}

      <!-- Dates passées (repliées) -->
      {#if datesPassees.length > 0}
        <details class="dates-passees">
          <summary>
            <i class="bi bi-clock-history"></i>
            {datesPassees.length} date{datesPassees.length > 1 ? 's' : ''} passée{datesPassees.length > 1 ? 's' : ''}
          </summary>
          <div class="dates-list dates-list--past">
            {#each datesPassees as d}
              <div class="date-card date-card--past">
                <div class="date-day">{fmtDate(d.date_heure)} à {fmtHeure(d.date_heure)}</div>
                {#if d.lieu || d.ville}
                  <div class="date-info-item">
                    <i class="bi bi-geo-alt"></i>
                    <span>{[d.lieu, d.ville].filter(Boolean).join(' — ')}</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </details>
      {/if}

    </div>
  </div>
</div>
{/if}

<style>
  .not-found {
    display:flex; flex-direction:column; align-items:center;
    justify-content:center; min-height:40vh; gap:1rem; color:#aaa;
  }
  .not-found i { font-size:3rem; }
  .not-found a { color:#c9a000; font-weight:600; text-decoration:none; }

  .spec-page { max-width:1050px; margin:0 auto; padding:1.5rem 1.25rem 4rem; }

  .breadcrumb {
    display:flex; align-items:center; gap:.5rem;
    font-size:.82rem; color:#888; margin-bottom:2rem; flex-wrap:wrap;
  }
  .breadcrumb a { color:#c9a000; text-decoration:none; font-weight:600; }
  .breadcrumb a:hover { text-decoration:underline; }
  .breadcrumb i { font-size:.65rem; }

  .spec-layout { display:grid; grid-template-columns:280px 1fr; gap:2rem; align-items:start; }

  /* Aside */
  .spec-aside { position:sticky; top:5rem; }
  .spec-affiche {
    width:100%; border-radius:14px;
    box-shadow:0 4px 20px rgba(0,0,0,.15); display:block; margin-bottom:1.25rem;
  }
  .spec-affiche-placeholder {
    width:100%; height:200px; border-radius:14px; background:#f5f1e8;
    display:flex; align-items:center; justify-content:center;
    font-size:3rem; color:#c9a000; margin-bottom:1.25rem;
  }

  .hum-mini-card {
    display:flex; align-items:center; gap:.85rem;
    background:#fff; border-radius:12px; padding:.9rem 1rem;
    box-shadow:0 2px 12px rgba(0,0,0,.07); text-decoration:none; color:inherit;
    border:2px solid transparent; transition:border-color .18s;
  }
  .hum-mini-card:hover { border-color:#f5c518; }
  .hum-mini-photo { width:48px; height:48px; border-radius:50%; object-fit:cover; flex-shrink:0; }
  .hum-mini-avatar {
    width:48px; height:48px; border-radius:50%; background:#c9a000; color:#fff;
    display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0;
  }
  .hum-mini-nom { font-weight:700; font-size:.9rem; color:#1a1a1a; }
  .hum-mini-link { font-size:.78rem; color:#c9a000; font-weight:600; }

  /* Main */
  .spec-titre { font-size:clamp(1.4rem,3vw,2rem); font-weight:800; color:#1a0a00; margin:0 0 1rem; }
  .spec-desc {
    font-size:.97rem; color:#555; line-height:1.7; margin-bottom:1.75rem;
    padding:1.25rem; background:#fff; border-radius:10px;
    box-shadow:0 2px 10px rgba(0,0,0,.05);
  }

  .dates-title {
    font-size:1.1rem; font-weight:700; color:#1a1a1a;
    display:flex; align-items:center; gap:.5rem; margin-bottom:1rem;
    padding-bottom:.5rem; border-bottom:2px solid #f5c518;
  }

  .dates-list { display:flex; flex-direction:column; gap:.85rem; }
  .dates-list--past { margin-top:.75rem; }

  .date-card {
    background:#fff; border-radius:12px; padding:1.1rem 1.25rem;
    box-shadow:0 2px 12px rgba(0,0,0,.07); border-left:4px solid #f5c518;
  }
  .date-card--past { border-left-color:#ddd; opacity:.7; }

  .date-card-top {
    display:flex; align-items:flex-start; justify-content:space-between;
    gap:.75rem; margin-bottom:.75rem;
  }
  .date-day { font-weight:700; font-size:.95rem; color:#1a1a1a; text-transform:capitalize; }
  .date-hour { font-size:.83rem; color:#666; margin-top:.2rem; display:flex; align-items:center; gap:.3rem; }
  .date-statut {
    font-size:.7rem; font-weight:700; padding:.25rem .65rem;
    border-radius:20px; white-space:nowrap; display:inline-flex; align-items:center; gap:.3rem;
    flex-shrink:0;
  }

  .date-card-mid { display:flex; flex-direction:column; gap:.35rem; margin-bottom:.9rem; }
  .date-info-item { display:flex; align-items:center; gap:.45rem; font-size:.84rem; color:#555; }
  .date-info-item i { color:#c9a000; }

  .billet-btn {
    display:inline-flex; align-items:center; gap:.4rem;
    background:#f5c518; color:#1a0a00; font-weight:700;
    padding:.5rem 1.1rem; border-radius:8px; text-decoration:none;
    font-size:.85rem; transition:background .18s;
  }
  .billet-btn:hover { background:#c9a000; }
  .billet-btn--disabled {
    background:#f0f0f0; color:#999; font-weight:700;
    padding:.5rem 1.1rem; border-radius:8px; font-size:.85rem;
    display:inline-flex; align-items:center;
  }
  .billet-btn--annule {
    background:#fce4ec; color:#c62828; font-weight:700;
    padding:.5rem 1.1rem; border-radius:8px; font-size:.85rem;
    display:inline-flex; align-items:center;
  }

  .no-dates {
    display:flex; flex-direction:column; align-items:center; gap:.75rem;
    padding:2.5rem; background:#f9f9f9; border-radius:12px; color:#aaa;
  }
  .no-dates i { font-size:2.5rem; }
  .no-dates p { font-size:.95rem; margin:0; }

  details.dates-passees { margin-top:1.5rem; }
  details.dates-passees summary {
    cursor:pointer; font-size:.85rem; color:#aaa;
    display:flex; align-items:center; gap:.4rem;
    padding:.5rem 0; list-style:none;
  }
  details.dates-passees summary::-webkit-details-marker { display:none; }

  @media (max-width:700px) {
    .spec-layout { grid-template-columns:1fr; }
    .spec-aside { position:static; }
    .spec-affiche { max-width:280px; margin:0 auto 1.25rem; }
  }
</style>
