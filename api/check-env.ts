// API endpoint para verificar variables de entorno en Vercel
export default async function handler(_request: Request) {
  try {
    // Verificar que las variables de entorno están disponibles en el servidor
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    // Respuesta simplificada y rápida
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: {
        urlConfigured: !!supabaseUrl,
        keyConfigured: !!supabaseKey,
        urlValid: supabaseUrl ? supabaseUrl.includes('.supabase.co') : false
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
      message: 'Failed to check environment'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }
}