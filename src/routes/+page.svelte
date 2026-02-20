
<script>
  import { onMount } from 'svelte';
  
  import pub1 from "$lib/img/pubspa.jpg";
  // import pubradio from "$lib/img/pub-radio.gif";
  import  "$lib/style_news.css";
  import  "$lib/style_events.css";
  

  // Données des artistes
  let artists = $state([]);
  let isLoading_artists = $state(true);
  let error_artists = $state(null);

  async function fetchArtists() {
    try {
      isLoading_artists = true;
      error_artists = null;
      const response = await fetch('https://adminradio.oneradio.ci/radio_one/artistes.php');
      if (!response.ok) throw new Error('Erreur de chargement des artistes');
      const data = await response.json();
      artists = data.map(item => ({
        id: item.id,
        image: 'https://adminradio.oneradio.ci/artistes/' + item.image,
      }));
    } catch (e) {
      error_artists = e.message || 'Erreur de chargement des artistes';
    } finally {
      isLoading_artists = false;
    }
  }

  onMount(() => {
    fetchArtists();
  });

  // État initial
  let carouselPosition = 0;
  let isDragging = false;
  let startX, scrollLeft;

  // Référence au carrousel
  let carouselRef = $state();

  // Dupliquez les artistes pour créer un effet infini
  let duplicatedArtists = $derived([...artists, ...artists]);

  // Déplacer vers la diapositive suivante
  function moveToNextSlide() {
    if (isDragging || !carouselRef) return;

    const itemWidth = carouselRef.querySelector(".carousel-item")?.offsetWidth || 0;
    if (!itemWidth) return;

    carouselPosition -= itemWidth;
    carouselRef.style.transition = 'transform 0.5s ease';
    carouselRef.style.transform = `translateX(${carouselPosition}px)`;

    const numItems = artists.length;
    if (carouselPosition <= -itemWidth * numItems) {
      setTimeout(() => {
        if (!carouselRef) return;
        carouselRef.style.transition = 'none';
        carouselPosition += itemWidth * numItems;
        carouselRef.style.transform = `translateX(${carouselPosition}px)`;
        void carouselRef.offsetHeight; // force reflow
        carouselRef.style.transition = 'transform 0.5s ease';
      }, 550);
    }
  }

  // Déplacer vers la diapositive précédente
  function moveToPrevSlide() {
    if (isDragging || !carouselRef) return;

    const itemWidth = carouselRef.querySelector(".carousel-item")?.offsetWidth || 0;
    if (!itemWidth) return;

    // Si on est au début, sauter d'abord à la position des clones (invisible)
    if (carouselPosition >= 0) {
      carouselRef.style.transition = 'none';
      carouselPosition = -itemWidth * artists.length;
      carouselRef.style.transform = `translateX(${carouselPosition}px)`;
      void carouselRef.offsetHeight; // force reflow
    }

    carouselPosition += itemWidth;
    carouselRef.style.transition = 'transform 0.5s ease';
    carouselRef.style.transform = `translateX(${carouselPosition}px)`;
  }

  // Drag and drop
  function setupDragEvents(e) {
    isDragging = true;
    startX = e.clientX || e.touches?.[0]?.clientX || 0;
    scrollLeft = carouselPosition;
    if (carouselRef) carouselRef.style.transition = 'none';
  }

  function handleMouseMove(e) {
    if (!isDragging || !carouselRef) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const walk = clientX - startX;
    carouselPosition = scrollLeft + walk;
    carouselRef.style.transform = `translateX(${carouselPosition}px)`;
  }

  function handleMouseUp() {
    if (!isDragging || !carouselRef) return;
    isDragging = false;

    // Snap to the nearest item
    const itemWidth = carouselRef.querySelector(".carousel-item")?.offsetWidth || 1;
    carouselPosition = Math.round(carouselPosition / itemWidth) * itemWidth;

    // Clamp within valid range
    const numItems = artists.length;
    if (carouselPosition > 0) carouselPosition = 0;
    if (carouselPosition < -itemWidth * numItems) carouselPosition = -itemWidth * numItems;

    carouselRef.style.transition = 'transform 0.3s ease';
    carouselRef.style.transform = `translateX(${carouselPosition}px)`;
  }

  // Lightbox
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  function openLightbox(index) {
    // Map back to original artist index (since duplicatedArtists repeats)
    lightboxIndex = index % artists.length;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function lightboxPrev() {
    lightboxIndex = (lightboxIndex - 1 + artists.length) % artists.length;
  }

  function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % artists.length;
  }

  function handleLightboxKeydown(e) {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  }

  // Autoplay
  let autoplayInterval;
  function startAutoplaySel() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(moveToNextSlide, 3000);
  }



  //code du carroussel principal;
  // État du slider


  let activeIndex = $state(0);
  let isPlaying = true;

    // Données des slides
    let slides = $state([])


 // State for gallery items
   let sliderItems = [];
    let isLoadingslide = true;
    let errorslide = null;
  
    onMount(() => {
        // Fetch gallery items
        fetchSlide();

    });

    async function fetchSlide() {
        try {
          isLoadingslide = true;
            errorslide = null;

            // Utiliser l'API JSONPlaceholder pour simuler un fetch de données
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/sliders.php');
            
            if (!response.ok) {
                throw new Error('Erreur de chargement des données');
            }

            const data = await response.json();

            // Transformer les données de l'API en notre format
            slides = data.map((item, index) => ({
                url: "https://adminradio.oneradio.ci/pub/"+item.images, 
                lien: item.lien,
                title: item.titre,
                description: item.description
            }));

            isLoadingslide = false;

    
        } catch (err) {
            error = err.message || 'Erreur de chargement des images';
            isLoadingslide = false;
        }
    }






    // Fonction pour définir la slide active
    function setActiveSlide(index) {
        activeIndex = index;
    }

    // Fonction pour démarrer le défilement automatique
    let interval;
    function startAutoplay() {
        if (isPlaying) {
            interval = setInterval(() => {
                activeIndex = (activeIndex + 1) % slides.length;
            }, 3000);
        }
    }

    // Arrêter le défilement automatique au survol
    function pauseAutoplay() {
        isPlaying = false;
        clearInterval(interval);
    }

    function resumeAutoplay() {
        isPlaying = true;
        startAutoplay();
    }

    // Initialiser le défilement automatique
    startAutoplay();

    // Ajuster dynamiquement la hauteur du slider
    let sliderHeight = $state("600px");
    function adjustSliderHeight() {
        const windowWidth = window.innerWidth;

        if (windowWidth < 480) {
            sliderHeight = "300px";
        } else if (windowWidth < 768) {
            sliderHeight = "400px";
        } else {
            sliderHeight = "600px";
        }
    }

   
      // Démarrer l'autoplay après le montage
    onMount(() => {
      startAutoplaySel();
      // Appeler la fonction au chargement et au redimensionnement
      adjustSliderHeight();
      window.addEventListener("resize", adjustSliderHeight);
    });


   
    let datanews = $state([]);
    let isLoading_news = $state(true);
    let error_news = $state(null);
    
    onMount(async()=>{

        try {
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/news3.php');

            if (!response.ok) throw new Error('Erreur réseau');
            datanews = await response.json();
            } catch (e) {
              error_news = e;
            } finally {
            isLoading_news = false;
            }
     
    })

    let dataevents = $state([]);
    let isLoading_events = true;
    let error_events = null;
    
    onMount(async()=>{

        try {
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/events3.php');

            if (!response.ok) throw new Error('Erreur réseau');
            dataevents = await response.json();
            } catch (e) {
              error_events = e;
            } finally {
            isLoading_events = false;
            }
     
    })

    // State for gallery items
    let galleryItems = $state([]);
    let isLoading = true;
    let error = null;
    let owlCarouselLoaded = false;
    let carouselElement = $state();

    onMount(() => {
        // Fetch gallery items
        fetchGalleryItems();

        // Dynamically load Owl Carousel dependencies
        const owlCarouselCSS = document.createElement('link');
        owlCarouselCSS.rel = 'stylesheet';
        owlCarouselCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css';
        document.head.appendChild(owlCarouselCSS);

        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        jqueryScript.onload = () => {
            const owlScript = document.createElement('script');
            owlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js';
            owlScript.onload = () => {
                owlCarouselLoaded = true;
                // Tenter d'initialiser le carousel maintenant que owl est chargé
                setTimeout(initCarousel, 100);
            };
            document.head.appendChild(owlScript);
        };
        document.head.appendChild(jqueryScript);

        return () => {
            // Cleanup 
            if (jqueryScript.parentNode) document.head.removeChild(jqueryScript);
            if (owlCarouselCSS.parentNode) document.head.removeChild(owlCarouselCSS);
        };
    });

    async function fetchGalleryItems() {
        try {
            isLoading = true;
            error = null;

            // Utiliser l'API JSONPlaceholder pour simuler un fetch de données
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/animateurs.php');
            
            if (!response.ok) {
                throw new Error('Erreur de chargement des données');
            }

            const data = await response.json();

            // Transformer les données de l'API en notre format
            galleryItems = data.map((item, index) => ({
                src: "https://adminradio.oneradio.ci/animateurs/"+item.photo, 
                alt: item.nom,
                title: item.nom,
                fonction: item.fonction
            }));

            isLoading = false;

            // Initialiser le carousel après un court délai
            setTimeout(initCarousel, 100);

        } catch (err) {
            error = err.message || 'Erreur de chargement des images';
            isLoading = false;
        }
    }


    function initCarousel() {
        if (owlCarouselLoaded && window.jQuery && carouselElement && galleryItems.length > 0) {
            // Détruire l'instance existante si elle existe
            if (window.jQuery(carouselElement).data('owl.carousel')) {
                window.jQuery(carouselElement).owlCarousel('destroy');
            }

            window.jQuery(carouselElement).owlCarousel({
                loop: true,
                margin: 20,
                nav: true,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    1000: { items: 3 }
                }
            });
        }
    }


</script>

<svelte:window onkeydown={handleLightboxKeydown} />

<svelte:head>
  <title>One radio - Bienvenue</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<style>
 
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .carousel-container {
    position: relative;
    overflow: hidden;
  }

  .carousel {
    display: flex;
    cursor: grab;
    user-select: none;
  }

  .carousel-item {
    flex: 0 0 33.33%;
    min-width: 33.33%;
    padding: 0 10px;
    box-sizing: border-box;
  }
.section-badge{
    color:#fff;
    border-radius: 25px;
    background: #ff0000;
    padding: 7px 10px;
    font-size: 12px;

}
  
  .artist-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .artist-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .artist-card:hover .zoom-btn {
    opacity: 1;
  }

  .artist-image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .zoom-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.55);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 5;
  }

  .zoom-btn:hover {
    background: rgba(255, 0, 0, 0.8);
  }

  /* Lightbox */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-img {
    max-width: 85vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
    user-select: none;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: -10px;
    background: none;
    border: none;
    color: #fff;
    font-size: 36px;
    cursor: pointer;
    line-height: 1;
    z-index: 10001;
    transition: color 0.2s;
  }

  .lightbox-close:hover {
    color: #ff0000;
  }

  .lightbox-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 10001;
  }

  .lightbox-arrow:hover {
    background: rgba(255, 0, 0, 0.7);
  }

  .lightbox-arrow-left {
    left: -60px;
  }

  .lightbox-arrow-right {
    right: -60px;
  }

  .lightbox-counter {
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 14px;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .lightbox-arrow-left {
      left: 5px;
    }
    .lightbox-arrow-right {
      right: 5px;
    }
    .lightbox-close {
      top: -35px;
      right: 0;
    }
  }

  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 46px;
    height: 46px;
    background-color: #fff;
    border-radius: 50%;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  .cover-artiste{
    background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.6));
    position: absolute;
    top: -51px;
    height: 46px;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .carousel-button:hover {
    background-color: #f5f5f7;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .carousel-prev {
    left: 10px;
  }

  .carousel-next {
    right: 10px;
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    .carousel-item {
      flex: 0 0 50%;
      min-width: 50%;
    }
  }

  @media (max-width: 768px) {
    .carousel-item {
      flex: 0 0 100%;
      min-width: 100%;
    }
  }

  /* Slider du corrousel principal*/
  .slider {
        width: 100%;
        height: var(--slider-height, 600px);
        display: flex;
        gap: 0rem;
      
        position: relative;
    }

    .slide {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: flex 0.5s ease-in-out;
    }

    .slide-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        transition: transform 0.5s;
    }

    .slide-overlay {
        position: absolute;
        inset: 0;
        transition: opacity 0.5s;
    }

    .slide.active {
        flex: 0 0 80%;
    }

    .slide:not(.active) {
        flex: 0 0 5%;
    }

    .slide.active .slide-overlay {
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2), transparent);
    }

    .slide:not(.active) .slide-overlay {
        background: rgba(0, 0, 0, 0.4);
    }

    .slide:not(.active):hover .slide-overlay {
        background: rgba(0, 0, 0, 0.6);
    }

    .slide-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1.5rem;
        color: white;
        opacity: 0;
        transform: translateY(1rem);
        transition: all 0.5s;
    }

    .slide.active .slide-content {
        opacity: 1;
        transform: translateY(0);
        margin-bottom: 5rem;
    }

    .slide-title {
        font-size: 2.875rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .slide-description {
        font-size: 1.125rem;
        opacity: 0.9;
    }

    .inactive-title {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        color: white;
        font-weight: bold;
        font-size: 1.5rem;
        opacity: 0;
        transition: opacity 0.5s;
    }

    .slide:not(.active) .inactive-title {
        opacity: 1;
    }

    .vertical-text {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(-180deg) translateY(-100%);
        white-space: nowrap;
    }

    /* Styles pour les écrans plus petits */
    @media (max-width: 768px) {
        .slider {
            --slider-height: 400px;
        }

        .slide.active {
            flex: 0 0 90%;
        }

        .slide:not(.active) {
            flex: 0 0 3%;
        }

        .slide-title {
            font-size: 1.5rem;
        }

        .slide-description {
            font-size: 1rem;
        }

        .inactive-title {
            font-size: 1.2rem;
        }
    }

    @media (max-width: 480px) {
        .slider {
            --slider-height: 300px;
        }

        .slide.active {
            flex: 0 0 100%;
        }

        .slide:not(.active) {
            display: none;
        }

        .slide-content {
            padding: 1rem;
        }

        .slide-title {
            font-size: 1.2rem;
        }

        .slide-description {
            font-size: 0.9rem;
        }

        .inactive-title {
            display: none;
        }
    }

    /* Points indicateurs */
    .indicators {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.5rem;
    }

    .indicator {
        width: 10px;
        height: 10px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .indicator.active {
        background-color: white;
    }
    .zone_animateur{
     background: #00090d;
     background: linear-gradient(107deg, rgba(0, 9, 13, 1) 33%, rgba(255, 0, 0, 1) 43%, rgba(235, 113, 113, 1) 46%, rgba(255, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 62%);
    }
    /* owl carrousel */
    .container-owl {
        font-family: Arial, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        position: relative;
        /* background: #000000; */
    }

    .container-owl h1 {
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 2rem;
        color: #ffffff;
    }

    .gallery-item {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .gallery-item img {
        width: 100%;
        height: 350px; /* Increased height to fill the frame */
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .gallery-item:hover img {
        transform: scale(1.05);
    }

    .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        overflow: hidden;
        width: 100%;
        height: 0;
        transition: 0.5s ease;
    }

    .gallery-item:hover .image-overlay {
        height: 100%;
    }

    .gallery-item h3 {
        color: white;
        font-size: 1.5rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
.gallery-item h2 {
        color: #ff7f2a;
        font-size: 1.5rem;
        position: absolute;
        top: 51%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .gallery-item:hover h3, .gallery-item:hover h2 {
        opacity: 1;
    }

    :global(.owl-carousel .owl-nav) {
        position: absolute;
        top: 50%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        transform: translateY(-50%);
        pointer-events: none;
    }

    :global(.owl-carousel .owl-nav button) {
        background: rgba(255, 255, 255, 0.9) !important;
        border-radius: 50% !important;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        outline: none;
        pointer-events: auto;
        margin: 0 10px;
        color: #ff7f2a !important; /* Navigation arrow color */
    }

    :global(.owl-carousel .owl-nav button:hover) {
        background: white !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    :global(.owl-carousel .owl-dots) {
        text-align: center;
        margin-top: 20px;
    }

    :global(.owl-carousel .owl-dot) {
        width: 12px;
        height: 12px;
        background: #ffffff !important; /* Changed non-active dot color */
        border-radius: 50%;
        margin: 0 5px;
        outline: none;
    }

    :global(.owl-carousel .owl-dot.active) {
        background: #ff0101 !important;
        transform: scale(1.2);
    }
</style>

<!-- Structure HTML -->
<div class="slider" style="height: {sliderHeight}">
  {#each slides as slide, index}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
          class="slide {index === activeIndex ? 'active' : ''}"
          onclick={() => setActiveSlide(index)}
      >
          <div class="slide-bg" style="background-image: url({slide.url})"></div>
          <div class="slide-overlay"></div>
          <div class="slide-content">
              <h2 class="slide-title">{slide.title}</h2>
              <p class="slide-description">{slide.description}</p>
          </div>
          <div class="inactive-title">
              <p class="vertical-text">{slide.title}</p>
          </div>
      </div>
  {/each}
</div>

<div class="indicators">
  {#each slides as _, index}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
          class="indicator {index === activeIndex ? 'active' : ''}"
          onclick={() => setActiveSlide(index)}
      ></div>
  {/each}
</div>


<main class="main-content">
<div style="padding-top:20px" class="container">
<!-- <div style="text-align: center;">
  <img style="width:min(750px,100%);" src="{pubradio}" alt="pubrdio">
</div> -->
  <section class="artists-section">
  
    <div class="section">
      <h1>Invités de la semaine</h1>
    </div>
    <div class="carousel-container">
      <button class="carousel-button carousel-prev" onclick={moveToPrevSlide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff0"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="carousel"
        bind:this={carouselRef}
        onmousedown={setupDragEvents}
        onmousemove={handleMouseMove}
        onmouseup={handleMouseUp}
        onmouseleave={handleMouseUp}
        ontouchstart={setupDragEvents}
        ontouchmove={handleMouseMove}
        ontouchend={handleMouseUp}
      >
        {#if isLoading_artists}
          <div style="display:flex;align-items:center;justify-content:center;width:100%;padding:40px;">
            <p>Chargement des artistes...</p>
          </div>
        {:else if error_artists}
          <div style="display:flex;align-items:center;justify-content:center;width:100%;padding:40px;">
            <p style="color:red;">{error_artists}</p>
          </div>
        {:else}
          {#each duplicatedArtists as artist, i}
            <div class="carousel-item">
              <div class="artist-card">
                <img src={artist.image} alt="Artiste {artist.id}" class="artist-image" />
                <button class="zoom-btn" onclick={() => openLightbox(i)} aria-label="Zoomer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
      <button class="carousel-button carousel-next" onclick={moveToNextSlide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fa0000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </section>

  <section class="section">
    <div style="paddding:5px 20px;box-sizing:border-box">
      <small style="background:red;color:#fff;padding:3px 5px;border-radius:5px"><i class="bi bi-chevron-right"></i> Publicité </small>
       <a href="#"><img width="100%" src="{pub1}" alt="Pub1"/></a>
    </div>
   
  </section>

  <section class="section">
    <h1>Dernières Actualités</h1>
    
    <!-- Structure HTML -->
    <div class="news-grid">
     

        {#if isLoading_news}
        <p style="text-align: center;">Chargement en cours...</p>
        {:else if error_news}
        <p>Erreur: {error_news.message}</p>
        {:else}
    
            {#each datanews as item}
              <article class="news-card">
                <div class="news-image">
                   <a href="/news/{item.slug}">
                    <img src="https://adminradio.oneradio.ci/cropavatar/img/{item.photo}" alt="Article 1">
                    <span class="news-category">{item.categorie}</span>
                   </a>
                </div>
                <div class="news-content">
                    <h3>{item.titre}</h3>
                    <p class="news-excerpt">{item.description.substring(0, 180)} ...</p>
                    <div class="news-meta">
                        <span><i class="bi bi-calendar3"></i><strong> {item.datepub}</strong></span>
                        <span><i class="bi bi-person-circle"></i> {item.auteur}</span>
                    </div>
                    <a href="/news/{item.slug}" class="read-more">Lire la suite <i class="bi bi-arrow-right"></i></a>
                </div>
            </article>
            {/each}
      
        {/if}

 
    </div>
     <div class="voir-plus">
      <!-- {#if showLoadMoreButton} -->

        <a class="load-more-button" href="/news">Voir Plus <i class="bi bi-chevron-double-right"></i></a>
      <!-- {/if} -->
    </div>

  </section>
  
  <section class="section">
    <h1>Evènements</h1>
    
    <!-- Structure HTML -->
    <div class="events-grid">
      {#each dataevents as event}
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
                         <small>Publié </small>
                          {event.pastdate}
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
     <div class="voir-plus">
      <!-- {#if showLoadMoreButton} -->

        <a class="events-load-more-button" href="/events">Voir Plus <i class="bi bi-chevron-double-right"></i></a>
      <!-- {/if} -->
    </div>

  </section>
 
</div>
<div style="width: 100%;" class="zone_animateur">
  <div class="container-owl">
    <h1>Team OneRadio</h1>
    
    <div bind:this={carouselElement} class="owl-carousel gallery-carousel">
        {#each galleryItems as item}
            <div class="gallery-item">
                <img src={item.src} alt={item.alt}>
                <div class="image-overlay">
                    <h3>{item.title}</h3>
                     <h2 style="color:#ff7f2a">{item.fonction}</h2>
                </div>
            </div>
        {/each}
    </div>
  </div>
</div>
{#if lightboxOpen}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="lightbox-overlay" onclick={closeLightbox} onkeydown={handleLightboxKeydown}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="lightbox-content" onclick={(e) => e.stopPropagation()}>
    <button class="lightbox-close" onclick={closeLightbox} aria-label="Fermer">&times;</button>
    <button class="lightbox-arrow lightbox-arrow-left" onclick={lightboxPrev} aria-label="Précédent">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <img src={artists[lightboxIndex]?.image} alt="Artiste {artists[lightboxIndex]?.id}" class="lightbox-img" />
    <button class="lightbox-arrow lightbox-arrow-right" onclick={lightboxNext} aria-label="Suivant">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>
    <div class="lightbox-counter">{lightboxIndex + 1} / {artists.length}</div>
  </div>
</div>
{/if}

<script type="text/javascript">
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/68441950e58c84190b866fa9/1it505p6a';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
    </script>
</main>