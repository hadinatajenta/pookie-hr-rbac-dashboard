/**
 * Page: Register
 * Creates a new user account via POST /api/v1/auth/register.
 * Required fields: first_name, username, email, password (min 6).
 * Optional fields: last_name.
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

export default function Register() {
  const { register, isAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Already authenticated → redirect to dashboard
  useEffect(() => {
    if (isAuth) navigate('/dashboard', { replace: true });
  }, [isAuth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccessMessage('');

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccessMessage('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface flex">
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
            Join your team<br />in minutes.
          </h2>
          <p className="text-zinc-500 dark:text-text-secondary text-sm leading-relaxed">
            Create an account to access the centralized authentication and role management dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          {['Roles', 'Menus', 'Permissions', 'Users'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-border rounded-md text-xs text-zinc-500 dark:text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-sm anim-fade-up flex flex-col items-center lg:items-stretch lg:text-left text-center">
          {/* Mobile logo */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm dark:shadow-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">Pookie Auth</span>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Create account</h1>
          <p className="text-sm text-zinc-500 dark:text-text-secondary mb-8">
            Fill in the details below to register a new account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full text-left" noValidate>
            {/* Name row */}
            <div className="flex gap-3">
              <FormField
                label="First Name"
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="given-name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Jane"
                error={errors.first_name}
              />
              <FormField
                label="Last Name"
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                error={errors.last_name}
              />
            </div>

            <FormField
              label="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. jane_doe"
              error={errors.username}
            />

            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              error={errors.email}
            />

            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />

            <FormField
              label="Confirm Password"
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.confirm_password}
            />

            {/* Global error */}
            {globalError && (
              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-lg px-3.5 py-3 anim-fade-in shadow-sm dark:shadow-none">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 rounded-lg px-3.5 py-3 anim-fade-in">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{successMessage}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth className="mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-zinc-400 dark:text-text-muted mt-6">
            Protected by JWT authentication ·{' '}
            <span className="text-zinc-500 dark:text-text-secondary">Auth Service v1</span>
          </p>
        </div>
      </div>
    </div>
  );
}
