import { useState } from 'react';
import API from '../api';
import Button from './atoms/Button';
import FormField from './molecules/FormField';

export default function SecuritySettings() {
  const [form, setForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.old_password || !form.new_password) return setError('All fields are required');
    if (form.new_password !== form.confirm_password) return setError('Passwords do not match');

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await API.post('/change-password', {
        old_password: form.old_password,
        new_password: form.new_password
      });
      setMessage('Password updated successfully.');
      setForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white dark:bg-[#1e1f24] rounded-xl border border-zinc-200 dark:border-[#2e2f36] p-6 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Security Settings</h2>
      <p className="text-sm text-zinc-500 dark:text-text-secondary mb-6">Update your password to keep your account secure.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Current Password"
          id="old_password"
          name="old_password"
          type="password"
          value={form.old_password}
          onChange={(e) => setForm({...form, old_password: e.target.value})}
          placeholder="••••••••"
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
          label="Confirm New Password"
          id="confirm_password"
          name="confirm_password"
          type="password"
          value={form.confirm_password}
          onChange={(e) => setForm({...form, confirm_password: e.target.value})}
          placeholder="••••••••"
        />

        {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
        {message && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{message}</p>}

        <Button type="submit" variant="primary" loading={loading} className="w-fit mt-2">
          Update Password
        </Button>
      </form>
    </div>
  );
}
