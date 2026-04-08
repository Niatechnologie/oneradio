<script>
  import { onMount } from 'svelte';
  import img_p from '$lib/img/parieur.png';

  let isVisible = $state(false);
  let copySuccess = $state(false);
  let toastVisible = $state(false);
  let popupBlocked = $state(false);

  const PROMO_CODE = 'OA7245400';
  const AKWABET_URL = 'https://akwabet.com/prematch';

  onMount(() => {
    isVisible = true;
  });

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
    }).catch(() => {
      fallbackCopy(PROMO_CODE);
    });
  }

  function ouvrirAkwabet() {
    try {
      navigator.clipboard.writeText(PROMO_CODE).catch(() => {});
    } catch(e) {
      try { fallbackCopy(PROMO_CODE); } catch(e2) {}
    }

    const popup = window.open(
      AKWABET_URL,
      'akwabet_popup',
      'width=1000,height=700,left=100,top=60,scrollbars=yes,resizable=yes'
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      popupBlocked = true;
      toastVisible = false;
    } else {
      toastVisible = true;
      popupBlocked = false;
      setTimeout(() => { toastVisible = false; }, 5000);
    }
  }
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
      <div class="step-card step-card--promo" class:visible={isVisible}>
        <div class="promo-card-header">
          <div class="step-number step-number--inline">1</div>
          <div class="badge">Offre exclusive</div>
          <h3>Bonus de bienvenue +50%</h3>
          <p>Utilisez le code ci-dessous sur Akwabet</p>
        </div>
        <div class="promo-card-body">
          <div class="code-box">
            <span class="code-label">Code</span>
            <span class="code-value">{PROMO_CODE}</span>
            <button class="btn-copy" class:copied={copySuccess} onclick={copierCode}>
              {copySuccess ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <ul class="avantages">
            <li>Bonus de 50% sur votre premier dépôt</li>
            <li>Offre valable 48h après inscription</li>
            <li>Collez le code dans le champ "Code promo"</li>
          </ul>
          <button class="btn-open" onclick={ouvrirAkwabet}>
            Ouvrir Akwabet et utiliser le code
          </button>
          <p class="hint">Le code sera copié automatiquement dans votre presse-papier</p>
          {#if toastVisible}
            <div class="toast">
              Code copié ! Collez-le avec <strong>Ctrl+V</strong> dans le champ "Code promo" sur Akwabet.
            </div>
          {/if}
          {#if popupBlocked}
            <div class="popup-blocked">
              Votre navigateur a bloqué la fenêtre.
              <a href={AKWABET_URL} target="_blank">Cliquez ici pour ouvrir Akwabet</a>
              — puis collez le code <strong>{PROMO_CODE}</strong> avec Ctrl+V.
            </div>
          {/if}
        </div>
      </div>

      <div class="step-card" class:visible={isVisible}>
        <div class="step-number">2</div>
        <div class="step-icon"><i class="bi bi-ticket-perforated-fill"></i></div>
        <h3>Fais ton pari</h3>
        <p>Place tes pronostics sur les matchs de ton choix</p>
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
      <p>Sans le <strong>CODE PROMO : OA7245400</strong>, ta participation n'est pas valable !</p>
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
    opacity: 0.85;
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

  .inscription-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.8rem;
    padding: 0.6rem 1.2rem;
    background: var(--gold);
    color: var(--dark);
    border-radius: 2rem;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
  }

  .inscription-btn:hover {
    background: #e6c200;
    transform: scale(1.05);
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

  /* Step 1 Promo Card */
  .step-card--promo {
    padding: 0;
    overflow: hidden;
    text-align: left;
  }

  .step-number--inline {
    position: static;
    transform: none;
    margin: 0 auto 0.75rem;
  }

  .promo-card-header {
    background: #1a1a2e;
    padding: 1.5rem;
    text-align: center;
  }

  .badge {
    display: inline-block;
    background: #f0b429;
    color: #3d2700;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 10px;
  }

  .promo-card-header h3 {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .promo-card-header p {
    color: #aaa;
    font-size: 13px;
  }

  .promo-card-body {
    padding: 1.5rem;
  }

  .code-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8f8f8;
    border: 1.5px dashed #ccc;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 1rem;
  }

  .code-label {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .code-value {
    flex: 1;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #1a1a2e;
    text-align: center;
  }

  .btn-copy {
    background: none;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    cursor: pointer;
    color: #444;
    transition: background 0.15s;
  }

  .btn-copy:hover { background: #eee; }
  .btn-copy.copied { border-color: #22c55e; color: #16a34a; }

  .avantages {
    list-style: none;
    margin-bottom: 1.25rem;
    padding: 0;
  }

  .avantages li {
    font-size: 13px;
    color: #444;
    padding: 5px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .avantages li::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: #22c55e;
    border-radius: 50%;
    flex-shrink: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M13 4L6.5 11 3 7.5' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .btn-open {
    width: 100%;
    padding: 14px;
    background: #f0b429;
    color: #3d2700;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
  }

  .btn-open:hover { background: #e0a820; }
  .btn-open:active { transform: scale(0.98); }

  .hint {
    font-size: 11px;
    color: #999;
    text-align: center;
    margin-top: 10px;
  }

  .toast {
    margin-top: 14px;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: #166534;
    text-align: center;
  }

  .popup-blocked {
    margin-top: 14px;
    background: #fefce8;
    border: 1px solid #fde047;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: #713f12;
  }

  .popup-blocked a {
    color: #92400e;
    font-weight: 600;
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
