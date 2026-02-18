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
	<h1>Webradios en Direct</h1>

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
</div>

<style>
	/* :global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		padding: 20px;
	} */

	.container {
		max-width: 1200px;
		margin: 0 auto;
        margin-bottom: 50px;
	}

	h1 {
		text-align: center;
		color: rgb(0, 0, 0);
		margin-bottom: 30px;
        margin-top: 30px;
		font-size: 2.2em;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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

		h1 {
			font-size: 1.8em;
		}
	}
</style>
