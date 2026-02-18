export const prerender = true;
export async function load({ fetch, params }) {
    try {
       
      // Appel à l'API pour récupérer les détails du produit
      const response = await fetch(`https://adminradio.oneradio.ci/radio_one/programme.php`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            programme: null,
            status: 'not_found'
          };
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Extraire les données JSON
      const programme = await response.json();
      
      return {
        programme,
        status: 'success'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la news:', error);
      
      // Retourner l'erreur pour la gérer côté client
      return {
        programme: null,
        error: error.message,
        status: 'error'
      };
    }
  }