'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/FadeIn';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/menu');
        router.refresh();
      } else {
        setError(data.error || 'Invalid owner password.');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-char flex items-center justify-center p-4 selection:bg-sear selection:text-char">
      <FadeIn className="w-full max-w-sm">
        <div className="bg-char-soft border border-char-line rounded-lg p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-semibold text-cream mb-6 text-center">
            Owner / Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-dim mb-2 font-ticket">
                Admin Password
              </label>
              <input
                type="password"
                className="w-full bg-char border border-char-line rounded-md p-3 text-cream placeholder-cream-muted/50 focus:border-sear focus:ring-1 focus:ring-sear outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <p className="text-ember text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-sear text-char hover:bg-sear/90"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login securely'}
            </Button>
          </form>

          <p className="text-center text-xs text-cream-muted mt-6">
            Authorized access only.
          </p>
        </div>
      </FadeIn>
    </main>
  );
}
