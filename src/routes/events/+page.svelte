<script>
    import { onMount } from 'svelte';
    
    import pub1 from "$lib/img/pubspa.jpg";
    import  "$lib/style_news.css";
    import  "$lib/style_events.css";
    import loader from '$lib/img/loader.gif'
    import Pagination from "../pagination.svelte";
  
// Variables d'état réactives
  let data = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let currentPage = $state(1);
  let itemsPerPage = $state(6);
  let totalItems = $state(0);
  let items = $state([]);

  // Fonction pour charger les données
  async function loadData() {
    isLoading = true;
    error = null;
    
    try {
      // Récupération parallèle des données
      const [paginatedResponse, allNewsResponse] = await Promise.all([
        fetch(`https://adminradio.oneradio.ci/radio_one/events.php?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`https://adminradio.oneradio.ci/radio_one/allevents.php`)
      ]);

      if (!paginatedResponse.ok) {
        throw new Error(`Erreur API paginée: ${paginatedResponse.status}`);
      }
      
      if (!allNewsResponse.ok) {
        throw new Error(`Erreur API totale: ${allNewsResponse.status}`);
      }

      const [paginatedData, allNewsData] = await Promise.all([
        paginatedResponse.json(),
        allNewsResponse.json()
      ]);

      // Attribution des données
      items = paginatedData || [];
      totalItems = Array.isArray(allNewsData) ? allNewsData.length : 0;

    } catch (e) {
      error = e;
      console.error('Erreur lors du chargement:', e);
    } finally {
      isLoading = false;
    }
  }

  // Gestionnaire de changement de page
  async function handlePageChange(event) {
    currentPage = event.detail.page;
    if (event.detail.itemsPerPage) {
      itemsPerPage = event.detail.itemsPerPage;
    }
    
    await loadData();
    
    // Scroll vers le haut (optionnel)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Chargement initial
  onMount(() => {
    loadData();
  });
    
   </script>

<svelte:head>
    <title>Radio Treichville - Events</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

  <main style="background: #fff;">
      <div class="news-section" style="padding-top: 30px;">

          <!-- Section In House -->
          <h2 class="section-title">Événements In House</h2>
          <div class="inhouse-section">
            <article class="orma-card">
              <div class="orma-image">
                <div class="orma-badge">IN HOUSE</div>
                <div class="orma-gradient"></div>
                <div class="orma-content-overlay">
                  <h3 class="orma-title">🏆 ONE RADIO MUSIC AWARD (ORMA)</h3>
                  <p class="orma-subtitle">La grande messe annuelle de la musique urbaine et africaine</p>
                </div>
              </div>
              <div class="orma-body">
                <p class="orma-desc">
                  Le <strong>ONE RADIO MUSIC AWARD (ORMA)</strong> est un événement musical majeur dédié à la célébration, 
                  la valorisation et la reconnaissance des talents musicaux, des acteurs culturels et des professionnels 
                  de l'industrie musicale en Côte d'Ivoire et en Afrique.
                </p>
                <div class="orma-info">
                  <span class="orma-date"><i class="bi bi-calendar3"></i> Vendredi 04 Décembre</span>
                  <span class="orma-location"><i class="bi bi-geo-alt-fill"></i> Lieu à confirmer</span>
                </div>
                <div class="orma-highlights">
                  <span><i class="bi bi-trophy-fill"></i> Remise de trophées</span>
                  <span><i class="bi bi-mic-fill"></i> Prestations live</span>
                  <span><i class="bi bi-music-note-beamed"></i> Grand concert</span>
                  <span><i class="bi bi-star-fill"></i> Tapis rouge</span>
                </div>
                <a href="/events/awards" class="orma-btn">
                  Découvrir le projet <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </article>
          </div>

          <!-- Section Others -->
          <h2 class="section-title" style="margin-top: 3rem;">Others</h2>
           <div><!-- Composant Pagination -->
            <Pagination 
                {currentPage}
                {totalItems}
                {itemsPerPage}
                maxVisiblePages={5}
                showInfo={false}
                showFirstLast={true}
                on:pageChange={handlePageChange}
            /></div>
  
            {#if isLoading}
            <p class="chargement-events"><img src="{loader}" alt="loading"></p>
            {:else if error}
            <p class="chargement-events">Erreur: {error.message}</p>
            {:else}
            <div class="events-grid">
              {#each items as event}
                  <article class="events-card">
                      <div class="events-image-container">
                        <a href="/events/{event.slug}">
                          <img src="https://adminradio.oneradio.ci/cropavatar/img/{event.photo}" alt={event.titre} class="events-image" />
                          <span class="events-category">{event.categorie}</span>
                        </a>
                      </div>
                      <div class="events-content">
                          <div class="events-metadata">
                            
                              <div class="events-metadata-item">
                                <small>Publié le </small>  {event.datepub}
                              </div>
                              
                          </div>
                          <h2 class="events-title">{event.titre}</h2>
                          <!-- <p class="events-excerpt">{event.excerpt}</p> -->
                          <a href="/events/{event.slug}" class="events-read-more">
                              Voir plus
                              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                          </a>
                      </div>
                  </article>
              {/each}
              </div>
            {/if}
          

            <div><!-- Composant Pagination -->
            <Pagination 
                {currentPage}
                {totalItems}
                {itemsPerPage}
                maxVisiblePages={5}
                showInfo={false}
                showFirstLast={true}
                on:pageChange={handlePageChange}
            /></div>
  
      </div>
  </main>   
  
  
  <style>
  main {
      flex: 1;
      padding: 0.4rem 1rem 4rem 1rem;
  }
  .news-section {
  max-width: 1200px;
  margin: 0 auto;
  }
  .chargement-events{
    min-height: 400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    font-size: 1.2rem;
    justify-content: center;
    align-items: center;
}
  .section-title {
      text-align: center;
      font-size: 1.7rem;
      color: #333;
      margin-bottom: 3rem;
      position: relative;
  }
  
  .section-title::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(to right, #ff0000, #67b8ff);
      border-radius: 2px;
  }

  /* ORMA In House Card */
  .inhouse-section {
    margin-bottom: 2rem;
  }

  .orma-card {
    background: #fff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease;
  }

  .orma-card:hover {
    transform: translateY(-4px);
  }

  .orma-image {
    position: relative;
    height: 220px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d0000 40%, #cc0000 100%);
    overflow: hidden;
  }

  .orma-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #FFD700;
    color: #1a1a1a;
    padding: 0.3rem 0.8rem;
    border-radius: 2rem;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    z-index: 2;
  }

  .orma-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 30%, rgba(255, 215, 0, 0.15), transparent 60%),
                radial-gradient(circle at 20% 80%, rgba(255, 25, 25, 0.3), transparent 50%);
  }

  .orma-content-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem 1.5rem 1.5rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    z-index: 1;
  }

  .orma-title {
    color: #FFD700;
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
  }

  .orma-subtitle {
    color: #ddd;
    font-size: 0.9rem;
    font-style: italic;
  }

  .orma-body {
    padding: 1.5rem;
  }

  .orma-desc {
    color: #555;
    line-height: 1.7;
    margin-bottom: 1.2rem;
    font-size: 0.95rem;
  }

  .orma-info {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .orma-info span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #333;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .orma-info i {
    color: #ff1919;
  }

  .orma-highlights {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .orma-highlights span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: #f5f5f5;
    padding: 0.4rem 0.8rem;
    border-radius: 2rem;
    font-size: 0.8rem;
    color: #555;
    font-weight: 500;
  }

  .orma-highlights i {
    color: #FFD700;
    font-size: 0.85rem;
  }

  .orma-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.5rem;
    background: linear-gradient(135deg, #ff1919, #cc0000);
    color: white;
    border-radius: 2rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .orma-btn:hover {
    background: linear-gradient(135deg, #cc0000, #990000);
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 25, 25, 0.4);
  }

  @media (max-width: 768px) {
    .orma-image { height: 180px; }
    .orma-title { font-size: 1.2rem; }
    .orma-info { flex-direction: column; gap: 0.5rem; }
  }
  
  </style>