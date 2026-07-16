
<script>
  import { onMount, tick } from 'svelte';
  
  import pub1 from "$lib/img/pubspa.jpg";
  import pub2 from "$lib/img/pubspa2.png";
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

    // Données des slides (slider principal)
    let slides = $state([])
    // Données des slides pub (carousel pub-promo)
    let pubSlides = $state([])
    // Données des slides pub1 (barre pub top)
    let pub1Slides = $state([]);
    let pub1ActiveIndex = $state(0);


 // State for gallery items
   let sliderItems = [];
    let isLoadingslide = true;
    let errorslide = null;
  
    onMount(() => {
        // Fetch gallery items
        fetchSlide();
        fetchPubSlides();
        fetchPub1Slides();
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

    async function fetchPubSlides() {
        try {
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/sliders_pub.php');
            if (!response.ok) throw new Error('Erreur chargement pub slides');
            const data = await response.json();
            pubSlides = data.map(item => ({
                url: 'https://adminradio.oneradio.ci/pub/' + item.images,
                lien: item.lien,
                title: item.titre,
            }));
            setTimeout(initPubCarousel, 300);
        } catch (err) {
            console.warn('fetchPubSlides:', err.message);
        }
    }

    async function fetchPub1Slides() {
        try {
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/sliders_pub1.php');
            if (!response.ok) throw new Error('Erreur chargement pub1 slides');
            const data = await response.json();
            pub1Slides = data.map(item => ({
                url: 'https://adminradio.oneradio.ci/pub/' + item.images,
                lien: item.lien || '#',
            }));
            if (pub1Slides.length > 1) {
                setInterval(() => {
                    pub1ActiveIndex = (pub1ActiveIndex + 1) % pub1Slides.length;
                }, 4000);
            }
        } catch (err) {
            console.warn('fetchPub1Slides:', err.message);
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
        } else if (windowWidth < 1440) {
            sliderHeight = "600px";
        } else if (windowWidth < 1920) {
            sliderHeight = "750px";
        } else if (windowWidth < 3840) {
            sliderHeight = "900px";
        } else {
            sliderHeight = "1100px";
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
            const response = await fetch('https://adminradio.oneradio.ci/radio_one/news4.php');

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

    // ─────────────────────────────────────────────
    // World Cup 2026 — matchs & scores live
    // ─────────────────────────────────────────────
    let wcDate = $state(new Date());
    let wcMatches = $state([]);
    let wcLoading = $state(false);
    let wcDateLabel = $derived(
        wcDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    );

    function wcDateStr(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
    }

    async function fetchWCMatches() {
        wcLoading = true;
        try {
            const res = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${wcDateStr(wcDate)}`
            );
            const data = await res.json();
            wcMatches = (data.events || []).map(ev => {
                const comp = ev.competitions?.[0];
                const home = comp?.competitors?.find(c => c.homeAway === 'home');
                const away = comp?.competitors?.find(c => c.homeAway === 'away');
                const sn = comp?.status?.type?.name || '';
                const isLive = sn === 'STATUS_IN_PROGRESS';
                const isFinal = sn === 'STATUS_FINAL';
                const timeStr = ev.date
                    ? new Date(ev.date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Abidjan'
                    })
                    : '';
                return {
                    id: ev.id,
                    homeTeam: home?.team?.displayName || '?',
                    awayTeam:  away?.team?.displayName || '?',
                    homeLogo:  home?.team?.logo || '',
                    awayLogo:  away?.team?.logo || '',
                    homeScore: home?.score ?? '',
                    awayScore: away?.score ?? '',
                    isLive, isFinal, timeStr,
                    group: comp?.notes?.[0]?.headline || '',
                };
            });
        } catch(_) {
            wcMatches = [];
        } finally {
            wcLoading = false;
        }
    }

    function wcPrevDay() { wcDate = new Date(wcDate.getTime() - 86400000); fetchWCMatches(); }
    function wcNextDay() { wcDate = new Date(wcDate.getTime() + 86400000); fetchWCMatches(); }

    onMount(() => {
        fetchWCMatches();
        const wcInt = setInterval(fetchWCMatches, 60000);
        return () => clearInterval(wcInt);
    });

    // State for gallery items
    let galleryItems = $state([]);
    let isLoading = true;
    let error = null;
    let owlCarouselLoaded = false;
    let carouselElement = $state();
    let pubOwlEl = $state();

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
                setTimeout(initPubCarousel, 100);
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


    function initPubCarousel() {
        if (!owlCarouselLoaded || !window.jQuery || !pubOwlEl || pubSlides.length === 0) {
            setTimeout(initPubCarousel, 400);
            return;
        }
        const jq = window.jQuery;
        if (jq(pubOwlEl).data('owl.carousel')) {
            jq(pubOwlEl).owlCarousel('destroy');
        }
        jq(pubOwlEl).owlCarousel({
            loop: true,
            items: 1,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            nav: false,
            dots: false,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut'
        });
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
                    1000: { items: 4 }
                }
            });
        }
    }

    // ─────────────────────────────────────────────
    // GSAP — Timeline · Stagger · ScrollTrigger · Morphing
    // ─────────────────────────────────────────────
    let _gsap = null;
    let _st   = null;

    onMount(async () => {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
            import('gsap'),
            import('gsap/ScrollTrigger')
        ]);
        gsap.registerPlugin(ScrollTrigger);
        _gsap = gsap;
        _st   = ScrollTrigger;

        // ── 1. Page entrance ──────────────────────────────
        gsap.timeline({ delay: 0.05 })
            .from('.pub-bar',  { y: -45, opacity: 0, duration: 0.9, ease: 'power3.out' })
            .from('.slider',   { opacity: 0, duration: 1,   ease: 'power2.out' }, '-=0.6');

        // ── 2. Section titles: clip-path wipe left→right ──
        gsap.utils.toArray('.section h1').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                clipPath: 'inset(0 100% 0 0)',
                opacity: 0,
                duration: 1,
                ease: 'power4.out'
            });
        });

        // ── 3. Section badges scale pop ──────────────────
        gsap.utils.toArray('.section-badge').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 92%', once: true },
                scale: 0, opacity: 0,
                duration: 0.5, ease: 'back.out(2)'
            });
        });

        // ── 4. Pub promo: split left / right ─────────────
        gsap.from('.pub-text-side', {
            scrollTrigger: { trigger: '.pub-promo-section', start: 'top 82%', once: true },
            x: -70, opacity: 0, duration: 0.85, ease: 'power3.out'
        });
        gsap.from('.pub-carousel-side', {
            scrollTrigger: { trigger: '.pub-promo-section', start: 'top 82%', once: true },
            x: 70, opacity: 0, duration: 0.85, ease: 'power3.out', delay: 0.15
        });

        // ── 5. News — MSN layout stagger ─────────────────
        ScrollTrigger.create({
            trigger: '.msn-layout',
            start: 'top 82%',
            once: true,
            onEnter: () => {
                // Hero
                gsap.from('.msn-hero', {
                    y: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
                });
                // Side stack cards
                gsap.from('.msn-side-card', {
                    x: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.15
                });
                // Bottom grid cards
                gsap.from('.msn-grid-card', {
                    y: 50, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out', delay: 0.25
                });
            }
        });

        // ── 6. Events cards stagger + rotation morph ─────
        gsap.from('.events-card', {
            scrollTrigger: { trigger: '.events-grid', start: 'top 82%', once: true },
            y: 65, opacity: 0, rotation: 4, duration: 0.7, stagger: 0.09, ease: 'back.out(1.5)'
        });

        // ── 7. Artists carousel items ─────────────────────
        ScrollTrigger.create({
            trigger: '.artists-section',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.from('.carousel-item', {
                    y: 55, opacity: 0, scale: 0.88,
                    duration: 0.65, stagger: 0.055, ease: 'power3.out'
                });
            }
        });

        // ── 8. Zone animateur main timeline ──────────────
        // Split H1 into letter <span>s
        const zaH1 = document.querySelector('#zone-animateur h1');
        if (zaH1) {
            const raw = zaH1.textContent;
            zaH1.innerHTML = raw.split('').map(c =>
                c === ' '
                    ? '<span class="h1c" style="display:inline-block;white-space:pre"> </span>'
                    : `<span class="h1c" style="display:inline-block">${c}</span>`
            ).join('');
        }

        const zaTl = gsap.timeline({
            scrollTrigger: { trigger: '#zone-animateur', start: 'top 72%', once: true }
        });

        zaTl
            // Red accent line scales from center
            .from('.zone-accent-line', {
                scaleX: 0, transformOrigin: '50% 50%',
                duration: 1, ease: 'expo.out'
            })
            // H1 chars: 3-D flip entrance with stagger
            .from('#zone-animateur h1 .h1c', {
                y: 55, opacity: 0, rotationX: -90,
                transformOrigin: '50% 100%',
                duration: 0.65, stagger: 0.03, ease: 'back.out(2)'
            }, '-=0.55')
            // Red underline draws
            .from('.h1-underline', {
                scaleX: 0, transformOrigin: '50% 50%',
                duration: 0.5, ease: 'power3.out'
            }, '-=0.25')
            // Subtitle: letter-spacing morph from 0 → wide
            .from('.owl-subtitle', {
                opacity: 0, letterSpacing: '0em',
                duration: 0.85, ease: 'power2.out'
            }, '-=0.3');

        // ── 9. SVG wave continuous morphing ──────────────
        const wavePath = document.querySelector('.zone-wave-path');
        if (wavePath) {
            gsap.to(wavePath, {
                attr: { d: 'M0,35 C200,10 500,55 800,20 C950,5 1100,40 1200,22 L1200,0 L0,0 Z' },
                duration: 4.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }

        // ── 10. Gallery items (async: wait for owl to render)
        // Use set+to pattern to avoid owl-clone duplicates & overflow clipping
        const checkGallery = setInterval(() => {
            // Target only real items, not owl clones
            const items = document.querySelectorAll(
                '#zone-animateur .owl-item:not(.owl-clone) .gallery-item'
            );
            if (items.length > 0) {
                clearInterval(checkGallery);
                gsap.set(items, { opacity: 0, y: 30 });
                ScrollTrigger.create({
                    trigger: '#zone-animateur .gallery-carousel',
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        gsap.to(items, {
                            opacity: 1, y: 0,
                            duration: 0.8, stagger: 0.08, ease: 'power3.out'
                        });
                    }
                });
            }
        }, 400);
        setTimeout(() => clearInterval(checkGallery), 12000);

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    });

    // ── Hero slider: animate text on each slide change ──
    $effect(() => {
        const idx = activeIndex; // track reactive state
        tick().then(() => {
            if (!_gsap) return;
            const content = document.querySelector('.slide.active .slide-content');
            if (!content) return;
            _gsap.fromTo(
                Array.from(content.children),
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, stagger: 0.18, ease: 'power3.out', overwrite: 'auto' }
            );
        });
    });


</script>

<svelte:window onkeydown={handleLightboxKeydown} />

<svelte:head>
  <title>One radio - Bienvenue</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>

<style>
 
  .container {
    max-width: min(1200px, 90vw);
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

.pub-bar {
  width: 100%;
  /* overflow: hidden; */
  background: #000;
  margin-bottom: 6px;
  position: relative;
}
 .pub-bar a {
    display: block;
  }

  .pub-bar-slider {
    position: relative;
    width: 100%;
    height: clamp(70px, 10vw, 600px);
    overflow: hidden;
    background: #000;
  }

  @media (min-width: 1920px) {
    .pub-bar-slider { height: clamp(180px, 10vw, 320px); }
  }

  @media (min-width: 3840px) {
    .pub-bar-slider { height: clamp(280px, 8vw, 480px); }
  }

  .pub-bar-slide {
    display: block;
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.9s ease;
    background: #000;
  }

  .pub-bar-slide.active {
    opacity: 1;
  }

  .pub-bar-slide img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
.pub-indic {
  color: #ff0000;
  font-size: 22px;
  padding: 5px 10px;
  display: flex;
  letter-spacing: 1px;
  align-items: center;
  justify-content: center;
  background: #000000;
  border-right:1px solid #ff0000;
  height: 100%;
  position: absolute;
  font-family: Impact, sans-serif;
  left: 0;
  width: 80px;
  z-index: 10;
  overflow: visible; /* Indispensable pour le grand zoom */
}
.pub-indic::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #ff0000;
}

.pub-indic::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #000000;
}

/* Les deux mots animés */
.pub-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transform-origin: center;
  opacity: 0;
  animation: grand-zoom 6s infinite;
  white-space: nowrap;
}

.pub-text-1 {
  animation-delay: 0s;
}

.pub-text-2 {
  animation-delay: 3s;
}

@keyframes grand-zoom {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(5);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(3);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  45% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
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
        font-size: clamp(1.5rem, 3vw, 5rem);
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .slide-description {
        font-size: clamp(0.9rem, 1.1vw, 1.6rem);
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
            margin-top: 0 !important;
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
            margin-top: 0 !important;
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
    .zone_animateur {
        width: 100%;
        background: #050c12;
        padding: 3.5rem 0 4rem;
        position: relative;
        overflow: visible;
    }
    .zone-accent-line {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent 0%, #bb0000 28%, #ff4444 50%, #bb0000 72%, transparent 100%);
        transform-origin: 50% 50%;
        z-index: 2;
    }
    .zone-wave-svg {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 55px;
        pointer-events: none;
        z-index: 0;
    }
    .zone-wave-path { fill: rgba(200, 0, 0, 0.05); }
    /* owl carousel */
    .container-owl {
        font-family: 'Segoe UI', Arial, sans-serif;
        max-width: min(1200px, 90vw);
        margin: 0 auto;
        padding: 0 2rem 2rem;
        position: relative;
        z-index: 1;
    }
    .owl-section-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    .container-owl h3 {
        font-size: 1.4rem;
        font-weight: 900;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #ffffff;
        margin: 0 0 0.4rem;
        display: inline-block;
        position: relative;
    }
    .h1-underline {
        width: 50px;
        height: 3px;
        background: #ff0000;
        margin: 0.5rem auto 0.2rem;
        border-radius: 2px;
        transform-origin: 50% 50%;
    }
    .owl-subtitle {
        color: rgba(255, 255, 255, 0.38);
        font-size: 0.73rem;
        letter-spacing: 0.42em;
        text-transform: uppercase;
        margin: 0.9rem 0 0;
    }

    .gallery-item {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
    }
    .gallery-item:hover {
        border-color: rgba(255, 0, 0, 0.45);
        box-shadow: 0 0 0 1px rgba(255, 0, 0, 0.28), 0 14px 45px rgba(255, 0, 0, 0.18), 0 6px 20px rgba(0, 0, 0, 0.65);
        transform: translateY(-5px);
    }
    .gallery-item img {
        width: 100%;
        height: clamp(220px, 22vw, 520px);
        object-fit: cover;
        object-position: top;
        transition: transform 0.5s ease;
        display: block;
    }
    .gallery-item:hover img {
        transform: scale(1.07);
    }
    .card-bottom-info {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        padding: 2.5rem 1.2rem 1.2rem;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.93) 0%, rgba(0, 0, 0, 0.55) 60%, transparent 100%);
        transition: opacity 0.35s ease;
        z-index: 2;
        pointer-events: none;
    }
    .gallery-item:hover .card-bottom-info {
        opacity: 0;
    }
    .card-bottom-info h3 {
        color: #ffffff;
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
        letter-spacing: 0.04em;
    }
    .card-bottom-info h2 {
        color: #ff4d4d;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        margin: 0.2rem 0 0;
    }
    .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(160deg, rgba(0, 0, 0, 0.88) 0%, rgba(130, 0, 0, 0.52) 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.2rem;
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: 3;
    }
    .gallery-item:hover .image-overlay {
        opacity: 1;
    }
    .image-overlay h3 {
        color: #ffffff;
        font-size: 1.35rem;
        font-weight: 800;
        text-align: center;
        letter-spacing: 0.05em;
        margin: 0;
        transform: translateY(10px);
        transition: transform 0.4s ease;
    }
    .image-overlay h2 {
        color: #ff5555;
        font-size: 0.76rem;
        font-weight: 600;
        text-align: center;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin: 0.25rem 0 0;
        transform: translateY(10px);
        transition: transform 0.4s ease 0.05s;
    }
    .gallery-item:hover .image-overlay h3,
    .gallery-item:hover .image-overlay h2 {
        transform: translateY(0);
    }
    .gallery-share {
        display: flex;
        gap: 0.6rem;
        margin-top: 1.1rem;
        transform: translateY(14px);
        opacity: 0;
        transition: opacity 0.4s ease 0.12s, transform 0.4s ease 0.12s;
    }
    .gallery-item:hover .gallery-share {
        opacity: 1;
        transform: translateY(0);
    }
    .gallery-share-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 15px;
        text-decoration: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: background 0.25s, transform 0.25s, border-color 0.25s;
    }
    .gallery-share-btn:hover {
        background: #cc0000;
        border-color: #ff2222;
        transform: scale(1.18);
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
        background: #fff !important;
        border-radius: 50% !important;
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        border: none !important;
        transition: all 0.2s ease;
        outline: none;
        pointer-events: auto;
        margin: 0 10px;
        font-size: 1.5rem !important;
        color: #fa0000 !important;
    }

    :global(.owl-carousel .owl-nav button:hover) {
        background: #f5f5f7 !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
    }

    :global(.owl-pub-promo .owl-dots) {
        display: none !important;
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

 @media (max-width: 768px) {
  .main-content {
    /* padding: 2rem 1.5rem 9rem; */
    padding: 0;
    margin-top: 0;
    margin-bottom: 0 !important;

  }
  .container {
    padding: 24px 16px;
  }
  .artists-section {
    margin-bottom: 2rem;
  }
  .news-wc-row {
    margin-bottom: 2rem;
  }
  .ev-section-head {
    margin-bottom: 1rem;
  }
}
@media (max-width: 868px) {
  .main-content{
    margin-top: 0 !important;
  }
  main{
    margin-top: 0px !important;
  }
}

  /* ── Section pub promo ── */
  .pub-promo-section { padding: 3rem 0;}

  .pub-content {
    display: flex;
    align-items: stretch;
    gap: 24px;
  }

  .pub-text-side {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pub-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #e52222;
    color: #fff;
    padding: 3px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 600;
    align-self: flex-start;
  }

  .pub-text-side h2 {
    font-size: 1.4rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    line-height: 1.3;
  }

  .pub-text-side p {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.6;
    margin: 0;
  }

  .pub-img-bottom {
    width: 100%;
    border-radius: 8px;
    display: block;
    margin-top: auto;
  }

  .pub-carousel-side {
    flex: 1 1 50%;
    min-width: 0;
    border-radius: 0;
    overflow: hidden;
  }

  .pub-slide-item {
    position: relative;
    border-radius: 0;
    background: #fff;
  }

  .pub-slide-item a { display: block; }

  .pub-slide-item img {
    width: 100%;
    height: clamp(200px, 24vw, 480px);
    object-fit: contain;
    border-radius:10px;
    display: block;
  }

  .pub-slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    /* background: linear-gradient(transparent, rgba(0,0,0,0.7)); */
    color: #fff;
    padding: 20px 14px 12px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .pub-content { flex-direction: column; }
    .pub-text-side { flex: none; }
    .pub-slide-item img { height: 200px; }
  }

  /* ── News + World Cup layout ── */
  .news-wc-row {
    display: grid;
    grid-template-columns: 1fr 310px;
    gap: 1.5rem;
    align-items: start;
    margin-bottom: 3.5rem;
  }
  .news-col { margin: 0; }

  /* ── World Cup 2026 Widget ── */
  .wc-widget {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    position: sticky;
    top: 90px;
    box-shadow: 0 2px 14px rgba(0,0,0,0.07);
  }
  .wc-header {
    background: linear-gradient(135deg, #0a0a0a 0%, #0b0e16 100%);
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .wc-header h3 {
    color: #fff;
    font-size: 0.88rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: 0.03em;
  }
  .wc-header-trophy { font-size: 1.2rem; }
  .wc-date-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.85rem;
    background: #f1f5fd;
    border-bottom: 1px solid #dce6f7;
    gap: 0.5rem;
  }
  .wc-date-nav span {
    font-size: 0.73rem;
    font-weight: 600;
    color: #b90000;
    text-transform: capitalize;
    text-align: center;
    flex: 1;
  }
  .wc-nav-btn {
    width: 24px; height: 24px;
    border: 1px solid #c5d3ef; border-radius: 50%;
    background: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; color: #ee0f0f; flex-shrink: 0;
    transition: background 0.18s, border-color 0.18s, color 0.18s;
  }
  .wc-nav-btn:hover { background: #ff0000; border-color: #ff0000; color: #fff; }
  .wc-matches-list { max-height: 490px; overflow-y: auto; }
  .wc-match-group {
    padding: 0.38rem 0.9rem;
    font-size: 0.62rem; font-weight: 700;
    color: #eb0000; letter-spacing: 0.09em; text-transform: uppercase;
    background: #eef2fb;
    border-bottom: 1px solid #d8e3f7;
    border-top: 1px solid #d8e3f7;
  }
  .wc-match {
    display: flex; align-items: center;
    padding: 0.6rem 0.9rem;
    border-bottom: 1px solid #f4f6fb;
    gap: 0.4rem;
  }
  .wc-match:last-child { border-bottom: none; }
  .wc-team {
    flex: 1; display: flex; align-items: center;
    gap: 0.32rem; min-width: 0;
  }
  .wc-team--away { flex-direction: row-reverse; text-align: right; }
  .wc-team-logo {
    width: 20px; height: 20px;
    object-fit: contain; flex-shrink: 0; border-radius: 2px;
  }
  .wc-team-name {
    font-size: 0.73rem; font-weight: 600; color: #111;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .wc-score-box { flex-shrink: 0; text-align: center; min-width: 50px; }
  .wc-score {
    font-size: 0.92rem; font-weight: 800; color: #111; letter-spacing: 0.04em; line-height: 1.2;
  }
  .wc-score-live { color: #e53e3e; }
  .wc-score-time { font-size: 0.76rem !important; font-weight: 700 !important; color: #444 !important; }
  .wc-time { font-size: 0.62rem; color: #aaa; margin-top: 1px; }
  .wc-live-badge {
    display: inline-block; background: #e53e3e; color: #fff;
    font-size: 0.53rem; font-weight: 700; letter-spacing: 0.1em;
    padding: 1px 4px; border-radius: 3px; text-transform: uppercase;
    animation: wc-blink 1.2s ease-in-out infinite;
  }
  @keyframes wc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.38; } }
  .wc-no-matches, .wc-loading {
    padding: 2rem 1rem; text-align: center; color: #bbb;
    font-size: 0.78rem; line-height: 1.7;
  }
  .wc-footer {
    padding: 0.5rem 0.9rem; text-align: center;
    border-top: 1px solid #e8eef9; background: #f7faff;
  }
  .wc-footer a {
    font-size: 0.68rem; color: #1a56db; text-decoration: none; font-weight: 600;
  }
  .wc-footer a:hover { text-decoration: underline; }

  @media (max-width: 1060px) {
    .news-wc-row { grid-template-columns: 1fr; }
    .wc-widget { position: static; }
  }

  .artists-section { margin-bottom: 3.5rem; }

  /* ── Section events (home) ── */
  .ev-section-head {
    display: flex; align-items: center; gap: .75rem;
    margin-bottom: 1.5rem; padding-bottom: .75rem;
    border-bottom: 2px solid #f0f0f0;
  }
  .ev-section-head h2 {
    font-size: 1.3rem; font-weight: 800; color: #111;
    display: flex; align-items: center; gap: .45rem; margin: 0;
  }
  .ev-section-head h2 i { color: #ff1919; }
  .ev-section-badge-link {
    margin-left: auto;
    display: inline-flex; align-items: center; gap: .25rem;
    background: #ff1919; color: #fff;
    font-size: .75rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    padding: .3rem .75rem; border-radius: 20px; text-decoration: none;
    transition: background .18s;
  }
  .ev-section-badge-link:hover { background: #cc0000; }

  .ev-grid-home {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 0.85rem;
    margin: 0 0 0.85rem;
  }

  .ev-card-home {
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 14px rgba(0,0,0,.08);
    background: #fff; border: 1px solid #eee;
    display: flex; flex-direction: column;
    transition: transform .22s, box-shadow .22s;
  }
  .ev-card-home:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,.13); }

  .ev-card-img-wrap { position: relative; overflow: hidden; display: block; }
  .ev-card-img {
    width: 100%; height: 200px; object-fit: cover; display: block;
    transition: transform .35s ease;
  }
  .ev-card-home:hover .ev-card-img { transform: scale(1.04); }
  .ev-card-cat {
    position: absolute; top: .6rem; left: .6rem;
    background: #ff1919; color: #fff;
    font-size: .65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    padding: .2rem .6rem; border-radius: 20px;
  }

  .ev-card-body {
    padding: 0.75rem 0.85rem 0.9rem; display: flex; flex-direction: column; flex: 1; gap: .45rem;
  }
  .ev-card-meta {
    display: flex; align-items: center; gap: .35rem;
    font-size: .75rem; color: #aaa;
  }
  .ev-card-meta i { color: #ff1919; }
  .ev-card-title {
    font-size: .97rem; font-weight: 700; color: #111; margin: 0; line-height: 1.35;
  }
  .ev-card-title a { text-decoration: none; color: inherit; }
  .ev-card-title a:hover { color: #ff1919; }
  .ev-card-link {
    display: inline-flex; align-items: center; gap: .2rem;
    color: #ff1919; font-size: .82rem; font-weight: 700;
    text-decoration: none; margin-top: auto; width: fit-content;
    transition: gap .18s;
  }
  .ev-card-link:hover { gap: .45rem; }

  .voir-plus { display: flex; justify-content: center; margin-top: 1.5rem; }

  @media (max-width: 600px) {
    .ev-grid-home { grid-template-columns: 1fr; }
  }

  /* ── Large screens 1440px ── */
  @media (min-width: 1440px) {
    .container, .container-owl { max-width: min(1400px, 90vw); }
    .news-wc-row { grid-template-columns: 1fr 380px; }
    .pub-text-side h2 { font-size: clamp(1.4rem, 1.5vw, 2rem); }
    .pub-text-side p  { font-size: clamp(0.9rem, 0.9vw, 1.2rem); }
    .container-owl h3 { font-size: clamp(1.4rem, 1.4vw, 2rem); }
  }

  /* ── Full HD TV 1920px ── */
  @media (min-width: 1920px) {
    .container, .container-owl { max-width: min(1760px, 90vw); }
    .news-wc-row { grid-template-columns: 1fr 460px; }
    .carousel-item { flex: 0 0 25%; min-width: 25%; }
    .pub-text-side h2 { font-size: clamp(1.8rem, 1.5vw, 2.4rem); }
    .pub-text-side p  { font-size: clamp(1rem, 0.85vw, 1.3rem); }
    .container-owl h3 { font-size: clamp(1.8rem, 1.4vw, 2.4rem); }
    .inactive-title   { font-size: clamp(1.5rem, 1.6vw, 2.8rem); }
    .slide-content    { padding: 2.5rem; }
  }

  /* ── 4K TV 3840px ── */
  @media (min-width: 3840px) {
    .container, .container-owl { max-width: min(3400px, 90vw); }
    .news-wc-row { grid-template-columns: 1fr 700px; }
    .carousel-item { flex: 0 0 20%; min-width: 20%; }
    .pub-text-side h2 { font-size: clamp(2.5rem, 1.2vw, 3.5rem); }
    .pub-text-side p  { font-size: clamp(1.2rem, 0.7vw, 1.6rem); }
    .container-owl h3 { font-size: clamp(2.2rem, 1.1vw, 3rem); }
    .inactive-title   { font-size: clamp(2rem, 1.2vw, 3.5rem); }
    .slide-content    { padding: 4rem; }
    .gallery-share-btn { width: clamp(36px, 2.5vw, 60px); height: clamp(36px, 2.5vw, 60px); font-size: clamp(15px, 1.2vw, 28px); }
  }
</style>


<!-- test -->
<main class="main-content">
    <!-- Section Slider -->
    <!-- Barre de pub -->
    <div class="pub-bar">
      <div class="pub-indic">
        <span class="pub-text pub-text-1">Pub.</span>
        <span class="pub-text pub-text-2">Promo</span>
      </div>
      <div class="pub-bar-slider">
        {#each pub1Slides as slide, i}
          <a target="_blank" href="{slide.lien}" class="pub-bar-slide {i === pub1ActiveIndex ? 'active' : ''}">
            <img src="{slide.url}" alt="Publicité" />
          </a>
        {/each}
        {#if pub1Slides.length === 0}
          <a href="#" class="pub-bar-slide active">
            <img src="{pub2}" alt="Publicité" />
          </a>
        {/if}
      </div>
    </div>

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
   <div style="padding-top:40px" class="container">
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
          stroke="#fa0000"
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
            <p>Chargement des invités...</p>
          </div>
        {:else if error_artists}
          <div style="display:flex;align-items:center;justify-content:center;width:100%;padding:10px 40px;">
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

  <section class="section pub-promo-section">
    <div class="pub-content">
      <div class="pub-text-side">
        <small class="pub-badge"><i class="bi bi-megaphone-fill"></i> Publicité</small>
        <h2>Découvrez nos offres exclusives !</h2>
        <p>Profitez de réductions incroyables sur nos produits et services. Ne manquez pas cette opportunité de faire des économies tout en bénéficiant de la qualité OneRadio.</p>
        <a href="#"><img src="{pub1}" alt="Pub1" class="pub-img-bottom"/></a>
      </div>
      <div class="pub-carousel-side">
        <div class="owl-carousel owl-pub-promo" bind:this={pubOwlEl}>
          {#each pubSlides as slide}
            <div class="pub-slide-item">
              <a href={slide.lien || '#'}>
                <img src={slide.url} alt={slide.title} />
                {#if slide.title}
                  <div class="pub-slide-caption">{slide.title}</div>
                {/if}
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <div class="news-wc-row">
  <section class="section news-col">
    <div class="news-section-header">
      <span class="section-badge"><i class="bi bi-newspaper"></i> Actualité Nationale et Internationale</span>

        <a style="text-decoration:none" class="section-badge" href="/news"><i class="bi bi-plus"> Voir Plus <i class="bi bi-arrow-right"></i></a>

    </div>

    {#if isLoading_news}
      <p style="text-align:center;padding:2rem 0;color:#999;">Chargement en cours…</p>
    {:else if error_news}
      <p style="color:#e53e3e;">Erreur : {error_news.message}</p>
    {:else if datanews.length > 0}
      <div class="msn-layout">

        <!-- ── Top row : Hero + Side stack ── -->
        <div class="msn-top-row">

          <!-- Hero (1er article) -->
          <article class="msn-hero">
            <a href="/news/{datanews[0].slug}" class="msn-hero-link">
              <div class="msn-hero-media">
                <img src="https://adminradio.oneradio.ci/cropavatar/img/{datanews[0].photo}" alt={datanews[0].titre}>
              </div>
              <div class="msn-hero-body">
                <span class="msn-cat">{datanews[0].categorie}</span>
                <h2>{datanews[0].titre}</h2>
                <div class="msn-hero-meta">
                  <span><i class="bi bi-calendar3"></i> {datanews[0].datepub}</span>
                  <span><i class="bi bi-person-circle"></i> {datanews[0].auteur}</span>
                </div>
              </div>
            </a>
          </article>

          <!-- Side stack (articles 2-4) -->
          <div class="msn-side-stack">
            {#each datanews.slice(1, 4) as item}
              <article class="msn-side-card">
                <a href="/news/{item.slug}" class="msn-side-link">
                  <div class="msn-side-thumb">
                    <img src="https://adminradio.oneradio.ci/cropavatar/img/{item.photo}" alt={item.titre}>
                  </div>
                  <div class="msn-side-text">
                    <span class="msn-cat">{item.categorie}</span>
                    <h3>{item.titre}</h3>
                    <span class="msn-time"><i class="bi bi-calendar3"></i> {item.datepub}</span>
                  </div>
                </a>
              </article>
            {/each}
          </div>

        </div>

        <!-- ── Bottom grid (articles 5+) ── -->
        {#if datanews.length > 4}
          <div class="msn-grid">
            {#each datanews.slice(4) as item}
              <article class="msn-grid-card">
                <a href="/news/{item.slug}">
                  <div class="msn-grid-img">
                    <img src="https://adminradio.oneradio.ci/cropavatar/img/{item.photo}" alt={item.titre}>
                  </div>
                  <div class="msn-grid-body">
                    <span class="msn-cat">{item.categorie}</span>
                    <h3>{item.titre}</h3>
                    <span class="msn-time"><i class="bi bi-calendar3"></i> {item.datepub}</span>
                  </div>
                </a>
              </article>
            {/each}
          </div>
        {/if}

      </div>
    {/if}

  
  </section>

  <!-- ── Coupe du Monde 2026 Sidebar ── -->
  <aside class="wc-widget">
    <div class="wc-header">
      <span class="wc-header-trophy">🏆</span>
      <h3>Coupe du Monde 2026</h3>
    </div>
    <div class="wc-date-nav">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <button class="wc-nav-btn" onclick={wcPrevDay} aria-label="Jour précédent">‹</button>
      <span>{wcDateLabel}</span>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <button class="wc-nav-btn" onclick={wcNextDay} aria-label="Jour suivant">›</button>
    </div>
    <div class="wc-matches-list">
      {#if wcLoading}
        <div class="wc-loading"><i class="bi bi-hourglass-split"></i> Chargement…</div>
      {:else if wcMatches.length === 0}
        <div class="wc-no-matches">
          <i class="bi bi-calendar-x" style="font-size:1.5rem;color:#ddd;display:block;margin-bottom:0.5rem;"></i>
          Aucun match ce jour
        </div>
      {:else}
        {#each wcMatches as match}
          {#if match.group}
            <div class="wc-match-group">{match.group}</div>
          {/if}
          <div class="wc-match">
            <div class="wc-team">
              {#if match.homeLogo}<img src={match.homeLogo} alt="" class="wc-team-logo">{/if}
              <span class="wc-team-name">{match.homeTeam}</span>
            </div>
            <div class="wc-score-box">
              {#if match.isLive || match.isFinal}
                <div class="wc-score{match.isLive ? ' wc-score-live' : ''}">{match.homeScore} – {match.awayScore}</div>
                <div class="wc-time">{#if match.isLive}<span class="wc-live-badge">Live</span>{:else}Terminé{/if}</div>
              {:else}
                <div class="wc-score wc-score-time">{match.timeStr}</div>
                <div class="wc-time">À venir</div>
              {/if}
            </div>
            <div class="wc-team wc-team--away">
              <span class="wc-team-name">{match.awayTeam}</span>
              {#if match.awayLogo}<img src={match.awayLogo} alt="" class="wc-team-logo">{/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
    <div class="wc-footer">
      <a href="https://www.espn.com/soccer/competition/_/id/fifa.world" target="_blank" rel="noopener noreferrer">Voir tout sur ESPN</a>
    </div>
  </aside>
  </div>

  <section class="section">
    <div class="ev-section-head">
      <h2><i class="bi bi-calendar3"></i> Événements</h2>
      <a class="ev-section-badge-link" href="/events">Voir tout <i class="bi bi-arrow-right-short"></i></a>
    </div>

    <div class="ev-grid-home">
      {#each dataevents as event}
        <article class="ev-card-home">
          <a href="/events/{event.slug}" class="ev-card-img-wrap">
            <img src="https://adminradio.oneradio.ci/cropavatar/img/{event.photo}"
                 alt={event.titre} class="ev-card-img" />
            <span class="ev-card-cat">{event.categorie}</span>
          </a>
          <div class="ev-card-body">
            <div class="ev-card-meta">
              <i class="bi bi-calendar3"></i>
              <span>{event.pastdate}</span>
            </div>
            <h3 class="ev-card-title">
              <a href="/events/{event.slug}">{event.titre}</a>
            </h3>
            <a href="/events/{event.slug}" class="ev-card-link">
              Voir plus <i class="bi bi-arrow-right-short"></i>
            </a>
          </div>
        </article>
      {/each}
    </div>

   
  </section>
 
</div>
<div id="zone-animateur" class="zone_animateur">
  <div class="zone-accent-line"></div>
  <svg class="zone-wave-svg" viewBox="0 0 1200 55" preserveAspectRatio="none" aria-hidden="true">
    <path class="zone-wave-path" d="M0,28 C300,55 900,0 1200,28 L1200,0 L0,0 Z" />
  </svg>
  <div class="container-owl">
    <div class="owl-section-header">
      <h3>Team OneRadio</h3>
      <div class="h1-underline"></div>
      <p class="owl-subtitle">Animateurs &amp; Équipe</p>
    </div>

    <div bind:this={carouselElement} class="owl-carousel gallery-carousel">
        {#each galleryItems as item}
            <div class="gallery-item">
                <img src={item.src} alt={item.alt}>
                <div class="card-bottom-info">
                    <h3>{item.title}</h3>
                    <h2>{item.fonction}</h2>
                </div>
                <div class="image-overlay">
                    <h3>{item.title}</h3>
                    <h2>{item.fonction}</h2>
                    <div class="gallery-share">
                      <a href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(item.src)}" target="_blank" rel="noopener noreferrer" class="gallery-share-btn" aria-label="Partager sur Facebook"><i class="bi bi-facebook"></i></a>
                      <a href="https://wa.me/?text={encodeURIComponent(item.title + ' - ' + item.src)}" target="_blank" rel="noopener noreferrer" class="gallery-share-btn" aria-label="Partager sur WhatsApp"><i class="bi bi-whatsapp"></i></a>
                      <a href="https://twitter.com/intent/tweet?url={encodeURIComponent(item.src)}&text={encodeURIComponent(item.title)}" target="_blank" rel="noopener noreferrer" class="gallery-share-btn" aria-label="Partager sur X"><i class="bi bi-twitter-x"></i></a>
                    </div>
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
  //demo
      // var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      // (function(){
      // var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      // s1.async=true;
      // s1.src='https://embed.tawk.to/68441950e58c84190b866fa9/1it505p6a';
      // s1.charset='UTF-8';
      // s1.setAttribute('crossorigin','*');
      // s0.parentNode.insertBefore(s1,s0);
      // })();
  </script>
</main>