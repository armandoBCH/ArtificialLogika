import { createClient } from '@libsql/client';

// Crear cliente de Turso
const tursoUrl = process.env.VITE_TURSO_DATABASE_URL;
const tursoToken = process.env.VITE_TURSO_AUTH_TOKEN;

const turso = createClient({
  url: tursoUrl || '',
  authToken: tursoToken || ''
});

export default async function handler(request: Request) {
  const method = request.method;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (!type) {
    return new Response(JSON.stringify({ error: 'Content type is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    switch (method) {
      case 'GET': {
        // Obtener contenido por tipo
        const result = await turso.execute({
          sql: 'SELECT * FROM content WHERE content_type = ? ORDER BY created_at DESC',
          args: [type]
        });
        
        if (!result.rows) {
          throw new Error('Failed to fetch data from Turso');
        }
        
        const contentItems = result.rows.map(row => ({
          id: row.id,
          content_type: row.content_type,
          content_data: JSON.parse(row.content_data as string),
          created_at: row.created_at,
          updated_at: row.updated_at
        }));
        
        return new Response(JSON.stringify(contentItems), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'POST': {
        // Crear o actualizar contenido de un tipo específico
        const body = await request.json();
        const { content_data, id } = body;
        const contentId = id || `${type}-${Date.now()}`;
        const contentData = JSON.stringify(content_data);
        
        // Usar INSERT OR REPLACE para upsert
        const result = await turso.execute({
          sql: 'INSERT OR REPLACE INTO content (id, content_type, content_data, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
          args: [contentId, type, contentData]
        });
        
        if (!result.rowsAffected || result.rowsAffected === 0) {
          throw new Error('Failed to insert/update data in Turso');
        }
        
        return new Response(JSON.stringify({ id: contentId, success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(`Method ${method} Not Allowed`, {
          status: 405,
          headers: { 
            'Allow': 'GET, POST',
            'Content-Type': 'text/plain'
          }
        });
    }
  } catch (error: any) {
    console.error('Content by Type API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database operation failed',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}