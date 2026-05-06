<script>
  import { onMount } from 'svelte';

  let isVisible = $state(false);

  // Données des comédiens (à remplacer par des données dynamiques si besoin)
  let comediens = $state([
    {
      photo: 'https://randomuser.me/api/portraits/men/32.jpg', // grand portrait
      nom: 'Comédien 1',
      description: 'Description du comédien 1.',
      dateSpectacle: '2026-05-10',
      nomSpectacle: 'Spectacle A'
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/44.jpg', // grand portrait
      nom: 'Comédien 2',
      description: 'Description du comédien 2.',
      dateSpectacle: '2026-05-15',
      nomSpectacle: 'Spectacle B'
    }
  ]);

  onMount(() => {
    isVisible = true;
  });
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

<!-- Contenu principal -->
<main class="occ-main" class:visible={isVisible}>

  <!-- Programme -->
  <section class="occ-section" class:visible={isVisible}>
    <div class="occ-section-header">
      <h2>Programme Comedy Club</h2>
    </div>

    <div class="comedy-program">
      {#each comediens as comedien}
        <div class="comedy-card">
          <img src={comedien.photo} alt={comedien.nom} />
          <div class="nom">{comedien.nom}</div>
          <div class="description">{comedien.description}</div>
          <div class="footer">
            <span class="date">{comedien.dateSpectacle}</span>
            <span class="spectacle">{comedien.nomSpectacle}</span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Activités -->
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

  <!-- Ambition -->
  <div class="occ-ambition" class:visible={isVisible}>
    <div class="occ-ambition-icon"><i class="bi bi-globe2"></i></div>
    <h2>Notre ambition</h2>
    <p>Faire rayonner <strong>l'humour ivoirien</strong> à travers toute l'Afrique et au-delà, en créant une plateforme de référence pour les artistes et les passionnés de comédie.</p>
  </div>

  <!-- Contact -->
  <div class="occ-contact" class:visible={isVisible}>
    <h2><i class="bi bi-envelope-fill"></i> Nous contacter</h2>
    <div class="occ-contact-grid">
      <div class="occ-contact-item">
        <i class="bi bi-envelope"></i>
        <a href="mailto:contact@oneradio.ci">contact@oneradio.ci</a>
      </div>
      <div class="occ-contact-item">
        <i class="bi bi-telephone"></i>
        <span>+225 XX XX XX XX</span>
      </div>
      <div class="occ-contact-item">
        <i class="bi bi-geo-alt"></i>
        <span>Abidjan, Côte d'Ivoire</span>
      </div>
    </div>
  </div>

</main>

<style>
  /* ── Variables ── */
  :root {
    --occ-yellow:      #f5c518;
    --occ-yellow-dark: #c9a000;
    --occ-dark:        #1a0a00;
    --occ-dark2:       #2a1800;
    --occ-white:       #ffffff;
    --occ-text:        #1a1a1a;
    --occ-muted:       #555555;
    --occ-gray:        #f5f5f5;
    --occ-radius:      0.75rem;
  }

  /* ── Hero ── */
  .occ-hero {
    background: linear-gradient(135deg, var(--occ-dark) 0%, #3a1a00 100%);
    padding: 4rem 1.25rem 3rem;
    text-align: center;
  }

  .occ-tagline {
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    color: var(--occ-yellow);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* ── Layout principal ── */
  .occ-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── Animations d'apparition ── */
  .occ-section,
  .occ-ambition,
  .occ-contact {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }

  .occ-section.visible,
  .occ-ambition.visible,
  .occ-contact.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── En-têtes de section ── */
  .occ-section-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .occ-section-header h2 {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--occ-text);
    position: relative;
  }

  .occ-section-header h2::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--occ-yellow);
    border-radius: 2px;
  }

  /* ── Cartes comédiens ── */
  .comedy-program {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
  }

  .comedy-card {
    background: var(--occ-white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem 1rem;
    margin-bottom: 1.5rem;
  }

  .comedy-card img {
    width: 260px;
    height: 390px;
    object-fit: cover;
    border-radius: 18px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    background: #eee;
    display: block;
  }

  .comedy-card .nom {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .comedy-card .description {
    font-size: 1rem;
    color: var(--occ-muted);
    margin-bottom: 1.2rem;
    text-align: center;
  }

  .comedy-card .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-top: 1px solid #eee;
    padding-top: 0.7rem;
    font-size: 0.98rem;
    color: var(--occ-text);
    margin-top: auto;
  }

  .comedy-card .footer .date { font-weight: 500; }

  .comedy-card .footer .spectacle {
    font-style: italic;
    color: #0077cc;
  }

  /* ── Grille activités ── */
  .occ-activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.25rem;
  }

  .occ-activity-card {
    background: var(--occ-white);
    border-radius: var(--occ-radius);
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    border-top: 4px solid var(--occ-yellow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .occ-activity-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.11);
  }

  .occ-activity-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    color: var(--occ-yellow-dark);
  }

  .occ-activity-card h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--occ-text);
    margin-bottom: 0.5rem;
  }

  .occ-activity-card p {
    font-size: 0.9rem;
    color: var(--occ-muted);
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .occ-formats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .occ-format-badge {
    background: #f0f0f0;
    color: #333;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Ambition ── */
  .occ-ambition {
    background: linear-gradient(135deg, var(--occ-dark) 0%, #1a0a00 100%);
    border-radius: var(--occ-radius);
    padding: 3rem 2rem;
    text-align: center;
  }

  .occ-ambition-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    color: var(--occ-yellow);
  }

  .occ-ambition h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--occ-white);
    margin-bottom: 0.75rem;
  }

  .occ-ambition p {
    font-size: 1.05rem;
    color: #ccc;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto;
  }

  .occ-ambition strong { color: var(--occ-yellow); }

  /* ── Contact ── */
  .occ-contact {
    background: var(--occ-dark2);
    border-radius: var(--occ-radius);
    padding: 2rem;
  }

  .occ-contact h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--occ-white);
    margin-bottom: 1.25rem;
  }

  .occ-contact h2 i { color: var(--occ-yellow); margin-right: 0.4rem; }

  .occ-contact-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .occ-contact-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
    color: #ccc;
  }

  .occ-contact-item i { color: var(--occ-yellow); font-size: 1rem; }

  .occ-contact-item a {
    color: var(--occ-yellow);
    text-decoration: none;
    font-weight: 500;
  }

  .occ-contact-item a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .occ-hero { padding: 3.5rem 1rem 2.5rem; }
    .occ-activities-grid { grid-template-columns: 1fr; }
    .occ-ambition { padding: 2rem 1.25rem; }
  }
</style>