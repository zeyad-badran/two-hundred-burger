'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KitchenLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/kitchen');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid staff password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-char flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sear/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-char-surface border border-char-soft rounded-2xl p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-cream mb-2">Staff Access</h1>
          <p className="text-cream/60">Kitchen Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Staff Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-char border border-char-soft rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-sear transition-colors"
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-ember text-sm text-center bg-ember/10 border border-ember/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sear text-char font-bold rounded-xl py-3 hover:bg-[#e05a30] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Login to Kitchen'}
          </button>
        </form>
      </div>
    </div>
  );
}
