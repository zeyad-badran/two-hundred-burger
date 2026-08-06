'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type MenuItem = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  price: number;
  image_path: string;
  image_url: string;
  image_alt_en?: string;
  image_alt_ar?: string;
  tags: string[] | string;
  options: string[] | string;
  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export default function AdminMenuClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/menu');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch menu items');
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const payload = { 
        ...editingItem, 
        tags: Array.isArray(editingItem.tags) ? editingItem.tags : (typeof editingItem.tags === 'string' ? editingItem.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
        options: Array.isArray(editingItem.options) ? editingItem.options : (typeof editingItem.options === 'string' ? editingItem.options.split(',').map(s => s.trim()).filter(Boolean) : [])
      };

      const isNew = !editingItem.id;
      const url = isNew ? '/api/admin/menu' : `/api/admin/menu/${editingItem.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save item');
      }

      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete (hide) this item?')) return;
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem?.id) return;
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/admin/menu/${editingItem.id}/image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload image');
      }
      const updatedItem = await res.json();
      setEditingItem(prev => ({ ...prev, ...updatedItem }));
      fetchItems(); // refresh list in background
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!editingItem?.id) return;
    if (!confirm('Are you sure you want to remove this image?')) return;
    
    setUploadingImage(true);
    try {
      const res = await fetch(`/api/admin/menu/${editingItem.id}/image`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove image');
      
      setEditingItem(prev => ({ 
        ...prev, 
        image_path: '', 
        image_url: '' 
      }));
      fetchItems();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-char text-cream flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-char text-cream p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="font-display text-3xl font-semibold">Owner Menu Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Link href="/admin/dashboard">
              <Button variant="outline" className="text-cream border-cream hover:bg-cream hover:text-char">Sales Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {error && <p className="text-ember mb-4">{error}</p>}

        <Button onClick={() => setEditingItem({ price: 0, sort_order: 0, is_available: true, is_active: true })} className="mb-6 bg-sear text-char">
          + Add New Menu Item
        </Button>

        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-char-soft border ${!item.is_active ? 'border-ember/50 opacity-50' : 'border-char-line'} rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center`}>
              <div className="w-16 h-16 bg-char-dark rounded overflow-hidden flex-shrink-0">
                {(item.image_url || item.image_path) && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image_url || item.image_path} alt={item.name_en} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name_en} <span className="text-cream-muted font-normal text-sm block">{item.name_ar}</span></h3>
                <p className="text-sm text-cream-muted">{item.category} | {item.price} JOD</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${item.is_available ? 'bg-green-900/50 text-green-400' : 'bg-ember/20 text-ember'}`}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  {!item.is_active && (
                    <span className="text-xs px-2 py-1 rounded bg-ember/20 text-ember">Deleted</span>
                  )}
                  {item.is_featured && (
                    <span className="text-xs px-2 py-1 rounded bg-sear/20 text-sear">Featured</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>Edit</Button>
                {item.is_active && <Button variant="outline" className="text-ember border-ember hover:bg-ember hover:text-white" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-char-soft border border-char-line rounded-lg w-full max-w-2xl my-8">
            <form onSubmit={handleSave} className="p-6">
              <h2 className="text-xl font-bold mb-6">{editingItem.id ? 'Edit Item' : 'Add Item'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Name (EN) *</label>
                  <input type="text" required className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.name_en || ''} onChange={e => setEditingItem({...editingItem, name_en: e.target.value})} />
                </div>
                <div dir="rtl">
                  <label className="block text-sm mb-1">Name (AR) *</label>
                  <input type="text" required className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.name_ar || ''} onChange={e => setEditingItem({...editingItem, name_ar: e.target.value})} />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Description (EN)</label>
                  <textarea className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.description_en || ''} onChange={e => setEditingItem({...editingItem, description_en: e.target.value})} />
                </div>
                <div className="md:col-span-2" dir="rtl">
                  <label className="block text-sm mb-1">Description (AR)</label>
                  <textarea className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.description_ar || ''} onChange={e => setEditingItem({...editingItem, description_ar: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm mb-1">Category * (burgers, sides, drinks)</label>
                  <input type="text" required className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Price (JOD) *</label>
                  <input type="number" step="0.01" required className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                </div>

                <div className="md:col-span-2 border border-char-line rounded p-4 bg-char/50">
                  <label className="block text-sm font-bold mb-2">Item Image</label>
                  <p className="text-xs text-cream-muted mb-4">Use owner-approved or original images only. Recommended: 4:3 WebP, max 5MB.</p>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-32 h-24 bg-char-dark rounded overflow-hidden flex-shrink-0 flex items-center justify-center border border-char-line relative">
                      {(editingItem.image_url || editingItem.image_path) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={editingItem.image_url || editingItem.image_path} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-cream-muted">No Image</span>
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs">Uploading...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-2">
                      {!editingItem.id ? (
                        <p className="text-sm text-ember bg-ember/10 p-2 rounded">Save this item first before you can upload an image.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="outline" size="sm" className="relative cursor-pointer overflow-hidden" disabled={uploadingImage}>
                            {editingItem.image_url || editingItem.image_path ? 'Replace Image' : 'Upload Image'}
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              accept="image/jpeg,image/png,image/webp" 
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                            />
                          </Button>
                          
                          {(editingItem.image_url || editingItem.image_path) && (
                            <Button type="button" variant="outline" size="sm" className="text-ember border-ember hover:bg-ember hover:text-white" onClick={handleRemoveImage} disabled={uploadingImage}>
                              Remove Image
                            </Button>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-[10px] uppercase text-cream-muted">Alt Text (EN)</label>
                          <input type="text" className="w-full bg-char border border-char-line rounded px-2 py-1 text-sm"
                            value={editingItem.image_alt_en || ''} onChange={e => setEditingItem({...editingItem, image_alt_en: e.target.value})} />
                        </div>
                        <div dir="rtl">
                          <label className="block text-[10px] uppercase text-cream-muted">Alt Text (AR)</label>
                          <input type="text" className="w-full bg-char border border-char-line rounded px-2 py-1 text-sm"
                            value={editingItem.image_alt_ar || ''} onChange={e => setEditingItem({...editingItem, image_alt_ar: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Sort Order</label>
                  <input type="number" className="w-full bg-char border border-char-line rounded p-2"
                    value={editingItem.sort_order || 0} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Tags (comma separated, e.g. Popular, Spicy)</label>
                  <input type="text" className="w-full bg-char border border-char-line rounded p-2"
                    value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : (editingItem.tags || '')} 
                    onChange={e => setEditingItem({...editingItem, tags: e.target.value as any})} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Item Options / Variants (comma separated, e.g. Pepsi, 7Up, Mirinda)</label>
                  <p className="text-xs text-cream-muted mb-2">If provided, the customer will be forced to select one of these options before adding to cart.</p>
                  <input type="text" className="w-full bg-char border border-char-line rounded p-2"
                    value={Array.isArray(editingItem.options) ? editingItem.options.join(', ') : (editingItem.options || '')} 
                    onChange={e => setEditingItem({...editingItem, options: e.target.value as any})} />
                </div>

                <div className="md:col-span-2 flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingItem.is_available ?? true} onChange={e => setEditingItem({...editingItem, is_available: e.target.checked})} />
                    Available (In Stock)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingItem.is_featured ?? false} onChange={e => setEditingItem({...editingItem, is_featured: e.target.checked})} />
                    Featured (Best Seller)
                  </label>
                  {editingItem.id && (
                    <label className="flex items-center gap-2 cursor-pointer text-ember">
                      <input type="checkbox" checked={editingItem.is_active ?? true} onChange={e => setEditingItem({...editingItem, is_active: e.target.checked})} />
                      Active (Uncheck to soft-delete)
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-char-line">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                <Button type="submit" className="bg-sear text-char hover:bg-sear/90">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
