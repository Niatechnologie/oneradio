<script>
  import { onMount } from 'svelte';

  let isVisible = $state(false);

  onMount(() => {
    isVisible = true;
  });
</script>

<svelte:head>
  <title>ONE COMEDY CLUB – One Radio</title>
  <meta name="description" content="ONE COMEDY CLUB, la plateforme humoristique officielle de One Radio. Stand-up, live, radio, digital et formation en Côte d'Ivoire et en Afrique." />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" />
</svelte:head>

<div class="occ-wrap">

  <!-- ── HERO ── -->
  <header class="occ-hero" class:visible={isVisible}>
    <div class="occ-hero-overlay"></div>
    <div class="occ-hero-content">
      <span class="occ-tag">One Radio présente</span>
      <h1>ONE COMEDY CLUB</h1>
      <p class="occ-tagline">Le rire devient une industrie</p>
    </div>
  </header>

  <main class="occ-main">

    <!-- ── À PROPOS ── -->
    <section class="occ-section" class:visible={isVisible}>
      <div class="occ-section-header">
        <h2>À propos</h2>
      </div>
      <div class="occ-card">
        <p>
          <strong>ONE COMEDY CLUB</strong> est la plateforme humoristique officielle portée par One Radio,
          dédiée à la découverte, la production et la promotion des talents du stand-up en Côte d'Ivoire et en Afrique.
        </p>
        <p class="occ-mt">
          À la croisée du spectacle vivant, des médias et du digital, ONE COMEDY CLUB s'impose comme un
          <strong>écosystème complet du rire</strong>, combinant scène, radio, formation et diffusion digitale.
        </p>
      </div>
    </section>

    <!-- ── VISION + MISSION ── -->
    <div class="occ-two-col" class:visible={isVisible}>
      <section class="occ-card occ-card--dark">
        <div class="occ-section-header occ-section-header--light">
          <h2>Notre vision</h2>
        </div>
        <p>
          Faire de ONE COMEDY CLUB la <strong>référence du stand-up en Afrique de l'Ouest</strong>,
          en créant une industrie structurée autour du talent, du contenu et de la performance.
        </p>
      </section>

      <section class="occ-card">
        <div class="occ-section-header">
          <h2>Notre mission</h2>
        </div>
        <ul class="occ-list">
          <li>Détecter et accompagner les talents humoristiques émergents</li>
          <li>Produire des contenus originaux à forte valeur virale</li>
          <li>Créer des expériences live uniques</li>
          <li>Offrir aux marques un canal innovant de communication</li>
        </ul>
      </section>
    </div>

    <!-- ── ACTIVITÉS ── -->
    <section class="occ-section" class:visible={isVisible}>
      <div class="occ-section-header">
        <h2>Nos activités</h2>
      </div>
      <div class="occ-activities-grid">

        <div class="occ-activity-card">
          <h3>ONE COMEDY LIVE</h3>
          <p>Des soirées stand-up organisées régulièrement dans des lieux premium à Abidjan.</p>
          <div class="occ-formats">
            <span class="occ-format-badge">Open mic</span>
            <span class="occ-format-badge">Plateaux confirmés</span>
            <span class="occ-format-badge">One man show</span>
            <span class="occ-format-badge">Battles</span>
          </div>
        </div>

        <div class="occ-activity-card">
          <h3>ONE COMEDY RADIO</h3>
          <p>Le rire s'invite sur les ondes de One Radio.</p>
          <div class="occ-formats">
            <span class="occ-format-badge">Capsules quotidiennes</span>
            <span class="occ-format-badge">Chroniques</span>
            <span class="occ-format-badge">Directs</span>
          </div>
        </div>

        <div class="occ-activity-card">
          <h3>ONE COMEDY DIGITAL</h3>
          <p>Une présence forte sur le digital pour maximiser l'audience.</p>
          <div class="occ-formats">
            <span class="occ-format-badge">YouTube</span>
            <span class="occ-format-badge">TikTok & Instagram</span>
            <span class="occ-format-badge">Podcasts</span>
          </div>
        </div>

        <div class="occ-activity-card">
          <h3>ONE COMEDY ACADEMY</h3>
          <p>Un programme de formation et d'incubation des talents.</p>
          <div class="occ-formats">
            <span class="occ-format-badge">Écriture humoristique</span>
            <span class="occ-format-badge">Présence scénique</span>
            <span class="occ-format-badge">Professionnalisation</span>
          </div>
        </div>

      </div>
    </section>

    <!-- ── PARTENAIRES ── -->
    <section class="occ-section occ-section--gold" class:visible={isVisible}>
      <div class="occ-section-header">
        <h2>Opportunités pour les partenaires</h2>
      </div>
      <p class="occ-lead">
        ONE COMEDY CLUB offre aux marques un accès direct à une audience jeune, dynamique et engagée.
      </p>
      <div class="occ-partner-grid">
        <div class="occ-partner-item"><i class="bi bi-star-fill"></i> Sponsoring de shows live</div>
        <div class="occ-partner-item"><i class="bi bi-broadcast"></i> Intégration radio et digital</div>
        <div class="occ-partner-item"><i class="bi bi-camera-video-fill"></i> Brand content humoristique</div>
        <div class="occ-partner-item"><i class="bi bi-bag-fill"></i> Placement de produit</div>
        <div class="occ-partner-item"><i class="bi bi-trophy-fill"></i> Naming d'événements</div>
      </div>
    </section>

    <!-- ── POURQUOI ── -->
    <section class="occ-section" class:visible={isVisible}>
      <div class="occ-section-header">
        <h2>Pourquoi ONE COMEDY CLUB ?</h2>
      </div>
      <div class="occ-why-grid">
        <div class="occ-why-item">
          <p>Adossé à la puissance média de <strong>One Radio</strong></p>
        </div>
        <div class="occ-why-item">
          <p>Forte <strong>viralité</strong> du contenu humoristique</p>
        </div>
        <div class="occ-why-item">
          <p>Cible jeune et active <strong>(18–40 ans)</strong></p>
        </div>
        <div class="occ-why-item">
          <p>Potentiel de diffusion <strong>régional et international</strong></p>
        </div>
        <div class="occ-why-item">
          <p>Concept <strong>innovant et scalable</strong></p>
        </div>
      </div>
    </section>

    <!-- ── AMBITION ── -->
    <section class="occ-ambition" class:visible={isVisible}>
      <div class="occ-ambition-inner">
        <h2>Notre ambition</h2>
        <p>
          Créer une nouvelle génération de <strong>stars du rire africain</strong>, tout en positionnant
          ONE COMEDY CLUB comme un acteur incontournable du divertissement.
        </p>
      </div>
    </section>

    <!-- ── REJOIGNEZ-NOUS ── -->
    <section class="occ-section occ-section--join" class:visible={isVisible}>
      <div class="occ-section-header">
        <h2>Rejoignez-nous</h2>
      </div>
      <p class="occ-lead">Vous êtes :</p>
      <div class="occ-join-grid">
        <div class="occ-join-card">
          <strong>Humoriste ?</strong>
          <p>Montez sur scène et faites briller votre talent.</p>
        </div>
        <div class="occ-join-card">
          <strong>Partenaire ou sponsor ?</strong>
          <p>Associez votre marque à la bonne humeur et au rire.</p>
        </div>
        <div class="occ-join-card">
          <strong>Producteur ou média ?</strong>
          <p>Collaborez pour créer des contenus à fort impact.</p>
        </div>
      </div>
      <p class="occ-cta-label">ONE COMEDY CLUB est votre plateforme.</p>
    </section>

    <!-- ── CONTACT ── -->
    <section class="occ-contact" class:visible={isVisible}>
      <h2>Contact</h2>
      <div class="occ-contact-grid">
        <div class="occ-contact-item">
          <i class="bi bi-geo-alt-fill"></i>
          <span>Abidjan, Côte d'Ivoire</span>
        </div>
        <div class="occ-contact-item">
          <i class="bi bi-envelope-fill"></i>
          <a href="mailto:contact@oneradio.ci">contact@oneradio.ci</a>
        </div>
        <div class="occ-contact-item">
          <i class="bi bi-telephone-fill"></i>
          <a href="tel:+2250502877877">+225 0502877877</a>
        </div>
      </div>
    </section>

  </main>
</div>

<style>
  /* ── Variables locales ── */
  :root {
    --occ-yellow: #f51818;
    --occ-yellow-dark: #a30000;
    --occ-dark: #121212;
    --occ-dark2: #1e1e2e;
    --occ-red: #ff1919;
    --occ-white: #ffffff;
    --occ-gray: #f5f5f5;
    --occ-text: #1a1a1a;
    --occ-muted: #555;
    --occ-radius: 1rem;
  }

  /* ── Wrapper ── */
  .occ-wrap {
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--occ-text);
    background: #fafafa;
  }

  /* ── HERO ── */
  .occ-hero {
    position: relative;
    background: linear-gradient(135deg, var(--occ-dark) 0%, #1a0a00 40%, #2d1200 100%);
    padding: 5rem 1.5rem 4rem;
    text-align: center;
    overflow: hidden;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .occ-hero.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .occ-hero-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(245, 197, 24, 0.15), transparent 55%),
      radial-gradient(circle at 80% 30%, rgba(255, 25, 25, 0.12), transparent 50%);
    pointer-events: none;
  }

  .occ-hero-content {
    position: relative;
    z-index: 1;
  }

  .occ-tag {
    display: inline-block;
    background: var(--occ-yellow);
    color: var(--occ-dark);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 1rem;
  }

  .occ-hero-content h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 900;
    color: var(--occ-white);
    letter-spacing: 0.02em;
    margin-bottom: 0.75rem;
  }

  .occ-tagline {
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    color: var(--occ-yellow);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* ── MAIN ── */
  .occ-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── SECTION ── */
  .occ-section {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }

  .occ-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .occ-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
  }

  .occ-two-col.visible {
    opacity: 1;
    transform: translateY(0);
  }

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

  .occ-section-header--light h2 {
    color: var(--occ-white);
  }

  .occ-section-header--light h2::after {
    background: var(--occ-yellow);
  }

  .occ-icon {
    font-size: 1.5rem;
  }

  /* ── CARD ── */
  .occ-card {
    background: var(--occ-white);
    border-radius: var(--occ-radius);
    padding: 1.75rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  }

  .occ-card p {
    color: var(--occ-muted);
    line-height: 1.7;
    font-size: 1rem;
  }

  .occ-card--dark {
    background: var(--occ-dark2);
  }

  .occ-card--dark p {
    color: #ccc;
  }

  .occ-card--dark strong {
    color: var(--occ-yellow);
  }

  .occ-mt {
    margin-top: 0.85rem;
  }

  /* ── LIST ── */
  .occ-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .occ-list li {
    font-size: 0.95rem;
    color: var(--occ-muted);
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    line-height: 1.5;
  }

  .occ-list li::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    min-width: 16px;
    background: var(--occ-yellow);
    border-radius: 50%;
    margin-top: 2px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13 4L6.5 11 3 7.5' stroke='%23000' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  /* ── ACTIVITIES GRID ── */
  .occ-activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.25rem;
  }

  .occ-activity-card {
    background: var(--occ-white);
    border-radius: var(--occ-radius);
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    border-top: 4px solid var(--occ-yellow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .occ-activity-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.11);
  }

  .occ-activity-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
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

  /* ── PARTENAIRES ── */
  .occ-section--gold {
    background: linear-gradient(135deg, #fffbea, #fff8d0);
    border-radius: var(--occ-radius);
    padding: 2rem;
    border: 1.5px solid var(--occ-yellow);
  }

  .occ-lead {
    font-size: 1rem;
    color: var(--occ-muted);
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  .occ-partner-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.85rem;
  }

  .occ-partner-item {
    background: var(--occ-white);
    border-radius: 0.6rem;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--occ-text);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  .occ-partner-item i {
    color: var(--occ-yellow-dark);
    font-size: 1rem;
  }

  /* ── POURQUOI ── */
  .occ-why-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
    gap: 1rem;
  }

  .occ-why-item {
    background: var(--occ-white);
    border-radius: var(--occ-radius);
    padding: 1.25rem 1rem;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    transition: transform 0.25s ease;
  }

  .occ-why-item:hover {
    transform: translateY(-3px);
  }

  .occ-why-icon {
    display: block;
    font-size: 1.75rem;
    margin-bottom: 0.6rem;
  }

  .occ-why-item p {
    font-size: 0.9rem;
    color: var(--occ-muted);
    line-height: 1.5;
  }

  .occ-why-item strong {
    color: var(--occ-text);
  }

  /* ── AMBITION ── */
  .occ-ambition {
    background: linear-gradient(135deg, var(--occ-dark) 0%, #1a0a00 100%);
    border-radius: var(--occ-radius);
    padding: 3rem 2rem;
    text-align: center;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
  }

  .occ-ambition.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .occ-ambition-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
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

  .occ-ambition strong {
    color: var(--occ-yellow);
  }

  /* ── REJOIGNEZ-NOUS ── */
  .occ-section--join {
    background: var(--occ-gray);
    border-radius: var(--occ-radius);
    padding: 2rem;
  }

  .occ-join-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .occ-join-card {
    background: var(--occ-white);
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    transition: transform 0.2s ease;
  }

  .occ-join-card:hover {
    transform: translateY(-3px);
  }

  .occ-join-emoji {
    display: block;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .occ-join-card strong {
    display: block;
    font-size: 0.95rem;
    margin-bottom: 0.35rem;
    color: var(--occ-text);
  }

  .occ-join-card p {
    font-size: 0.85rem;
    color: var(--occ-muted);
    line-height: 1.5;
  }

  .occ-cta-label {
    text-align: center;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--occ-text);
  }

  /* ── CONTACT ── */
  .occ-contact {
    background: var(--occ-dark2);
    border-radius: var(--occ-radius);
    padding: 2rem;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
  }

  .occ-contact.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .occ-contact h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--occ-white);
    margin-bottom: 1.25rem;
  }

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

  .occ-contact-item i {
    color: var(--occ-yellow);
    font-size: 1rem;
  }

  .occ-contact-item a {
    color: var(--occ-yellow);
    text-decoration: none;
    font-weight: 500;
  }

  .occ-contact-item a:hover {
    text-decoration: underline;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .occ-hero {
      padding: 3.5rem 1rem 2.5rem;
    }

    .occ-two-col {
      grid-template-columns: 1fr;
    }

    .occ-activities-grid {
      grid-template-columns: 1fr;
    }

    .occ-ambition {
      padding: 2rem 1.25rem;
    }

    .occ-partner-grid,
    .occ-why-grid,
    .occ-join-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
