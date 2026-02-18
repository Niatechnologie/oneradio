<!-- Pagination.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let currentPage = 1;
  export let totalItems = 0;
  export let itemsPerPage = 6;
  export let maxVisiblePages = 5;
  export let showInfo = true;
  export let showFirstLast = true;
  
  const dispatch = createEventDispatcher();
  
  // Calculs
  $: totalPages = Math.ceil(totalItems / itemsPerPage);
  $: startItem = (currentPage - 1) * itemsPerPage + 1;
  $: endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Debug - à supprimer après test
  $: console.log('Pagination debug:', { 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    totalPages,
    startItem,
    endItem
  });
  
  // Calcul des pages visibles
  $: visiblePages = (() => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Ajuster le début si on est près de la fin
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();
  
  // Fonctions de navigation
  function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch('pageChange', { page, itemsPerPage });
    }
  }
  
  function previousPage() {
    goToPage(currentPage - 1);
  }
  
  function nextPage() {
    goToPage(currentPage + 1);
  }
  
  function firstPage() {
    goToPage(1);
  }
  
  function lastPage() {
    goToPage(totalPages);
  }
</script>

<!-- Affichage conditionnel modifié -->
{#if totalItems > 0}
  <div class="pagination">
    <!-- Informations -->
    {#if showInfo}
      <div class="pagination-info">
        Affichage {startItem} à {endItem} sur {totalItems} éléments
      </div>
    {/if}
    
    <!-- Navigation - seulement si plus d'une page -->
    {#if totalPages > 1}
      <div class="pagination-nav">
        <!-- Première page -->
        {#if showFirstLast && currentPage > 1}
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button 
            class="pagination-btn" 
            on:click={firstPage}
            title="Première page"
          >
            <i class="bi bi-chevron-double-left"></i>
          </button>
        {/if}
        
        <!-- Page précédente -->
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button 
          class="pagination-btn" 
          on:click={previousPage}
          disabled={currentPage === 1}
          title="Page précédente"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <!-- Pages visibles -->
        {#each visiblePages as page}
          <button 
            class="pagination-btn {page === currentPage ? 'active' : ''}"
            on:click={() => goToPage(page)}
          >
            {page}
          </button>
        {/each}
        
        <!-- Page suivante -->
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button 
          class="pagination-btn" 
          on:click={nextPage}
          disabled={currentPage === totalPages}
          title="Page suivante"
        >
         <i class="bi bi-chevron-right"></i>
        </button>
        
        <!-- Dernière page -->
        {#if showFirstLast && currentPage < totalPages}
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button 
            class="pagination-btn" 
            on:click={lastPage}
            title="Dernière page"
          >
            <i class="bi bi-chevron-double-right"></i>
           
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .pagination {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .pagination-info {
    color: #666;
    font-size: 0.9rem;
  }
  
  .pagination-nav {
    display: flex;
    gap: 0.25rem;
  }
  
  .pagination-btn {
    padding: 0.8rem 1.0rem;
    border: 1px solid #ddd;
    background: white;
    color: rgba(0, 115, 36, 0.902);
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    min-width: 2.5rem;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #bbb;
  }
  
  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-btn.active {
    background: rgba(0, 152, 48, 0.902);
    color: white;
    border-color: rgba(0, 152, 48, 0.902);
  }
  
  .pagination-btn.active:hover {
    background: rgba(0, 115, 36, 0.902);
    border-color:  rgba(0, 115, 36, 0.902);
  }
  
  @media (max-width: 768px) {
    .pagination {
      font-size: 0.8rem;
    }
    
    .pagination-btn {
      padding: 0.4rem 0.6rem;
      min-width: 2rem;
    }
    
    .pagination-info {
      font-size: 0.8rem;
      text-align: center;
    }
  }
</style>