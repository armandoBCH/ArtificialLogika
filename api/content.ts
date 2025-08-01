import { turso } from '../db/turso';

// Verificar configuración de variables de entorno
const tursoUrl = process.env.VITE_TURSO_DATABASE_URL;
const tursoToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error('Missing Turso environment variables:');
  console.error('VITE_TURSO_DATABASE_URL:', tursoUrl ? 'SET' : 'MISSING');
  console.error('VITE_TURSO_AUTH_TOKEN:', tursoToken ? 'SET' : 'MISSING');
}

export default async function handler(request: Request) {
  const method = request.method;

  // Verificar configuración antes de proceder
  if (!tursoUrl || !tursoToken) {
    return new Response(JSON.stringify({
      error: 'Turso configuration missing',
      details: 'Configure VITE_TURSO_DATABASE_URL and VITE_TURSO_AUTH_TOKEN environment variables in Vercel',
      configured: {
        url: !!tursoUrl,
        token: !!tursoToken
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    switch (method) {
      case 'GET': {
        // Obtener todo el contenido
        const result = await turso.execute('SELECT * FROM content ORDER BY created_at DESC');
        
        if (!result.rows) {
          throw new Error('Failed to fetch data from Turso');
        }
        
        const contentItems = result.rows.map(row => ({
          id: row.id,
          content_type: row.content_type,
          content_data: JSON.parse(row.content_data),
          created_at: row.created_at,
          updated_at: row.updated_at
        }));
        
        return new Response(JSON.stringify(contentItems), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'POST': {
        // Crear nuevo contenido
        const body = await request.json();
        const { content_type, content_data, id } = body;
        
        const contentId = id || `${content_type}-${Date.now()}`;
        const contentData = JSON.stringify(content_data);
        
        const result = await turso.execute({
          sql: 'INSERT INTO content (id, content_type, content_data) VALUES (?, ?, ?)',
          args: [contentId, content_type, contentData]
        });
        
        if (!result.rowsAffected || result.rowsAffected === 0) {
          throw new Error('Failed to insert data into Turso');
        }
        
        return new Response(JSON.stringify({ id: contentId, success: true }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'PUT': {
        // Actualizar contenido existente
        const updateBody = await request.json();
        const { id: updateId, content_data: updateData } = updateBody;
        
        const contentData = JSON.stringify(updateData);
        
        const result = await turso.execute({
          sql: 'UPDATE content SET content_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          args: [contentData, updateId]
        });
        
        if (!result.rowsAffected || result.rowsAffected === 0) {
          throw new Error('Failed to update data in Turso');
        }
        
        return new Response(JSON.stringify({ id: updateId, success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'DELETE': {
        // Eliminar contenido
        const deleteBody = await request.json();
        const { id: deleteId } = deleteBody;
        
        const result = await turso.execute({
          sql: 'DELETE FROM content WHERE id = ?',
          args: [deleteId]
        });
        
        if (!result.rowsAffected || result.rowsAffected === 0) {
          throw new Error('Failed to delete data from Turso');
        }
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(`Method ${method} Not Allowed`, {
          status: 405,
          headers: { 
            'Allow': 'GET, POST, PUT, DELETE',
            'Content-Type': 'text/plain'
          }
        });
    }
  } catch (error: any) {
    console.error('Turso API Error:', error);
    
    // Determinar el tipo de error
    let errorMessage = 'Database operation failed';
    let errorDetails = error.message || 'Unknown error';
    let statusCode = 500;
    
    if (error.message?.includes('no such table')) {
      errorMessage = 'Table not found';
      errorDetails = 'The content table does not exist in Turso';
      statusCode = 503;
    } else if (error.message?.includes('UNIQUE constraint failed')) {
      errorMessage = 'Duplicate content';
      errorDetails = 'Content with this ID already exists';
      statusCode = 409;
    } else if (error.message?.includes('Turso configuration missing')) {
      errorMessage = 'Configuration error';
      errorDetails = 'Turso is not properly configured';
      statusCode = 503;
    } else if (!tursoUrl || !tursoToken) {
      errorMessage = 'Environment variables missing';
      errorDetails = 'VITE_TURSO_DATABASE_URL and VITE_TURSO_AUTH_TOKEN are required';
      statusCode = 503;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorDetails,
      hint: 'Check Turso configuration and table setup',
      timestamp: new Date().toISOString(),
      env: {
        urlConfigured: !!tursoUrl,
        tokenConfigured: !!tursoToken
      }
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}