<script>
  import { onMount } from 'svelte';

  let isVisible = $state(false);

  onMount(() => {
    isVisible = true;
  });
</script>

<svelte:head>
  <title>ONE COMEDY CLUB – One Radio</title>
  <meta name="description" content="ONE COMEDY CLUB, la plateforme humoristique officielle de One Radio. Stand-up, live, radio, digital et formation en Côte d'Ivoire et en Afrique." />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
<script>
// Exemple de données, à remplacer par des données dynamiques si besoin
let comediens = [
  {
    photo: '/src/lib/img/comedien1.jpg',
    nom: 'Comédien 1',
    description: 'Description du comédien 1.',
    dateSpectacle: '2026-05-10',
    nomSpectacle: 'Spectacle A'
  },
  {
    photo: '/src/lib/img/comedien2.jpg',
    nom: 'Comédien 2',
    description: 'Description du comédien 2.',
    dateSpectacle: '2026-05-15',
    nomSpectacle: 'Spectacle B'
  }
  // Ajoutez d'autres comédiens ici
];
</script>

<style>
.comedy-program {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.comedy-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem 1rem 1rem;
  margin-bottom: 1.5rem;
}
.comedy-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}
.comedy-card .nom {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.comedy-card .description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 1.2rem;
  text-align: center;
}
.comedy-card .footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid #eee;
  padding-top: 0.7rem;
  font-size: 0.98rem;
  color: #222;
  margin-top: auto;
}
.comedy-card .footer .date {
  font-weight: 500;
}
.comedy-card .footer .spectacle {
  font-style: italic;
  color: #0077cc;
}
</style>

<h1>Programme Comedy Club</h1>
<div class="comedy-program">
  {#each comediens as comedien}
    <div class="comedy-card">
      <img src={comedien.photo} alt={comedien.nom} />
      <div class="nom">{comedien.nom}</div>
      <div class="description">{comedien.description}</div>
      <div class="footer">
        <span class="date">{comedien.dateSpectacle}</span>
        <span class="spectacle">{comedien.nomSpectacle}</span>
      </div>
    </div>
  {/each}
</div>
    color: var(--occ-white);
    letter-spacing: 0.02em;
    margin-bottom: 0.75rem;
  }

  .occ-tagline {
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    color: var(--occ-yellow);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .occ-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .occ-section {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }

  .occ-section.visible { opacity: 1; transform: translateY(0); }

  .occ-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
  }

  .occ-two-col.visible { opacity: 1; transform: translateY(0); }

  .occ-section-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .occ-section-header h2 {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--occ-text);
    position: relative;
  }

  .occ-section-header h2::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--occ-yellow);
    border-radius: 2px;
  }

  .occ-section-header--light h2 { color: var(--occ-white); }
  .occ-section-header--light h2::after { background: var(--occ-yellow); }

  .occ-card {
    background: var(--occ-white);
    border-radius: var(--occ-radius);
    padding: 1.75rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  }

  .occ-card p { color: var(--occ-muted); line-height: 1.7; font-size: 1rem; }
  .occ-card--dark { background: var(--occ-dark2); }
  .occ-card--dark p { color: #ccc; }
  .occ-card--dark strong { color: var(--occ-yellow); }
  .occ-mt { margin-top: 0.85rem; }

  .occ-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }

  .occ-list li {
    font-size: 0.95rem;
    color: var(--occ-muted);
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    line-height: 1.5;
  }

  .occ-list li::before {
    content: '';
    display: inline-block;
    width: 16px; height: 16px; min-width: 16px;
    background: var(--occ-yellow);
    border-radius: 50%;
    margin-top: 2px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13 4L6.5 11 3 7.5' stroke='%23000' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .occ-activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.25rem;
  }

  .occ-activity-card {
    background: var(--occ-white);
    border-radius: var(--occ-radius);
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    border-top: 4px solid var(--occ-yellow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .occ-activity-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.11); }

  .occ-activity-icon { font-size: 2rem; margin-bottom: 0.75rem; color: var(--occ-yellow); }

  .occ-activity-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--occ-text); margin-bottom: 0.5rem; }

  .occ-activity-card p { font-size: 0.9rem; color: var(--occ-muted); line-height: 1.5; margin-bottom: 1rem; }

  .occ-formats { display: flex; flex-wrap: wrap; gap: 0.4rem; }

  .occ-format-badge {
    background: #f0f0f0; color: #333; font-size: 11px;
    padding: 3px 10px; border-radius: 20px; font-weight: 500;
  }

  .occ-section--gold {
    background: linear-gradient(135deg, #fffbea, #fff8d0);
    border-radius: var(--occ-radius);
    padding: 2rem;
    border: 1.5px solid var(--occ-yellow);
  }

  .occ-lead { font-size: 1rem; color: var(--occ-muted); margin-bottom: 1.25rem; line-height: 1.6; }

  .occ-partner-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.85rem;
  }

  .occ-partner-item {
    background: var(--occ-white); border-radius: 0.6rem; padding: 0.75rem 1rem;
    font-size: 0.9rem; font-weight: 500; color: var(--occ-text);
    display: flex; align-items: center; gap: 0.6rem;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  .occ-partner-item i { color: var(--occ-yellow-dark); font-size: 1rem; }

  .occ-why-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
    gap: 1rem;
  }

  .occ-why-item {
    background: var(--occ-white); border-radius: var(--occ-radius);
    padding: 1.25rem 1rem; text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    transition: transform 0.25s ease;
  }

  .occ-why-item:hover { transform: translateY(-3px); }
  .occ-why-icon { display: block; font-size: 1.75rem; margin-bottom: 0.6rem; color: var(--occ-yellow-dark); }
  .occ-why-item p { font-size: 0.9rem; color: var(--occ-muted); line-height: 1.5; }
  .occ-why-item strong { color: var(--occ-text); }

  .occ-ambition {
    background: linear-gradient(135deg, var(--occ-dark) 0%, #1a0a00 100%);
    border-radius: var(--occ-radius);
    padding: 3rem 2rem; text-align: center;
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
  }

  .occ-ambition.visible { opacity: 1; transform: translateY(0); }
  .occ-ambition-icon { font-size: 2.5rem; margin-bottom: 0.75rem; color: var(--occ-yellow); }
  .occ-ambition h2 { font-size: 1.5rem; font-weight: 700; color: var(--occ-white); margin-bottom: 0.75rem; }
  .occ-ambition p { font-size: 1.05rem; color: #ccc; line-height: 1.7; max-width: 600px; margin: 0 auto; }
  .occ-ambition strong { color: var(--occ-yellow); }

  .occ-section--join {
    background: var(--occ-gray);
    border-radius: var(--occ-radius);
    padding: 2rem;
  }

  .occ-join-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem; margin-bottom: 1.5rem;
  }

  .occ-join-card {
    background: var(--occ-white); border-radius: 0.75rem; padding: 1.25rem;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    transition: transform 0.2s ease;
  }

  .occ-join-card:hover { transform: translateY(-3px); }
  .occ-join-emoji { display: block; font-size: 2rem; margin-bottom: 0.5rem; color: var(--occ-yellow-dark); }
  .occ-join-card strong { display: block; font-size: 0.95rem; margin-bottom: 0.35rem; color: var(--occ-text); }
  .occ-join-card p { font-size: 0.85rem; color: var(--occ-muted); line-height: 1.5; }
  .occ-cta-label { text-align: center; font-size: 1.05rem; font-weight: 700; color: var(--occ-text); }
  .occ-cta-label i { color: var(--occ-yellow-dark); }

  .occ-contact {
    background: var(--occ-dark2); border-radius: var(--occ-radius); padding: 2rem;
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
  }

  .occ-contact.visible { opacity: 1; transform: translateY(0); }
  .occ-contact h2 { font-size: 1.3rem; font-weight: 700; color: var(--occ-white); margin-bottom: 1.25rem; }
  .occ-contact h2 i { color: var(--occ-yellow); margin-right: 0.4rem; }
  .occ-contact-grid { display: flex; flex-wrap: wrap; gap: 1.25rem; }
  .occ-contact-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; color: #ccc; }
  .occ-contact-item i { color: var(--occ-yellow); font-size: 1rem; }
  .occ-contact-item a { color: var(--occ-yellow); text-decoration: none; font-weight: 500; }
  .occ-contact-item a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .occ-hero { padding: 3.5rem 1rem 2.5rem; }
    .occ-two-col { grid-template-columns: 1fr; }
    .occ-activities-grid { grid-template-columns: 1fr; }
    .occ-ambition { padding: 2rem 1.25rem; }
    .occ-partner-grid, .occ-why-grid, .occ-join-grid { grid-template-columns: 1fr; }
  }
</style>
