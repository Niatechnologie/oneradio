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
