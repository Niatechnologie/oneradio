<script>
import { onMount, onDestroy } from 'svelte';
import { page } from '$app/stores';
import pub1 from "$lib/img/pubspa.jpg";
import Pagination from "../../pagination.svelte";

  let podcastsId = $state(null);
  podcastsId = $page.params.podcastsId;

// Variables d'état réactives
  let data = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let currentPage = $state(1);
  let itemsPerPage = $state(6);
  let totalItems = $state(0);
  let playlist = $state([]);
  let leTitre = $state(null);

  // États audio
  let currentlyPlaying = $state(null);
  let audioElements = $state([]);
  let trackStates = $state([]);

  // Clé pour le stockage global des audios
  const GLOBAL_AUDIO_KEY = 'radioTreichAudioPlayer';

  // Fonction pour sauvegarder l'état audio global
  function saveGlobalAudioState() {
    if (typeof window !== 'undefined' && currentlyPlaying !== null) {
      const currentAudio = audioElements[currentlyPlaying];
      if (currentAudio) {
        window[GLOBAL_AUDIO_KEY] = {
          audioElement: currentAudio,
          trackIndex: currentlyPlaying,
          trackInfo: playlist[currentlyPlaying],
          podcastsId: podcastsId,
          isPlaying: !currentAudio.paused,
          currentTime: currentAudio.currentTime
        };
      }
    }
  }

  // Fonction pour récupérer l'état audio global
  function getGlobalAudioState() {
    if (typeof window !== 'undefined' && window[GLOBAL_AUDIO_KEY]) {
      return window[GLOBAL_AUDIO_KEY];
    }
    return null;
  }

  // Fonction pour nettoyer l'état audio global
  function clearGlobalAudioState() {
    if (typeof window !== 'undefined' && window[GLOBAL_AUDIO_KEY]) {
      const globalState = window[GLOBAL_AUDIO_KEY];
      if (globalState.audioElement) {
        globalState.audioElement.pause();
        globalState.audioElement.currentTime = 0;
        globalState.audioElement.src = '';
        globalState.audioElement.load();
      }
      delete window[GLOBAL_AUDIO_KEY];
    }
  }

  // Fonction pour synchroniser avec l'audio global
  function syncWithGlobalAudio() {
    const globalState = getGlobalAudioState();
    if (globalState && globalState.podcastsId === podcastsId) {
      // Trouver l'index de la piste dans la playlist actuelle
      const trackIndex = playlist.findIndex(track => 
        track.id === globalState.trackInfo.id || track.lien === globalState.trackInfo.lien
      );
      
      if (trackIndex !== -1 && globalState.audioElement) {
        // Synchroniser l'état local avec l'audio global
        audioElements[trackIndex] = globalState.audioElement;
        currentlyPlaying = trackIndex;
        trackStates[trackIndex].isPlaying = globalState.isPlaying;
        
        // Restaurer la position de lecture si elle était sauvegardée
        if (globalState.currentTime && globalState.audioElement.currentTime !== globalState.currentTime) {
          globalState.audioElement.currentTime = globalState.currentTime;
        }
        
        // Mettre à jour les états en temps réel
        setupExistingAudioElement(globalState.audioElement, trackIndex);
      }
    }
  }

  // Fonction pour nettoyer tous les éléments audio locaux (pas l'audio global)
  function cleanupLocalAudioElements() {
    const globalAudio = getGlobalAudioState()?.audioElement;
    
    audioElements.forEach((audio, index) => {
      if (audio && audio !== globalAudio) {
        // Arrêter la lecture seulement si ce n'est pas l'audio global
        audio.pause();
        audio.src = '';
        audio.load();
        // Nettoyer les event listeners
        if (audio._listeners) {
          Object.keys(audio._listeners).forEach(eventType => {
            audio.removeEventListener(eventType, audio._listeners[eventType]);
          });
        }
      }
    });
    
    // Réinitialiser seulement les éléments qui ne sont pas l'audio global
    audioElements = audioElements.map(audio => audio === globalAudio ? audio : null);
    
    // Réinitialiser currentlyPlaying seulement si l'audio global n'est pas actif
    if (!getGlobalAudioState()?.isPlaying) {
      currentlyPlaying = null;
    }
  }

  // Fonction pour initialiser les états des pistes
  function initializeTrackStates() {
    trackStates = playlist.map(() => ({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 70,
      progress: 0
    }));
  }

  // Fonction pour charger les données
  async function loadData() {
    isLoading = true;
    error = null;
    
    try {
      // Nettoyer les anciens éléments audio locaux avant de charger de nouvelles données
      cleanupLocalAudioElements();
      
      // Récupération parallèle des données
      const [paginatedResponse, allNewsResponse] = await Promise.all([
        fetch(`https://adminradio.oneradio.ci/radio_one/listpodcasts.php?page=${currentPage}&limit=${itemsPerPage}&podcastId=${podcastsId}`),
        fetch(`https://adminradio.oneradio.ci/radio_one/alllistpodcasts.php?podcastId=${podcastsId}`)
      ]);

      if (!paginatedResponse.ok) {
        throw new Error(`Erreur API paginée: ${paginatedResponse.status}`);
      }
      
      if (!allNewsResponse.ok) {
        throw new Error(`Erreur API totale: ${allNewsResponse.status}`);
      }

      const [paginatedData, allNewsData] = await Promise.all([
        paginatedResponse.json(),
        allNewsResponse.json()
      ]);

      // Attribution des données
      playlist = paginatedData.podcasts || [];

      leTitre = playlist[0]?.categorie;
      
      totalItems = Array.isArray(allNewsData.podcasts) ? allNewsData.podcasts.length : 0;
      
      // Réinitialiser les états audio après le chargement des données
      initializeTrackStates();
      
      // Créer de nouveaux éléments audio
      initializeAudioElements();
      
      // Synchroniser avec l'audio global s'il existe
      syncWithGlobalAudio();
     
    } catch (e) {
      error = e;
      console.error('Erreur lors du chargement:', e);
    } finally {
      isLoading = false;
    }
  }

  // Gestionnaire de changement de page
  async function handlePageChange(event) {
    currentPage = event.detail.page;
    if (event.detail.itemsPerPage) {
      itemsPerPage = event.detail.itemsPerPage;
    }
    
    // Sauvegarder l'état audio avant de changer de page
    saveGlobalAudioState();
    
    await loadData();
    
    // Scroll vers le haut (optionnel)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function pauseAll() {
    audioElements.forEach((audio, index) => {
      if (audio && !audio.paused) {
        audio.pause();
        trackStates[index].isPlaying = false;
      }
    });
    // NE PAS réinitialiser currentlyPlaying pour permettre la reprise
  }

  function stopAll() {
    // Arrêter l'audio global également
    clearGlobalAudioState();
    
    audioElements.forEach((audio, index) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        trackStates[index].isPlaying = false;
        trackStates[index].currentTime = 0;
        trackStates[index].progress = 0;
      }
    });
    currentlyPlaying = null;
    
    // Recréer les éléments audio pour qu'ils soient à nouveau fonctionnels
    initializeAudioElements();
  }

  async function togglePlay(index) {
    const audio = audioElements[index];
    if (!audio) {
      console.error(`Audio element at index ${index} is null`);
      return;
    }

    // Vérifier si l'audio est prêt
    if (audio.readyState < 2) { // HAVE_CURRENT_DATA
      try {
        await audio.load();
      } catch (error) {
        console.error('Erreur lors du chargement de l\'audio:', error);
        return;
      }
    }

    // Si une autre piste joue, la mettre en pause
    if (currentlyPlaying !== null && currentlyPlaying !== index) {
      const currentAudio = audioElements[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
        trackStates[currentlyPlaying].isPlaying = false;
      }
    }

    // Toggle de la piste actuelle
    if (audio.paused) {
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        trackStates[index].isPlaying = true;
        currentlyPlaying = index;
        // Sauvegarder immédiatement l'état global
        saveGlobalAudioState();
      } catch (error) {
        console.error('Erreur lors de la lecture:', error);
        trackStates[index].isPlaying = false;
        
        // Recréer l'élément audio en cas d'erreur
        const newAudio = new Audio();
        newAudio.src = `https://adminradio.oneradio.ci/podcasts/${playlist[index].lien}`;
        audioElements[index] = newAudio;
        setupAudioElement(newAudio, index);
      }
    } else {
      // PAUSE : on garde la référence de la piste en cours
      audio.pause();
      trackStates[index].isPlaying = false;
      // NE PAS réinitialiser currentlyPlaying pour permettre la reprise
      // currentlyPlaying reste à index pour pouvoir reprendre
      
      // Mettre à jour l'état global en mode pause
      if (getGlobalAudioState()?.audioElement === audio) {
        const globalState = window[GLOBAL_AUDIO_KEY];
        if (globalState) {
          globalState.isPlaying = false;
        }
      }
    }
  }

  function setVolume(index, volume) {
    const audio = audioElements[index];
    if (audio) {
      audio.volume = volume / 100;
      trackStates[index].volume = volume;
    }
  }

  function setupAudioElement(audio, index) {
    const handleLoadedMetadata = () => {
      trackStates[index].duration = audio.duration;
    };

    const handleTimeUpdate = () => {
      trackStates[index].currentTime = audio.currentTime;
      trackStates[index].progress = (audio.currentTime / audio.duration) * 100;
    };

    const handleEnded = () => {
      trackStates[index].isPlaying = false;
      currentlyPlaying = null;
      audio.currentTime = 0;
      trackStates[index].currentTime = 0;
      trackStates[index].progress = 0;
      // Nettoyer l'état global à la fin
      if (getGlobalAudioState()?.audioElement === audio) {
        clearGlobalAudioState();
      }
    };

    const handleError = (e) => {
      console.error(`Erreur audio pour l'index ${index}:`, e);
      trackStates[index].isPlaying = false;
      if (currentlyPlaying === index) {
        currentlyPlaying = null;
      }
    };

    const handleCanPlay = () => {
      // L'audio est prêt à être joué
      console.log(`Audio ${index} prêt à jouer`);
    };

    // Nettoyer les anciens listeners s'ils existent
    if (audio._listeners) {
      Object.keys(audio._listeners).forEach(eventType => {
        audio.removeEventListener(eventType, audio._listeners[eventType]);
      });
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Stocker les références des listeners pour pouvoir les supprimer plus tard
    audio._listeners = {
      loadedmetadata: handleLoadedMetadata,
      timeupdate: handleTimeUpdate,
      ended: handleEnded,
      error: handleError,
      canplay: handleCanPlay
    };

    audio.volume = trackStates[index].volume / 100;
    audio.preload = 'metadata'; // Précharger les métadonnées
  }

  function setupExistingAudioElement(audio, index) {
    // Pour un élément audio existant (venant de l'état global)
    if (audio.duration) {
      trackStates[index].duration = audio.duration;
    }
    
    trackStates[index].currentTime = audio.currentTime;
    trackStates[index].progress = (audio.currentTime / audio.duration) * 100;

    const handleTimeUpdate = () => {
      trackStates[index].currentTime = audio.currentTime;
      trackStates[index].progress = (audio.currentTime / audio.duration) * 100;
    };

    const handleEnded = () => {
      trackStates[index].isPlaying = false;
      currentlyPlaying = null;
      audio.currentTime = 0;
      trackStates[index].currentTime = 0;
      trackStates[index].progress = 0;
      clearGlobalAudioState();
    };

    // Nettoyer les anciens listeners s'ils existent
    if (audio._listeners) {
      Object.keys(audio._listeners).forEach(eventType => {
        audio.removeEventListener(eventType, audio._listeners[eventType]);
      });
    }

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    audio._listeners = {
      timeupdate: handleTimeUpdate,
      ended: handleEnded
    };
  }
 
  function initializeAudioElements() {
    // Réinitialiser le tableau d'éléments audio
    audioElements = [];
    
    playlist.forEach((track, index) => {
      // Vérifier si un audio global existe pour cette piste
      const globalState = getGlobalAudioState();
      if (globalState && globalState.trackInfo && 
          (globalState.trackInfo.id === track.id || globalState.trackInfo.lien === track.lien)) {
        // Utiliser l'audio global existant
        audioElements[index] = globalState.audioElement;
        currentlyPlaying = index;
        trackStates[index].isPlaying = true;
        setupExistingAudioElement(globalState.audioElement, index);
      } else {
        // Créer un nouvel élément audio
        const audio = new Audio();
        audio.src = `https://adminradio.oneradio.ci/podcasts/${track.lien}`;
        audioElements[index] = audio;
        setupAudioElement(audio, index);
      }
    });
  }

  // Sauvegarde de l'état avant de quitter la page
  function handleBeforeUnload() {
    saveGlobalAudioState();
  }

  // Nettoyage au montage du composant
  onMount(() => {
    loadData();
    
    // Écouter les événements de navigation
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    // Nettoyage lors de la navigation
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      // Sauvegarder l'état avant de quitter
      saveGlobalAudioState();
    };
  });

  // Nettoyage à la destruction du composant
  onDestroy(() => {
    // Sauvegarder l'état audio global avant destruction
    saveGlobalAudioState();
    
    // Nettoyer tous les event listeners
    audioElements.forEach(audio => {
      if (audio && audio._listeners) {
        Object.keys(audio._listeners).forEach(eventType => {
          audio.removeEventListener(eventType, audio._listeners[eventType]);
        });
      }
    });
  });
</script>

<svelte:head>
  <title>Oneradio - Podcasts</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
   <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
</svelte:head>


    <div class="header">
    <h1>🎵 {leTitre}</h1>
  </div>
  <div class="global-controls">
    <button class="global-btn" onclick={pauseAll}>
      <i class="bi bi-pause-fill"></i> Tout Mettre en Pause
    </button>
    <button class="global-btn" onclick={stopAll}>
      <i class="bi bi-stop-fill"></i> Tout Arrêter
    </button>
  </div>
<div class="player-container">
  <div class="playlist">
    {#each playlist as track, index}
      <div 
        class="track" 
        class:playing={trackStates[index].isPlaying}
        id="track-{index}"
      >
        <div class="status-indicator"></div>
        <div class="track-number">{index + 1}</div>
        <div class="track-cover">
          <img src="https://adminradio.oneradio.ci/podcasts/{track.photo}" alt={track.titre} class="track-cover-img" />
        </div>
        <div class="track-info">
          <div class="track-title">{track.titre}</div>
          <div class="track-artist">Emission du {track.datepub}</div>
        </div>
        <div class="audio-controls">
          <div class="time-display">
            {formatTime(trackStates[index].currentTime)} / {formatTime(trackStates[index].duration)}
          </div>
          <button class="play-btn" onclick={() => togglePlay(index)}>
            {#if trackStates[index].isPlaying}
              <i class="bi bi-pause-fill"></i>
            {:else}
              <i class="bi bi-play-fill"></i>
            {/if}
          </button>
          <div class="volume-control">
            <i class="bi bi-volume-up-fill"></i>
            <input 
              type="range" 
              class="volume-slider" 
              min="0" 
              max="100" 
              bind:value={trackStates[index].volume}
              onchange={() => setVolume(index, trackStates[index].volume)}
            >
          </div>
        </div>
        <div class="progress-bar" style="width: {trackStates[index].progress}%"></div>
      </div>
    {/each}
  </div>
</div>



            <div><!-- Composant Pagination -->
              <Pagination 
                  {currentPage}
                  {totalItems}
                  {itemsPerPage}
                  maxVisiblePages={5}
                  showInfo={false}
                  showFirstLast={true}
                  on:pageChange={handlePageChange}
              />
            </div>


<style>

.main-content {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #007e33 0%, #f97316 100%);
    line-height: 1.6;
    margin-bottom: 0 !important;
}

.player-container {
    max-width: 1200px;
    margin: 15px auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

        /* Lecteurs 2 */
 
  .header {
    background: linear-gradient(45deg, #ff6b6b, #ffa500);
    color: white;
    margin-top:0;
    padding: 10px;
    text-align: center;
  }

  .header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .header p {
    opacity: 0.9;
    font-size: 1.1em;
  }

  .playlist {
    padding: 20px;
  }

  .track {
    display: flex;
    align-items: center;
    background: white;
    margin-bottom: 15px;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .track:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .track.playing {
    background: linear-gradient(45deg, #ff6b6b, #ffa500);
    color: white;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }

  .track-number {
    background: #007e33;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 15px;
    font-size: 1.1em;
    flex-shrink: 0;
  }

  .track-cover {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 15px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .track-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .track.playing .track-cover {
    box-shadow: 0 2px 12px rgba(255, 255, 255, 0.3);
  }

  .track.playing .track-number {
    background: rgba(255, 255, 255, 0.3);
  }

  .track-info {
    flex: 1;
    margin-right: 20px;
  }

  .track-title {
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .track-artist {
    opacity: 0.7;
    font-size: 1em;
  }

  .track.playing .track-artist {
    opacity: 0.9;
  }

  .audio-controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .play-btn {
    background: linear-gradient(45deg, #ff6b6b, #ffa500);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .play-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  .track.playing .play-btn {
    background: rgba(255, 255, 255, 0.3);
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .volume-slider {
    width: 80px;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    cursor: pointer;
  }

  .track.playing .volume-slider {
    background: rgba(255, 255, 255, 0.3);
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(45deg, #ff6b6b, #ffa500);
    transition: width 0.1s ease;
    border-radius: 0 0 15px 15px;
  }

  .time-display {
    font-size: 0.9em;
    opacity: 0.8;
    min-width: 80px;
    text-align: center;
  }

  .track.playing .time-display {
    opacity: 1;
  }

  .status-indicator {
    position: absolute;
    top: 10px;
    right: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4CAF50;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .track.playing .status-indicator {
    opacity: 1;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }

  .global-controls {
    color: white;
    padding: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .global-btn {
    background: rgba(2, 148, 0, 0.647);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1em;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .global-btn:hover {
    background: rgba(255, 145, 0, 0.877);
    transform: translateY(-2px);
  }
</style>