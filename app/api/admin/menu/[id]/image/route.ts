import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/admin-auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const BUCKET_NAME = 'menu-images';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // Fetch the menu item to get the slug for folder organization
    const { data: menuItem, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select('slug, image_path')
      .eq('id', params.id)
      .single();

    if (fetchError || !menuItem) {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }

    // Convert File to Buffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate safe storage path
    const ext = file.type.split('/')[1];
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const storagePath = `menu-items/${menuItem.slug}/${uniqueId}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image to storage.' }, { status: 500 });
    }

    // Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // Try to delete the old image if it existed in Supabase Storage
    if (menuItem.image_path && menuItem.image_path.startsWith('menu-items/')) {
      await supabaseAdmin.storage.from(BUCKET_NAME).remove([menuItem.image_path]);
    }

    // Update database
    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update({
        image_path: storagePath,
        image_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('DB update error:', updateError);
      return NextResponse.json({ error: 'Failed to link image to menu item.' }, { status: 500 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    console.error('Image upload crash:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch current image path
    const { data: menuItem, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select('image_path')
      .eq('id', params.id)
      .single();

    if (fetchError || !menuItem) {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }

    // Delete from storage if it is a managed storage path
    if (menuItem.image_path && menuItem.image_path.startsWith('menu-items/')) {
      const { error: removeError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([menuItem.image_path]);
        
      if (removeError) {
        console.warn('Could not delete old image from storage, proceeding to clear DB:', removeError);
      }
    }

    // Clear DB fields
    const { error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update({
        image_path: null,
        image_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (updateError) {
      console.error('DB clear image error:', updateError);
      return NextResponse.json({ error: 'Failed to remove image reference.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Image delete crash:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
