<script>
    // Data source
  
    import {onMount} from 'svelte';

    let { data } = $props();
    const success=data.status;
    let scheduleData=data.programme;

    let isLoading = true;
    let error = null;

const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Get the current day of the week and set it as the default selected day
const getCurrentDay = () => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const currentDayIndex = new Date().getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  return days[currentDayIndex];
};

let selectedDay = $state(getCurrentDay());

// Icons as SVG strings
const icons = {
  Culture: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
  Politique: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg>',
  talk: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
};

// Handle day selection
function updateDay(day) {
  selectedDay = day;
}

// Helper function to get abbreviated day name
function getAbbreviatedDay(day) {
  return day.slice(0, 3);
}
</script>
<svelte:head>
  <title>One Radio - Emissions</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</svelte:head>
  
  <div class="container">
    <!-- Header -->
    <header style="background:#fff !important;" class="header">
      <div class="header-content">
        <div class="header-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="radio-icon">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"></path>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"></path>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
          </svg>
          <div>
            <h1>Emissions</h1>
            <p class="header-subtitle">Programme des Emissions hebdomadaires</p>
          </div>
        </div>
        <div class="header-divider"></div>
        <div class="header-right">
        <span style=" padding-top:5px" >Suivez nous en direct</span>
          <a href="tel:+2250501877877" class="phone-number">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16z"></path></svg>
            (+225) 0500 877 877
          </a>
          <div class="social-links">
           <a href="https://wa.me/2250501877877" target="_blank" rel="noopener noreferrer" class="social-link whatsapp" aria-label="WhatsApp">
             <i class="bi bi-whatsapp"></i>
           </a>
            <a href="https://www.facebook.com/oneradioci" target="_blank" rel="noopener noreferrer" class="social-link facebook" aria-label="Facebook">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="https://www.youtube.com/@oneradiocotedivoire6837" target="_blank" rel="noopener noreferrer" class="social-link youtube" aria-label="YouTube">
              <i class="bi bi-youtube"></i>
            </a>
            <a href="https://www.tiktok.com/@oneradioci?_r=1&_t=ZS-95MxlXMAaPv" target="_blank" rel="noopener noreferrer" class="social-link tiktok" aria-label="YouTube">
              <i class="bi bi-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </header>
  
    <!-- Day Navigation -->
    <div class="tabs-container">
      <div class="tabs">
        <nav id="dayTabs">
          {#each weekDays as day}
            <button 
              class="tab-button {selectedDay === day ? 'active' : ''}" 
              onclick={() => updateDay(day)}
            >
              {getAbbreviatedDay(day)}
            </button>
          {/each}
        </nav>
      </div>
    </div>
  
    <!-- Programs Section -->
    <div class="programs-container">
        <div class="programs-list">
        {#each scheduleData[selectedDay] as program}
          <div class="program-card">
            <div class="program-content">
              <div class="pochette">
                <img src="https://adminradio.oneradio.ci/emissions/{program.photo}"  alt={program.designation} width="100" height="100" style="border-radius: 0.5rem;">
              </div>
              <div class="program-info">
                <h3 class="program-title">{program.designation}</h3>
                <p class="program-host">Par {program.presentateur} | <span class="program-type">{@html icons[program.categorie]}  <span>{program.categorie}</span></span></p>
                
                <p class="program-description">{@html program.description}</p>
              </div>
              <div class="program-time">
                {@html icons.clock}
                <span>{program.hdebut} - {program.hfin}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <style>
    /* Base styles */
    :root {
      --color-indigo-50: #eef2ff;
      --color-indigo-600: #ff0000;
      --color-purple-50: #faf5ff;
      --color-gray-500: #6b7280;
      --color-gray-600: #4b5563;
      --color-gray-700: #374151;
      --color-gray-900: #111827;
    }
  
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  
    :global(body) {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      background: linear-gradient(to bottom right, var(--color-indigo-50), var(--color-purple-50));
    }
  
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  
    /* Header styles */
    .header {
      margin-bottom: 3rem;
    }
  
    .header-content {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 0.5rem;
    }

    .header-left {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-right: 1.5rem;
    }

    .header-divider {
      width: 2px;
      align-self: stretch;
      background-color: #e00;
      border-radius: 1px;
      flex-shrink: 0;
    }

    .header-subtitle {
      color: var(--color-gray-600);
      margin: 0;
      text-align: left;
    }

    .header-right {
      flex: 0 0 50%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      padding-left: 1.5rem;
    }

    .phone-number {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-gray-900);
      text-decoration: none;
      transition: color 0.2s;
    }

    .phone-number:hover {
      color: #ff2a2a;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: #fff;
      text-decoration: none;
      transition: opacity 0.2s, transform 0.2s;
    }

    .social-link:hover {
      opacity: 0.85;
      transform: scale(1.1);
    }

    .social-link.youtube  { background: #FF0000; }
    .social-link.facebook { background: #1877F2; }
    .social-link.tiktok   { background: #000000; }
    .social-link.whatsapp { background: #25D366; }
  
    .radio-icon {
      width: 2rem;
      height: 2rem;
      color: var(--color-indigo-600);
    }
  
    h1 {
      font-size: 1.875rem;
      font-weight: bold;
      color: var(--color-gray-900);
    }
  

  
    /* Tabs styles */
    .tabs-container {
      max-width: 48rem;
      margin: 0 auto 3rem;
    }
  
    .tabs {
      background: white;
      border-radius: 15rem;
      padding: 0rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        overflow: hidden;
    }
  
    nav {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
  
    .tab-button {
      padding: 0.95rem;
      border: none;
      background: none;
      cursor: pointer;
      position: relative;
      color: var(--color-gray-500);
      transition: color 0.3s;
      font-size: 0.95rem;
      font-weight: 600;
    }
  
    .tab-button:hover {
      color: var(--color-gray-700);
    }
  
    .tab-button.active {
      color: #fff;
      font-weight: 600;
      background: #ff2a2a;
    }
  
    /* Programs styles */
    .programs-container {
      max-width: 64rem;
      margin: 0 auto;
    }
  
    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-gray-900);
      margin-bottom: 2rem;
    }
  
    .programs-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  
    .program-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: box-shadow 0.3s;
    }
  
    .program-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  
    .program-content {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
  
    .program-info {
      flex-grow: 1;
    }
  
    .program-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-gray-900);
      margin-bottom: 0.25rem;
    }
  
    .program-host {
      color: var(--color-gray-600);
      margin-bottom: 0.5rem;
    }
  
    .program-type {
        margin-bottom: 0.75rem;
    }
  
    .program-type :global(svg) {
      width: 1rem;
      height: 1rem;
      color: var(--color-indigo-600);
    }
  
    .program-type span {
      font-size: 0.875rem;
      color: var(--color-indigo-600);
      font-weight: 500;
      text-transform: capitalize;
    }
  
    .program-description {
      color: var(--color-gray-600);
    }
  
    .program-time {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background:rgba(255, 127, 42, 0.051);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      white-space: nowrap;
      height: 2rem;
    }
  
    .program-time :global(svg) {
      width: 1rem;
      height: 1rem;
      color:#111827;
    }
  
    .program-time span {
      font-size: 1.875rem;
      font-weight: 500;
      color: #343538;
    }
  </style>