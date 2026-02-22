<script>
  import { page } from '$app/stores';

  // Labels lisibles pour chaque segment de route
  const routeLabels = {
    'news': 'Actualités',
    'events': 'Événements',
    'awards': 'One Radio music award',
    'podcasts': 'Podcasts',
    'contact': 'Contact',
    'programme': 'Programme',
    'webradio': 'Webradios',
    'parieur': 'Super Parieur'
  };

  /**
   * @param {string} segment
   * @returns {string}
   */
  function getLabel(segment) {
    return routeLabels[segment] || decodeURIComponent(segment);
  }

  // Construire les breadcrumbs à partir de l'URL
  let breadcrumbs = $derived.by(() => {
    const pathname = $page.url.pathname;
    if (pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      // Si c'est un paramètre dynamique (ex: un ID), on affiche "Détails"
      const isDynamic = !routeLabels[segment] && index > 0;
      const label = isDynamic ? 'Détails' : getLabel(segment);
      return { label, path, isLast };
    });
  });

  let isVisible = $derived($page.url.pathname !== '/');
</script>

{#if isVisible && breadcrumbs.length > 0}
  <nav class="breadcrumb" aria-label="Fil d'Ariane">
    <div class="breadcrumb-container">
      <a href="/" class="breadcrumb-link">
        <i class="bi bi-house-door-fill"></i>
        <span>Accueil</span>
      </a>
      {#each breadcrumbs as crumb}
        <span class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></span>
        {#if crumb.isLast}
          <span class="breadcrumb-current">{crumb.label}</span>
        {:else}
          <a href={crumb.path} class="breadcrumb-link">{crumb.label}</a>
        {/if}
      {/each}
    </div>
  </nav>
{/if}

<style>
  .breadcrumb {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 0.75rem 1.5rem;
    border-bottom: 2px solid #ff1919;
    font-family: 'Roboto', sans-serif;
    margin-top: 108px;
  }

  .breadcrumb-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .breadcrumb-link {
    color: #ccc;
    text-decoration: none;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.3s ease;
  }

  .breadcrumb-link:hover {
    color: #ff1919;
  }

  .breadcrumb-link i {
    font-size: 0.95rem;
  }

  .breadcrumb-separator {
    color: #666;
    font-size: 0.7rem;
    display: inline-flex;
    align-items: center;
  }

  .breadcrumb-current {
    color: #ff1919;
    font-size: 0.85rem;
    font-weight: 600;
  }

  @media (max-width: 868px) {
    .breadcrumb {
      padding: 0.5rem 0.8rem;
      margin-top:0;
    }

    .breadcrumb-container {
      gap: 0.3rem;
    }

    .breadcrumb-link {
      font-size: 0.75rem;
      gap: 0.2rem;
    }

    .breadcrumb-link i {
      font-size: 0.85rem;
    }

    .breadcrumb-separator {
      font-size: 0.6rem;
    }

    .breadcrumb-current {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .breadcrumb {
      padding: 0.4rem 0.6rem;
    }

    .breadcrumb-link span {
      display: none;
    }

    .breadcrumb-link i {
      font-size: 0.9rem;
    }

    .breadcrumb-current {
      font-size: 0.7rem;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
