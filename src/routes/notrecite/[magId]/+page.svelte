<script>
    export const prerender = true;
    import { onMount } from 'svelte';
    
    const { 
      fileUrl = 'https://admin.radiotreichville.ci/magazines/',
      data 
    } = $props();
    
    const success = data.status;
    let mag = data.detailsmag;
    let fileUrl2 = fileUrl + mag[0].lien;

    let isLoading = true;
    let error = null;
    
    onMount(() => {
      // Code à exécuter lors du montage du composant
      isLoading = false;
     
    });
  
    const googleDocUrl = "https://docs.google.com/gview";
    const url = `${googleDocUrl}?url=${fileUrl2}&embedded=true`;
  </script>

<svelte:head>
  <title>Radio Treichville - Magazine</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>
<main>
    {#if mag[0].lien!== null}
    <p style="text-align: center;padding: 15px;background: #03800a;"><a href="/notrecite" style="color:#fff"><i class="bi bi-arrow-left"></i> Retour</a></p>
    <iframe style="position:relative; top:0; left:0; bottom:0; right:0; width:100%; height:100vh; border:none; margin:0; padding:0; overflow:hidden; z-index:10;" src={url} title="article" width="500" height="1000" ></iframe>
    {:else}
    <p style="text-align: center;"> Aucun fichier disponible</p>
    {/if}
 
</main>