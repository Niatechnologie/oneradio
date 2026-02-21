<script>
    import { onMount } from 'svelte';
    
    import pub1 from "$lib/img/pubspa.jpg";
    import Pagination from "../pagination.svelte";
  
// Variables d'état réactives
  let data = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let currentPage = $state(1);
  let itemsPerPage = $state(6);
  let totalItems = $state(0);
  let podcasts = $state([]);

  // Fonction pour charger les données
  async function loadData() {
    isLoading = true;
    error = null;
    
    try {
      // Récupération parallèle des données
      const [paginatedResponse, allNewsResponse] = await Promise.all([
        fetch(`https://adminradio.oneradio.ci/radio_one/podcasts.php?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`https://adminradio.oneradio.ci/radio_one/allpodcasts.php`)
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
      podcasts = paginatedData.podcasts || [];
      totalItems = Array.isArray(allNewsData.podcasts) ? allNewsData.podcasts.length : 0;

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
  <title>Radio Treichville - Podcasts</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<main style="margin:0" class="main-content">
    <div class="container">
        <header>
            <div class="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="music-icon"><path d="M8 18V6l11-2v12"></path><path d="M8 9L19 7"></path><circle cx="4" cy="18" r="4"></circle><circle cx="15" cy="16" r="4"></circle></svg>
            </div>
            <h1>Nos Podcasts Tendances</h1>
            <p>Découvrez nos  meilleurs podcasts</p>
        </header>

        
            <div class="podcasts-grid" id="podcastsContainer">
                {#each podcasts as podcast}
                    <div class="podcast-card" data-id={podcast.id}>
                        <a href="/podcasts/{podcast.idscat}" class="podcast-link">
                            <div class="podcast-image-container">
                                <img src="https://adminradio.oneradio.ci/souscategories/{podcast.photo}" alt={podcast.categorie} class="podcast-image">
                                <div class="podcast-overlay">
                                    <h3 class="podcast-title">{podcast.categorie}</h3>
                                </div>
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
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

.main-content {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #007e33 0%, #f97316 100%);
    color: white;
    line-height: 1.6;
    margin-bottom: 0 !important;
}

    .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    
}

header {
    text-align: center;
    margin-bottom: 3rem;
}

.logo {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.music-icon {
    /* color: #fed7aa; */
    width: 48px;
    height: 48px;
}

h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: rgb(255, 255, 255);
}

header p {
    color: #fed7aa;
    font-size: 1.1rem;
}

.podcasts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.podcast-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    height: 350px;
}

.podcast-card:hover {
    transform: scale(1.03);
    border-color: rgba(255, 255, 255, 0.2);
}

.podcast-image-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.podcast-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.podcast-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
    height: 100%;
}

.podcast-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
    padding: 3rem 1.5rem 1.5rem;
    z-index: 2;
}

.podcast-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #ffffff !important;
    margin: 0;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
        margin-bottom: 0;
    }
    
    .podcasts-grid {
        grid-template-columns: 1fr;
    }
    
    h1 {
        font-size: 2rem;
    }
}

</style>