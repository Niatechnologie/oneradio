<script>
    import { onMount } from 'svelte';
    
    
  /**
   * @typedef {Object} Props
   * @property {string} [phone] - Propriétés personnalisables (optionnelles)
   * @property {string} [email]
   * @property {string} [address]
   */

  /** @type {Props} */
  let { phone = "(+225) 27 21 25 61 10 | (+225) 27 21 24 03 47", email = "contact@radiotreichville.ci", address = "Abidjan, Côte d'Ivoire Treichville, Av. 1, Rue 21, près de la bourse de travail" } = $props();
    
    // Mettre à jour l'année automatiquement
    let currentYear = $state();
    
    onMount(() => {
      currentYear = new Date().getFullYear();
    });
  </script>
  
  <footer>
     
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
          <li><a href="/contact"><i class="bi bi-chat-dots-fill"></i> Contact</a></li>
        </ul>
      </div>
  
      <div class="footer-section">
        <h3>Suivez-nous</h3>
        <div class="social-links">
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <a href="https://www.facebook.com/RadioTreichville" target="_blank" class="social-link"><i class="bi bi-facebook"></i></a>
          <!-- <a href="#" class="social-link"><i class="bi bi-twitter-x"></i></a>
          <a href="#" class="social-link"><i class="bi bi-instagram"></i></a> -->
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
    }
    
    .footer-content {
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
    }
  </style>