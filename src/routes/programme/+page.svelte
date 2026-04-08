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
            <p class="header-subtitle">Guide des Emissions hebdomadaires</p>
          </div>
        </div>
        <div class="header-right">
          <a href="tel:+2250000000" class="phone-number">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16z"></path></svg>
            +225 00 00 00 00
          </a>
          <div class="social-links">
            <a href="https://www.youtube.com/@oneradio" target="_blank" rel="noopener noreferrer" class="social-link youtube" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.facebook.com/oneradio" target="_blank" rel="noopener noreferrer" class="social-link facebook" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@oneradio" target="_blank" rel="noopener noreferrer" class="social-link tiktok" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
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
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-subtitle {
      color: var(--color-gray-600);
      margin: 0;
      text-align: left;
    }

    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .phone-number {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 1rem;
      font-weight: 600;
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
    .social-link.tiktok   { background: #000; }
  
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