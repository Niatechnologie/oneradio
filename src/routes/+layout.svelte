<script>
  import { run } from 'svelte/legacy';

    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { page } from '$app/stores';
    import ShareButtons from './shareButtons.svelte';
    import '$lib/styles.css';
    import logo from '$lib/img/logo.svg';
    import freq from '$lib/img/freq.svg';
    import Footer from './footer.svelte';
  /**
   * @typedef {Object} Props
   * @property {string} [src] - Pour un streaming
   * @property {string} [title]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { src = "https://oneradioweb.oneradio.ci/radiotreich", title = "Audio Player", children } = $props();
   
    // Variables pour gérer les transitions
    let currentKey = $state(null);
    let playPauseBtn;
    let playPauseIcon;
    let volumeSlider;
   
    // Variables pour le buffering
    let isBuffering = $state(true);
    let bufferingProgress = 0;

    // ✅ Variables pour la stratégie d'autoplay
    let userInteracted = false;
    let autoPlayAttempted = false;
    let waitingForInteraction = $state(false);
    
    // Fonction pour détecter les changements de page
    run(() => {
          if ($page.url.pathname) {
            currentKey = $page.url.pathname;
          }
       });

      const fullUrl = $derived(`${$page.url.origin}${$page.url.pathname}`);
      const fullUrl2 = $derived($page.url.href);
      function showUrl() {
        alert(fullUrl);
      }

    function isActive(path) {
        return $page.url.pathname === path;
      }
      
      function isActiveRoute(basePath) {
        return $page.url.pathname.startsWith(basePath);
      }

    // Variables réactives
    let audio = $state();
    let playing = false;
    let duration = 0;
    let currentTime = $state(0);
    let volume = 1;
   
    function formatTime(seconds) {
      if (isNaN(seconds)) return "00:00";
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
   
    function updateIcon(element, iconType) {
      if (!element) {
        console.error("L'élément d'icône n'est pas disponible");
        return;
      }
      
      if (iconType === 'play') {
        element.className = 'bi bi-play-fill';
      } else if (iconType === 'pause') {
        element.className = 'bi bi-pause-fill';
      }
    }
   
    function setupStreamingEvents() {
      if (!audio) return;
      
      audio.addEventListener('waiting', () => {
        isBuffering = true;
        const progressContainer = document.querySelector('.progress-container');
        const equalizerContainer = document.querySelector('.equalizer-container');
        if (progressContainer) progressContainer.style.opacity = 0;
        if (equalizerContainer) equalizerContainer.style.opacity = 0;
        console.log("Mise en mémoire tampon...");
      });
      
      audio.addEventListener('canplay', () => {
        isBuffering = false;
        console.log("Prêt à jouer");
      });
      
      audio.addEventListener('playing', () => {
        isBuffering = false;
        waitingForInteraction = false;
        console.log("Lecture en cours");
        const equalizerContainer = document.querySelector('.equalizer-container');
        const progressContainer = document.querySelector('.progress-container');
        if (equalizerContainer) equalizerContainer.style.opacity = 1;
        if (progressContainer) progressContainer.style.opacity = 1;
      });
      
      audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const duration = audio.duration;
          
          if (isFinite(duration) && duration > 0) {
            bufferingProgress = (bufferedEnd / duration) * 100;
          } else {
            bufferingProgress = (bufferingProgress + 5) % 100;
          }
        }
      });

      // Gestion des erreurs audio
      audio.addEventListener('error', (e) => {
        console.error("Erreur audio:", e);
        isBuffering = false;
      });
    }
    
    function toggleEqualizer(isPlaying) {
      const equalizer = document.querySelector('.equalizer-container');
      
      if (!equalizer) {
        console.error("Élément equalizer non trouvé");
        return;
      }
      
      if (isPlaying) {
        equalizer.classList.add('active_equalier');
        equalizer.style.opacity = 1;
      } else {
        equalizer.classList.remove('active_equalier');
        equalizer.style.opacity = 0;
      }
    }

    // ✅ Fonction startAutoPlay améliorée avec gestion de latence
    function startAutoPlay() {
      if (!audio || autoPlayAttempted) return;
      autoPlayAttempted = true;
      
      console.log("🎵 Tentative de lecture automatique...");
      isBuffering = true; // Spinner visible pendant la latence
      
      // Charger la source
      audio.load();
      
      // Tenter la lecture automatique
      audio.play().then(() => {
        console.log("✅ Lecture automatique réussie");
        playing = true;
        waitingForInteraction = false;
        updateIcon(playPauseIcon, 'pause');
        toggleEqualizer(true);
      }).catch(error => {
        console.warn("⚠️ Autoplay bloqué par le navigateur:", error.message);
        isBuffering = false;
        playing = false;
        waitingForInteraction = true; // Indiquer qu'on attend une interaction
        updateIcon(playPauseIcon, 'play');
        
        // Plan B : écouter la première interaction utilisateur
        setupInteractionListeners();
      });
    }

    // ✅ Écouteurs d'interaction pour déclencher la lecture
    function setupInteractionListeners() {
      console.log("👂 En attente de la première interaction utilisateur...");
      
      const triggerPlay = () => {
        if (userInteracted || playing) return;
        userInteracted = true;
        
        console.log("👆 Interaction détectée, lancement de la lecture...");
        isBuffering = true;
        waitingForInteraction = false;
        
        // Petit délai pour que le spinner soit visible
        setTimeout(() => {
          audio.play().then(() => {
            console.log("✅ Lecture lancée après interaction");
            playing = true;
            updateIcon(playPauseIcon, 'pause');
            toggleEqualizer(true);
          }).catch(err => {
            console.error("Erreur lecture après interaction:", err);
            isBuffering = false;
          });
        }, 300);
        
        removeInteractionListeners();
      };
      
      window._triggerPlayHandler = triggerPlay;
      
      document.addEventListener('click', triggerPlay, { once: false });
      document.addEventListener('touchstart', triggerPlay, { once: false });
      document.addEventListener('keydown', triggerPlay, { once: false });
      document.addEventListener('scroll', triggerPlay, { once: false, passive: true });
    }

    function removeInteractionListeners() {
      if (window._triggerPlayHandler) {
        document.removeEventListener('click', window._triggerPlayHandler);
        document.removeEventListener('touchstart', window._triggerPlayHandler);
        document.removeEventListener('keydown', window._triggerPlayHandler);
        document.removeEventListener('scroll', window._triggerPlayHandler);
        delete window._triggerPlayHandler;
      }
    }

    function togglePlay() {
      console.log("Toggle Play, état actuel:", playing);
      
      if (!audio) {
          console.error("L'élément audio n'est pas initialisé");
          return;
      }
      
      // Marquer l'interaction utilisateur
      userInteracted = true;
      waitingForInteraction = false;
      removeInteractionListeners();
      
      if (playing) {
          audio.pause();
      } else {
          isBuffering = true;
          
          const currentSrc = audio.src;
          audio.src = currentSrc;
          audio.load();
          
          audio.play().catch(error => {
              console.error("Erreur lors de la lecture:", error);
              isBuffering = false;
          });
      }
      
      playing = !playing;
      
      updateIcon(playPauseIcon, playing ? 'pause' : 'play');
      
      if (!isBuffering) {
          toggleEqualizer(playing);
      }
    }

    function handleTimeUpdate() {
      if (audio) {
        currentTime = audio.currentTime;
      }
    }
   
    function handleLoadedMetadata() {
      if (audio) {
        duration = audio.duration;
        isBuffering = false;
        console.log("Metadata chargée, durée:", duration);
      }
    }
    
    function handleVolumeClick(e) {
      if (!audio) return;
      
      const slider = e.currentTarget;
      const boundingRect = slider.getBoundingClientRect();
      const clickPosition = e.clientX - boundingRect.left;
      const sliderWidth = boundingRect.width;
      
      let newVolume = clickPosition / sliderWidth;
      newVolume = Math.max(0, Math.min(1, newVolume));
      
      volume = newVolume;
      audio.volume = volume;
      
      const volumeFill = slider.querySelector('.volume-fill');
      if (volumeFill) {
        volumeFill.style.width = `${volume * 100}%`;
      }
      
      const volumeInput = slider.querySelector('.volume-input');
      if (volumeInput) {
        volumeInput.value = volume;
      }
      
      updateVolumeIcon(volume > 0 ? 'unmute' : 'mute');
    }

    function handleVolumeChange(e) {
      if (audio && e && e.target) {
        volume = parseFloat(e.target.value);
        audio.volume = volume;
        
        const volumeFill = document.querySelector('.volume-fill');
        if (volumeFill) {
          volumeFill.style.width = `${volume * 100}%`;
        }
        
        updateVolumeIcon(volume > 0 ? 'unmute' : 'mute');
      }
    }

    function handleSeek(e) {
      if (audio) {
        const seekPosition = e.target.value;
        audio.currentTime = seekPosition;
      }
    }
   
    function toggleMute() {
      if (!audio) return;
      
      if (audio.volume > 0) {
        audio.dataset.previousVolume = audio.volume;
        volume = 0;
        audio.volume = 0;
        updateVolumeIcon('mute');
      } else {
        volume = parseFloat(audio.dataset.previousVolume || 1);
        audio.volume = volume;
        updateVolumeIcon('unmute');
      }
      
      const volumeFill = document.querySelector('.volume-fill');
      if (volumeFill) {
        volumeFill.style.width = `${volume * 100}%`;
      }
    }

    function updateVolumeIcon(state) {
      const volumeIcon = document.querySelector('.volume-btn i');
      if (!volumeIcon) return;
      
      if (state === 'mute') {
        volumeIcon.className = 'bi bi-volume-mute-fill';
      } else {
        volumeIcon.className = 'bi bi-volume-up-fill';
      }
    }

    let isScrolled = false;
    let isBurgerActive = false;
    let isLogoHovered = false;
    
    function handleScroll() {
      isScrolled = window.scrollY > 50;
    }
    
    function toggleBurger() {
      isBurgerActive = !isBurgerActive;
    }
    
    function closeBurger() {
      isBurgerActive = false;
    }
    
    function smoothScroll(event, targetId) {
      event.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      closeBurger();
    }
    
    function handleLogoMouseEnter() {
      isLogoHovered = true;
    }
    
    function handleLogoMouseLeave() {
      isLogoHovered = false;
    }
        
    const newsItems = [
        { text: "Révolution de l'IA dans la médecine avec 99% de précision diagnostique", category: "TECH", class: "tech", time: "2min" },
        { text: "Accord historique sur le climat lors du sommet mondial des nations", category: "MONDE", class: "world", time: "5min" },
        { text: "Découverte d'une exoplanète potentiellement habitable à 12 années-lumière", category: "SCIENCE", class: "science", time: "8min" },
        { text: "Nouveau traitement contre le cancer avec 95% de taux de réussite", category: "SANTÉ", class: "health", time: "12min" },
        { text: "Les marchés mondiaux montrent des signes de forte reprise économique", category: "FINANCE", class: "finance", time: "15min" },
        { text: "L'informatique quantique atteint un nouveau jalon technologique majeur", category: "TECH", class: "tech", time: "18min" },
        { text: "Traité de paix international signé par les dirigeants mondiaux", category: "MONDE", class: "world", time: "22min" },
        { text: "Percée en physique quantique ouvre de nouvelles possibilités scientifiques", category: "SCIENCE", class: "science", time: "25min" },
        { text: "Vaccin révolutionnaire avec 99% d'efficacité contre maladies virales", category: "SANTÉ", class: "health", time: "28min" },
        { text: "Crypto-monnaies atteignent des records historiques de valorisation", category: "FINANCE", class: "finance", time: "32min" },
        { text: "Nouvelle puce révolutionnaire 10 fois plus rapide que les précédentes", category: "TECH", class: "tech", time: "35min" },
        { text: "Coopération internationale renforcée pour la sécurité mondiale", category: "MONDE", class: "world", time: "38min" },
        { text: "Mission spatiale révèle des secrets sur l'origine de l'univers", category: "SCIENCE", class: "science", time: "42min" },
        { text: "Thérapie génique guérit une maladie rare chez 100% des patients", category: "SANTÉ", class: "health", time: "45min" },
        { text: "Innovation fintech révolutionne les paiements internationaux", category: "FINANCE", class: "finance", time: "48min" },
        { text: "Robot autonome développe ses propres algorithmes d'apprentissage", category: "TECH", class: "tech", time: "52min" },
        { text: "Nouvelle alliance économique entre pays émergents annoncée", category: "MONDE", class: "world", time: "55min" },
        { text: "Nouvelle espèce découverte dans les profondeurs océaniques", category: "SCIENCE", class: "science", time: "58min" },
        { text: "Nouvelle technique chirurgicale réduit les risques de 80%", category: "SANTÉ", class: "health", time: "62min" },
        { text: "Investissements verts dépassent les 500 milliards de dollars", category: "FINANCE", class: "finance", time: "65min" }
    ];

    const doubleNews = [...newsItems, ...newsItems];    
        
    onMount(() => {
      // Charger Bootstrap Icons CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
      document.head.appendChild(link);
      
      // Éléments du DOM
      playPauseBtn = document.querySelector('.play-pause-btn');
      playPauseIcon = document.querySelector('.play-pause-btn i');
      volumeSlider = document.querySelector('.volume-slider');
      
      console.log("Bouton play/pause trouvé:", !!playPauseBtn);
      console.log("Icône play/pause trouvée:", !!playPauseIcon);
      
      // Initialiser l'audio
      audio = document.querySelector('audio');
      if (audio) {
        audio.volume = volume;
        audio.autoplay = false;
        audio.preload = "auto";
        
        console.log("🎵 Audio initialisé");
        
        // Configuration des événements de streaming
        setupStreamingEvents();
        
        // ✅ Activer le spinner immédiatement (temps de latence visible)
        isBuffering = true;
        
        // ✅ Délai de latence de 2 secondes avant tentative d'autoplay
        // Pendant ce temps, le spinner tourne et donne un feedback visuel
        setTimeout(() => {
          startAutoPlay();
        }, 2000);
      }
      
      // Événements du lecteur audio
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
      }
      
      if (volumeSlider) {
        volumeSlider.addEventListener('input', handleVolumeChange);
      }
      
      if (playPauseIcon) {
        updateIcon(playPauseIcon, 'play');
      }

      // Configuration du volume slider
      const volumeSliderContainer = document.querySelector('.volume-slider');
      const volumeBtn = document.querySelector('.volume-btn');
      
      if (volumeSliderContainer) {
        volumeSliderContainer.innerHTML = `
        <input type="range" min="0" max="1" step="0.01" value="${volume}" class="volume-input" style="width: 100%; height: 100%; position: absolute; opacity: 0; cursor: pointer; z-index: 2;">
        <div class="volume-fill" style="width: ${volume * 100}%; height: 100%; background-color: #ff7f2a;"></div>
        `;
        
        const volumeInput = volumeSliderContainer.querySelector('.volume-input');
        if (volumeInput) {
          volumeInput.addEventListener('input', handleVolumeChange);
        }
        
        volumeSliderContainer.addEventListener('click', handleVolumeClick);
      }

      if (volumeBtn) {
        volumeBtn.addEventListener('click', toggleMute);
      }

      const equalizer = document.querySelector('.equalizer-container');
      if (equalizer) {
        equalizer.classList.remove('active_equalier');
      }

      // Menu mobile
      const bars = document.querySelector('.bars');
      const menuMobile = document.querySelector('.menu-mobile');
      const logo_bureau = document.getElementById('logo_bureau');
      const menuLinks = document.querySelectorAll('.menu-mobile a');

      if (bars && menuMobile && logo_bureau) {
        menuMobile.style.transition = 'left 0.3s ease-in-out';
        
        let isMenuOpen = false;
        
        const closeMenu = () => {
          menuMobile.style.left = '-255px';
          logo_bureau.style.display = 'block';
          isMenuOpen = false;
        };
        
        const openMenu = () => {
          menuMobile.style.left = '0px';
          logo_bureau.style.display = 'none';
          isMenuOpen = true;
        };
        
        bars.addEventListener('click', () => {
          if (isMenuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        });
        
        menuLinks.forEach(link => {
          link.addEventListener('click', () => {
            closeMenu();
          });
        });
      }
   
      window.addEventListener('scroll', handleScroll);
        
      // Nettoyage lors de la destruction du composant
      return () => {
        window.removeEventListener('scroll', handleScroll);
        removeInteractionListeners();
      };
   });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</svelte:head>

<style>
  /* Navbar */
.navbar {
    background-color: #ff7f2a;
    color: white;
    padding: 7px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    box-sizing: border-box;
    font-size: 16px;
    width: 100%;
    z-index: 1000;
    backdrop-filter: blur(20px); 
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);  
  }
 
  .navbar #logo {
    position: relative;
    text-align: center;
  }
  nav #logo_bureau {
    position: absolute;
    left: 46%;
    transform: translateX(-50%);
    display: none;
    top: 5px;
  }

  nav a:nth-child(4) {
    display: inline-flex;
  }
  
  nav .bars {
    display: none;
    position: absolute;
    right: 15px;
    cursor: pointer;
  }
  nav .bars span {
    display: block;
    width: 43px;
    height: 7px;
    background-color: white;
    margin: 5px 0;
    transition: all 0.3s ease;
    border-radius: 6px;
  }
  nav .bars:hover {
    cursor: pointer;
  }

    .navbar.scrolled {
        padding: 0.5rem 0;
        background: rgba(0, 131, 83, 0.98) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .navbar .menu-desktop{
      display: flex;
       align-items: center;
    }

    .menu-desktop a {
        text-decoration: none;
        color: #fff;
        font-weight: 500;
        font-size: 1.1rem;
        margin-left: 10px;
        padding: 7px 10px;
        border-radius: 25px;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        height: 100%;
        line-height: 1;
    }

    .menu-desktop a:not(:nth-child(4)):before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgb(41, 180, 20), #18630c);
        transition: left 0.3s ease;
        z-index: -1;
        border-radius: 25px;
    }
     .active {
        background: linear-gradient(45deg, rgb(41, 180, 20), #18630c);
        transition: left 0.3s ease;
    }

    .menu-desktop a:hover::before {
        left: 0;
    }

    .menu-desktop a:hover {
        color: white;
        transform: translateY(-2px);
    }

  /* Menu mobile */
  .menu-mobile {
    display: none;
    position: fixed;
    top: 0;
    left: -255px;
    min-width: 250px;
    width: 255px;
    height: 100%;
    background-color: rgba(255, 127, 42, 0.9);
    box-shadow: 0 0 14px rgba(82, 82, 82, 0.577);
    box-sizing: border-box;
    z-index: 9999;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 16px;
  }
  .menu-mobile a {
    display: block;
    margin: 10px 0;
    color: rgb(255, 255, 255);
    text-decoration: none;
    font-size: 16px;
    padding: 0.8rem;
    transition: color 0.3s ease;
    position: relative;
  }
  .menu-mobile a i {
   position: absolute;
   right: 10px;
   font-family: 25px;
   color:#fff;
   top: 50%;
   transform: translateY(-50%);
  }

  main {
    margin-top: 70px !important;
    padding: 0;
    margin-bottom: 0;
  }

@media (max-width: 868px) {
    main {
      margin-top: 80px !important;
    }
    nav {
      display: block;
      height: 80px;
      
      .menu-desktop{
        display: none !important;
      }
   
      .bars {
        display: block;
        cursor: pointer;
        top: 50%;
        transform: translateY(-50%);
      }
      #logo_bureau {
         display: block;
      }
    }
    .menu-mobile {
      display: block;
    }
  }

  /* Player Right Section */
  .player-right {
    display: flex;
    align-items: center;
  }

  .volume-btn {
    background: none;
    border: none;
    color: rgb(38, 38, 38);
    cursor: pointer;
    font-size: 25px;
    margin-right: 10px;
  }

  .volume-slider {
    position: relative;
    width: 100px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    margin-right: 15px;
  }

  .volume-fill {
    height: 100%;
    background-color: #ff7f2a;
    width: 100%;
    transition: width 0.2s ease;
  }

  .volume-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  /* Égaliseur */
  .equalizer-container {
    display: inline-flex !important;
    align-items: center;
    height: 20px;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
    position: absolute;
    right: 160px;
  }

  .active_equalier {
    opacity: 1 !important;
  }

  .equalizer-bars {
    display: flex;
    align-items: flex-end;
    height: 100%;
  }

  .equalizer-bar {
    width: 3px;
    background-color: #ff7f2a;
    margin: 0 1px;
    height: 30%;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
  }

  .equalizer-bar:nth-child(1) {
    animation-name: equalizer1;
    height: 40%;
  }

  .equalizer-bar:nth-child(2) {
    animation-name: equalizer2;
    height: 60%;
    animation-delay: 0.1s;
  }

  .equalizer-bar:nth-child(3) {
    animation-name: equalizer3;
    height: 80%;
    animation-delay: 0.2s;
  }

  .equalizer-bar:nth-child(4) {
    animation-name: equalizer4;
    height: 50%;
    animation-delay: 0.3s;
  }

  @keyframes equalizer1 {
    0% { height: 40%; }
    100% { height: 70%; }
  }

  @keyframes equalizer2 {
    0% { height: 60%; }
    100% { height: 90%; }
  }

  @keyframes equalizer3 {
    0% { height: 80%; }
    100% { height: 50%; }
  }

  @keyframes equalizer4 {
    0% { height: 50%; }
    100% { height: 80%; }
  }
 
  /* Styles pour l'indicateur de chargement */
  .buffer-container {
    position: absolute;
    top: 50%;
    width: 45px;
    transform: translateY(-50%);
  }
  
  .buffer-spinner {
    width: 45px;
    height: 45px;
    border: 4px solid rgba(255, 127, 42, 0.3);
    border-radius: 50%;
    border-top-color: #ff7f2a;
    animation: spin 1s linear infinite;
    top: 50px;
    right: 100px;
  }
  
  .buffer-text {
    position: absolute;
    top: -18px;
    left: -5px;
    font-size: 10px;
    color: #ff7f2a;
    white-space: nowrap;
  }

  /* ✅ Style pour le message "Cliquez pour démarrer" */
  .buffer-text.interaction-needed {
    color: #18630c;
    font-weight: 600;
    animation: pulse 1.5s ease-in-out infinite;
    font-size: 11px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes buffer-progress {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 0%; }
  }

  /* News Ticker */
  .ticker {
        width: 100%;
        margin-top: 100px;
        height: 40px;
        background: #16213e;
        border-top: 3px solid #0f3460;
        border-bottom: 3px solid #e94560;
        overflow: hidden;
        position: relative;
    }

    .ticker-content {
        display: flex;
        align-items: center;
        height: 100%;
        white-space: nowrap;
        animation: scroll 250s linear infinite;
        width: fit-content;
    }

    .ticker:hover .ticker-content {
        animation-play-state: paused;
    }

    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    .news-item {
        display: inline-flex;
        align-items: center;
        color: #eee;
        font-size: 16px;
        font-weight: 500;
        margin-right: 120px;
        cursor: pointer;
        transition: color 0.2s;
        min-width: max-content;
    }

    .news-item:hover {
        color: #fff;
    }

    .category {
        color: #fff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        margin-right: 16px;
        text-transform: uppercase;
    }

    .tech { background: #0f3460; }
    .world { background: #e94560; }
    .science { background: #f39c12; }
    .health { background: #27ae60; }
    .finance { background: #8e44ad; }
    .sport { background: #e67e22; }
    .culture { background: #9b59b6; }

    .time {
        color: #888;
        font-size: 14px;
        margin-left: 12px;
    }

    @media (max-width: 768px) {
        .ticker { 
            height: 40px; 
            margin-top: 80px;
        }
        
        .news-item { 
            font-size: 14px; 
            margin-right: 80px; 
        }
        
        .category { 
            font-size: 10px; 
            padding: 3px 8px; 
        }
    }
</style>

<!-- Navbar -->
<nav id="navbar" class="navbar">
  <a href="/" id="logo_bureau"><img style="border-radius: 10px;" width="190" src="{logo}" alt=""></a>
  <div class="menu-desktop">
    <a class:active={isActiveRoute('/news')} href="/news">Actualités</a>
    <a class:active={isActiveRoute('/podcasts')} href="/podcasts">Podcasts</a>
    <a class="nav-link" target="_blank" href="https://www.mairietreichville.com">Mairie de Treichville</a>
    <a class="logo" href="/" id="logo"><img style="border-radius: 10px;" width="190" src="{logo}" alt=""></a>
    <a class:active={isActiveRoute('/events')} href="/events">Events</a>
    <a class:active={isActive('/programme')} href="/programme">Programmes</a>
    <a class:active={isActive('/notrecite')} href="/notrecite">Actus de la mairie</a>
  </div>
   <div class="bars" id="bars">
    <span></span>
    <span></span>
    <span></span>
  </div>
</nav>

<div class="ticker">
    <div class="ticker-content">
        {#each doubleNews as item}
            <div class="news-item">
                <span class="category {item.class}">{item.category}</span>
                <span>{item.text}</span>
                <span class="time">{item.time}</span>
            </div>
        {/each}
    </div>
</div>

<div class="menu-mobile">
  <a href="/" id="logo"><img style="border-radius: 10px;" width="190" src="{logo}" alt=""></a>
  <a href="/news">Actualités <i class="bi bi-chevron-right"></i></a>
  <a href="/podcasts">Podcasts <i class="bi bi-chevron-right"></i></a>
  <a target="_blank" href="https://www.mairietreichville.com">Mairie de Treichville <i class="bi bi-box-arrow-up-right"></i></a>
  <a href="/events">Events <i class="bi bi-chevron-right"></i></a>
  <a href="/programme">Programme <i class="bi bi-chevron-right"></i></a>
  <a href="/notrecite">Actus de la mairie <i class="bi bi-chevron-right"></i></a>
</div>

<!-- Élément audio (caché) -->
<div style="display:none">
  <h3>{title}</h3>
  <audio
    bind:this={audio}
    {src}
    ontimeupdate={handleTimeUpdate}
    onloadedmetadata={handleLoadedMetadata}
    preload="auto"
  ></audio>
</div>

<!-- Interface du lecteur audio visible -->
<div class="audio-player">
  <div class="player-left">
    <img src="{freq}" alt="Current Song" class="current-song-image">
    <div class="current-song-info">
      <span class="song-title">Radio Treichville</span>
      <!-- svelte-ignore a11y_distracting_elements -->
      <span class="song-artist"><marquee scrollamount="3">Le passé toujours présent</marquee></span>
    </div>
  </div>
  
  <div class="player-center">
    <div class="player-controls">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="play-pause-btn"> <i style="font-size:34px" class="bi bi-play"></i> </button>
    </div>
    
    <!-- ✅ Indicateur de chargement avec message contextuel -->
    {#if isBuffering || waitingForInteraction}
    <div class="buffer-container">
      <div class="buffer-spinner"></div>
      <span class="buffer-text" class:interaction-needed={waitingForInteraction}>
        {#if waitingForInteraction}
          Cliquez pour démarrer
        {:else}
          Chargement...
        {/if}
      </span>
    </div>
    {:else}
    <div class="equalizer-container">
      <div class="equalizer-bars">
        <div class="equalizer-bar"></div>
        <div class="equalizer-bar"></div>
        <div class="equalizer-bar"></div>
        <div class="equalizer-bar"></div>
      </div>
    </div>
    {/if}
    
    <div class="progress-container">
      <span class="time current-time">{formatTime(currentTime)}</span>
    </div>
  </div>
  
  <div class="player-right">
    <button class="volume-btn">
      <i class="bi bi-volume-up-fill"></i>
    </button>
    <div class="volume-slider">
      <div class="volume-fill"></div>
    </div>
  </div>
</div>

<!-- Contenu principal -->
<main style="margin-top:0 !important;">
  <div
    in:fade={{ duration: 300 }}  
    out:fly={{ y: 20, duration: 300 }} 
    key={currentKey} 
  >
    {@render children?.()}
  </div>
</main>

<!-- Footer -->
<Footer/>