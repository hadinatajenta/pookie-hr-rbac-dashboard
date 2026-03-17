/**
 * Page: Login
 * Clean, minimal login form using atomic components.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

export default function Login() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#24252a] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-zinc-50 dark:bg-[#1e1f24] border-r border-zinc-200 dark:border-[#2e2f36] flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">Pookie Auth</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white leading-snug mb-4">
            Manage your team<br />from one place.
          </h2>
          <p className="text-zinc-500 dark:text-[#a0a3ab] text-sm leading-relaxed">
            A centralized dashboard for authentication, roles, permissions, and menu management. Clean, fast, and secure.
          </p>
        </div>

        <div className="flex gap-3">
          {['Roles', 'Menus', 'Permissions', 'Users'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-[#3a3b42] rounded-md text-xs text-zinc-500 dark:text-[#a0a3ab]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm anim-fade-up flex flex-col items-center lg:items-stretch lg:text-left text-center">
          {/* Mobile logo */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm dark:shadow-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">Pookie Auth</span>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Sign in</h1>
          <p className="text-sm text-zinc-500 dark:text-[#a0a3ab] mb-8 lg:mb-8">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full text-left" noValidate>
            <FormField
              label="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. john_doe"
              error={errors.username}
            />

            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />

            {globalError && (
              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-lg px-3.5 py-3 anim-fade-in shadow-sm dark:shadow-none">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              className="mt-1"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-xs text-zinc-400 dark:text-[#64676f] mt-8">
            Protected by JWT authentication ·{' '}
            <span className="text-zinc-500 dark:text-[#a0a3ab]">Auth Service v1</span>
          </p>
        </div>
      </div>
    </div>
  );
}
