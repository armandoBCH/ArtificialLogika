// Endpoint súper simple para verificar variables de entorno
export default async function handler(_request: Request) {
  return new Response(JSON.stringify({
    url: !!process.env.VITE_SUPABASE_URL,
    key: !!process.env.VITE_SUPABASE_ANON_KEY,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} 