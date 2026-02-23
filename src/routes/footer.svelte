<script>
    import { onMount } from 'svelte';
    
    
  /**
   * @typedef {Object} Props
   * @property {string} [phone] - Propriétés personnalisables (optionnelles)
   * @property {string} [email]
   * @property {string} [address]
   */

  /** @type {Props} */
  let { phone = "(+225) 27 22 30 54 75 | 0501 877 877", email = "contact@onradio.ci", address = "Abidjan Cocody, Angré 8é tranche, non loin de la CNPS. One Radio 2é etage Porte B3" } = $props();
    
    // Mettre à jour l'année automatiquement
    let currentYear = $state();
    
    /** @type {Array<{id: number, icon: string, left: number, duration: number, delay: number, size: number}>} */
    let notes = $state([]);
    let noteId = 0;

    const musicIcons = ['♪', '♫', '♬', '♩', '𝅘𝅥𝅮', '𝅘𝅥𝅯'];

    function spawnNote() {
      const id = noteId++;
      const note = {
        id,
        icon: musicIcons[Math.floor(Math.random() * musicIcons.length)],
        left: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: 0,
        size: 0.8 + Math.random() * 1.2
      };
      notes = [...notes, note];
      setTimeout(() => {
        notes = notes.filter(n => n.id !== id);
      }, note.duration * 1000);
    }

    onMount(() => {
      currentYear = new Date().getFullYear();

      // Spawn initial batch
      for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnNote(), i * 500);
      }

      // Continuously spawn notes
      const interval = setInterval(() => {
        spawnNote();
      }, 800 + Math.random() * 1200);

      return () => clearInterval(interval);
    });
  </script>
  
  <footer>
    <!-- Notes musicales flottantes -->
    <div class="floating-notes">
      {#each notes as note (note.id)}
        <span
          class="music-note"
          style="left: {note.left}%; animation-duration: {note.duration}s; font-size: {note.size}rem;"
        >
          {note.icon}
        </span>
      {/each}
    </div>

    <div class="footer-content">
      <div class="footer-section">
        <h3>Contactez-nous</h3>
        <div class="contact-info">
          <p><i class="bi bi-telephone-fill"></i> {phone}</p>
          <p><i class="bi bi-envelope-fill"></i> {email}</p>
          <p><i class="bi bi-geo-alt-fill"></i> {address}</p>
        </div>
      </div>
  
      <div class="footer-section">
        <h3>Liens Rapides</h3>
        <ul>
          <!-- <li><a href="/about"><i class="bi bi-info-circle-fill"></i> À propos</a></li> -->
          <li><a href="/news"><i class="bi bi-info"></i> Actualités</a></li>
          <li><a href="/events"><i class="bi bi-calendar3"></i> Events</a></li>
          <li><a href="/podcasts"><i class="bi bi-music-note-beamed"></i> PodCasts</a></li>
          <li><a href="/webradio"><i class="bi bi-music-note-beamed"></i> Webradios</a></li>
          <li><a href="/programme"><i class="bi bi-music-note-beamed"></i> Nos Emissions</a></li>
          <li><a href="/contact"><i class="bi bi-chat-dots-fill"></i> Contact</a></li>
        </ul>
      </div>
  
      <div class="footer-section">
        <h3>Suivez-nous</h3>
        <div class="social-links">
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <a href="https://www.facebook.com/oneradioci" target="_blank" class="social-link"><i class="bi bi-facebook"></i></a>
          <a href="https://www.youtube.com/@oneradiocotedivoire6837" class="social-link"><i class="bi bi-youtube"></i></a>
          <a href="#" class="social-link"><i class="bi bi-instagram"></i></a> 
        </div>
        <h3>Nos Applications</h3>
        <div class="app-links">
          <a href="https://play.google.com/store" target="_blank" class="app-btn">
            <i class="bi bi-google-play"></i>
            <div class="app-btn-text">
              <span class="app-btn-small">Télécharger sur</span>
              <span class="app-btn-big">Google Play</span>
            </div>
          </a>
          <a href="https://apps.apple.com" target="_blank" class="app-btn">
            <i class="bi bi-apple"></i>
            <div class="app-btn-text">
              <span class="app-btn-small">Télécharger sur</span>
              <span class="app-btn-big">App Store</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  
    <div class="footer-bottom">
        <p>Copyright © {currentYear} <a href="https://niatechnologie.com" target="_blank">niatechnologie</a>  -  Tous droits reservés.</p>
    </div>
  </footer>
  
  <style>
    /* Styles du footer */
    footer {
      background-color: #1a1a1a;
      color: #e0e0e0;
      padding:3rem 1rem;
      font-family: 'Roboto';
      position: relative;
      overflow: hidden;
    }

    /* Notes musicales flottantes */
    .floating-notes {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .music-note {
      position: absolute;
      bottom: -2rem;
      color: #ff1919;
      opacity: 0;
      animation: floatUp linear forwards;
      text-shadow: 0 0 6px rgba(255, 25, 25, 0.4);
    }

    @keyframes floatUp {
      0% {
        opacity: 0;
        transform: translateY(0) rotate(0deg);
      }
      15% {
        opacity: 0.9;
      }
      70% {
        opacity: 0.6;
      }
      100% {
        opacity: 0;
        transform: translateY(-400px) rotate(20deg);
      }
    }

    .footer-content {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }
    
    .footer-section h3 {
      color: white;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      position: relative;
    }
    
    .footer-section h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.5rem;
      width: 50px;
      height: 2px;
      background-color: #ff1919;
    }
    
    .contact-info p {
      margin: 0.8rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .contact-info i {
      font-size: 1.2rem;
      color: #ff1919;
    }
    
    ul {
      list-style: none;
    }
    
    ul li {
      margin: 0.8rem 0;
    }
    
    ul li i {
      margin-right: 0.5rem;
      color: #ff1919;
    }
    
    a {
      color: #e0e0e0;
      text-decoration: none;
      transition: color 0.3s ease;
      display: inline-flex;
      align-items: center;
    }
    
    a:hover {
      color: white;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
    }
    
    .social-link {
      padding: 0.8rem;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .social-link i {
      font-size: 1.2rem;
    }
    
    .social-link:hover {
      background-color: #ff1919;
      color: white;
    }

    /* Boutons App Store / Play Store */
    .app-links {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .app-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 1rem;
      border: 1px solid #555;
      border-radius: 8px;
      transition: all 0.3s ease;
      max-width: 200px;
    }

    .app-btn:hover {
      border-color: #ff1919;
      background-color: rgba(255, 25, 25, 0.1);
    }

    .app-btn i {
      font-size: 1.6rem;
      color: #ff1919;
    }

    .app-btn-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .app-btn-small {
      font-size: 0.65rem;
      color: #aaa;
    }

    .app-btn-big {
      font-size: 0.95rem;
      font-weight: 600;
      color: #fff;
    }

    .footer-bottom {
      margin-top: 2rem;
      padding-top: 2rem;
      text-align: center;
      border-top: 1px solid #333;
    }
    
    .footer-bottom p {
      font-size: 0.9rem;
      color: #888;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .text-red {
      color: #ff4444;
    }
    
    /* Media Queries pour la responsivité */
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      
      .footer-section h3::after {
        left: 50%;
        transform: translateX(-50%);
      }
      
      .social-links {
        justify-content: center;
      }
      
      .contact-info p {
        justify-content: center;
      }

      .app-links {
        align-items: center;
      }
    }
  </style>