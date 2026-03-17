/**
 * Organism: Sidebar
 * Fixed left navigation. Builds a tree from flat menu list,
 * renders NavItem molecules recursively.
 */
import NavItem from './molecules/NavItem';
import Avatar from './atoms/Avatar';
import Button from './atoms/Button';

function buildTree(menus) {
  const map = {};
  menus.forEach((m) => { map[m.id] = { ...m, children: [] }; });
  const roots = [];
  menus.forEach((m) => {
    if (!m.parent_id || !map[m.parent_id]) roots.push(map[m.id]);
    else map[m.parent_id].children.push(map[m.id]);
  });
  const sort = (items) => {
    items.sort((a, b) => a.sort_order - b.sort_order);
    items.forEach((i) => sort(i.children));
    return items;
  };
  return sort(roots);
}

export default function Sidebar({ menus, activeMenu, onSelect, profile, onLogout }) {
  const tree = buildTree(menus);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-[#1e1f24] border-r border-[#2e2f36]">

      {/* Brand */}
      <div className="h-14 flex items-center px-4 border-b border-[#2e2f36] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Pookie Auth</span>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-4 pt-4 pb-1.5">
        <p className="text-[10px] font-semibold text-[#64676f] uppercase tracking-widest">Navigation</p>
      </div>

      {/* Menu list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 relative">
        <ul className="space-y-0.5">
          {tree.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeId={activeMenu?.id}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-[#2e2f36] shrink-0">
        <div className="flex items-center gap-2.5">
          <Avatar name={profile?.username || ''} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile?.username || '—'}</p>
            <p className="text-[10px] text-[#64676f]">Authenticated</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="shrink-0 !px-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>
    </aside>
  );
}
