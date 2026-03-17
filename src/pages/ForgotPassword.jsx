import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage('A reset token has been generated. In production, this would be sent to your email.');
      // For demo purposes, we might show the token if the backend returns it
      if (res.data.data?.reset_token) {
         setMessage(`Reset token generated: ${res.data.data.reset_token}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-sm anim-fade-up">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 text-center">Forgot Password</h1>
        <p className="text-sm text-zinc-500 dark:text-text-secondary mb-8 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. john@example.com"
            error={error}
          />

          {message && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 rounded-lg px-3.5 py-3 shadow-sm">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{message}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
            Send Reset Link
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-text-secondary mt-8">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
