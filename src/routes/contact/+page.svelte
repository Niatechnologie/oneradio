<script>
    import '$lib/csscontact.css';
    import { onMount, onDestroy } from 'svelte';
  
  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let map;
  
  const initMap = () => {
    if (typeof L !== 'undefined') {
      map = L.map('map').setView([5.3781, -3.9697], 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      L.marker([5.3781, -3.9697])
        .addTo(map)
        .bindPopup('<strong>ONE RADIO</strong><br>Cocody, Angré 8è tranche')
        .openPopup();
    }
  };
  
  const handleSubmit = () => {
    const formData = { name, email, subject, message };
    console.log('Form submitted:', formData);
    name = '';
    email = '';
    subject = '';
    message = '';
  };
  
  onMount(() => {
    initMap();
  });
  
  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>
<svelte:head>
    <title>One Radio - Contact</title>
  <!-- Inclusion des fichiers Leaflet depuis CDN -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
        crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
          crossorigin=""></script>
</svelte:head>
<main class="main-content">
<div class="container">
    <div class="grid">
      <!-- Contact Information -->
      <div class="card">
        <h2>Contactez-nous</h2>
        <div class="contact-info">
          <div class="info-item">
            <i class="bi bi-geo-alt-fill contact-icon"></i>
            <p>Abidjan Cocody, Angré 8è tranche, non loin de la CNPS.<br>One Radio 2è etage Porte B3</p>
          </div>
          <div class="info-item">
            <i class="bi bi-telephone-fill contact-icon"></i>
            <span><strong>(+225) 27 22 30 54 75</strong></span>
          </div>
          <div class="info-item">
            <i class="bi bi-envelope-fill contact-icon"></i>
            <span>contact@onradio.ci</span>
          </div>
          <div class="info-item">
            <i class="bi bi-facebook contact-icon"></i>
            <a href="https://www.facebook.com/RadioTreichville" target="_blank">Facebook - One Radio</a>
          </div>
          <div class="info-item">
            <i class="bi bi-youtube contact-icon"></i>
            <a href="https://www.youtube.com/@oneradiocotedivoire6837" target="_blank">YouTube - One Radio</a>
          </div>
        </div>
        
        <!-- Map -->
        <div id="map"></div>
      </div>

      <!-- Contact Form -->
      <div class="card">
        <form autocomplete="off" method="post" enctype="multipart/form-data" id="contactForm">
          <div class="form-group">
            <label for="name">Nom complet</label>
            <input autocomplete="off" type="text" name="nom" id="name" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input autocomplete="off" type="email" nom="email" id="email" required />
          </div>

          <div class="form-group">
            <label for="subject">Sujet</label>
            <input autocomplete="off" type="text" name="objet" id="subject" required />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea autocomplete="off"  id="message" name="msg" rows="4" required></textarea>
          </div>

          <button type="submit">
            <span>Envoyer le message</span>
            <i class="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
</div>
</main>

<style>
  main {
      flex: 1;
      padding: 2rem 1rem 4rem 1rem;
  }
 
  </style>