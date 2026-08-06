import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/admin-auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name_en, name_ar, description_en, description_ar,
      category, price, image_path, image_url, tags, options,
      is_available, is_featured, is_active, sort_order
    } = body;

    if (price !== undefined && price < 0) {
      return NextResponse.json({ error: 'Price must be >= 0' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .update({
        ...(name_en !== undefined && { name_en }),
        ...(name_ar !== undefined && { name_ar }),
        ...(description_en !== undefined && { description_en }),
        ...(description_ar !== undefined && { description_ar }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price }),
        ...(image_path !== undefined && { image_path }),
        ...(image_url !== undefined && { image_url }),
        ...(tags !== undefined && { tags }),
        ...(options !== undefined && { options }),
        ...(is_available !== undefined && { is_available }),
        ...(is_featured !== undefined && { is_featured }),
        ...(is_active !== undefined && { is_active }),
        ...(sort_order !== undefined && { sort_order }),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Soft delete
    const { error } = await supabaseAdmin
      .from('menu_items')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error soft-deleting menu item:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
