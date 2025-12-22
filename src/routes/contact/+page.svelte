<script>
    import '$lib/csscontact.css';
    import { onMount, onDestroy } from 'svelte';
  
  // Déclaration des variables pour le formulaire
  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let map;
  
  // Fonction pour initialiser la carte
  const initMap = () => {
    // Vérifier que L (Leaflet) est disponible
    if (typeof L !== 'undefined') {
      map = L.map('map').setView([5.3118056, -4.0101389], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      L.marker([5.3118056, -4.0101389])
        .addTo(map)
        .bindPopup('<strong>RADIO TREICHVILLE</strong>')
        .openPopup();
    }
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    const formData = { name, email, subject, message };
    console.log('Form submitted:', formData);
    // Ici vous envoyeriez normalement les données à votre serveur
    
    // Réinitialiser le formulaire
    name = '';
    email = '';
    subject = '';
    message = '';
  };
  
  // Monter la carte quand le composant est prêt
  onMount(() => {
    // Assurez-vous que le DOM est chargé
    initMap();
  });
  
  // Nettoyer la carte quand le composant est détruit
  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>
<svelte:head>
    <title>Radio Treichville - Contact</title>
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
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p>Abidjan, Côte d'Ivoire<br>
            Treichville, Av. 1, Rue 21, près de la bourse de travail</p>
            
          </div>
          <div class="info-item">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span><strong>(+225)  27 21 25 61 10 | (+225) 27 21 24 03 47</strong></span>
          </div>
          <div class="info-item">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>contact@radiotreichville.ci</span>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
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