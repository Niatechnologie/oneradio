<script>
  import { onMount } from 'svelte';
  import img_p from '$lib/img/parieur.png';

  let isVisible = $state(false);

  onMount(() => {
    isVisible = true;
  });
</script>

<svelte:head>
  <title>One Radio - Super Parieur</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<div class="container">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <i class="bi bi-trophy-fill header-icon"></i>
      <h1>SUPER PARIEUR</h1>
    </div>
    <p class="header-sub">Le jeu qui transforme tes pronostics en gains !</p>
  </header>

  <!-- Hero Banner -->
  <div class="hero-banner" class:visible={isVisible}>
    <div class="hero-overlay"></div>
    <img src={img_p} alt="Super Parieur" class="hero-img" />
    <div class="hero-text">
      <h2>Tu aimes le sport ?<br>Tu aimes les défis ?</h2>
      <p>Deviens le <strong>SUPER PARIEUR</strong> de ONE RADIO chaque jour et gagne du <strong>CASH</strong> !</p>
    </div>
  </div>

  <!-- Steps Section -->
  <section class="steps-section">
    <h2 class="section-title">Comment participer ?</h2>
    <div class="steps-grid">
      <div class="step-card" class:visible={isVisible}>
        <div class="step-number">1</div>
        <div class="step-icon"><i class="bi bi-person-plus-fill"></i></div>
        <h3>Inscris-toi</h3>
        <p>Inscris-toi sur <strong>AKWABET</strong> avec le code promo</p>
        <div class="promo-code">
          <i class="bi bi-tag-fill"></i>
          <span>CODE PROMO : 877</span>
        </div>
      </div>

      <div class="step-card" class:visible={isVisible}>
        <div class="step-number">2</div>
        <div class="step-icon"><i class="bi bi-ticket-perforated-fill"></i></div>
        <h3>Fais ton pari</h3>
        <p>Place tes pronostics sur les matchs de ton choix</p>
      </div>

      <div class="step-card" class:visible={isVisible}>
        <div class="step-number">3</div>
        <div class="step-icon"><i class="bi bi-whatsapp"></i></div>
        <h3>Envoie ta capture</h3>
        <p>Envoie la capture de ton ticket sur le WhatsApp de ONE RADIO</p>
        <a href="https://wa.me/2250500877877" target="_blank" class="whatsapp-btn">
          <i class="bi bi-whatsapp"></i> 0500 877 877
        </a>
      </div>
    </div>
  </section>

  <!-- Winner Section -->
  <section class="winner-section" class:visible={isVisible}>
    <div class="winner-card">
      <div class="winner-icon"><i class="bi bi-star-fill"></i></div>
      <h2>🏆 Deviens le SUPER PARIEUR du jour !</h2>
      <p>Celui qui fait le plus de <strong>GROS pronostics gagnants</strong> devient le <strong>SUPER PARIEUR</strong> du jour !</p>
    </div>
  </section>

  <!-- Warning Section -->
  <section class="warning-section" class:visible={isVisible}>
    <div class="warning-card">
      <div class="warning-header">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <h3>Rappel important</h3>
      </div>
      <p>Sans le <strong>CODE PROMO : 877</strong>, ta participation n'est pas valable !</p>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section" class:visible={isVisible}>
    <div class="cta-card">
      <i class="bi bi-broadcast-pin cta-icon"></i>
      <h2>📻 SUPER PARIEUR – ONE RADIO</h2>
      <p>Le jeu qui transforme tes pronostics en gains !</p>
      <a href="https://wa.me/2250500877877" target="_blank" class="cta-btn">
        <i class="bi bi-whatsapp"></i> Participer maintenant
      </a>
    </div>
  </section>
</div>

<style>
  :root {
    --red: #ff1919;
    --red-dark: #cc0000;
    --gold: #FFD700;
    --dark: #1a1a1a;
    --gray-600: #4b5563;
    --gray-900: #111827;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 2.5rem;
    background: #fff;
    box-shadow: none;
    border-radius: 1rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .header-icon {
    font-size: 2rem;
    color: var(--gold);
  }

  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--gray-900);
    letter-spacing: 0.05em;
  }

  .header-sub {
    color: var(--gray-600);
    font-size: 1.05rem;
  }

  /* Hero Banner */
  .hero-banner {
    position: relative;
    background: linear-gradient(135deg, var(--dark) 0%, #2d0000 50%, var(--red-dark) 100%);
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }

  .hero-banner.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 80% 20%, rgba(255, 25, 25, 0.3), transparent 60%);
  }

  .hero-img {
    position: absolute;
    right: -1rem;
    bottom: 0;
    height: 100%;
    max-height: 280px;
    width: auto;
    object-fit: contain;
    z-index: 0;
    opacity: 0.35;
    pointer-events: none;
  }

  .hero-text {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
  }

  .hero-text h2 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .hero-text p {
    font-size: 1.15rem;
    color: #e0e0e0;
  }

  .hero-text strong {
    color: var(--gold);
  }

  /* Steps Section */
  .steps-section {
    margin-bottom: 3rem;
  }

  .section-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 2rem;
    position: relative;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -0.6rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--red);
    border-radius: 2px;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .step-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
    transition-delay: 0.1s;
  }

  .step-card:nth-child(2) { transition-delay: 0.25s; }
  .step-card:nth-child(3) { transition-delay: 0.4s; }

  .step-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .step-number {
    position: absolute;
    top: -0.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2rem;
    height: 2rem;
    background: var(--red);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .step-icon {
    font-size: 2.5rem;
    color: var(--red);
    margin-bottom: 1rem;
  }

  .step-card h3 {
    font-size: 1.2rem;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  }

  .step-card p {
    color: var(--gray-600);
    line-height: 1.5;
  }

  .promo-code {
    margin-top: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--red), var(--red-dark));
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .whatsapp-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    background: #25D366;
    color: white;
    border-radius: 2rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .whatsapp-btn:hover {
    background: #1da851;
    transform: scale(1.05);
  }

  /* Winner Section */
  .winner-section {
    margin-bottom: 2.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease 0.3s;
  }

  .winner-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .winner-card {
    background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%);
    border: 2px solid var(--gold);
    border-radius: 1rem;
    padding: 2.5rem 2rem;
    text-align: center;
  }

  .winner-icon {
    font-size: 2.5rem;
    color: var(--gold);
    margin-bottom: 1rem;
  }

  .winner-card h2 {
    font-size: 1.4rem;
    color: var(--gray-900);
    margin-bottom: 0.75rem;
  }

  .winner-card p {
    color: var(--gray-600);
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .winner-card strong {
    color: var(--red);
  }

  /* Warning Section */
  .warning-section {
    margin-bottom: 2.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease 0.4s;
  }

  .warning-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .warning-card {
    background: #fff5f5;
    border-left: 4px solid var(--red);
    border-radius: 0.75rem;
    padding: 1.5rem 2rem;
  }

  .warning-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .warning-header i {
    color: var(--red);
    font-size: 1.3rem;
  }

  .warning-header h3 {
    color: var(--red);
    font-size: 1.1rem;
  }

  .warning-card p {
    color: var(--gray-600);
    font-size: 1rem;
  }

  .warning-card strong {
    color: var(--red);
  }

  /* CTA Section */
  .cta-section {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease 0.5s;
  }

  .cta-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .cta-card {
    background: linear-gradient(135deg, var(--dark) 0%, #2d0000 100%);
    border-radius: 1rem;
    padding: 3rem 2rem;
    text-align: center;
    color: white;
  }

  .cta-icon {
    font-size: 2.5rem;
    color: var(--red);
    margin-bottom: 1rem;
  }

  .cta-card h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .cta-card p {
    color: #ccc;
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 2rem;
    background: var(--red);
    color: white;
    border-radius: 2rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }

  .cta-btn:hover {
    background: var(--red-dark);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 25, 25, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    h1 { font-size: 1.5rem; }
    .hero-text h2 { font-size: 1.25rem; }
    .hero-banner { padding: 2rem 1.5rem; }
    .steps-grid { grid-template-columns: 1fr; }
    .winner-card { padding: 2rem 1.5rem; }
    .cta-card { padding: 2rem 1.5rem; }
  }
</style>
