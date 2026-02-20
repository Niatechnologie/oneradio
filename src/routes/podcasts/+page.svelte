<script>
  import { onMount } from 'svelte';
  import Pagination from "../pagination.svelte";

  let data = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let currentPage = $state(1);
  let itemsPerPage = $state(6);
  let totalItems = $state(0);
  let podcasts = $state([]);

  async function loadData(page = currentPage, limit = itemsPerPage) {
    isLoading = true;
    error = null;
    
    try {
      const [paginatedResponse, allNewsResponse] = await Promise.all([
        fetch(`https://adminradio.oneradio.ci/radio_one/podcasts.php?page=${page}&limit=${limit}`),
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

      podcasts = paginatedData.podcasts || [];
      totalItems = Array.isArray(allNewsData.podcasts) ? allNewsData.podcasts.length : 0;

    } catch (e) {
      error = e;
      console.error('Erreur lors du chargement:', e);
    } finally {
      isLoading = false;
    }
  }

  async function handlePageChange(event) {
    currentPage = event.detail.page;
    if (event.detail.itemsPerPage) {
      itemsPerPage = event.detail.itemsPerPage;
    }
    await loadData(currentPage, itemsPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    loadData();
  });
</script>

<svelte:head>
  <title>OneRadio - Podcasts</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<main style="margin:0" class="main-content">
  <div class="container">
    <header>
      <h1>Nos Podcasts</h1>
      <p>Ecoutez nos meilleurs podcasts</p>
    </header>

    {#if isLoading}
      <div class="loading">
        <p>Chargement en cours...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>Une erreur est survenue : {error.message}</p>
        <button onclick={() => loadData()}>Réessayer</button>
      </div>
    {:else}
      <div class="podcasts-grid" id="podcastsContainer">
        {#each podcasts as podcast}
          <div class="podcast-card" data-id={podcast.id}>
            <div class="podcast-image-container">
              <a href="/podcasts/{podcast.idscat}">
                <img 
                  src="https://adminradio.oneradio.ci/podcasts/img/{podcast.photo}" 
                  alt={podcast.categorie} 
                  class="podcast-image"
                >
              </a>
            </div>
            <div class="podcast-content">
              <h3 class="podcast-title">{podcast.categorie}</h3>
              <div class="podcast-meta">
                <span class="duration">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {podcast.date_emission}
                </span>
                <span class="category">{podcast.titre}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <Pagination 
        {currentPage}
        {totalItems}
        {itemsPerPage}
        maxVisiblePages={5}
        showInfo={false}
        showFirstLast={true}
        onpageChange={handlePageChange}
      />
    {/if}
  </div>
</main>

<style>
  .main-content {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #ff2b2b 100%);
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

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: rgb(0, 0, 0);
  }

  header p {
    color: #ff0000;
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
  }

  .podcast-card:hover {
    transform: scale(1.03);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .podcast-image-container {
    position: relative;
    height: 250px;
  }

  .podcast-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .podcast-content {
    padding: 1.5rem;
  }

  .podcast-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: white;
  }

  .podcast-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #fed7aa;
  }

  .duration {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .category {
    background: rgba(234, 88, 12, 0.3);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid rgba(234, 88, 12, 0.5);
  }

  .loading, .error {
    text-align: center;
    padding: 3rem;
    color: white;
  }

  .error button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: white;
    color: #ff2b2b;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
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