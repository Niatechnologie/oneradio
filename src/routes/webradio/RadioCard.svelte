<script>
	import { onMount, onDestroy } from 'svelte';

	// Props avec $props() (Svelte 5)
	let { radio, audio, isPlaying, onTogglePlay, onVolumeChange } = $props();

	// État local avec $state (Svelte 5)
	let status = $state('ready');
	let statusText = $state('Prêt');
	let volume = $state(70);
	let errorMessage = $state('');
	let isLoading = $state(false);

	// Chemin de la pochette
	const pochettePath = $derived(
		radio.repertoire 
			? `pochettes/${radio.repertoire}/${radio.pochette}` 
			: `pochettes/${radio.pochette}`
	);

	// Configuration des événements audio
	function setupAudioEvents() {
		if (!audio) return;

		audio.addEventListener('loadstart', handleLoadStart);
		audio.addEventListener('canplay', handleCanPlay);
		audio.addEventListener('playing', handlePlaying);
		audio.addEventListener('pause', handlePause);
		audio.addEventListener('ended', handleEnded);
		audio.addEventListener('error', handleError);
		audio.addEventListener('waiting', handleWaiting);
	}

	function handleLoadStart() {
		isLoading = true;
		status = 'loading';
		statusText = 'Chargement...';
		errorMessage = '';
	}

	function handleCanPlay() {
		isLoading = false;
	}

	function handlePlaying() {
		isLoading = false;
		status = 'playing';
		statusText = 'En lecture';
	}

	function handlePause() {
		status = 'ready';
		statusText = 'En pause';
	}

	function handleEnded() {
		status = 'ready';
		statusText = 'Terminé';
	}

	function handleError(e) {
		isLoading = false;
		status = 'error';
		statusText = 'Erreur';
		errorMessage = 'Impossible de charger le flux audio';
		console.error('Erreur audio:', e);
	}

	function handleWaiting() {
		status = 'loading';
		statusText = 'Mise en mémoire tampon...';
	}

	// Gérer le changement de volume local
	function handleVolumeInput(e) {
		volume = parseInt(e.target.value);
		onVolumeChange(volume);
	}

	// Nettoyer les événements
	function cleanupAudioEvents() {
		if (!audio) return;

		audio.removeEventListener('loadstart', handleLoadStart);
		audio.removeEventListener('canplay', handleCanPlay);
		audio.removeEventListener('playing', handlePlaying);
		audio.removeEventListener('pause', handlePause);
		audio.removeEventListener('ended', handleEnded);
		audio.removeEventListener('error', handleError);
		audio.removeEventListener('waiting', handleWaiting);
	}

	// Montage du composant
	onMount(() => {
		setupAudioEvents();
	});

	// Démontage du composant
	onDestroy(() => {
		cleanupAudioEvents();
	});
</script>

<div class="radio-card">
	<div class="radio-header">
		<div class="radio-info">
			<div class="radio-title">{radio.designation}</div>
			<div class="radio-description">{radio.description}</div>
		</div>
		<img 
			src={pochettePath} 
			alt={radio.designation} 
			class="radio-pochette"
			onerror={(e) => e.target.style.display = 'none'}
		/>
	</div>

	<div class="player-controls">
		<button 
			class="play-button"
			class:playing={isPlaying}
			class:loading={isLoading}
			onclick={onTogglePlay}
			disabled={isLoading}
		>
			{#if isLoading}
				<div class="loader"></div>
			{:else if isPlaying}
				<span class="pause-icon">⏸</span>
			{:else}
				<span class="play-icon">▶</span>
			{/if}
		</button>

		<div class="volume-control">
			<span class="volume-icon">🔊</span>
			<input 
				type="range" 
				class="volume-slider" 
				min="0" 
				max="100" 
				bind:value={volume}
				oninput={handleVolumeInput}
			/>
		</div>
	</div>

	<div class="status-indicator">
		<span class="status-dot" class:loading={status === 'loading'} class:playing={status === 'playing'} class:error={status === 'error'}></span>
		<span class="status-text">{statusText}</span>
	</div>

	{#if errorMessage}
		<div class="error-message">{errorMessage}</div>
	{/if}
</div>

<style>
	.radio-card {
		background: white;
		border-radius: 15px;
		padding: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease;
	}

	.radio-card:hover {
		transform: translateY(-5px);
	}

	.radio-header {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}

	.radio-pochette {
		width: 60px;
		height: 60px;
		border-radius: 10px;
		object-fit: cover;
		margin-left: 15px;
		background: linear-gradient(135deg, #ff1b1b 0%, rgb(255, 0, 0) 100%);
	}

	.radio-info {
		flex: 1;
	}

	.radio-title {
		font-size: 1.2em;
		font-weight: bold;
		color: #333;
		margin-bottom: 5px;
	}

	.radio-description {
		font-size: 0.9em;
		color: #666;
		font-style: italic;
	}

	.player-controls {
		display: flex;
		align-items: center;
		gap: 15px;
		margin-top: 15px;
	}

	.play-button {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, #ff1b1b 0%, rgb(255, 0, 0) 100%);
		color: white;
		font-size: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.play-button:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
	}

	.play-button:active:not(:disabled) {
		transform: scale(0.95);
	}

	.play-button.playing {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	}

	.play-button:disabled {
		cursor: not-allowed;
		opacity: 0.8;
	}

	/* Loader (spinner) */
	.loader {
		width: 30px;
		height: 30px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.play-icon,
	.pause-icon {
		display: inline-block;
	}

	.volume-control {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.volume-icon {
		font-size: 20px;
		color: #667eea;
	}

	.volume-slider {
		flex: 1;
		height: 5px;
		border-radius: 5px;
		background: #ddd;
		outline: none;
		-webkit-appearance: none;
		cursor: pointer;
	}

	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #667eea;
		cursor: pointer;
	}

	.volume-slider::-moz-range-thumb {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #667eea;
		cursor: pointer;
		border: none;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
		padding: 10px;
		background: #f5f5f5;
		border-radius: 8px;
		font-size: 0.85em;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ccc;
	}

	.status-dot.loading {
		background: #ffa500;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.status-dot.playing {
		background: #4caf50;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.status-dot.error {
		background: #f44336;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.error-message {
		color: #f44336;
		font-size: 0.85em;
		margin-top: 10px;
	}
</style>