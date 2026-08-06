import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // Only return active and available items for the public menu
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select(`
        id,
        slug,
        category,
        price,
        image_path,
        image_url,
        image_alt_en,
        image_alt_ar,
        tags,
        options,
        is_featured,
        name:name_${locale},
        description:description_${locale}
      `)
      .eq('is_active', true)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform raw DB schema slightly to match frontend `MenuItem` type seamlessly
    const formattedData = data.map((item: any) => ({
      id: item.slug, // Frontend uses slug as ID generally, but we can pass real ID too
      db_id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image_url || item.image_path,
      image_alt: locale === 'ar' ? (item.image_alt_ar || item.name) : (item.image_alt_en || item.name),
      category: item.category,
      featured: item.is_featured,
      tags: item.tags || [],
      options: item.options || []
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Error fetching public menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
