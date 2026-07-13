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
    import Breadcrumb from './breadcrumb.svelte';

  /**
   * @typedef {Object} Props
   * @property {string} [src]
   * @property {string} [title]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { src = "https://oneradioweb.oneradio.ci/streamone", title = "Audio Player", children } = $props();

  // Variables pour gérer les transitions
  let currentKey = $state(null);
  let playPauseBtn;
  let playPauseIcon;
  let volumeSlider;

  // Variables pour le buffering
  let isBuffering = $state(true);
  let bufferingProgress = 0;

  // Fonction pour détecter les changements de page
  run(() => {
    if ($page.url.pathname) {
      currentKey = $page.url.pathname;
    }
  });

  const fullUrl = $derived(`${$page.url.origin}${$page.url.pathname}`);
  const fullUrl2 = $derived($page.url.href);

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

  // ── Now Playing (nowplaying.txt) ────────────────────────
  let nowPlayingCurrent = $state('');
  let nowPlayingNext = $state('');

  let nowPlayingMarqueeText = $derived(
    nowPlayingCurrent || 'One People, One Radio&nbsp;&nbsp;•&nbsp;&nbsp;oneradio.ci'
  );

async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/nowplaying');
      if (!res.ok) return;
      const data = await res.json();
      nowPlayingCurrent = data.current;
      nowPlayingNext = data.next;
    } catch (_) {}
  }

  // Formatage du temps
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Mise à jour de l'icône play/pause
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

  // Configuration des événements de streaming
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
      console.log("Lecture en cours");
      setTimeout(() => {
        const equalizerContainer = document.querySelector('.equalizer-container');
        const progressContainer = document.querySelector('.progress-container');
        if (equalizerContainer) equalizerContainer.style.opacity = 1;
        if (progressContainer) progressContainer.style.opacity = 1;
      }, 50);
    });

    audio.addEventListener('progress', () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const dur = audio.duration;
        if (isFinite(dur) && dur > 0) {
          bufferingProgress = (bufferedEnd / dur) * 100;
        } else {
          bufferingProgress = (bufferingProgress + 5) % 100;
        }
        console.log("Progression buffer:", bufferingProgress);
      }
    });
  }

  // Afficher/masquer l'égaliseur avec délai pour laisser Svelte re-rendre le DOM
  function toggleEqualizer(isPlaying) {
    setTimeout(() => {
      const equalizer = document.querySelector('.equalizer-container');
      if (!equalizer) return;

      if (isPlaying) {
        equalizer.classList.add('active_equalier');
        equalizer.style.opacity = 1;
      } else {
        equalizer.classList.remove('active_equalier');
        equalizer.style.opacity = 0;
      }
    }, 50);
  }

  // Fade-in du volume après démutage
  function fadeInVolume(targetVolume) {
    const steps = 30;
    const interval = 1500 / steps; // 1.5 secondes de fade
    let currentStep = 0;

    audio.volume = 0;

    const fadeIn = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(targetVolume, (currentStep / steps) * targetVolume);

      // Mettre à jour le slider visuellement
      const volumeFill = document.querySelector('.volume-fill');
      if (volumeFill) {
        volumeFill.style.width = `${audio.volume * 100}%`;
      }
      const volumeInput = document.querySelector('.volume-input');
      if (volumeInput) {
        volumeInput.value = audio.volume;
      }

      if (currentStep >= steps) {
        clearInterval(fadeIn);
        volume = targetVolume;
        console.log("Démutage terminé, volume final:", audio.volume);
      }
    }, interval);
  }

  // Autoplay avec stratégie muted puis démutage automatique
  function startAutoPlay() {
    if (!audio) return;

    console.log("Tentative de lecture automatique...");
    isBuffering = true;

    audio.load();

    // Stratégie 1 : lecture normale
    audio.play().then(() => {
      console.log("Lecture automatique réussie (non muted)");
      playing = true;
      updateIcon(playPauseIcon, 'pause');
      toggleEqualizer(true);

    }).catch(() => {
      // Stratégie 2 : muted autoplay (toujours autorisé par les navigateurs)
      console.log("Tentative muted autoplay...");
      audio.muted = true;

      audio.play().then(() => {
        console.log("Muted autoplay réussi");
        playing = true;
        updateIcon(playPauseIcon, 'pause');
        toggleEqualizer(true);

        // Démutage automatique avec fade-in après 2 secondes
        setTimeout(() => {
          console.log("Démutage automatique...");
          audio.muted = false;
          fadeInVolume(volume); // Montée progressive du volume sur 1.5s
        }, 2000);

      }).catch(error => {
        console.warn("Autoplay totalement bloqué:", error);
        isBuffering = false;
        playing = false;
        updateIcon(playPauseIcon, 'play');
      });
    });
  }

  // Toggle play/pause avec rechargement du stream
  function togglePlay() {
    console.log("Toggle Play appelé, état actuel:", playing);

    if (!audio) {
      console.error("L'élément audio n'est pas initialisé");
      return;
    }

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
    audio.muted = false;

    const volumeFill = slider.querySelector('.volume-fill');
    if (volumeFill) {
      volumeFill.style.width = `${volume * 100}%`;
    }
    const volumeInput = slider.querySelector('.volume-input');
    if (volumeInput) {
      volumeInput.value = volume;
    }

    updateVolumeIcon(volume > 0 ? 'unmute' : 'mute');
    console.log("Volume clicked:", volume);
  }

  function handleVolumeChange(e) {
    if (audio && e && e.target) {
      volume = parseFloat(e.target.value);
      audio.volume = volume;
      audio.muted = false;

      const volumeFill = document.querySelector('.volume-fill');
      if (volumeFill) {
        volumeFill.style.width = `${volume * 100}%`;
      }

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

    if (audio.volume > 0 && !audio.muted) {
      audio.dataset.previousVolume = audio.volume;
      volume = 0;
      audio.volume = 0;
      updateVolumeIcon('mute');
    } else {
      audio.muted = false;
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

  // Navbar
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
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeBurger();
  }

  function handleLogoMouseEnter() {
    isLogoHovered = true;
  }

  function handleLogoMouseLeave() {
    isLogoHovered = false;
  }

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
    console.log("Slider de volume trouvé:", !!volumeSlider);

    // Initialiser l'audio
    audio = document.querySelector('audio');
    if (audio) {
      audio.volume = volume;
      audio.autoplay = true;
      console.log("Volume initial défini à:", volume);

      setupStreamingEvents();
      audio.preload = "auto";
      audio.load();

      // Démarrer dès que le flux est prêt
      audio.addEventListener('canplay', function onCanPlay() {
        audio.removeEventListener('canplay', onCanPlay);
        startAutoPlay();
      }, { once: true });
    }

    // Bouton play/pause
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlay);
    } else {
      console.error("Le bouton play/pause n'a pas été trouvé");
    }

    // Slider de volume
    if (volumeSlider) {
      volumeSlider.addEventListener('input', handleVolumeChange);
    } else {
      console.error("Le slider de volume n'a pas été trouvé");
    }

    // Initialiser l'icône play
    if (playPauseIcon) {
      updateIcon(playPauseIcon, 'play');
    }

    // Volume slider interactif
    const volumeSliderContainer = document.querySelector('.volume-slider');
    const volumeBtn = document.querySelector('.volume-btn');

    if (volumeSliderContainer) {
      volumeSliderContainer.innerHTML = `
        <input type="range" min="0" max="1" step="0.01" value="${volume}" class="volume-input" style="width: 100%; height: 100%; position: absolute; opacity: 0; cursor: pointer; z-index: 2;">
        <div class="volume-fill" style="width: ${volume * 100}%; height: 100%; background-color: #ff2a2a;"></div>
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
    } else {
      console.error("Un ou plusieurs éléments du menu n'ont pas été trouvés");
    }

    window.addEventListener('scroll', handleScroll);

    // ── Notifications publicitaires ──────────────────────────────────────
    const PUB_API      = 'https://adminradio.oneradio.ci/radio_one/publicites.php';
    const PUB_IMG_BASE = 'https://adminradio.oneradio.ci/pub/';
    let appEnArrierePlan = false;

    document.addEventListener('pause',  () => { appEnArrierePlan = true;  }, false);
    document.addEventListener('resume', () => { appEnArrierePlan = false; }, false);

    function pubImgUrl(filename) {
      if (!filename) return '';
      return filename.startsWith('http') ? filename : PUB_IMG_BASE + filename;
    }

    function getPubsVues() {
      try { return JSON.parse(localStorage.getItem('pubs_vues') || '{}'); }
      catch(e) { return {}; }
    }

    function savePubsVues(data) {
      localStorage.setItem('pubs_vues', JSON.stringify(data));
    }

    function peutAfficherPub(pub) {
      const vues  = getPubsVues();
      const entry = vues[pub.id];
      const nb    = (pub.nb_affichages  != null) ? pub.nb_affichages  : 0;
      const inter = (pub.intervalle_min != null) ? pub.intervalle_min : 0;
      if (!entry) return true;
      if (nb !== 0 && entry.count >= nb) return false;
      if (inter === 0) return true;
      const msEcoulees = Date.now() - (entry.lastShown || 0);
      return msEcoulees >= inter * 60 * 1000;
    }

    function marquerPubVue(pub) {
      const vues  = getPubsVues();
      const entry = vues[pub.id] || { count: 0, lastShown: 0 };
      entry.count    += 1;
      entry.lastShown = Date.now();
      vues[pub.id]    = entry;
      savePubsVues(vues);
    }

    // ── File d'attente ───────────────────────────────────────────────────
    let pubQueue     = [];
    let pubEnCours   = false;
    let pubTimerAuto = null;
    const PUB_DUREE_MS = 10000;

    const pubOverlay   = document.getElementById('pub-overlay');
    const pubImg       = document.getElementById('pub-img');
    const pubTitre     = document.getElementById('pub-titre');
    const pubMessage   = document.getElementById('pub-message');
    const pubCta       = document.getElementById('pub-cta');
    const pubClose     = document.getElementById('pub-close');
    const pubTimerFill = document.getElementById('pub-timer-fill');

    function fermerPub() {
      clearTimeout(pubTimerAuto);
      pubOverlay.hidden = true;
      pubEnCours = false;
      if (pubQueue.length > 0) {
        setTimeout(afficherProchainesPub, 12000);
      }
    }

    function afficherPub(pub) {
      pubEnCours = true;
      marquerPubVue(pub);
      if (navigator.vibrate) navigator.vibrate([0, 200, 100, 200]);

      pubImg.src           = pub._localImgUri || pubImgUrl(pub.image);
      pubImg.style.display = pub.image ? 'block' : 'none';
      pubTitre.textContent   = pub.titre;
      pubMessage.textContent = pub.message;

      if (pub.url) {
        pubCta.style.display = 'block';
        pubCta.onclick = (e) => {
          e.preventDefault();
          fermerPub();
          if (typeof cordova !== 'undefined' && cordova.InAppBrowser) {
            cordova.InAppBrowser.open(pub.url, '_blank', 'location=yes,closebuttoncaption=Fermer,toolbar=yes');
          } else {
            window.open(pub.url, '_blank');
          }
        };
      } else {
        pubCta.style.display = 'none';
      }

      pubTimerFill.style.transition = 'none';
      pubTimerFill.style.transform  = 'scaleX(1)';
      pubOverlay.hidden = false;

      requestAnimationFrame(() => {
        pubTimerFill.style.transition = `transform ${PUB_DUREE_MS / 1000}s linear`;
        pubTimerFill.style.transform  = 'scaleX(0)';
      });

      pubTimerAuto = setTimeout(fermerPub, PUB_DUREE_MS);
    }

    function afficherProchainesPub() {
      if (pubEnCours || pubQueue.length === 0) return;
      afficherPub(pubQueue.shift());
    }

    pubClose.addEventListener('click', fermerPub);
    pubOverlay.addEventListener('click', (e) => {
      if (e.target === pubOverlay) fermerPub();
    });

    function cacherImagePourNotif(imgUrl, id, callback) {
      // Fallback web : pas de cache local Cordova disponible
      callback(null);
    }

    function planifierPubs(pubs) {
      pubs.forEach((pub) => {
        if (!peutAfficherPub(pub)) return;
        if (!appEnArrierePlan) pubQueue.push(pub);

        cacherImagePourNotif(pubImgUrl(pub.image), 'pub_' + pub.id, (localUri) => {
          if (localUri) pub._localImgUri = localUri;

          if (typeof cordova !== 'undefined' && cordova.plugins?.notification) {
            const notifOptions = {
              id               : 200 + pub.id,
              androidChannelId : 'oneradio_pubs',
              title            : pub.titre,
              text             : pub.message,
              androidSmallIcon : 'res://ic_launcher',
              androidLargeIcon : localUri || 'res://ic_launcher',
              sound            : 'default',
              data             : { url: pub.url }
            };
            if (localUri) notifOptions.attachments = [localUri];
            cordova.plugins.notification.local.schedule(notifOptions);
          }
        });
      });

      if (pubQueue.length > 0 && !pubEnCours) {
        setTimeout(afficherProchainesPub, 5000);
      }
    }

    async function chargerPubs() {
      try {
        const res  = await fetch(PUB_API);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          planifierPubs(json.data);
        }
      } catch(e) {
        console.warn('Pubs fetch error:', e);
      }
    }

    // Reset quotidien : efface le compteur de vues chaque nouveau jour
    const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
    const lastReset = parseInt(localStorage.getItem('pubs_vues_reset') || '0', 10);
    if (lastReset < todayMidnight.getTime()) {
      localStorage.removeItem('pubs_vues');
      localStorage.setItem('pubs_vues_reset', String(todayMidnight.getTime()));
    }

    chargerPubs();
    setInterval(chargerPubs, 5 * 60 * 1000);
    // ────────────────────────────────────────────────────────────────────

    // ── Now Playing : fetch immédiat + refresh toutes les 15 secondes ───
    fetchNowPlaying();
    const nowPlayingInterval = setInterval(fetchNowPlaying, 15 * 1000);

    // ── Notifications de changement de programme ──────────────────────────
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // ────────────────────────────────────────────────────────────────────

    // ── GSAP Player Animations ──────────────────────────────────────────
    (async () => {
    try {
      const { gsap } = await import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm');
      const player = document.querySelector('.audio-player');
      if (player && gsap) {

        // 1. Entrance
        gsap.from(player, { y: 90, opacity: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.2 });

        // 2. Float doux en boucle
        gsap.to(player, { y: -5, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // 3. Glow pulsé
        gsap.to(player, {
          boxShadow: '0 16px 48px rgba(255,25,25,0.32), 0 4px 16px rgba(0,0,0,0.14)',
          duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut'
        });

        // 5. Bouton play : pulse idle + burst au clic
        const playBtn = player.querySelector('.play-pause-btn');
        if (playBtn) {
          gsap.to(playBtn, { scale: 1.07, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          playBtn.addEventListener('click', () => {
            gsap.timeline()
              .to(playBtn, { scale: 0.88, duration: 0.08, ease: 'power3.in' })
              .to(playBtn, { scale: 1.2,  duration: 0.22, ease: 'back.out(3)' })
              .to(playBtn, { scale: 1,    duration: 0.18, ease: 'power2.out' });
          }, true);
        }

        // 6. Image pochette : spin au hover
        const songImg = player.querySelector('.current-song-image');
        let imgSpin;
        if (songImg) {
          player.addEventListener('mouseenter', () => {
            imgSpin = gsap.to(songImg, { rotation: 360, duration: 4, ease: 'linear', repeat: -1 });
          });
          player.addEventListener('mouseleave', () => {
            imgSpin?.pause();
            gsap.to(songImg, { rotation: 0, duration: 0.4, ease: 'power2.out' });
            imgSpin = null;
          });
        }

        // 7. On-air dot : GSAP glow pulse
        const dot = player.querySelector('.on-air-dot');
        if (dot) {
          gsap.to(dot, { scale: 1.7, opacity: 0.2, duration: 0.75, yoyo: true, repeat: -1, ease: 'power2.inOut' });
        }

        // 8. Barres égaliseur : GSAP aléatoire
        function animBar(bar) {
          gsap.to(bar, {
            scaleY: 0.15 + Math.random() * 0.85,
            duration: 0.12 + Math.random() * 0.22,
            ease: 'power1.inOut',
            transformOrigin: 'bottom center',
            onComplete: () => animBar(bar)
          });
        }
        player.querySelectorAll('.equalizer-bar').forEach(b => animBar(b));
      }
    } catch(e) { console.warn('GSAP init error:', e); }
    })();
    // ────────────────────────────────────────────────────────────────────

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(nowPlayingInterval);
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

  .nav-phone {
    display: flex;
    align-items: center;
    gap: 5px;
    position: absolute;
    left: 20px;
    background: rgba(255, 255, 255, 1);
    padding: 5px 10px;
    border-radius: 20px;
  }

  nav #logo_bureau {
    position: absolute;
    left: 46%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: none;
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
    background: rgba(8, 10, 9, 0.98) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .navbar .menu-desktop {
    display: flex;
    align-items: center;
  }

  .menu-desktop a {
    text-decoration: none;
    color: #fff;
    font-weight: 500;
    font-size: 1rem;
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
    color: #fff;
    top: 50%;
    transform: translateY(-50%);
  }

  /* Contenu principal */
  main {
    margin-top: 0;
    padding: 0;
    margin-bottom: 0;
  }

  main.is-home {
    margin-top: 0;
  }

  @media (max-width: 868px) {
    nav {
      display: block;
      height: 80px;
    }
    nav .menu-desktop {
      display: none !important;
    }
    nav .bars {
      display: block;
      cursor: pointer;
      top: 50%;
      transform: translateY(-50%);
    }
    nav #logo_bureau {
      display: block;
    }
    .menu-mobile {
      display: block;
    }
    .nav-phone {
      display: none;
    }
  }

  /* Player */
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
    background-color: #ff2a2a;
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

  /* Égaliseur jjjj*/
  .equalizer-container {
    display: inline-flex !important;
    align-items: center;
    height: 20px;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
    position: absolute;
    right: 60px;
  }
  .active_equalier { opacity: 1 !important; }

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
  .equalizer-bar:nth-child(1) { animation-name: equalizer1; height: 40%; }
  .equalizer-bar:nth-child(2) { animation-name: equalizer2; height: 60%; animation-delay: 0.1s; }
  .equalizer-bar:nth-child(3) { animation-name: equalizer3; height: 80%; animation-delay: 0.2s; }
  .equalizer-bar:nth-child(4) { animation-name: equalizer4; height: 50%; animation-delay: 0.3s; }

  @keyframes equalizer1 { 0% { height: 40%; } 100% { height: 70%; } }
  @keyframes equalizer2 { 0% { height: 60%; } 100% { height: 90%; } }
  @keyframes equalizer3 { 0% { height: 80%; } 100% { height: 50%; } }
  @keyframes equalizer4 { 0% { height: 50%; } 100% { height: 80%; } }

  /* Audio Player */
  .audio-player {
    position: fixed;
    bottom: 1.2rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 40%;
    max-width: 64rem;
    height: 4rem;
    background-color: rgba(255, 255, 255, 0.92) !important;
    backdrop-filter: blur(18px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-radius: 0.75rem;
    padding: 0.5rem;
    border: 1px solid rgba(255, 25, 25, 0.18);
    z-index: 50;
    display: flex;
    align-items: center;
    overflow: visible;
    transition: border-color 0.3s ease;
  }

  .audio-player:hover {
    border-color: rgba(255, 25, 25, 0.35);
  }

  @media (min-width: 768px) {
    .audio-player { height: 5rem; }
  }
  @media (max-width: 1126px) {
    .audio-player { height: 5rem; width: 60%; }
  }
  @media (max-width: 767px) {
    .audio-player { height: 7rem; width: 80%; }
  }
  @media (max-width: 567px) {
    .audio-player { height: 5rem; width: 95%; }
  }

  .player-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 33.333333%;
  }

  .current-song-image {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 0.25rem;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .audio-player:hover .current-song-image {
    transform: scale(1.05);
  }

  .current-song-info {
    display: flex;
    flex-direction: column;
  }

  .song-next {
    font-size: 0.7rem;
    color: #ff2a2a;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

.player-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    position:relative;
    padding: 0 1rem;
  }

  .player-controls {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .play-pause-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 9999px;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(196, 118, 1, 0.3);
  }

  .play-pause-btn:hover {
    transform: scale(1.1);
    background-color: var(--primary-dark);
    box-shadow: 0 4px 12px rgb(180, 87, 0);
  }

  .progress-container {
    display: flex;
    align-items: center;
    margin-top: 0.25rem;
    position: absolute;
    opacity: 0;
    right:20px
  }

  .time {
    font-size: 1.5rem;
    color: var(--muted-dark);
    transition: color 0.3s ease;
  }

  .audio-player:hover .time {
    color: var(--foreground);
  }

  .player-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 20%;
    justify-content: flex-end;
  }

  .volume-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
  }

  .volume-btn:hover {
    color: var(--primary);
  }

  .volume-slider {
    width: 5rem;
    height: 0.25rem;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
    display: none;
    cursor: pointer;
    transition: height 0.3s ease;
  }

  @media (min-width: 768px) {
    .volume-slider { display: block; }
  }

  .audio-player:hover .volume-slider {
    height: 0.375rem;
  }

  .volume-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: var(--primary);
    width: 100%;
    border-radius: 9999px;
    transition: background-color 0.3s ease;
  }

  .audio-player:hover .volume-fill {
    background-color: var(--primary-dark);
  }

  /* Spinner de chargement */
  .buffer-container {
    position: absolute;
    top: 50%;
    width: 45px;
    transform: translateY(-50%);
  }

  .buffer-spinner {
    width: 45px;
    height: 45px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #ffffff;
    animation: spin 1s linear infinite;
    top: 50px;
    right: 100px;
  }

  .buffer-text {
    position: absolute;
    top: -18px;
    left: -5px;
    font-size: 10px;
    color: #ffffff;
    white-space: nowrap;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Ticker */
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

  .news-item:hover { color: #fff; }

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

  /* ── Popup publicitaire ── */
  .pub-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pubOverlayIn 0.25s ease;
  }

  .pub-overlay[hidden] { display: none !important; }

  @keyframes pubOverlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .pub-modal {
    background: linear-gradient(160deg, #1a0a0a 0%, #0f0f0f 100%);
    border: 1px solid rgba(229, 34, 34, 0.25);
    border-radius: 14px;
    width: 80vw;
    max-width: 80vw;
    max-height: 100vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
    animation: pubModalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    margin: 0;
  }

  @keyframes pubModalIn {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  .pub-close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    width: 42px;
    height: 42px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.15s ease;
    backdrop-filter: blur(6px);
  }

  .pub-close:active { transform: scale(0.9); background: rgba(229, 34, 34, 0.5); }

  .pub-img {
    width: 100%;
    aspect-ratio: 16 / 7;
    object-fit: cover;
    display: block;
  }

  .pub-body {
    padding: 14px 16px 10px;
  }

  .pub-body h3 {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 5px;
    line-height: 1.3;
  }

  .pub-body p {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.82rem;
    margin: 0;
    line-height: 1.45;
  }

  .pub-footer {
    padding: 10px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pub-cta {
    display: block;
    text-align: center;
    background: linear-gradient(135deg, #e52222 0%, #b80000 100%);
    color: #fff !important;
    font-weight: 700;
    font-size: 0.88rem;
    letter-spacing: 0.03em;
    padding: 11px 20px;
    border-radius: 10px;
    text-decoration: none;
    transition: opacity 0.2s ease, transform 0.15s ease;
    box-shadow: 0 4px 14px rgba(229, 34, 34, 0.4);
  }

  .pub-cta:active { opacity: 0.85; transform: scale(0.97); }

  .pub-timer-bar {
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .pub-timer-fill {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #e52222, #ff6060);
    border-radius: 2px;
    transform-origin: left;
    transition: transform linear;
  }

  /* ── SVG border animé GSAP ── */
  .player-svg-border {
    position: absolute;
    top: -2px; left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    pointer-events: none;
    z-index: 0;
    overflow: visible;
  }
  .player-border-r1,
  .player-border-r2 {
    stroke-dasharray: 80 1000;
    stroke-dashoffset: 0;
    opacity: 0.85;
  }
  .player-border-r2 { opacity: 0.45; }
</style>

<!-- Navbar -->
<nav id="navbar" class="navbar">
    <div class="nav-phone">
      <i style="color:red" class="bi bi-telephone-fill"></i>
      <span style="color:red" >(+225) 27 223 054 75</span>
    </div>
  <a href="/" id="logo_bureau"><img style="border-radius: 10px;" width="120" src="{logo}" alt=""></a>
  <div class="menu-desktop">
    <a class:active={isActiveRoute('/onetv')} href="/onetv">
      <i style="margin-right: 2px;" class="bi bi-tv-fill"></i> &nbsp; One TV
    </a>
    <a href="https://studiomozaik.com" target="_blank">Academy</a>
    <a href="https://shop.oneradio.ci" target="_blank">Boutique</a>
    <a class="logo" href="/" id="logo"><img style="border-radius: 10px;" width="120" src="{logo}" alt=""></a>
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

<div class="ticker"></div>

<div class="menu-mobile">
  <a href="/" id="logo"><img style="border-radius: 10px;" width="120" src="{logo}" alt=""></a>
  <a href="/onetv"><i class="bi bi-tv-fill"></i> One TV <i class="bi bi-chevron-right"></i></a>
  <a href="https://studiomozaik.com" target="_blank"><i class="bi bi-file"></i>Academy <i class="bi bi-chevron-right"></i></a>
  <a href="https://shop.oneradio.ci" target="_blank"><i class="bi bi-bag-fill"></i> Boutique <i class="bi bi-chevron-right"></i></a>
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

<!-- Lecteur audio -->
<div class="audio-player">
  <!-- SVG border animé GSAP -->
  <svg class="player-svg-border" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <rect class="player-border-r1" rx="12" ry="12" fill="none" stroke="#ff1919" stroke-width="2.5"/>
    <rect class="player-border-r2" rx="12" ry="12" fill="none" stroke="#ff6644" stroke-width="1.5"/>
  </svg>
  <div class="player-left">
    <img src="{freq}" alt="Current Song" class="current-song-image">
    <div class="current-song-info">
      <!-- svelte-ignore a11y_distracting_elements -->
      <span class="song-artist"><marquee scrollamount="4">{@html nowPlayingMarqueeText}</marquee></span>
      {#if nowPlayingNext}
        <span class="song-next">A suivre : {nowPlayingNext}</span>
      {/if}
    </div>
  </div>

  <div class="player-center">
    <div class="player-controls">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="play-pause-btn">
        <i style="font-size:34px" class="bi bi-play"></i>
      </button>
    </div>

    {#if isBuffering}
      <div class="buffer-container">
        <div class="buffer-spinner"></div>
        <!-- <span class="buffer-text">Chargement...</span> -->
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
    <button class="volume-btn" aria-label="Mute/Unmute">
      <i class="bi bi-volume-up-fill"></i>
    </button>
  </div>
</div>

<!-- Fil d'Ariane -->
<Breadcrumb />

<!-- Contenu principal -->
<main class:is-home={$page.url.pathname === '/'}>
  <div
    in:fade={{ duration: 300 }}
    out:fly={{ y: 20, duration: 300 }}
    key={currentKey}
  >
    {@render children?.()}
  </div>
</main>

<!-- Popup publicitaire -->
<div id="pub-overlay" class="pub-overlay" hidden>
  <div id="pub-modal" class="pub-modal">
    <button id="pub-close" class="pub-close" aria-label="Fermer">&#10005;</button>
    <img id="pub-img" src="" alt="" class="pub-img">
    <div class="pub-body">
      <h3 id="pub-titre"></h3>
      <p id="pub-message"></p>
    </div>
    <div class="pub-footer">
      <a id="pub-cta" href="#" class="pub-cta">En savoir plus</a>
      <div class="pub-timer-bar"><div id="pub-timer-fill" class="pub-timer-fill"></div></div>
    </div>
  </div>
</div>

<!-- Footer -->
<Footer />