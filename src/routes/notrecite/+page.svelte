<script >
    export const prerender = true;
    import { onMount } from 'svelte';
   
    let data = $state([]);
    let isLoading = $state(true);
    let error = $state(null);
    

    onMount(async()=>{

        try {
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/mensuel.php');

            if (!response.ok) throw new Error('Erreur réseau');
            data = await response.json();
            } catch (e) {
            error = e;
            } finally {
            isLoading = false;
            }
        
    })
</script>
<svelte:head>
  <title>Radio Treichville - Magazine</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<main style="background: #fff;">
    <section style="padding-top: 30px;" class="news-section">
        <h2 class="section-title">Bienvenue dans votre bulletin municipal mensuel !</h2>
        <p style="font-size:18px !important;">
        <strong>Chers habitants de Treichville,</strong><br>
        Ce bulletin mensuel est votre fenêtre sur la vie de notre commune. Vous y découvrirez l'actualité de nos quartiers, les projets en cours de réalisation, les services municipaux à votre disposition, ainsi que les événements culturels et sociaux qui rythment notre commune.
        De l'amélioration de nos infrastructures aux initiatives citoyennes, en passant par les célébrations de notre riche patrimoine, ce mensuel reflète le dynamisme et l'engagement de notre municipalité au service de tous les Treichvillois. <br>
        Bonne lecture !</p> <br>
        <div class="news-container">
    
            {#if isLoading}
            <p>Chargement en cours...</p>
            {:else if error}
            <p>Erreur: {error.message}</p>
            {:else}
        
                {#each data as item}
                  
                <article class="news-card">
                    <div class="news-image">
                        <a target="_blank" href="https://admin.radiotreichville.ci/magazines/{item.lien}" class="read-more">
                        <img src="https://admin.radiotreichville.ci/magazines/{item.photo}" alt="Article 1">
                        </a>
                        <span class="news-category">{item.designation}</span>
                    </div>
                 
                </article>
           
                {/each}
          
            {/if}
    
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
            font-size: 1.9rem;
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
        
        .news-container {
            display: grid;
            grid-template-columns: repeat(4, minmax(200px, 1fr));
            gap: 2rem;
            padding: 0 1rem;
            display: grid;

        }
        
        .news-card {
            background: white;
            border-radius:2px;
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
            height: auto;
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
            background: #009830e6;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
       
        .news-content {
            padding: 1.5rem;
        }
     
        .read-more {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #009830e6;
            text-decoration: none;
            font-weight: 500;
            transition: gap 0.3s ease;
        }
        
        .read-more:hover {
            gap: 0.8rem;
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