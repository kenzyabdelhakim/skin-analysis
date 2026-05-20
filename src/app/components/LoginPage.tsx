import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onGoToRegister: () => void;
}

export function LoginPage({ onGoToRegister }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Package className="w-10 h-10 text-primary" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-lg" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-[#FFC9E3] to-[#FF99CC] bg-clip-text text-transparent">
              DermaStation
            </h1>
          </div>
          <p className="text-gray-400 text-sm tracking-wide">Sign in to your account</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: 'rgba(18,18,18,0.95)',
            borderColor: 'rgba(255,179,217,0.2)',
          }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Welcome back</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(255,107,157,0.15)', color: '#FF6B9D', border: '1px solid rgba(255,107,157,0.3)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder-gray-600 outline-none transition-all focus:ring-1"
                style={{
                  background: 'rgba(30,30,30,0.8)',
                  border: '1px solid rgba(255,179,217,0.2)',
                  ['--tw-ring-color' as string]: 'rgba(255,179,217,0.5)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,179,217,0.6)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,179,217,0.2)')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-foreground placeholder-gray-600 outline-none transition-all"
                  style={{
                    background: 'rgba(30,30,30,0.8)',
                    border: '1px solid rgba(255,179,217,0.2)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,179,217,0.6)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,179,217,0.2)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FFB3D9, #FF99CC)',
                color: '#0D0D0D',
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={onGoToRegister}
              className="font-medium transition-colors hover:underline"
              style={{ color: '#FFB3D9' }}
            >
              Create one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
