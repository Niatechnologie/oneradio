<!-- Pagination.svelte -->
<script>
  let { 
    currentPage = 1, 
    totalItems = 0, 
    itemsPerPage = 6, 
    maxVisiblePages = 5, 
    showInfo = true, 
    showFirstLast = true,
    onpageChange = () => {}
  } = $props();
  
  let totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
  let startItem = $derived((currentPage - 1) * itemsPerPage + 1);
  let endItem = $derived(Math.min(currentPage * itemsPerPage, totalItems));
  
  let visiblePages = $derived((() => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })());
  
  function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onpageChange({ detail: { page, itemsPerPage } });
    }
  }
  
  const previousPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);
</script>

{#if totalItems > 0}
  <div class="pagination">
    {#if showInfo}
      <div class="pagination-info">
        Affichage {startItem} à {endItem} sur {totalItems} éléments
      </div>
    {/if}
    
    {#if totalPages > 1}
      <div class="pagination-nav">
        {#if showFirstLast && currentPage > 1}
          <button 
            class="pagination-btn" 
            onclick={firstPage}
            title="Première page"
          >
            <i class="bi bi-chevron-double-left"></i>
          </button>
        {/if}
        
        <button 
          class="pagination-btn" 
          onclick={previousPage}
          disabled={currentPage === 1}
          title="Page précédente"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        {#each visiblePages as page}
          <button 
            class="pagination-btn {page === currentPage ? 'active' : ''}"
            onclick={() => goToPage(page)}
          >
            {page}
          </button>
        {/each}
        
        <button 
          class="pagination-btn" 
          onclick={nextPage}
          disabled={currentPage === totalPages}
          title="Page suivante"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
        
        {#if showFirstLast && currentPage < totalPages}
          <button 
            class="pagination-btn" 
            onclick={lastPage}
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
    background: rgba(0, 0, 0, 0.9);
    color: white;
    border-color: rgba(0, 0, 0, 0.9);
  }
  
  .pagination-btn.active:hover {
    background: rgba(255, 0, 0, 0.9);
    border-color: rgba(255, 0, 0, 0.9);
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