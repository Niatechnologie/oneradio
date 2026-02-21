<!-- ShareButtons.svelte -->
<script>
  /**
   * @typedef {Object} Props
   * @property {string} [url]
   * @property {string} [title]
   */

  /** @type {Props} */
  let { url = '', title = '' } = $props();

  function shareOnFacebook() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  function shareOnTwitter() {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  function shareOnLinkedIn() {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  function shareOnWhatsApp() {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (e) {
      console.error('Erreur copie:', e);
    }
  }

  let copied = $state(false);
</script>

<div class="share-section">
  <h4 class="share-title"><i class="bi bi-share-fill"></i> Partager</h4>
  <div class="share-buttons">
    <button class="share-btn facebook" onclick={shareOnFacebook} title="Partager sur Facebook">
      <i class="bi bi-facebook"></i>
    </button>
    <button class="share-btn twitter" onclick={shareOnTwitter} title="Partager sur X (Twitter)">
      <i class="bi bi-twitter-x"></i>
    </button>
    <button class="share-btn whatsapp" onclick={shareOnWhatsApp} title="Partager sur WhatsApp">
      <i class="bi bi-whatsapp"></i>
    </button>
    <button class="share-btn linkedin" onclick={shareOnLinkedIn} title="Partager sur LinkedIn">
      <i class="bi bi-linkedin"></i>
    </button>
    <button class="share-btn copy" onclick={copyLink} title="Copier le lien">
      <i class="bi {copied ? 'bi-check-lg' : 'bi-link-45deg'}"></i>
    </button>
  </div>
</div>

<style>
  .share-section {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .share-title {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .share-buttons {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .share-btn {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .share-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .facebook { background-color: #1877F2; }
  .twitter { background-color: #000; }
  .whatsapp { background-color: #25D366; }
  .linkedin { background-color: #0A66C2; }
  .copy { background-color: #ff1919; }
</style>