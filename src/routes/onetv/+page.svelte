<script>
  import { onMount } from 'svelte';

  const API_KEY    = 'AIzaSyAUeGGt6iOFwuBw10bpQoNE1Iv_sn6nvaE';
  const YT_HANDLE  = 'oneradiocotedivoire6837'; // handle sans @
  const BASE       = 'https://www.googleapis.com/youtube/v3';

  let mainVideo    = $state(null);   // { videoId, title, thumbnail, publishedAt, description, viewCount, concurrentViewers }
  let isLive       = $state(false);
  let recentVideos = $state([]);     // [{ videoId, title, thumbnail, publishedAt, isLive }]
  let loading      = $state(true);
  let error        = $state(null);

  // ── helpers ──────────────────────────────────────────────────────────────

  async function yt(endpoint, params) {
    const url = `${BASE}/${endpoint}?${new URLSearchParams({ ...params, key: API_KEY })}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Erreur YouTube API');
    return data;
  }

  function thumb(snippet) {
    return snippet.thumbnails?.medium?.url
        ?? snippet.thumbnails?.high?.url
        ?? snippet.thumbnails?.default?.url
        ?? '';
  }

  // ── fetch principal ───────────────────────────────────────────────────────

  async function fetchVideos() {
    loading = true;
    error   = null;
    try {
      // 1) Récupérer l'ID de la chaîne + la playlist uploads depuis le handle
      const channelData = await yt('channels', {
        part: 'id,contentDetails',
        forHandle: YT_HANDLE,
      });
      if (!channelData.items?.length) throw new Error('Chaîne YouTube introuvable');

      const channelId         = channelData.items[0].id;
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // 2) Chercher un direct EN COURS sur la chaîne
      const liveSearch = await yt('search', {
        part: 'id,snippet',
        channelId,
        eventType: 'live',
        type: 'video',
        maxResults: 1,
      });

      if (liveSearch.items?.length) {
        // ── direct en cours ──
        const item = liveSearch.items[0];
        const vid  = await yt('videos', {
          part: 'snippet,liveStreamingDetails,statistics',
          id: item.id.videoId,
        });
        const v = vid.items?.[0];
        mainVideo = {
          videoId:            item.id.videoId,
          title:              item.snippet.title,
          thumbnail:          thumb(item.snippet),
          publishedAt:        item.snippet.publishedAt,
          description:        item.snippet.description,
          viewCount:          v?.statistics?.viewCount ?? null,
          concurrentViewers:  v?.liveStreamingDetails?.concurrentViewers ?? null,
        };
        isLive = true;

      } else {
        // 3) Pas de direct — chercher le DERNIER direct terminé
        const completedSearch = await yt('search', {
          part: 'id,snippet',
          channelId,
          eventType: 'completed',
          type: 'video',
          order: 'date',
          maxResults: 1,
        });

        if (completedSearch.items?.length) {
          const item = completedSearch.items[0];
          const vid  = await yt('videos', {
            part: 'snippet,statistics',
            id: item.id.videoId,
          });
          const v = vid.items?.[0];
          mainVideo = {
            videoId:     item.id.videoId,
            title:       item.snippet.title,
            thumbnail:   thumb(item.snippet),
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
            viewCount:   v?.statistics?.viewCount ?? null,
            concurrentViewers: null,
          };
        } else {
          // 4) Fallback : dernière vidéo publiée
          const fallback = await yt('search', {
            part: 'id,snippet',
            channelId,
            type: 'video',
            order: 'date',
            maxResults: 1,
          });
          if (fallback.items?.length) {
            const item = fallback.items[0];
            mainVideo = {
              videoId:     item.id.videoId,
              title:       item.snippet.title,
              thumbnail:   thumb(item.snippet),
              publishedAt: item.snippet.publishedAt,
              description: item.snippet.description,
              viewCount:   null,
              concurrentViewers: null,
            };
          }
        }
        isLive = false;
      }

      // 5) Vidéos récentes depuis la playlist uploads (exclure la vidéo principale)
      const recentData = await yt('playlistItems', {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: 9,
      });
      recentVideos = (recentData.items ?? [])
        .filter(i => i.snippet.resourceId.videoId !== mainVideo?.videoId)
        .slice(0, 6)
        .map(i => ({
          videoId:     i.snippet.resourceId.videoId,
          title:       i.snippet.title,
          thumbnail:   thumb(i.snippet),
          publishedAt: i.snippet.publishedAt,
          liveBroadcastContent: i.snippet.liveBroadcastContent ?? 'none',
        }));

    } catch (err) {
      error = err.message || 'Impossible de charger le contenu.';
      console.error('OneTv error:', err);
    } finally {
      loading = false;
    }
  }

  // ── utils ─────────────────────────────────────────────────────────────────

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  function formatViews(count) {
    if (!count) return '';
    const n = parseInt(count);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M vues`;
    if (n >= 1_000)     return `${Math.floor(n / 1000)}K vues`;
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

  <!-- ── Contenu ── -->
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
      <!-- ── Lecteur principal ── -->
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
            src="https://www.youtube.com/embed/{mainVideo.videoId}?autoplay={isLive ? 1 : 0}&rel=0"
            title={mainVideo.title}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>

        <div class="video-info">
          <h2 class="video-title">{mainVideo.title}</h2>
          <div class="video-meta">
            {#if mainVideo.publishedAt}
              <span><i class="bi bi-calendar3"></i> {formatDate(mainVideo.publishedAt)}</span>
            {/if}
            {#if mainVideo.viewCount}
              <span><i class="bi bi-eye-fill"></i> {formatViews(mainVideo.viewCount)}</span>
            {/if}
            {#if isLive && mainVideo.concurrentViewers}
              <span class="live-viewers">
                <i class="bi bi-people-fill"></i>
                {parseInt(mainVideo.concurrentViewers).toLocaleString('fr-FR')} spectateurs
              </span>
            {/if}
          </div>
          {#if mainVideo.description}
            <p class="video-desc">
              {mainVideo.description.slice(0, 220)}{mainVideo.description.length > 220 ? '…' : ''}
            </p>
          {/if}
        </div>
      </div>

      <!-- ── Vidéos récentes ── -->
      {#if recentVideos.length > 0}
        <div class="recent-section">
          <h3 class="recent-title">
            <i class="bi bi-collection-play-fill"></i> Vidéos récentes
          </h3>
          <div class="recent-grid">
            {#each recentVideos as video}
              <a
                href="https://www.youtube.com/watch?v={video.videoId}"
                target="_blank"
                rel="noopener noreferrer"
                class="video-card"
              >
                <div class="thumb-wrap">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  {#if video.liveBroadcastContent === 'live'}
                    <span class="thumb-live">LIVE</span>
                  {:else if video.liveBroadcastContent === 'none' && video.title?.toLowerCase().includes('direct')}
                    <span class="thumb-replay">REPLAY</span>
                  {/if}
                  <div class="thumb-overlay">
                    <i class="bi bi-play-circle-fill"></i>
                  </div>
                </div>
                <div class="card-info">
                  <p class="card-title">{video.title}</p>
                  <span class="card-date">{formatDate(video.publishedAt)}</span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- ── Bouton YouTube ── -->
      <div class="yt-cta">
        <a
          href="https://www.youtube.com/@{YT_HANDLE}"
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

  .tv-brand i  { font-size: 2.5rem; color: #ff2a2a; }

  .tv-brand h1 {
    font-size: 2.5rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -1px;
  }

  .tv-brand h1 span { color: #ff2a2a; }

  .tv-subtitle { color: #aaa; font-size: 1rem; margin: 0; }

  /* ── Contenu ── */
  .tv-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* Loader */
  .loader-wrap { text-align: center; padding: 5rem 0; color: #aaa; }

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
  .error-wrap { text-align: center; padding: 4rem 1rem; color: #ccc; }

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

  /* Iframe */
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

  /* Infos */
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

  .video-desc { color: #888; font-size: 0.9rem; line-height: 1.6; margin: 0; }

  /* Récentes */
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

  /* Carte */
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
    color: transparent;
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
    .tv-header   { padding: 1rem }
  }
</style>
