<script>
import Footer from "../footer.svelte";
import {onMount} from 'svelte';
import Pagination from "../pagination.svelte";
import loader from '$lib/img/loader.gif'
  
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
        fetch(`https://adminradio.oneradio.ci/radio_one/news.php?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`https://adminradio.oneradio.ci/radio_one/allnews.php`)
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
  <title>Radio Treichville - News</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<main style="background: #fff;">
<section class="news-section"  style="padding-top:10px;">

    <h2 class="section-title">Dernières Actualités</h2>
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
        
    
     <!-- Sélecteur nombre d'éléments par page -->
   
        {#if isLoading}
        <p class="chargement-news"><img src="{loader}" alt="" srcset=""></p>
        {:else if error}
        <p class="chargement-news error2">Erreur: {error.message}</p>
        {:else}
         <div class="news-container">
            {#each items as item}
              <article class="news-card">
                <div class="news-image"> <a href="/news/{item.slug}" class="read-more">
                    <img src="https://admin.radiotreichville.ci/cropavatar/img/{item.photo}" alt="Article 1">
                    <span class="news-category">{item.categorie}</span>
                    </a>
                </div>
                <div class="news-content">
                    <a href="/news/{item.slug}" class="read-more">
                      <h3>{item.titre}</h3>  </a>
                      <p class="news-excerpt">{item.description.substring(0, 180)} ...</p>
                  
                    <div class="news-meta">
                        <span><i class="bi bi-calendar3"></i><strong>Publié le {item.datepub}</strong></span>
                        <span><i class="bi bi-person-circle"></i> {item.auteur}</span>
                    </div>
                    <a href="/news/{item.slug}" class="read-more">Lire la suite <i class="bi bi-arrow-right"></i></a>
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
</section>

</main>


<style>
main {
    flex: 1;
    padding: 2rem 1rem 4rem 1rem;
}

/* Styles de la section news */
.news-section {
    max-width: 1200px;
    margin: 0 auto;
   
}

 .chargement-news{
    min-height: 400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    font-size: 1.2rem;
    justify-content: center;
    align-items: center;
}
.error2{
  color:red !important
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

.news-container {
display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes égales */
  gap: 2rem;
  padding: 0 1rem;
}

.news-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.news-image {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.news-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.news-card:hover .news-image img {
    transform: scale(1.05);
}

.news-category {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #ff0000;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.news-content {
    padding: 1.5rem;
}

.news-content h3 {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 1rem;
    line-height: 1.4;
}

.news-excerpt {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
}

.news-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
    color: #888;
}

.news-meta span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.news-meta i {
    font-size: 1rem;
    color: #ff0000;
}

.read-more {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #ff0000;
    text-decoration: none;
    font-weight: 500;
    transition: gap 0.3s ease;
}

.read-more:hover {
    gap: 0.8rem;
}


a {
    color: #e0e0e0;
    text-decoration: none;
    transition: color 0.3s ease;
    display: inline-flex;
    align-items: center;
}

a:hover {
    color: white;
}

/* Media Queries pour la responsivité */
@media (max-width: 768px) {
    .section-title {
        font-size: 2rem;
    }

    .news-container {
        grid-template-columns: 1fr;
    }

}

 
</style>