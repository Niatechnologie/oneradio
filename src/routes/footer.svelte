<script>
  let { phone = "(+225) 05 01 877 877", email = "contact@oneradio.ci", address = "Abidjan Cocody, Angré 8ème tranche — One Radio, 2ème étage Porte B3" } = $props();

  let currentYear = $state(new Date().getFullYear());
</script>

<footer>
  <div class="footer-inner">

    <!-- Branding -->
    <div class="footer-brand">
      <div class="brand-logo">ONE<span>RADIO</span></div>
      <p class="brand-tagline">La radio de la nouvelle génération</p>
      <div class="social-row">
        <a href="https://wa.me/2250501877877"                                          target="_blank" rel="noopener" class="soc soc-wa"  aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
        <a href="https://www.facebook.com/oneradioci"                                  target="_blank" rel="noopener" class="soc soc-fb"  aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="https://www.youtube.com/@oneradiocotedivoire6837"                     target="_blank" rel="noopener" class="soc soc-yt"  aria-label="YouTube"><i class="bi bi-youtube"></i></a>
        <a href="https://www.tiktok.com/@oneradioci?_r=1&_t=ZS-95MxlXMAaPv"           target="_blank" rel="noopener" class="soc soc-tt"  aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
        <a href="https://www.instagram.com/oneradioci"                                 target="_blank" rel="noopener" class="soc soc-ig"  aria-label="Instagram"><i class="bi bi-instagram"></i></a>
      </div>
    </div>

    <!-- Liens -->
    <div class="footer-col">
      <h4>Navigation</h4>
      <ul>
        <li><a href="/news"><i class="bi bi-newspaper"></i> Actualités</a></li>
        <li><a href="/events"><i class="bi bi-calendar3"></i> Événements</a></li>
        <li><a href="/events/one-comedy-club"><i class="bi bi-mic-fill"></i> ONE COMEDY CLUB</a></li>
        <li><a href="/podcasts"><i class="bi bi-headphones"></i> Podcasts</a></li>
        <li><a href="/programme"><i class="bi bi-tv"></i> Nos Émissions</a></li>
        <li><a href="/contact"><i class="bi bi-chat-dots-fill"></i> Contact</a></li>
        <li><a href="/webradio"><i class="bi bi-broadcast"></i> Webradios</a></li>
      </ul>
    </div>

    <!-- Contact + Apps -->
    <div class="footer-col">
      <h4>Contact</h4>
      <ul class="contact-list">
        <li><i class="bi bi-telephone-fill"></i> <span>{phone}</span></li>
        <li><i class="bi bi-envelope-fill"></i> <a href="mailto:{email}">{email}</a></li>
        <li><i class="bi bi-geo-alt-fill"></i> <span>{address}</span></li>
      </ul>

      <h4 style="margin-top:1.25rem;">Applications</h4>
      <div class="app-row">
       <a href="https://apps.apple.com" target="_blank" class="app-btn">
          <i class="bi bi-apple"></i>
          <div><span>Télécharger sur</span><strong>App Store</strong></div>
        </a>
        <a href="https://play.google.com/store" target="_blank" class="app-btn">
          <i class="bi bi-google-play"></i>
          <div><span>Disponible sur</span><strong>Google Play</strong></div>
        </a>
       
      </div>

    </div>

  </div>

  <div class="footer-bottom">
    <p>© {currentYear} <a href="https://niatechnologie.com" target="_blank" rel="noopener">Niatechnologie</a> — Tous droits réservés.</p>
    <p class="footer-bottom-right">One Radio CI · Abidjan</p>
  </div>
</footer>

<style>
  footer {
    background: #111;
    color: #ccc;
    font-family: 'Roboto', sans-serif;
    padding: 2rem 1.25rem 0;
    position: relative;
    overflow: hidden;
  }
  footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, #ff1919 25%, #ff4444 50%, #ff1919 75%, transparent 100%);
  }

  /* Layout principal */
  .footer-inner {
    position: relative; z-index:1;
    max-width: 1100px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 1fr 1.4fr;
    gap: 2rem;
    padding-bottom: 1.75rem;
  }

  /* Branding */
  .brand-logo {
    font-size: 1.6rem; font-weight: 900; color: #fff;
    letter-spacing: .04em; line-height: 1; margin-bottom: .35rem;
  }
  .brand-logo span { color: #ff1919; }
  .brand-tagline {
    font-size: .78rem; color: #888; margin-bottom: 1rem; font-style: italic;
  }

  .social-row { display:flex; gap:.5rem; flex-wrap:wrap; }
  .soc {
    width:34px; height:34px; border-radius:50%;
    border: 1.5px solid rgba(255,255,255,.12);
    display:flex; align-items:center; justify-content:center;
    font-size:.95rem; text-decoration:none;
    transition: transform .18s, background .18s, border-color .18s;
  }
  .soc:hover { transform:translateY(-3px) scale(1.1); }
  .soc-wa { color:#fff; } .soc-wa:hover { background:#25d366; color:#fff; border-color:#25d366; }
  .soc-fb { color:#fff; } .soc-fb:hover { background:#1877f2; color:#fff; border-color:#1877f2; }
  .soc-yt { color:#fff; } .soc-yt:hover { background:#ff0000; color:#fff; border-color:#ff0000; }
  .soc-tt { color:#fff;    } .soc-tt:hover { background:#333;    color:#fff; border-color:#555;    }
  .soc-ig { color:#fff; } .soc-ig:hover { background:#e1306c; color:#fff; border-color:#e1306c; }

  /* Colonnes */
  .footer-col h4 {
    color:#fff; font-size:.85rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.08em;
    margin-bottom:.75rem; padding-bottom:.4rem;
    border-bottom: 2px solid #ff1919; display:inline-block;
  }

  ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.45rem; }
  ul li, ul li a {
    display:inline-flex; align-items:flex-start; gap:.45rem;
    font-size:.83rem; color:#bbb; text-decoration:none;
    transition:color .18s;
  }
  ul li a:hover { color:#fff; }
  ul li i { color:#ff1919; flex-shrink:0; margin-top:.1rem; font-size:.85rem; }

  .contact-list li { align-items:flex-start; color:#bbb; }
  .contact-list li i { flex-shrink:0; }
  .contact-list li span, .contact-list li a { color:#bbb; font-size:.83rem; line-height:1.45; }
  .contact-list li a:hover { color:#fff; }

  /* App buttons */
  .app-row { display:flex; flex-direction:row; flex-wrap:wrap; gap:.5rem; }
  .app-btn {
    display:inline-flex; align-items:center; gap:.55rem;
    padding:.45rem .85rem; border:1px solid #444; border-radius:8px;
    text-decoration:none; max-width:190px;
    transition: border-color .18s, background .18s;
  }
  .app-btn:hover { border-color:#ff1919; background:rgba(255,25,25,.07); }
  .app-btn i { font-size:1.4rem; color:#ff1919; }
  .app-btn div { display:flex; flex-direction:column; line-height:1.2; }
  .app-btn div span  { font-size:.62rem; color:#888; }
  .app-btn div strong { font-size:.85rem; color:#fff; font-weight:600; }

  /* Bottom bar */
  .footer-bottom {
    position:relative; z-index:1;
    border-top:1px solid #2a2a2a;
    padding:.75rem 0;
    max-width:1100px; margin:0 auto;
    display:flex; align-items:center; justify-content:space-between;
    gap:.5rem; flex-wrap:wrap;
  }
  .footer-bottom p { font-size:.78rem; color:#666; margin:0; display:flex; align-items:center; gap:.35rem; }
  .footer-bottom a { color:#ff1919; text-decoration:none; }
  .footer-bottom a:hover { text-decoration:underline; }
  .footer-bottom-right { color:#555 !important; font-size:.75rem !important; }

  /* Responsive */
  @media (max-width: 900px) {
    .footer-inner { grid-template-columns: 1fr 1fr; }
    .footer-brand { grid-column: 1 / -1; }
  }
  @media (max-width: 560px) {
    .footer-inner { grid-template-columns: 1fr; gap:1.5rem; }
    .footer-bottom { flex-direction:column; text-align:center; }
  }
</style>
