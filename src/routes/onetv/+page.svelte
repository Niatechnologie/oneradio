<script>
  import { onMount } from 'svelte';

  const API_KEY = 'AIzaSyAUeGGt6iOFwuBw10bpQoNE1Iv_sn6nvaE';
  // Remplacez par l'ID de votre playlist YouTube (ex: PLxxxxxxx ou UUxxxxxxx pour les uploads)
  // Pour le trouver : ouvrez la playlist sur YouTube > copiez l'ID dans l'URL après ?list=
  const PLAYLIST_ID = 'PLH0AkpOLQWAeRDrH6k9TekCLjdnweMjWu';

  let mainVideo = $state(null);
  let isLive = $state(false);
  let recentVideos = $state([]);
  let loading = $state(true);
  let error = $state(null);

  async function fetchVideos() {
    loading = true;
    error = null;
    try {
      // Étape 1 : récupérer les 10 dernières vidéos de la playlist
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
      );
      const playlistData = await playlistRes.json();

      if (playlistData.error) {
        throw new Error(playlistData.error.message || 'Erreur YouTube API');
      }
      if (!playlistData.items || playlistData.items.length === 0) {
        throw new Error('Aucune vidéo trouvée dans la playlist');
      }

      // Étape 2 : récupérer les détails complets (dont liveStreamingDetails)
      const videoIds = playlistData.items
        .map(i => i.snippet.resourceId.videoId)
        .filter(Boolean)
        .join(',');

      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails,statistics&id=${videoIds}&key=${API_KEY}`
      );
      const videosData = await videosRes.json();

      if (!videosData.items || videosData.items.length === 0) {
        throw new Error('Impossible de charger les détails des vidéos');
      }

      // Étape 3 : détecter le direct en cours ou le dernier direct
      const liveVideo = videosData.items.find(
        v => v.snippet.liveBroadcastContent === 'live'
      );

      if (liveVideo) {
        mainVideo = liveVideo;
        isLive = true;
      } else {
        // Chercher le dernier direct terminé
        const lastLive = videosData.items.find(
          v => v.liveStreamingDetails?.actualStartTime
        );
        mainVideo = lastLive || videosData.items[0];
        isLive = false;
      }

      recentVideos = videosData.items.filter(v => v.id !== mainVideo.id).slice(0, 6);
    } catch (err) {
      error = err.message || 'Impossible de charger le contenu. Vérifiez votre connexion.';
      console.error('OneTv error:', err);
    } finally {
      loading = false;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function formatViews(count) {
    if (!count) return '';
    const n = parseInt(count);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M vues`;
    if (n >= 1_000) return `${Math.floor(n / 1000)}K vues`;
    return `${n} vues`;
  }

  onMount(fetchVideos);
</script>

<svelte:head>
  <title>One TV – One Radio</title>
</svelte:head>

<div class="onetv-page">

  <!-- ── En-tête ── -->
  <div class="tv-header">
    <div class="tv-brand">
      <i class="bi bi-tv-fill"></i>
      <h1>One <span>TV</span></h1>
    </div>
    <p class="tv-subtitle">Regardez nos directs et nos émissions en replay</p>
  </div>

  <!-- ── Contenu principal ── -->
  <div class="tv-main">

    {#if loading}
      <div class="loader-wrap">
        <div class="tv-loader"></div>
        <p>Chargement en cours…</p>
      </div>

    {:else if error}
      <div class="error-wrap">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <p>{error}</p>
        <button onclick={fetchVideos} class="retry-btn">
          <i class="bi bi-arrow-clockwise"></i> Réessayer
        </button>
      </div>

    {:else if mainVideo}
      <!-- Lecteur principal -->
      <div class="main-player-wrap">
        <div class="player-badge-row">
          {#if isLive}
            <span class="badge-live"><span class="live-dot"></span> EN DIRECT</span>
          {:else}
            <span class="badge-replay">
              <i class="bi bi-camera-reels-fill"></i> DERNIER DIRECT
            </span>
          {/if}
        </div>

        <div class="video-frame-wrap">
          <iframe
            src="https://www.youtube.com/embed/{mainVideo.id}?autoplay={isLive ? 1 : 0}&rel=0"
            title={mainVideo.snippet.title}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>

        <div class="video-info">
          <h2 class="video-title">{mainVideo.snippet.title}</h2>
          <div class="video-meta">
            <span><i class="bi bi-calendar3"></i> {formatDate(mainVideo.snippet.publishedAt)}</span>
            {#if mainVideo.statistics?.viewCount}
              <span><i class="bi bi-eye-fill"></i> {formatViews(mainVideo.statistics.viewCount)}</span>
            {/if}
            {#if isLive && mainVideo.liveStreamingDetails?.concurrentViewers}
              <span class="live-viewers">
                <i class="bi bi-people-fill"></i>
                {parseInt(mainVideo.liveStreamingDetails.concurrentViewers).toLocaleString('fr-FR')} spectateurs
              </span>
            {/if}
          </div>
          {#if mainVideo.snippet.description}
            <p class="video-desc">
              {mainVideo.snippet.description.slice(0, 220)}{mainVideo.snippet.description.length > 220 ? '…' : ''}
            </p>
          {/if}
        </div>
      </div>

      <!-- Vidéos récentes -->
      {#if recentVideos.length > 0}
        <div class="recent-section">
          <h3 class="recent-title">
            <i class="bi bi-collection-play-fill"></i> Vidéos récentes
          </h3>
          <div class="recent-grid">
            {#each recentVideos as video}
              <a
                href="https://www.youtube.com/watch?v={video.id}"
                target="_blank"
                rel="noopener noreferrer"
                class="video-card"
              >
                <div class="thumb-wrap">
                  <img
                    src={video.snippet.thumbnails?.medium?.url ?? video.snippet.thumbnails?.default?.url}
                    alt={video.snippet.title}
                    loading="lazy"
                  />
                  {#if video.snippet.liveBroadcastContent === 'live'}
                    <span class="thumb-live">LIVE</span>
                  {:else if video.liveStreamingDetails?.actualStartTime}
                    <span class="thumb-replay">REPLAY</span>
                  {/if}
                  <div class="thumb-overlay">
                    <i class="bi bi-play-circle-fill"></i>
                  </div>
                </div>
                <div class="card-info">
                  <p class="card-title">{video.snippet.title}</p>
                  <span class="card-date">{formatDate(video.snippet.publishedAt)}</span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Bouton YouTube -->
      <div class="yt-cta">
        <a
          href="https://www.youtube.com/@oneradiocotedivoire6837"
          target="_blank"
          rel="noopener noreferrer"
          class="yt-btn"
        >
          <i class="bi bi-youtube"></i> Voir toutes nos vidéos sur YouTube
        </a>
      </div>
    {/if}

  </div>
</div>

<style>
  .onetv-page {
    background: #0a0a0a;
    min-height: 100vh;
    color: #fff;
    padding-bottom: 130px;
    font-family: 'Roboto', sans-serif;
  }

  /* ── En-tête ── */
  .tv-header {
    background: linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #0a0a0a 100%);
    padding: 3rem 1.5rem 2rem;
    text-align: center;
    border-bottom: 2px solid #ff2a2a;
  }

  .tv-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .tv-brand i {
    font-size: 2.5rem;
    color: #ff2a2a;
  }

  .tv-brand h1 {
    font-size: 2.8rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -1px;
  }

  .tv-brand h1 span { color: #ff2a2a; }

  .tv-subtitle {
    color: #aaa;
    font-size: 1rem;
    margin: 0;
  }

  /* ── Contenu ── */
  .tv-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* Loader */
  .loader-wrap {
    text-align: center;
    padding: 5rem 0;
    color: #aaa;
  }

  .tv-loader {
    width: 56px;
    height: 56px;
    border: 5px solid rgba(255, 42, 42, 0.2);
    border-top-color: #ff2a2a;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 1.2rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Erreur */
  .error-wrap {
    text-align: center;
    padding: 4rem 1rem;
    color: #ccc;
  }

  .error-wrap i {
    font-size: 3rem;
    color: #ff2a2a;
    display: block;
    margin-bottom: 1rem;
  }

  .retry-btn {
    margin-top: 1.5rem;
    background: #ff2a2a;
    color: #fff;
    border: none;
    border-radius: 30px;
    padding: 0.7rem 1.8rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s, transform 0.15s;
  }

  .retry-btn:hover { background: #cc1a1a; transform: scale(1.04); }

  /* Badges */
  .player-badge-row { margin-bottom: 0.75rem; }

  .badge-live {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #ff2a2a;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    padding: 0.35rem 0.9rem;
    border-radius: 30px;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }

  .badge-replay {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 42, 42, 0.12);
    border: 1px solid #ff2a2a;
    color: #ff6060;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.35rem 0.9rem;
    border-radius: 30px;
  }

  /* Lecteur iframe */
  .video-frame-wrap {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(255, 42, 42, 0.15);
  }

  .video-frame-wrap iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  /* Infos vidéo */
  .video-info { padding: 1.25rem 0 0; }

  .video-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    line-height: 1.4;
  }

  .video-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 0.75rem;
  }

  .video-meta span { display: inline-flex; align-items: center; gap: 0.3rem; }
  .live-viewers { color: #ff6060 !important; font-weight: 600; }

  .video-desc {
    color: #888;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }

  /* Vidéos récentes */
  .recent-section { margin-top: 3rem; }

  .recent-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #ff2a2a;
  }

  .recent-title i { color: #ff2a2a; }

  .recent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  /* Carte vidéo */
  .video-card {
    text-decoration: none;
    color: #fff;
    background: #141414;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    display: block;
  }

  .video-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(255, 42, 42, 0.2);
  }

  .thumb-wrap {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: #1a1a1a;
  }

  .thumb-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .video-card:hover .thumb-wrap img { transform: scale(1.05); }

  .thumb-live {
    position: absolute;
    top: 8px;
    left: 8px;
    background: #ff2a2a;
    color: #fff;
    font-size: 0.68rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  .thumb-replay {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0,0,0,0.7);
    color: #ff8080;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    border: 1px solid #ff2a2a;
  }

  .thumb-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0);
    transition: background 0.2s;
  }

  .video-card:hover .thumb-overlay { background: rgba(0,0,0,0.4); }

  .thumb-overlay i {
    font-size: 2.8rem;
    color: rgba(255,255,255,0);
    transition: color 0.2s, transform 0.2s;
  }

  .video-card:hover .thumb-overlay i {
    color: rgba(255,255,255,0.9);
    transform: scale(1.1);
  }

  .card-info { padding: 0.75rem 1rem; }

  .card-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #eee;
    margin: 0 0 0.3rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-date { font-size: 0.78rem; color: #666; }

  /* CTA */
  .yt-cta {
    text-align: center;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid #1a1a1a;
  }

  .yt-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: #ff2a2a;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.85rem 2rem;
    border-radius: 30px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(255, 42, 42, 0.35);
  }

  .yt-btn i { font-size: 1.3rem; }

  .yt-btn:hover {
    background: #cc1a1a;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 42, 42, 0.45);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .tv-brand h1 { font-size: 2rem; }
    .tv-brand i  { font-size: 1.8rem; }
    .tv-main     { padding: 1.5rem 1rem; }
    .recent-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .video-title { font-size: 1.1rem; }
  }

  @media (max-width: 480px) {
    .recent-grid { grid-template-columns: 1fr; }
    .tv-header   { padding: 2rem 1rem 1.5rem; }
  }
</style>
