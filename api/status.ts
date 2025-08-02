// Endpoint simple para verificar el estado de la aplicación - VERSIÓN TURSO
export default async function handler(_request: Request) {
  try {
    // Respuesta inmediata sin logs pesados
    const hasTursoUrl = !!(process.env.TURSO_DATABASE_URL);
    const hasTursoToken = !!(process.env.TURSO_AUTH_TOKEN);
    
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      turso: {
        configured: hasTursoUrl && hasTursoToken,
        urlConfigured: hasTursoUrl,
        tokenConfigured: hasTursoToken,
        urlLength: process.env.TURSO_DATABASE_URL?.length || 0,
        tokenLength: process.env.TURSO_AUTH_TOKEN?.length || 0
      }
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'Status check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }
}