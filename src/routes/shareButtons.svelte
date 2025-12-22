<!-- ShareButtons.svelte -->
<script>
  export let url = '';
  export let title = '';
  export let description = '';

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
</script>

<div class="share-buttons">
  <button on:click={shareOnFacebook}>Facebook</button>
  <button on:click={shareOnTwitter}>Twitter</button>
  <button on:click={shareOnLinkedIn}>LinkedIn</button>
</div>

<style>
  .share-buttons {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>