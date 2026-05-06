<script>
  import { onMount } from 'svelte';
  let isVisible = false;
  onMount(() => { isVisible = true; });
</script>

<svelte:head>
  <title>ONE COMEDY CLUB – En savoir plus</title>
  <meta name="description" content="ONE COMEDY CLUB, la plateforme humoristique officielle de One Radio. Stand-up, live, radio, digital et formation en Côte d'Ivoire et en Afrique." />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
</svelte:head>

<div class="occ-wrap">
  <header class="occ-hero" class:visible={isVisible}>
    <div class="occ-hero-overlay"></div>
    <div class="occ-hero-content">
      <span class="occ-tag">One Radio présente</span>
      <h1>ONE COMEDY CLUB</h1>
      <p class="occ-tagline">Le rire devient une industrie</p>
    </div>
  </header>
  <main class="occ-main">
    <!-- ...copier ici le contenu de l'ancien +page.svelte si besoin... -->
    <section class="occ-section" style="text-align:center; margin-bottom:2rem;">
      <a href="/events/one-comedy-club" class="occ-btn" style="display:inline-block;padding:0.7rem 1.5rem;background:#ff0000;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;transition:background 0.2s;">Retour au programme</a>
    </section>
  </main>
</div>
