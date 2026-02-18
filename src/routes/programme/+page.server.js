export const prerender = false; // ← correction ici

export async function load({ fetch, params }) {
    try {
      const response = await fetch(`https://adminradio.oneradio.ci/radio_one/programmes.php`);  
      if (!response.ok) {
        if (response.status === 404) {
          return { programme: null, status: 'not_found' };
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
     
      const programme = await response.json();
      return { programme, status: 'success' };

    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error);
      return { programme: null, error: error.message, status: 'error' };
    }
}