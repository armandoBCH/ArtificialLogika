import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Verificar configuración de variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Verificar configuración antes de proceder
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      error: 'Supabase configuration missing',
      details: 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in Vercel',
      configured: {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
      }
    });
  }

  try {
    switch (method) {
      case 'GET':
        // Obtener todo el contenido
        const { data: getAllData, error: getAllError } = await supabase
          .from('content')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (getAllError) {
          console.error('Supabase GET error:', getAllError);
          throw getAllError;
        }
        return res.status(200).json(getAllData || []);

      case 'POST':
        // Crear nuevo contenido
        const { content_type, content_data, id } = req.body;
        
        const { data: createData, error: createError } = await supabase
          .from('content')
          .insert([{
            id: id || `${content_type}-${Date.now()}`,
            content_type,
            content_data,
            user_id: null // Permitir null para contenido público
          }])
          .select()
          .single();

        if (createError) {
          console.error('Supabase POST error:', createError);
          throw createError;
        }
        return res.status(201).json(createData);

      case 'PUT':
        // Actualizar contenido existente
        const { id: updateId, content_data: updateData } = req.body;
        
        const { data: updateResult, error: updateError } = await supabase
          .from('content')
          .update({ 
            content_data: updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', updateId)
          .select()
          .single();

        if (updateError) {
          console.error('Supabase PUT error:', updateError);
          throw updateError;
        }
        return res.status(200).json(updateResult);

      case 'DELETE':
        // Eliminar contenido
        const { id: deleteId } = req.body;
        
        const { error: deleteError } = await supabase
          .from('content')
          .delete()
          .eq('id', deleteId);

        if (deleteError) {
          console.error('Supabase DELETE error:', deleteError);
          throw deleteError;
        }
        return res.status(200).json({ success: true });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Content API Error:', error);
    return res.status(500).json({ 
      error: 'Database operation failed',
      details: error.message || 'Unknown error',
      hint: 'Check Supabase configuration and table setup'
    });
  }
}