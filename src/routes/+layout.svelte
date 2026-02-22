<script>
  import { run } from 'svelte/legacy';

    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition'; // Importer des transitions prédéfinies
    import { page } from '$app/stores'; // Accéder au store de navigation
    import ShareButtons from './shareButtons.svelte';
    import '$lib/styles.css';
    import logo from '$lib/img/logo.svg';
    import freq from '$lib/img/freq.svg';
    import Footer from './footer.svelte';
    import Breadcrumb from './breadcrumb.svelte';
  /**
   * @typedef {Object} Props
   * @property {string} [src] - Pour un streaming
   * @property {string} [title]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { src = "https://oneradioweb.oneradio.ci/streamone", title = "Audio Player", children } = $props();
   
    // Variables pour gérer les transitions
    let currentKey = $state(null);
    let playPauseBtn;
    let playPauseIcon;
    let volumeSlider; // Ajout d'une référence pour le slider de volume
   
    // Variables pour le buffering
    let isBuffering = $state(true);
    let bufferingProgress = 0;
    
    // Fonction pour détecter les changements de page
    run(() => {
          if ($page.url.pathname) {
            currentKey = $page.url.pathname; // Utiliser l'URL comme clé unique pour chaque page
          }
       });

          // Construire l'URL complète
      const fullUrl = $derived(`${$page.url.origin}${$page.url.pathname}`);
      const fullUrl2 = $derived($page.url.href);
      function showUrl() {
        alert(fullUrl);
      }

    function isActive(path) {
        return $page.url.pathname === path;
      }
      
      // Ou pour les routes avec paramètres
      function isActiveRoute(basePath) {
        return $page.url.pathname.startsWith(basePath);
      }


   
    // Variables réactives
    let audio = $state();
    let playing = false;
    let duration = 0;
    let currentTime = $state(0);
    let volume = 1;
   
    // Formatage du temps (conversion de secondes en format mm:ss)
    function formatTime(seconds) {
      if (isNaN(seconds)) return "00:00";
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
   
    // Fonction pour mettre à jour l'icône
    function updateIcon(element, iconType) {
      if (!element) {
        console.error("L'élément d'icône n'est pas disponible");
        return;
      }
      
      // Modification pour utiliser Bootstrap Icons
      if (iconType === 'play') {
        element.className = 'bi bi-play-fill';
      } else if (iconType === 'pause') {
        element.className = 'bi bi-pause-fill';
      }
    }
   
    // Configuration des événements de streaming
    function setupStreamingEvents() {
      if (!audio) return;
      
      // Événement quand la lecture est interrompue pour mise en mémoire tampon
      audio.addEventListener('waiting', () => {
        isBuffering = true;
		document.querySelector('.progress-container').style.opacity = 0; // Cacher le spinner
		document.querySelector('.equalizer-container').style.opacity = 0;
        console.log("Mise en mémoire tampon...");
      });
      
      // Événement quand la lecture peut commencer/reprendre
      audio.addEventListener('canplay', () => {
        isBuffering = false;
		
        console.log("Prêt à jouer");
      });
      
       // Événement quand la lecture commence effectivement
        audio.addEventListener('playing', () => {
        isBuffering = false;
        console.log("Lecture en cours");
		    document.querySelector('.equalizer-container').style.opacity = 1;
		    document.querySelector('.progress-container').style.opacity = 1; // Cacher le spinner
      });
      
      // Événement de progression du chargement (pour les parties mises en cache)
      audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const duration = audio.duration;
          
          // Pour un streaming, la duration peut être Infinity, donc on utilise une approche différente
          if (isFinite(duration) && duration > 0) {
            bufferingProgress = (bufferedEnd / duration) * 100;
          } else {
            // Pour un flux continu, montrer une indication que le buffer avance
            bufferingProgress = (bufferingProgress + 5) % 100;
          }
          console.log("Progression buffer:", bufferingProgress);
        }
      });
    }
    
    // Fonction pour afficher/masquer l'égaliseur
    function toggleEqualizer(isPlaying) {
      const equalizer = document.querySelector('.equalizer-container');
      console.log("toggleEqualizer appelé, état:", isPlaying);
      console.log("Élément égaliseur trouvé:", !!equalizer);
      
      if (!equalizer) {
        console.error("Élément equalizer non trouvé");
        return;
      }
      
      // Ajouter ou supprimer la classe 'active' selon l'état de lecture
      if (isPlaying) {
        equalizer.classList.add('active_equalier');
        console.log("Classe 'active' ajoutée à l'égaliseur");
		  equalizer.style.opacity = 1;
      } else {
        equalizer.classList.remove('active_equalier');
        console.log("Classe 'active' supprimée de l'égaliseur");
		  equalizer.style.opacity = 0;
      }
    }

    // Fonction togglePlay modifiée pour recharger la source après pause
    function togglePlay() {
      console.log("Toggle Play appelé, état actuel:", playing);
      
      if (!audio) {
          console.error("L'élément audio n'est pas initialisé");
          return;
      }
      
      if (playing) {
          audio.pause();
          // On garde l'état actuel (en pause)
      } else {
          // Indiquer que nous sommes en chargement
          isBuffering = true;
          
          // Recharger la source avant de jouer
          const currentSrc = audio.src;
          audio.src = currentSrc;
          audio.load();
          
          audio.play().catch(error => {
              console.error("Erreur lors de la lecture:", error);
              isBuffering = false; // Arrêter l'indication de chargement en cas d'erreur
          });
      }
      
      playing = !playing;
      
      // Mettre à jour l'icône
      updateIcon(playPauseIcon, playing ? 'pause' : 'play');
      
      // Activer/désactiver l'égaliseur uniquement si nous ne sommes pas en train de charger
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
      
      // Calculate new volume based on click position
      let newVolume = clickPosition / sliderWidth;
      // Ensure volume is between 0 and 1
      newVolume = Math.max(0, Math.min(1, newVolume));
      
      // Update the volume
      volume = newVolume;
      audio.volume = volume;
      
      // Update the visual fill
      const volumeFill = slider.querySelector('.volume-fill');
      if (volumeFill) {
        volumeFill.style.width = `${volume * 100}%`;
      }
      
      // Also update the range input value for consistency
      const volumeInput = slider.querySelector('.volume-input');
      if (volumeInput) {
        volumeInput.value = volume;
      }
      
      // Update the volume icon
      updateVolumeIcon(volume > 0 ? 'unmute' : 'mute');
      
      console.log("Volume clicked and changed to:", volume);
    }

    function handleVolumeChange(e) {
      if (audio && e && e.target) {
        volume = parseFloat(e.target.value);
        audio.volume = volume;
        
        // Update the visual fill of the volume slider
        const volumeFill = document.querySelector('.volume-fill');
        if (volumeFill) {
          volumeFill.style.width = `${volume * 100}%`;
        }
        
        // Update the volume icon
        updateVolumeIcon(volume > 0 ? 'unmute' : 'mute');
        
        console.log("Volume changed to:", volume);
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
        // Store the current volume before muting
        audio.dataset.previousVolume = audio.volume;
        volume = 0;
        audio.volume = 0;
        updateVolumeIcon('mute');
      } else {
        // Restore previous volume or default to 1
        volume = parseFloat(audio.dataset.previousVolume || 1);
        audio.volume = volume;
        updateVolumeIcon('unmute');
      }
      
      // Update the visual fill
      const volumeFill = document.querySelector('.volume-fill');
      if (volumeFill) {
        volumeFill.style.width = `${volume * 100}%`;
      }
    }

    // Add this function to update the volume icon based on state
    function updateVolumeIcon(state) {
      const volumeIcon = document.querySelector('.volume-btn i');
      if (!volumeIcon) return;
      
      if (state === 'mute') {
        volumeIcon.className = 'bi bi-volume-mute-fill';
      } else {
        volumeIcon.className = 'bi bi-volume-up-fill';
      }
    }
    
    // Fonction pour démarrer la lecture automatiquement
    function startAutoPlay() {
      if (!audio) return;
      
      console.log("Tentative de lecture automatique...");
      isBuffering = true;
      
      // Pour un streaming, charger une première fois
      audio.load();
      
      // Tenter de lire automatiquement
      audio.play().then(() => {
        console.log("Lecture automatique réussie");
        playing = true;
        updateIcon(playPauseIcon, 'pause');
        toggleEqualizer(true);
      }).catch(error => {
        console.warn("Lecture automatique bloquée:", error);
        console.log("L'utilisateur devra cliquer pour démarrer la lecture");
        isBuffering = false;
        playing = false;
        updateIcon(playPauseIcon, 'play');
      });
    }

      // Variables réactives
        let isScrolled = false;
        let isBurgerActive = false;
        let isLogoHovered = false;
        
        // Gestion du scroll
        function handleScroll() {
          isScrolled = window.scrollY > 50;
        }
        
        // Gestion du menu burger
        function toggleBurger() {
          isBurgerActive = !isBurgerActive;
        }
        
        // Fermer le menu burger
        function closeBurger() {
          isBurgerActive = false;
        }
        
        // Scroll fluide vers les sections
        function smoothScroll(event, targetId) {
          event.preventDefault();
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
          closeBurger(); // Fermer le menu mobile après clic
        }
        
        // Gestion du survol du logo
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

	// Doubler les nouvelles pour assurer la continuité
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
      volumeSlider = document.querySelector('.volume-slider'); // Ajout de la référence au slider de volume
      
      console.log("Bouton play/pause trouvé:", !!playPauseBtn);
      console.log("Icône play/pause trouvée:", !!playPauseIcon);
      console.log("Slider de volume trouvé:", !!volumeSlider);
      
      // Initialiser l'audio et définir le volume initial
      audio = document.querySelector('audio');
      if (audio) {
        audio.volume = volume;
        audio.autoplay = true; // Ajouter l'attribut autoplay
        console.log("Volume initial défini à:", volume);
        console.log("Autoplay défini à:", audio.autoplay);
        
        // Configuration des événements de streaming
        setupStreamingEvents();
        
        // Pour un streaming, définir l'attribut preload sur "auto" peut aider
        audio.preload = "auto";
        
        // Démarrer la lecture automatique
        setTimeout(startAutoPlay, 4000); // Délai court pour s'assurer que tout est chargé
      }
      
      // Événements du lecteur audio
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
      } else {
        console.error("Le bouton play/pause n'a pas été trouvé");
      }
      
      // Ajouter l'écouteur d'événement pour le changement de volume
      if (volumeSlider) {
        volumeSlider.addEventListener('input', handleVolumeChange);
      } else {
        console.error("Le slider de volume n'a pas été trouvé");
      }
      
      // Initialiser l'icône
      if (playPauseIcon) {
        updateIcon(playPauseIcon, 'play');
      }

      // Add volume slider functionality
      const volumeSliderContainer = document.querySelector('.volume-slider');
      const volumeBtn = document.querySelector('.volume-btn');
      
      if (volumeSliderContainer) {
        // Convert the div to a functional volume control
        volumeSliderContainer.innerHTML = `
        <input type="range" min="0" max="1" step="0.01" value="${volume}" class="volume-input" style="width: 100%; height: 100%; position: absolute; opacity: 0; cursor: pointer; z-index: 2;">
        <div class="volume-fill" style="width: ${volume * 100}%; height: 100%; background-color: #ff7f2a;"></div>
        `;
        
        // Add event listeners for both input drag and direct click
        const volumeInput = volumeSliderContainer.querySelector('.volume-input');
        if (volumeInput) {
          volumeInput.addEventListener('input', handleVolumeChange);
        }
        
        // Add click handler to the volume slider container
        volumeSliderContainer.addEventListener('click', handleVolumeClick);
      }

      if (volumeBtn) {
        volumeBtn.addEventListener('click', toggleMute);
      }

      const equalizer = document.querySelector('.equalizer-container');
      if (equalizer) {
        console.log("Égaliseur trouvé dans le DOM");
        // L'égaliseur doit être caché initialement
        equalizer.classList.remove('active_equalier');
      } else {
        console.error("Égaliseur non trouvé dans le DOM");
      }

      //Bascule du menu;
      const bars = document.querySelector('.bars');
      const menuMobile = document.querySelector('.menu-mobile');
      const logo_bureau = document.getElementById('logo_bureau');
      const menuLinks = document.querySelectorAll('.menu-mobile a');

      // Check if elements exist before adding event listeners
      if (bars && menuMobile && logo_bureau) {
        // Set initial styles for smooth transitions
        menuMobile.style.transition = 'left 0.3s ease-in-out';
      
        
        // Default state
        let isMenuOpen = false;
        
        // Function to close the menu
        const closeMenu = () => {
          menuMobile.style.left = '-255px';
          logo_bureau.style.display = 'block';
          isMenuOpen = false;
        };
        
        // Function to open the menu
        const openMenu = () => {
          menuMobile.style.left = '0px';
          logo_bureau.style.display = 'none';
          isMenuOpen = true;
        };
        
        // Toggle menu on bars click
        bars.addEventListener('click', () => {
          if (isMenuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        });
        
        // Add event listeners to all links in the mobile menu
        menuLinks.forEach(link => {
          link.addEventListener('click', () => {
            closeMenu();
          });
        });
      } else {
        console.error("Un ou plusieurs éléments du menu n'ont pas été trouvés");
      }
   
    // Ajouter l'écouteur de scroll
        window.addEventListener('scroll', handleScroll);
        
        // Nettoyage lors de la destruction du composant
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
   });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</svelte:head>
<!-- <svelte:window bind:scrollY />  -->

<style>
  /* Navbar */
  /* Menu version 2*/
/* Menu Principal */
.navbar {
    background-color: #ff2a2a;
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

  /* .bars.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

  .bars.active span:nth-child(2) {
      opacity: 0;
  }

  .bars.active span:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
  } */


    .navbar.scrolled {
        padding: 0.5rem 0;
        background: rgba(8, 10, 9, 0.98) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .navbar .menu-desktop{
      display: flex;
       align-items: center;
    }


    
        /* Navigation */
      
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
            height: 100%; /* Assure le centrage vertical */
            line-height: 1;
        }

        .menu-desktop a:not(:nth-child(4)):before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
              background: linear-gradient(45deg, rgb(0, 0, 0), #3a0404);
            transition: left 0.3s ease;
            z-index: -1;
            border-radius: 25px;
        }
         .active {
           
            background: linear-gradient(45deg, rgb(0, 0, 0), #3a0404);
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
    background-color: rgba(255, 0, 0, 0.9);
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

  /* Contenu principal */
  main {
    margin-top: 70px !important; /* Espace pour la navbar fixe */
    padding: 0;
    margin-bottom: 0;
  }
  
   

@media (max-width: 868px) {
    main {
      margin-top: 80px !important; /* Espace pour la navbar fixe */
   
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
    /* overflow: hidden; */
  }

  .volume-fill {
    height: 100%;
    background-color: #ff2a2a;
    width: 100%; /* This will be set dynamically based on volume */
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
    display: inline-flex !important; /* Forcer l'affichage pour le débogage */
    align-items: center;
    height: 20px;
    margin-left: 10px;
    opacity: 0; /* Caché par défaut */
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
    background-color: #ff2a2a;
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
    border: 4px solid rgba(255, 42, 42, 0.3);
    border-radius: 50%;
    border-top-color: #ff2a2a;
    animation: spin 1s linear infinite;
	/* position: absolute; */
	top: 50px;
	right: 100px;
  }
  
  
  .buffer-text {
    position: absolute;
    top: -18px;
    left: -5px;
    font-size: 10px;
    color: #ff2a2a;
    white-space: nowrap;
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

  /* News */
  .ticker {
		width: 100%;
    margin-top: 100px;
		height: 15px;
		background: #000000;
		border-top: 3px solid #000000;
		border-bottom: 3px solid #ff2222;
		overflow: hidden;
		position: relative;
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
			height: 7px; 
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
  <a href="/" id="logo_bureau"><img  style="border-radius: 10px;" width="190" src="{logo}" alt=""></a>
  <div class="menu-desktop">
    <a class:active={isActiveRoute('/news')} target="_blank" href="https://www.youtube.com/@oneradiocotedivoire6837"><i style="margin-right: 2px;" class="bi bi-play-btn-fill"></i> &nbsp; One TV</a>
    <a class:active={isActiveRoute('/podcasts')}  target="_blank" href="https://boutique.oneradio.ci/">Shop</a>
       <a class:active={isActiveRoute('/webradio')}  href="/webradio">web Radios</a>

    <a class="logo" href="/" id="logo"><img style="border-radius: 10px;" width="190" src="{logo}" alt=""></a>
    <a class:active={isActiveRoute('/events')} href="/events">Events</a>
    <a class:active={isActiveRoute('/programme')} href="/programme">Nos Emissions</a>
    <a class:active={isActiveRoute('/parieur')} href="/parieur">Super Parieur</a>

  </div>
   <div class="bars" id="bars">
    <span></span>
    <span></span>
    <span></span>
  </div>
</nav>
<div class="ticker">
	
</div>
  <div class="menu-mobile">
  <a href="/" id="logo"><img  style="border-radius: 10px;"width="190" src="{logo}" alt=""></a>
  <a href="https://www.youtube.com/@oneradiocotedivoire6837" target="_blank"><i class="bi bi-play-btn-fill"></i> One TV <i class="bi bi-chevron-right"></i></a>
  <a href="https://boutique.oneradio.ci/" target="_blank"><i class="bi bi-shop"></i> Shop <i class="bi bi-chevron-right"></i></a>
  <a href="/webradio"><i class="bi bi-broadcast"></i> Web Radios <i class="bi bi-chevron-right"></i></a>
  <a href="/events"><i class="bi bi-calendar-event"></i> Events <i class="bi bi-chevron-right"></i></a>
  <a href="/programme"><i class="bi bi-mic-fill"></i> Nos Emissions <i class="bi bi-chevron-right"></i></a>
  <a href="/parieur"><i class="bi bi-trophy-fill"></i> Super Parieur <i class="bi bi-chevron-right"></i></a>
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
    autoplay
  ></audio>
</div>

<!-- Interface du lecteur audio visible -->
<div class="audio-player">
  <div class="player-left">
    <img src="{freq}" alt="Current Song" class="current-song-image">
    <div class="current-song-info">
      <span class="song-title">One Radio</span>
      <!-- svelte-ignore a11y_distracting_elements -->
      <span class="song-artist"><marquee scrollamount="3">One People, One Radio</marquee></span>
    </div>
  </div>
  
  <div class="player-center">
    <div class="player-controls">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="play-pause-btn"> <i style="font-size:34px" class="bi bi-play"></i> </button>
    </div>
    
    <!-- Indicateur de chargement ou égaliseur -->
    {#if isBuffering}
    <div class="buffer-container">
      <div class="buffer-spinner"></div>
      <span class="buffer-text">Chargement...</span>
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

<!-- Fil d'Ariane -->
<Breadcrumb />

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