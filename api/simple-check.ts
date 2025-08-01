// Endpoint súper simple para verificar variables de entorno - TURSO
export default async function handler(_request: Request) {
  return new Response(JSON.stringify({
    url: !!process.env.VITE_TURSO_DATABASE_URL,
    token: !!process.env.VITE_TURSO_AUTH_TOKEN,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} 