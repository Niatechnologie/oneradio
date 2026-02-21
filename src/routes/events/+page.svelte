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
        fetch(`https://adminradio.oneradio.ci/radio_treich/events.php?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`https://adminradio.oneradio.ci/radio_treich/allevents.php`)
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
      <div class="news-section"  style="padding-top: 30px;">
          <h2 class="section-title">Derniers Events</h2>
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
      background: linear-gradient(to right, #009830e6, #67b8ff);
      border-radius: 2px;
  }
  
  </style>