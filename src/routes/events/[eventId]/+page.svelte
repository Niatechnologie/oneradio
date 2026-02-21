<script >
    let { data } = $props();
    export const prerender = true;

    import {onMount} from 'svelte';

    
    const success=data.status;
    let events=data.detailevents;

    let isLoading = true;
    let error = null;

</script>
<svelte:head>
  <title>Radio Treichville - Events</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

 <main style="background: #fff;">
      <section class="news-section"  style="padding-top: 10px;">
          <h2 class="section-title">{events[0].titre}</h2>
      
        <div class="news-container">
<!--     
            {#if isLoading}
            <p>Chargement en cours...</p>
            {:else if error}
            <p>Erreur: {error.message}</p>
            {:else}
         -->
            <article class="news-card">
                <div class="news-image">
                    <!-- svelte-ignore a11y_img_redundant_alt -->
                    <img src="https://adminradio.oneradio.ci/cropavatar/img/{events[0].photo}" alt="Photo Article">
                    <span class="news-category">{@html events[0].categorie}</span>
                </div>
                <div class="news-content">
                    <h2>{events[0].titre}</h2>
                    <div class="news-excerpt">{@html events[0].description}</div>
                    
                    <div class="news-meta">
                        <span><i class="bi bi-calendar3"></i>Publié le {@html events[0].datepub}</span>
                        <span><i class="bi bi-person-circle"></i> {events[0].auteur}</span>
                    </div>
                    <!-- <a href="/news/{data.id}" class="read-more">Lire la suite <i class="bi bi-arrow-right"></i></a> -->
                </div>
            </article>
          
            <!-- {/if} -->
    
        </div>
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
        background: linear-gradient(to right, #ff0000, #000000);
        border-radius: 2px;
    }
    
    .news-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
        height: 800px;
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
    
    .news-content h2 {
        font-size: 2.2rem;
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
    
    /* Styles du footer */
    footer {
        background-color: #1a1a1a;
        color: #e0e0e0;
        padding: 3rem 1rem;
    }
    
    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        padding: 0 1rem;
    }
    
    .footer-section h3 {
        color: white;
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        position: relative;
    }
    
    .footer-section h3::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -0.5rem;
        width: 50px;
        height: 2px;
        background-color: #ff0000;
    }
    
    .contact-info p {
        margin: 0.8rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .contact-info i {
        font-size: 1.2rem;
        color: #ff0000;
    }
    
    ul {
        list-style: none;
    }
    
    ul li {
        margin: 0.8rem 0;
    }
    
    ul li i {
        margin-right: 0.5rem;
        color: #ff0000;
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
    
    .social-links {
        display: flex;
        gap: 1rem;
    }
    
    .social-link {
        padding: 0.8rem;
        border: 1px solid #ff0000;
        border-radius: 50%;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .social-link i {
        font-size: 1.2rem;
    }
    
    .social-link:hover {
        background-color: #ff0000;
        color: white;
    }
    
    .footer-bottom {
        margin-top: 2rem;
        padding-top: 2rem;
        text-align: center;
        border-top: 1px solid #333;
    }
    
    .footer-bottom p {
        font-size: 0.9rem;
        color: #888;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .text-red {
        color: #ff4444;
    }
    
    /* Media Queries pour la responsivité */
    @media (max-width: 768px) {
        .section-title {
            font-size: 2rem;
        }
    
        .news-container {
            grid-template-columns: 1fr;
        }
    
        .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
        }
    
        .footer-section h3::after {
            left: 50%;
            transform: translateX(-50%);
        }
    
        .social-links {
            justify-content: center;
        }
    
        .contact-info p {
            justify-content: center;
        }
    }
    </style>