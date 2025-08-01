import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { type } = query;

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Content type is required' });
  }

  try {
    switch (method) {
      case 'GET':
        // Obtener contenido por tipo
        const { data: getTypeData, error: getTypeError } = await supabase
          .from('content')
          .select('*')
          .eq('content_type', type)
          .order('created_at', { ascending: false });
        
        if (getTypeError) throw getTypeError;
        return res.status(200).json(getTypeData || []);

      case 'POST':
        // Crear o actualizar contenido de un tipo específico
        const { content_data, id } = req.body;
        const contentId = id || `${type}-${Date.now()}`;
        
        // Usar upsert para crear o actualizar
        const { data: upsertData, error: upsertError } = await supabase
          .from('content')
          .upsert({
            id: contentId,
            content_type: type,
            content_data,
            user_id: null,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (upsertError) throw upsertError;
        return res.status(200).json(upsertData);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Content by Type API Error:', error);
    return res.status(500).json({ 
      error: 'Database operation failed',
      details: error.message 
    });
  }
}