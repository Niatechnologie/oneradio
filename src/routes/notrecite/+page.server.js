// src/routes/products/[id]/+page.server.js
export const prerender = true;
export async function load({ fetch, params }) {
    try {
   
      // Appel à l'API pour récupérer les détails du produit
      const response = await fetch(`https://adminradio.oneradio.ci/radio_one/mensuel.php`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            magazines: null,
            status: 'not_found'
          };
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Extraire les données JSON
      const magazines = await response.json();
      
      return {
        magazines,
        status: 'success'
      };
    } catch (error) {
      console.error('Erreur de récupération', error);
      
      // Retourner l'erreur pour la gérer côté client
      return {
        magazines: null,
        error: error.message,
        status: 'error'
      };
    }
  }