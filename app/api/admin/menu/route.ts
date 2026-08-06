import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/admin-auth';

export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching admin menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name_en, name_ar, description_en, description_ar,
      category, price, image_path, image_url, tags, options,
      is_available, is_featured, sort_order
    } = body;

    if (!name_en || !name_ar || !category || price === undefined || price < 0) {
      return NextResponse.json({ error: 'Invalid required fields' }, { status: 400 });
    }

    // Auto-generate slug from name_en if missing
    let slug = body.slug;
    if (!slug) {
      slug = name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      // Add random string to avoid collision if duplicate
      slug += '-' + Math.random().toString(36).substring(2, 6);
    }

    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .insert({
        slug,
        name_en, name_ar, description_en, description_ar,
        category, price, image_path, image_url, tags: tags || [],
        options: options || [],
        is_available: is_available ?? true,
        is_featured: is_featured ?? false,
        is_active: true,
        sort_order: sort_order ?? 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
