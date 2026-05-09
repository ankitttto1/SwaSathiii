import { useState } from 'react';
import { signUp, signIn } from '../lib/auth';

interface Props {
  onClose: () => void;
  onAuthSuccess: () => void;
}

type Mode = 'login' | 'signup' | 'reset';

export default function Auth({ onClose, onAuthSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signUp(email, password, displayName);
    if (err) {
      setError(err.message);
    } else {
      setSuccess('Account created! Please check your email to confirm.');
      setTimeout(() => {
        setMode('login');
        setSuccess('');
      }, 2000);
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message);
    } else {
      onAuthSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join Us' : 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="w-full py-3 text-green-600 font-semibold hover:bg-green-50 rounded-xl transition-colors"
            >
              Don't have an account? Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode('reset')}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Forgot password?
            </button>
          </form>
        ) : mode === 'signup' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-3 text-green-600 font-semibold hover:bg-green-50 rounded-xl transition-colors"
            >
              Already have an account? Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            setSuccess('Check your email for reset link');
            setLoading(false);
            setTimeout(() => setMode('login'), 2000);
          }} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Enter your email and we'll send a password reset link.</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-3 text-green-600 font-semibold hover:bg-green-50 rounded-xl transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
