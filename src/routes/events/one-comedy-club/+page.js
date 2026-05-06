<script>
  export const load = () => {
    // Redirige vers la page programme_comedy.svelte par défaut
    return {
      status: 302,
      redirect: '/events/one-comedy-club/programme_comedy'
    };
  };
</script>
