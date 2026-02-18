// src/routes/products/[id]/+page.server.js
export async function load({ fetch, params }) {
    try {
      // Récupérer l'ID de la news depuis les paramètres d'URL
      const { eventId } = params;
      
      // Appel à l'API pour récupérer les détails du produit
      const response = await fetch(`https://adminradio.oneradio.ci/radio_one/event-details/${eventId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            detailevents: null,
            status: 'not_found'
          };
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Extraire les données JSON
      const detailevents = await response.json();
      
      return {
        detailevents,
        status: 'success'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la news:', error);
      
      // Retourner l'erreur pour la gérer côté client
      return {
        detailevents: null,
        error: error.message,
        status: 'error'
      };
    }
  }