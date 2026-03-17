import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function PagePlaceholder({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center anim-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center text-zinc-500 mb-6 shadow-sm dark:shadow-none">
        <PackageOpen size={32} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
        {description || 'This module has been allocated but the requested page interface is not implemented yet.'}
      </p>
    </div>
  );
}
