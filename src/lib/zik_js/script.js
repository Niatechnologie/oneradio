  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let lucideLoaded = false;

  // Données des chansons
  const songs = [
    {
      id: 1,
      title: "Retro Rap",
      artist: "Le Rap à l'ancienne",
      cover: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      audio: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    },
    {
      id: 2,
      title: "Soft Dreams",
      artist: "Echo Valley",
      cover: "https://images.unsplash.com/photo-1584554576075-5dfa7629e747?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      audio: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    },
    {
      id: 3,
      title: "Morning Light",
      artist: "The Floating World",
      cover: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      audio: "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3",
    },
  ];

  // Références aux éléments du DOM
  let playPauseBtn;
  let playPauseIcon;
  let nextBtn;
  let prevBtn;
  let repeatBtn;
  let shuffleBtn;
  let progressBar;
  let currentTimeEl;
  let totalTimeEl;
  let volumeBtn;
  let volumeIcon;
  let volumeFill;
  let minimizeBtn;
  let audioPlayer;
  let songTitleEl;
  let songArtistEl;
  let songImageEl;

  // État du lecteur
  let currentSongIndex = 0;
  let isPlaying = false;
  let isRepeat = false;
  let isShuffle = false;
  let isMinimized = false;
  let volume = 0.7; // Volume par défaut

  if (browser) {
    onMount(() => {
      // Charger la bibliothèque Lucide
      const script = document.createElement('script');
      script.onload = () => {
        initAudioPlayer();
      };
      document.body.appendChild(script);
    });
  }

  // Initialiser le lecteur audio
  function initAudioPlayer() {
    if (!lucideLoaded || !browser) return;

    // Création de l'élément audio
    const audio = new Audio();
    audio.volume = volume;

    // Charger la première chanson
    loadSong(currentSongIndex);

    // Événements du lecteur audio
    playPauseBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      totalTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (isShuffle) {
        playRandomSong();
      } else {
        nextSong();
      }
    });

    repeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      repeatBtn.style.color = isRepeat ? 'var(--primary)' : '';
    });

    shuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleBtn.style.color = isShuffle ? 'var(--primary)' : '';
    });

    volumeBtn.addEventListener('click', toggleMute);

    minimizeBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      if (isMinimized) {
        audioPlayer.style.height = '4rem';
        audioPlayer.querySelector('.progress-container').style.display = 'none';
        audioPlayer.querySelector('.current-song-info').style.display = 'none';
      } else {
        audioPlayer.style.height = '';
        audioPlayer.querySelector('.progress-container').style.display = '';
        audioPlayer.querySelector('.current-song-info').style.display = '';
      }
    });
  }

  // Charger une chanson
  function loadSong(index) {
    const song = songs[index];
    audio.src = song.audio;
    songTitleEl.textContent = song.title;
    songArtistEl.textContent = song.artist;
    songImageEl.src = song.cover;

    // Mettre à jour l'affichage de la durée
    audio.addEventListener('loadeddata', () => {
      totalTimeEl.textContent = formatTime(audio.duration);

    });
  }

  // Lecture/Pause
  function togglePlay() {
    console.log("est ttsts");
     if (audio.paused) {
      audio.play();
      playPauseIcon.setAttribute('name', 'pause');
      isPlaying = true;
    } else {
      audio.pause();
      playPauseIcon.setAttribute('name', 'play');
      isPlaying = false;
    }
  }

  // Chanson suivante
  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
      audio.play();
    }
  }

  // Chanson précédente
  function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
      audio.play();
    }
  }

  // Chanson aléatoire
  function playRandomSong() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex && songs.length > 1);

    currentSongIndex = randomIndex;
    loadSong(currentSongIndex);
    if (isPlaying) {
      audio.play();
    }
  }

  // Mettre à jour la progression
  function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Couper/rétablir le son
  function toggleMute() {
    if (audio.volume > 0) {
      audio.volume = 0;
      volumeIcon.setAttribute('name', 'volume-x');
      volumeFill.style.width = '0%';
    } else {
      audio.volume = volume;
      volumeIcon.setAttribute('name', 'volume-2');
      volumeFill.style.width = `${volume * 100}%`;
    }
  }

  // Formater le temps (secondes -> MM:SS)
  function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
