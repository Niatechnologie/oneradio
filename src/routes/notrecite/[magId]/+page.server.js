// src/routes/products/[id]/+page.server.js
// export const prerender = true;
export async function load({ fetch, params }) {
    try {
      // Récupérer l'ID de la news depuis les paramètres d'URL
      const { magId } = params;
      
      // Appel à l'API pour récupérer les détails du produit
      const response = await fetch(`https://admin.radiotreichville.ci/radio_treich/mag-details/${magId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            detailsmag: null,
            status: 'not_found'
          };
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Extraire les données JSON
      const detailsmag = await response.json();
      
      return {
        detailsmag,
        status: 'success'
      };
    } catch (error) {
      console.error('Erreur de récupération:', error);
      
      // Retourner l'erreur pour la gérer côté client
      return {
        detailsmag: null,
        error: error.message,
        status: 'error'
      };
    }
  }