/**
 * Molecule: NavItem
 * A single navigation item with optional children (submenu).
 * Handles its own open/closed state.
 */
import { useState } from 'react';

const ICON_MAP = {
  dashboard: '⊞', users: '◎', clock: '◷', wallet: '◈',
  briefcase: '◉', chart: '⊿', folder: '▣', 'bar-chart': '⊟',
  settings: '◈', list: '≡', shield: '◬', layers: '⊕',
  'log-in': '→', calendar: '▦', dollar: '$', file: '▤',
  'credit-card': '▨', target: '◎', 'check-square': '☑',
  'file-text': '▤', user: '◉', lock: '◈', menu: '≡',
};
const getIcon = (name) => ICON_MAP[name] || '·';

export default function NavItem({ item, depth = 0, activeId, onSelect }) {
  const hasChildren = item.children?.length > 0;
  const [open, setOpen] = useState(false);
  const isActive = activeId === item.id;

  const indent = depth * 12;

  return (
    <li className="list-none">
      <button
        type="button"
        onClick={() => (hasChildren ? setOpen((o) => !o) : onSelect(item))}
        style={{ paddingLeft: `${12 + indent}px` }}
        className={`
          group w-full flex items-center gap-2.5 pr-3 py-2 rounded-md text-sm
          transition-colors duration-150 text-left cursor-pointer select-none
          ${isActive
            ? 'bg-indigo-500/15 text-white'
            : 'text-[#a0a3ab] hover:bg-white/5 hover:text-white'}
        `}
      >
        {/* Accent bar for active */}
        {isActive && (
          <span className="absolute left-0 w-0.5 h-5 bg-indigo-500 rounded-r" />
        )}

        {/* Icon */}
        <span className={`text-xs font-mono w-4 text-center shrink-0 ${isActive ? 'text-indigo-400' : 'text-[#64676f] group-hover:text-[#a0a3ab]'}`}>
          {getIcon(item.icon)}
        </span>

        {/* Label */}
        <span className="flex-1 truncate capitalize font-medium">
          {item.name.replace(/_/g, ' ')}
        </span>

        {/* Chevron for parents */}
        {hasChildren && (
          <svg
            className={`w-3.5 h-3.5 shrink-0 text-[#64676f] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Submenu */}
      {hasChildren && open && (
        <ul className="anim-expand mt-0.5 border-l border-[#3a3b42] ml-[19px]">
          {item.children.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              depth={depth + 1}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
