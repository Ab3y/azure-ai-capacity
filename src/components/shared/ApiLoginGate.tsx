import { useState } from 'react';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { apiLogin } from '@/services/leadTimeApi';
import { useApiAuthStore } from '@/store/useAuthStore';

interface ApiLoginGateProps {
  children: React.ReactNode;
  title?: string;
}

export function ApiLoginGate({ children, title = 'Protected Content' }: ApiLoginGateProps) {
  const { isApiAuthenticated, setAuth } = useApiAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isApiAuthenticated) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiLogin(username, password);
      setAuth(result.token, result.username, result.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">{title}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Enter your credentials to access this content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--foreground))] mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="Username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--foreground))] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
