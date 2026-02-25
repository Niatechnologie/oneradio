<script>
  import '$lib/csscontact.css';
  import { onMount, onDestroy } from 'svelte';

  let name = '';
  let email = '';
  let phone = '';
  let subject = '';
  let message = '';
  let sending = false;
  let responseMsg = '';
  let responseMsgType = '';
  let map;

  const RECAPTCHA_SITE_KEY = '6LdmVHcsAAAAAN2I2jqs7wEcRVq2CIKbsNPWhGO7';
  // ✅ Suppression des espaces en fin d'URL
  const PHP_ENDPOINT = 'https://adminradio.oneradio.ci/radio_one/transmission_contact.php';

  // ✅ Initialisation de la carte Leaflet
  const initMap = () => {
    if (typeof L !== 'undefined' && document.getElementById('map')) {
      map = L.map('map').setView([5.3781, -3.9697], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([5.3781, -3.9697])
        .addTo(map)
        .bindPopup('<strong>ONE RADIO</strong><br>Cocody, Angré 8è tranche')
        .openPopup();
    }
  };

  // ✅ Gestion de la soumission du formulaire (au niveau du composant, pas imbriqué)
  const handleSubmit = async (event) => {
    event.preventDefault();
    responseMsg = '';
    responseMsgType = '';

    if (!name || !email || !subject || !message) {
      responseMsg = 'Veuillez remplir tous les champs obligatoires.';
      responseMsgType = 'error';
      return;
    }

    sending = true;
    try {
      if (window.grecaptcha) {
        const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact' });
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('recaptcha_token', recaptchaToken);

        const res = await fetch(PHP_ENDPOINT, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (data.success) {
          responseMsg = data.message || 'Message envoyé avec succès !';
          responseMsgType = 'success';
          // ✅ Réinitialisation du formulaire
          name = '';
          email = '';
          phone = '';
          subject = '';
          message = '';
        } else {
          responseMsg = data.message || "Erreur lors de l'envoi.";
          responseMsgType = 'error';
        }
      } else {
        responseMsg = 'reCAPTCHA non chargé. Veuillez réessayer.';
        responseMsgType = 'error';
      }
    } catch (e) {
      console.error('Erreur lors de l\'envoi:', e);
      responseMsg = 'Erreur réseau. Veuillez réessayer.';
      responseMsgType = 'error';
    } finally {
      sending = false;
    }
  };

  // ✅ Cycle de vie Svelte
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
  <!-- Leaflet CSS/JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
        crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
          crossorigin=""></script>
  <!-- reCAPTCHA v3 -->
  <script src="https://www.google.com/recaptcha/api.js?render=6LdmVHcsAAAAAN2I2jqs7wEcRVq2CIKbsNPWhGO7"></script>
</svelte:head>

<main class="main-content">
  <div class="container">
    <div class="grid">
      <!-- Informations de contact -->
      <div class="card">
        <h2>Contactez-nous</h2>
        <div class="contact-info">
          <div class="info-item">
            <i class="bi bi-geo-alt-fill contact-icon"></i>
            <p>Abidjan Cocody, Angré 8è tranche, non loin de la CNPS.<br>One Radio 2è étage Porte B3</p>
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
            <a href="https://www.facebook.com/oneradioci" target="_blank" rel="noopener noreferrer">Facebook - One Radio</a>
          </div>
          <div class="info-item">
            <i class="bi bi-youtube contact-icon"></i>
            <a href="https://www.youtube.com/@oneradiocotedivoire6837" target="_blank" rel="noopener noreferrer">YouTube - One Radio</a>
          </div>
        </div>
        <!-- Carte -->
        <div id="map"></div>
      </div>

      <!-- Formulaire -->
      <div class="card">
        <form autocomplete="off" id="contactForm" on:submit={handleSubmit}>
          <div class="form-group">
            <label for="name">Nom complet</label>
            <input autocomplete="off" type="text" id="name" bind:value={name} required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input autocomplete="off" type="email" id="email" bind:value={email} required />
          </div>

          <div class="form-group">
            <label for="phone">Téléphone</label>
            <input autocomplete="off" type="tel" id="phone" bind:value={phone} />
          </div>

          <div class="form-group">
            <label for="subject">Sujet</label>
            <input autocomplete="off" type="text" id="subject" bind:value={subject} required />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea autocomplete="off" id="message" rows="4" bind:value={message} required></textarea>
          </div>

          <button type="submit" disabled={sending}>
            <span>{sending ? 'Envoi...' : 'Envoyer le message'}</span>
            <i class="bi bi-send-fill"></i>
          </button>

          {#if responseMsg}
            <div class="response-message {responseMsgType}">{responseMsg}</div>
          {/if}
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
  .response-message {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
  }
  .response-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .response-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  /* Ajustement hauteur carte */
  #map {
    height: 250px;
    width: 100%;
    border-radius: 8px;
    margin-top: 1rem;
    z-index: 1;
  }
</style>