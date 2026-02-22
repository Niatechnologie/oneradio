<script>
  import { onMount } from 'svelte';

  let isVisible = $state(false);
  let activeCategory = $state(null);

  const categories = [
    { icon: 'bi-mic-fill', title: 'Artiste de l\'année' },
    { icon: 'bi-star-fill', title: 'Révélation de l\'année' },
    { icon: 'bi-music-note-beamed', title: 'Hit de l\'année' },
    { icon: 'bi-people-fill', title: 'Meilleure collaboration' },
    { icon: 'bi-gender-female', title: 'Meilleur artiste féminin' },
    { icon: 'bi-gender-male', title: 'Meilleur artiste masculin' },
    { icon: 'bi-vinyl-fill', title: 'Meilleur groupe' },
    { icon: 'bi-camera-reels-fill', title: 'Meilleur clip vidéo' },
    { icon: 'bi-broadcast', title: 'Prix du public ONE RADIO' },
    { icon: 'bi-award-fill', title: 'Prix spécial du jury' }
  ];

  const programme = [
    { icon: 'bi-trophy-fill', title: 'Cérémonie officielle de remise de trophées', color: '#FFD700' },
    { icon: 'bi-mic-fill', title: 'Prestations live d\'artistes majeurs', color: '#ff1919' },
    { icon: 'bi-music-note-list', title: 'Grand concert populaire le lendemain', color: '#9b59b6' },
    { icon: 'bi-star-fill', title: 'Performances exclusives', color: '#e67e22' },
    { icon: 'bi-balloon-fill', title: 'Animations & happenings', color: '#2ecc71' },
    { icon: 'bi-heart-fill', title: 'Hommages', color: '#e74c3c' },
    { icon: 'bi-camera-reels-fill', title: 'Tapis rouge & interviews médias', color: '#3498db' },
    { icon: 'bi-gem', title: 'After-show VIP', color: '#FFD700' }
  ];

  const cibles = [
    { icon: 'bi-people-fill', label: 'Jeunes & grand public' },
    { icon: 'bi-headphones', label: 'Professionnels de la musique' },
    { icon: 'bi-broadcast', label: 'Médias & influenceurs' },
    { icon: 'bi-building', label: 'Marques & sponsors' },
    { icon: 'bi-bank', label: 'Institutions culturelles' }
  ];

  const sponsors = [
    { icon: 'bi-eye-fill', label: 'Forte visibilité média (radio, digital, terrain)' },
    { icon: 'bi-megaphone-fill', label: 'Présence sur tous les supports de communication' },
    { icon: 'bi-award-fill', label: 'Naming de trophées' },
    { icon: 'bi-shop', label: 'Activations terrain & opérations promotionnelles' },
    { icon: 'bi-palette-fill', label: 'Espaces branding & stands' },
    { icon: 'bi-volume-up-fill', label: 'Mentions antenne & réseaux sociaux' }
  ];

  onMount(() => {
    isVisible = true;
  });

  function toggleCategory(index) {
    activeCategory = activeCategory === index ? null : index;
  }
</script>

<svelte:head>
  <title>ORMA - ONE RADIO MUSIC AWARD</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<div class="awards-page">

  <!-- Hero Section -->
  <section class="hero" class:visible={isVisible}>
    <div class="hero-particles">
      {#each Array(20) as _, i}
        <span class="particle" style="--delay: {i * 0.3}s; --x: {Math.random() * 100}%; --y: {Math.random() * 100}%;"></span>
      {/each}
    </div>
    <div class="hero-content">
      <div class="hero-badge"><i class="bi bi-trophy-fill"></i> ÉVÉNEMENT IN HOUSE</div>
      <h1 class="hero-title">
        <span class="title-line">ONE RADIO</span>
        <span class="title-line gold">MUSIC AWARD</span>
        <span class="title-acronym">(ORMA)</span>
      </h1>
      <p class="hero-tagline">La grande messe annuelle de la musique urbaine et africaine</p>
      <div class="hero-date">
        <div class="date-item">
          <i class="bi bi-calendar3"></i>
          <span>Vendredi 04 Décembre</span>
        </div>
        <div class="date-item">
          <i class="bi bi-geo-alt-fill"></i>
          <span>Lieu à confirmer</span>
        </div>
      </div>
    </div>
    <div class="hero-scroll">
      <i class="bi bi-chevron-double-down"></i>
    </div>
  </section>

  <!-- About Section -->
  <section class="section about-section" class:visible={isVisible}>
    <div class="container">
      <h2 class="section-heading">À propos du <span class="gold-text">ORMA</span></h2>
      <div class="about-grid">
        <div class="about-text">
          <p>
            Le <strong>ONE RADIO MUSIC AWARD (ORMA)</strong> est un événement musical majeur dédié à la célébration, 
            la valorisation et la reconnaissance des talents musicaux, des acteurs culturels et des professionnels 
            de l'industrie musicale en <strong>Côte d'Ivoire</strong> et en <strong>Afrique</strong>.
          </p>
          <p>
            Chaque année, ONE RADIO, à travers ses partenaires, récompense plusieurs catégories d'artistes et de 
            professionnels en Côte d'Ivoire et à l'échelle africaine.
          </p>
          <p>
            La cérémonie est suivie, le lendemain, d'un <strong>grand concert populaire en plein air ou dans un stade</strong>, 
            offert au public.
          </p>
          <p>
            Cet événement d'envergure ambitionne de devenir un <strong>rendez-vous annuel incontournable</strong>, 
            réunissant artistes, producteurs, médias, partenaires, institutions et grand public autour d'une même passion : 
            <strong class="gold-text">la musique</strong>.
          </p>
        </div>
        <div class="about-stats">
          <div class="stat-card">
            <span class="stat-icon"><i class="bi bi-mic-fill"></i></span>
            <span class="stat-number">10+</span>
            <span class="stat-label">Catégories</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon"><i class="bi bi-globe-americas"></i></span>
            <span class="stat-number">CI & Afrique</span>
            <span class="stat-label">Portée</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon"><i class="bi bi-music-note-list"></i></span>
            <span class="stat-number">2 jours</span>
            <span class="stat-label">D'événement</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Objectifs Section -->
  <section class="section objectives-section">
    <div class="container">
      <h2 class="section-heading"><i class="bi bi-bullseye"></i> Objectifs</h2>
      <div class="objectives-grid">
        <div class="objective-card">
          <div class="obj-icon"><i class="bi bi-trophy-fill"></i></div>
          <h3>Récompenser l'excellence</h3>
          <p>Récompenser l'excellence musicale ivoirienne et africaine</p>
        </div>
        <div class="objective-card">
          <div class="obj-icon"><i class="bi bi-star-fill"></i></div>
          <h3>Mettre en lumière</h3>
          <p>Mettre en lumière les talents émergents et confirmés</p>
        </div>
        <div class="objective-card">
          <div class="obj-icon"><i class="bi bi-globe-americas"></i></div>
          <h3>Valoriser la diversité</h3>
          <p>Valoriser la diversité culturelle et musicale</p>
        </div>
        <div class="objective-card">
          <div class="obj-icon"><i class="bi bi-link-45deg"></i></div>
          <h3>Créer une plateforme</h3>
          <p>Créer une plateforme de visibilité, de rencontres et de networking</p>
        </div>
        <div class="objective-card">
          <div class="obj-icon"><i class="bi bi-film"></i></div>
          <h3>Spectacle de qualité</h3>
          <p>Offrir un spectacle de très haute qualité au public</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Programme Section -->
  <section class="section programme-section">
    <div class="container">
      <h2 class="section-heading"><i class="bi bi-mic-fill"></i> Contenu de l'événement</h2>
      <div class="programme-grid">
        {#each programme as item, i}
          <div class="programme-card" style="--accent: {item.color}; --delay: {i * 0.1}s">
            <i class="bi {item.icon} programme-icon"></i>
            <span>{item.title}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Categories Section -->
  <section class="section categories-section">
    <div class="container">
      <h2 class="section-heading"><i class="bi bi-trophy-fill"></i> Catégories de récompenses</h2>
      <div class="categories-grid">
        {#each categories as cat, i}
          <button 
            class="category-card" 
            class:active={activeCategory === i}
            onclick={() => toggleCategory(i)}
          >
            <span class="cat-emoji"><i class="bi {cat.icon}"></i></span>
            <span class="cat-title">{cat.title}</span>
            <div class="cat-shine"></div>
          </button>
        {/each}
      </div>
    </div>
  </section>

  <!-- Cibles Section -->
  <section class="section cibles-section">
    <div class="container">
      <h2 class="section-heading"><i class="bi bi-bullseye"></i> Cibles</h2>
      <div class="cibles-grid">
        {#each cibles as cible}
          <div class="cible-card">
            <i class="bi {cible.icon}"></i>
            <span>{cible.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Sponsors Section -->
  <section class="section sponsors-section">
    <div class="container">
      <h2 class="section-heading"><i class="bi bi-handshake"></i> Opportunités Partenaires & Sponsors</h2>
      <div class="sponsors-grid">
        {#each sponsors as sponsor}
          <div class="sponsor-card">
            <i class="bi {sponsor.icon}"></i>
            <p>{sponsor.label}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="section cta-section">
    <div class="container">
      <div class="cta-card">
        <h2><i class="bi bi-broadcast"></i> ONE RADIO MUSIC AWARD</h2>
        <p class="cta-sub">La grande messe annuelle de la musique urbaine et africaine,<br>portée par l'expertise média et la puissance de diffusion de <strong>ONE RADIO</strong>.</p>
        <div class="cta-date">
          <i class="bi bi-calendar3"></i> Vendredi 04 Décembre
        </div>
        <a href="/contact" class="cta-btn">
          <i class="bi bi-envelope-fill"></i> Devenir partenaire
        </a>
      </div>
    </div>
  </section>

</div>

<style>
  /* ============ BASE ============ */
  .awards-page {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #333;
    overflow-x: hidden;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .section {
    padding: 4rem 0;
  }

  .section-heading {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 2.5rem;
    position: relative;
  }

  .section-heading::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #ff1919, #FFD700);
    margin: 0.8rem auto 0;
    border-radius: 2px;
  }

  .gold-text { color: #FFD700; }

  /* ============ HERO ============ */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 30%, #2d0000 60%, #0a0a0a 100%);
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  .hero.visible {
    opacity: 1;
  }

  .hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #FFD700;
    border-radius: 50%;
    left: var(--x);
    top: var(--y);
    opacity: 0;
    animation: sparkle 3s var(--delay) infinite;
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 0.8; transform: scale(1); }
  }

  .hero-content {
    text-align: center;
    z-index: 1;
    padding: 2rem;
  }

  .hero-badge {
    display: inline-block;
    background: rgba(255, 215, 0, 0.15);
    border: 1px solid rgba(255, 215, 0, 0.3);
    color: #FFD700;
    padding: 0.4rem 1.2rem;
    border-radius: 2rem;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin-bottom: 2rem;
  }

  .hero-title {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 1.5rem;
  }

  .title-line {
    font-size: 3rem;
    font-weight: 900;
    color: white;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .title-line.gold {
    color: #FFD700;
    font-size: 3.5rem;
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  }

  .title-acronym {
    font-size: 1.5rem;
    color: #888;
    font-weight: 400;
    letter-spacing: 0.3em;
  }

  .hero-tagline {
    color: #aaa;
    font-size: 1.15rem;
    font-style: italic;
    margin-bottom: 2.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-date {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .date-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ccc;
    font-size: 1rem;
    font-weight: 500;
  }

  .date-item i {
    color: #ff1919;
    font-size: 1.1rem;
  }

  .hero-scroll {
    position: absolute;
    bottom: 2rem;
    animation: bounce 2s infinite;
    color: #555;
    font-size: 1.5rem;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }

  /* ============ ABOUT ============ */
  .about-section {
    background: #fff;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease 0.3s;
  }

  .about-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .about-text p {
    color: #555;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .about-text strong {
    color: #1a1a1a;
  }

  .about-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .stat-card {
    background: linear-gradient(135deg, #fafafa, #f0f0f0);
    border-radius: 1rem;
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 1.8rem;
    color: #FFD700;
  }

  .stat-number {
    font-size: 1.2rem;
    font-weight: 800;
    color: #1a1a1a;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #888;
  }

  /* ============ OBJECTIVES ============ */
  .objectives-section {
    background: #f9f9f9;
  }

  .objectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .objective-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease;
  }

  .objective-card:hover {
    transform: translateY(-5px);
  }

  .obj-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    background: linear-gradient(135deg, #ff1919, #cc0000);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .obj-icon i {
    font-size: 1.4rem;
    color: white;
  }

  .objective-card h3 {
    font-size: 1.05rem;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }

  .objective-card p {
    color: #777;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* ============ PROGRAMME ============ */
  .programme-section {
    background: #fff;
  }

  .programme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .programme-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #fafafa;
    padding: 1.2rem 1.5rem;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s var(--delay) both;
  }

  .programme-card:hover {
    background: #f0f0f0;
    transform: translateX(5px);
  }

  .programme-icon {
    font-size: 1.5rem;
    color: var(--accent);
  }

  .programme-card span {
    font-weight: 500;
    color: #333;
    font-size: 0.95rem;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ============ CATEGORIES ============ */
  .categories-section {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%);
    padding: 5rem 0;
  }

  .categories-section .section-heading {
    color: white;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .category-card {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 1rem;
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .category-card:hover,
  .category-card.active {
    background: rgba(255, 215, 0, 0.1);
    border-color: #FFD700;
    transform: scale(1.05);
  }

  .cat-emoji {
    font-size: 2rem;
    color: #ff1919;
  }

  .cat-title {
    color: #ddd;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .cat-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 40%, rgba(255, 215, 0, 0.05) 50%, transparent 60%);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    from { transform: translateX(-100%) rotate(45deg); }
    to { transform: translateX(100%) rotate(45deg); }
  }

  /* ============ CIBLES ============ */
  .cibles-section {
    background: #fff;
  }

  .cibles-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .cible-card {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #f5f5f5;
    padding: 0.8rem 1.5rem;
    border-radius: 3rem;
    transition: all 0.3s ease;
  }

  .cible-card:hover {
    background: #1a1a1a;
    color: white;
  }

  .cible-card i {
    color: #ff1919;
    font-size: 1.1rem;
  }

  .cible-card span {
    font-weight: 500;
    font-size: 0.95rem;
  }

  /* ============ SPONSORS ============ */
  .sponsors-section {
    background: #f9f9f9;
  }

  .sponsors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.2rem;
  }

  .sponsor-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .sponsor-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }

  .sponsor-card i {
    font-size: 1.5rem;
    color: #FFD700;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .sponsor-card p {
    color: #555;
    line-height: 1.5;
    font-size: 0.95rem;
    margin: 0;
  }

  /* ============ CTA ============ */
  .cta-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%);
  }

  .cta-card {
    text-align: center;
    color: white;
  }

  .cta-card h2 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: #FFD700;
  }

  .cta-sub {
    color: #aaa;
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 2rem;
  }

  .cta-sub strong {
    color: white;
  }

  .cta-date {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #ccc;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.6rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cta-date i {
    color: #ff1919;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, #ff1919, #cc0000);
    color: white;
    border-radius: 3rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(255, 25, 25, 0.3);
  }

  .cta-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 30px rgba(255, 25, 25, 0.5);
  }

  /* ============ RESPONSIVE ============ */
  @media (max-width: 768px) {
    .title-line { font-size: 2rem; }
    .title-line.gold { font-size: 2.3rem; }
    .title-acronym { font-size: 1.2rem; }
    .hero-tagline { font-size: 1rem; }
    .hero-date { flex-direction: column; gap: 0.8rem; align-items: center; }
    .about-grid { grid-template-columns: 1fr; }
    .section-heading { font-size: 1.4rem; }
    .categories-grid { grid-template-columns: repeat(2, 1fr); }
    .cta-card h2 { font-size: 1.5rem; }
    .hero { min-height: 90vh; }
  }

  @media (max-width: 480px) {
    .title-line { font-size: 1.6rem; }
    .title-line.gold { font-size: 1.8rem; }
    .categories-grid { grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    .objectives-grid { grid-template-columns: 1fr; }
  }
</style>
