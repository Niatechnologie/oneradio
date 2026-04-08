<script>
	import { onMount, onDestroy } from 'svelte';
	import RadioCard from './RadioCard.svelte';

	// URL de votre API PHP
	const API_URL = 'https://adminradio.oneradio.ci/liste_webradio.php'; // Remplacez par l'URL de votre fichier PHP

	// État réactif avec $state (Svelte 5)
	let radios = $state([]);
	let loading = $state(true);
	let error = $state(null);
	let currentPlayingId = $state(null);
	let audioPlayers = $state({});

	// Charger les données des webradios
	async function loadRadios() {
		try {
			loading = true;
			error = null;
			const response = await fetch(API_URL);
			const data = await response.json();

			if (data.error) {
				throw new Error(data.message);
			}

			radios = data;

			// Initialiser les lecteurs audio pour chaque radio
			data.forEach(radio => {
				const audio = new Audio();
				audio.preload = 'none';
				audio.volume = 0.7;
				audioPlayers[radio.id] = {
					audio: audio,
					url: radio.lien
				};
			});

		} catch (err) {
			console.error('Erreur de chargement:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}

	// Gérer la lecture/pause
	function handleTogglePlay(radioId) {
		const player = audioPlayers[radioId];
		if (!player) return;

		const audio = player.audio;

		// Si une autre radio joue, l'arrêter
		if (currentPlayingId && currentPlayingId !== radioId) {
			stopRadio(currentPlayingId);
		}

		if (audio.paused) {
			// Si l'audio n'a pas encore de source, la définir
			if (!audio.src) {
				audio.src = player.url;
			}
			audio.play().catch(error => {
				console.error('Erreur de lecture:', error);
			});
			currentPlayingId = radioId;
		} else {
			audio.pause();
			currentPlayingId = null;
		}
	}

	// Arrêter une radio
	function stopRadio(radioId) {
		const player = audioPlayers[radioId];
		if (player && player.audio) {
			player.audio.pause();
			player.audio.currentTime = 0;
		}
	}

	// Gérer le changement de volume
	function handleVolumeChange(radioId, volume) {
		const player = audioPlayers[radioId];
		if (player && player.audio) {
			player.audio.volume = volume / 100;
		}
	}

	// Charger les radios au montage
	onMount(() => {
		loadRadios();
	});

	// Nettoyer les ressources audio à la destruction
	onDestroy(() => {
		Object.values(audioPlayers).forEach(player => {
			if (player.audio) {
				player.audio.pause();
				player.audio.src = '';
			}
		});
	});
</script>

<div class="container">
	<div class="webradio-header">
		<div class="wh-title-row">
			<div class="bars-wrap">
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</div>
			<h2 class="section-title" >Nos webradios</h2>
			<div class="bars-wrap bars-wrap--flip">
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</div>
		</div>
		<p class="wh-subtitle">
			Écoutez les belles sonorités du monde,<br>sélectionnées selon vos goûts du moment.
		</p>
	
	</div>

	{#if loading}
		<div class="loading-container">
			<div class="big-loader"></div>
			<p>Chargement des radios...</p>
		</div>
	{:else if error}
		<div class="error-container">
			<h2>❌ Erreur de chargement</h2>
			<p>{error}</p>
			<button onclick={loadRadios} class="retry-button">Réessayer</button>
		</div>
	{:else}
		<div class="radio-grid">
			{#each radios as radio (radio.id)}
				<RadioCard 
					{radio}
					audio={audioPlayers[radio.id]?.audio}
					isPlaying={currentPlayingId === radio.id}
					onTogglePlay={() => handleTogglePlay(radio.id)}
					onVolumeChange={(volume) => handleVolumeChange(radio.id, volume)}
				/>
			{/each}
		</div>
	{/if}

	<div class="cta-block">
		<div class="cta-icon"><i class="bi bi-broadcast"></i></div>
		<div class="cta-text">
			<p class="cta-main">Nous mettons à votre disposition des <strong>webradios personnalisées</strong>, contactez dès maintenant notre service technique&nbsp;: nous vous proposons des solutions <strong>clé en main</strong>.</p>
			<a href="tel:+2250501877877" class="cta-phone">
				<i class="bi bi-telephone-fill"></i>
				Appelez au (+225) 0501 877 877
			</a>
		</div>
	</div>
</div>

<style>
	/* :global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}*/

	/* :global(body) {
		background: #000;
	}  */

	.container {
		max-width: 1200px;
		margin: 0 auto;
        margin-bottom: 50px;
	}

	/* ── Animated header ── */
	@keyframes wave {
		0%,100% { transform: scaleY(1); }
		50% { transform: scaleY(2.2); }
	}
	@keyframes pulse-dot {
		0%,100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	.webradio-header {
		text-align: center;
		padding: 2rem 0 1.5rem;
	}

	.wh-title-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-bottom: 12px;
	}

	.wh-title {
		font-size: 22px;
		font-weight: 500;
		color: var(--color-text-primary, #111);
	}

	.section-title {
		text-align: center;
		font-size: 1.7rem;
		color: #333;
		margin-bottom: 3rem;
		position: relative;
	}

	

	.bars-wrap {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 24px;
	}

	.bars-wrap--flip { transform: scaleX(-1); }

	.bar {
		display: inline-block;
		width: 4px;
		border-radius: 2px;
		background: #F00;
		transform-origin: bottom;
	}
	.bar:nth-child(1) { animation: wave 0.9s ease-in-out infinite 0s;    height: 14px; }
	.bar:nth-child(2) { animation: wave 0.9s ease-in-out infinite 0.15s; height: 20px; }
	.bar:nth-child(3) { animation: wave 0.9s ease-in-out infinite 0.3s;  height: 10px; }
	.bar:nth-child(4) { animation: wave 0.9s ease-in-out infinite 0.45s; height: 18px; }
	.bar:nth-child(5) { animation: wave 0.9s ease-in-out infinite 0.6s;  height: 12px; }

	.wh-subtitle {
		font-size: 15px;
		color: var(--color-text-secondary, #555);
		line-height: 1.6;
		max-width: 380px;
		margin: 0 auto;
	}

	.wh-live-label {
		font-size: 12px;
		color: #A32D2D;
		font-weight: 500;
	}

	.radio-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}

	.loading-container,
	.error-container {
		text-align: center;
		color: white;
		padding: 40px;
	}

	.big-loader {
		width: 60px;
		height: 60px;
		border: 6px solid rgba(255, 255, 255, 0.3);
		border-top: 6px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.error-container h2 {
		margin-bottom: 15px;
	}

	.retry-button {
		margin-top: 20px;
		padding: 12px 30px;
		font-size: 1em;
		background: white;
		color: #f54545;
		border: none;
		border-radius: 25px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.retry-button:hover {
		transform: scale(1.05);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 768px) {
		.radio-grid {
			grid-template-columns: 1fr;
		}
	}

	/* CTA block */
	.cta-block {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		background: linear-gradient(135deg, #1a0000 0%, #2d0000 100%);
		border: 1px solid #F0033;
		border-radius: 1rem;
		padding: 1.75rem 2rem;
		margin-top: 3rem;
	}

	.cta-icon {
		font-size: 2.5rem;
		color: #F00;
		flex-shrink: 0;
	}

	.cta-text {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.cta-main {
		font-size: 0.97rem;
		color: #ddd;
		line-height: 1.6;
		margin: 0;
	}

	.cta-main strong { color: #fff; }

	.cta-phone {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #E24B4A;
		color: #fff;
		font-size: 1rem;
		font-weight: 700;
		text-decoration: none;
		padding: 0.55rem 1.25rem;
		border-radius: 2rem;
		width: fit-content;
		transition: background 0.2s, transform 0.2s;
	}

	.cta-phone:hover {
		background: #c03939;
		transform: scale(1.03);
	}

	@media (max-width: 600px) {
		.cta-block { flex-direction: column; text-align: center; padding: 1.5rem 1.25rem; }
		.cta-phone { align-self: center; }
	}
</style>
