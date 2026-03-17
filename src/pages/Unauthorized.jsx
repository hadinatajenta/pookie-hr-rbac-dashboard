import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center anim-fade-up">
      <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-6 relative overflow-hidden shadow-sm dark:shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <div className="absolute inset-0 bg-linear-to-tr from-red-100 dark:from-red-500/20 to-transparent"></div>
        <ShieldAlert size={40} className="relative z-10" />
      </div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Access Restricted</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-md leading-relaxed">
        You do not have the required permissions to access this page. This action has been logged by the security layer.
      </p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors border border-zinc-800 dark:border-zinc-700 shadow-sm"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
