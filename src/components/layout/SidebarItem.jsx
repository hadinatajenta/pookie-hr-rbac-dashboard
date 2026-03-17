import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { resolveIcon } from '../../icons/resolveIcon';

const SidebarItem = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Resolve icon
  const IconComponent = resolveIcon(item.icon, item.children?.length > 0);

  const paddingLeft = `${depth * 1 + 1}rem`;
  const isParent = item.children && item.children.length > 0;

  // Base styling for modern, dark, glass look
  const baseClasses = `
    group flex items-center justify-between w-full py-2.5 pr-4 rounded-lg 
    transition-all duration-200 ease-in-out cursor-pointer text-sm font-medium
    hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800/60 dark:hover:text-white
  `;

  if (isParent) {
    return (
      <div className="w-full flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${baseClasses} text-zinc-500 dark:text-zinc-400`}
          style={{ paddingLeft }}
        >
          <div className="flex items-start justify-start gap-3">
            <IconComponent size={18} className="text-zinc-400 transition-colors group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" strokeWidth={1.5} />
            <span className='text-start'>{item.description}</span>
          </div>
          <div className="text-zinc-400 dark:text-zinc-600 transition-transform duration-200">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </button>

        {/* CSS transition hack for smooth open/close expansion */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out`}
          style={{ 
            maxHeight: isOpen ? '1000px' : '0px', 
            opacity: isOpen ? 1 : 0 
          }}
        >
          <div className="flex flex-col gap-1 mt-1 border-l ml-6 border-zinc-200 p-2 dark:border-zinc-800/50">
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path ? (item.path.startsWith('/') ? item.path : `/${item.path}`) : '#'}
      className={({ isActive }) => `
        ${baseClasses}
        ${isActive ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700/50' : 'text-zinc-500 dark:text-zinc-400'}
      `}
      style={{ paddingLeft }}
    >
      <div className="flex items-center gap-3">
        <IconComponent 
          size={18} 
          className="transition-colors text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" 
          strokeWidth={1.5} 
        />
        <span>{item.description}</span>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
