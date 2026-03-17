import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  
  const [form, setForm] = useState({
    token: token,
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.token) return setError('Token is missing');
    if (form.new_password.length < 6) return setError('Password must be at least 6 characters');
    if (form.new_password !== form.confirm_password) return setError('Passwords do not match');

    setLoading(true);
    setError('');

    try {
      await API.post('/auth/reset-password', {
        token: form.token,
        new_password: form.new_password
      });
      alert('Password reset successfully. You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-sm anim-fade-up">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 text-center">Reset Password</h1>
        <p className="text-sm text-zinc-500 dark:text-text-secondary mb-8 text-center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            label="Reset Token"
            id="token"
            name="token"
            type="text"
            value={form.token}
            onChange={(e) => setForm({...form, token: e.target.value})}
            placeholder="Enter token from email"
          />

          <FormField
            label="New Password"
            id="new_password"
            name="new_password"
            type="password"
            value={form.new_password}
            onChange={(e) => setForm({...form, new_password: e.target.value})}
            placeholder="••••••••"
          />

          <FormField
            label="Confirm Password"
            id="confirm_password"
            name="confirm_password"
            type="password"
            value={form.confirm_password}
            onChange={(e) => setForm({...form, confirm_password: e.target.value})}
            placeholder="••••••••"
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-lg px-3.5 py-3 shadow-sm">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
