// src/routes/products/[id]/+page.server.js
export async function load({params }) {
    try {
      // Récupérer l'ID de la news depuis les paramètres d'URL
      const { podcastsId } = params;

          return {
            idpodcast: podcastsId,
            status: 'not_found'
          };
    
      
    } catch (error) {
    return {
            idpodcast: podcastsId,
            status: 'not_found'
          };
    

    }
  }