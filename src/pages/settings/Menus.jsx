import React, { useState, useEffect, useCallback } from 'react';
import { getMenusTree, createMenu, updateMenu, deleteMenu } from '../../services/menus';
import { getPermissions } from '../../services/permissions';
import ModalForm from '../../components/ModalForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import PermissionGuard from '../../components/PermissionGuard';
import { Plus, Edit2, Trash2, Folder, FileText, ChevronRight } from 'lucide-react';

export default function Menus() {
  const [tree, setTree] = useState([]);
  const [flatPermissions, setFlatPermissions] = useState([]);
  const [flatMenus, setFlatMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', path: '', description: '', icon: '', parent_id: 0, sort_order: 0, permission_id: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDependencies = useCallback(async () => {
    setIsLoading(true);
    try {
      const [treeRes, permRes] = await Promise.all([ getMenusTree(), getPermissions() ]);
      setTree(treeRes.data || []);
      setFlatPermissions(permRes.data || []);
      
      const flatten = (nodes) => nodes.reduce((acc, curr) => {
         acc.push(curr);
         if (curr.children?.length) acc.push(...flatten(curr.children));
         return acc;
      }, []);
      setFlatMenus(flatten(treeRes.data || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  const handleOpenForm = (menu = null, parentId = 0) => {
    setError(null);
    setActiveMenu(menu);
    if (menu) {
      setFormData({ 
        name: menu.name, path: menu.path, description: menu.description || '', 
        icon: menu.icon || '', parent_id: menu.parent_id || 0, sort_order: menu.sort_order || 0, 
        permission_id: menu.permission_id || 0 
      });
    } else {
      setFormData({ name: '', path: '', description: '', icon: '', parent_id: parentId, sort_order: 0, permission_id: 0 });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const p = { ...formData, parent_id: Number(formData.parent_id), permission_id: Number(formData.permission_id), sort_order: Number(formData.sort_order) };
        if (activeMenu) await updateMenu(activeMenu.id, p);
        else await createMenu(p);
        setIsFormOpen(false);
        fetchDependencies();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
        await deleteMenu(activeMenu.id);
        setIsDeleteOpen(false);
        fetchDependencies();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recursive Node Renderer
  const renderNode = (node, depth = 0) => (
    <div key={node.id} className="flex flex-col border-b border-gray-100 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-[#2a2b30]/30 transition-colors">
      <div 
        className="flex items-center justify-between p-3"
        style={{ paddingLeft: `${depth * 2 + 1}rem` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-400 dark:text-gray-500">
             {node.children && node.children.length > 0 ? <Folder size={18} /> : <FileText size={18} />}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
               {node.name}
               {node.permission_id === 0 && <span className="text-[9px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Public</span>}
            </span>
            <span className="text-xs text-gray-500 font-mono mt-0.5">{node.path || '#'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 sm:opacity-100">
           {node.id > 8 && (
             <PermissionGuard permission="menus.manage">
                <button title="Add Submenu" onClick={() => handleOpenForm(null, node.id)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                   <Plus size={16} />
                </button>
                <button onClick={() => handleOpenForm(node)} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                   <Edit2 size={16} />
                </button>
                <button onClick={() => { setActiveMenu(node); setIsDeleteOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                   <Trash2 size={16} />
                </button>
             </PermissionGuard>
           )}
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col">
           {node.children.map(child => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Navigation Tree</h1>
        <PermissionGuard permission="menus.manage">
          <button onClick={() => handleOpenForm(null, 0)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm">
            <Plus size={16} /> Add Root
          </button>
        </PermissionGuard>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-2">
         {isLoading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse">Loading structure...</div>
         ) : tree.length > 0 ? (
            <div className="flex flex-col border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-surface">
               {tree.map(root => renderNode(root))}
            </div>
         ) : (
            <div className="text-center p-8 text-gray-500">Navigation is completely undefined.</div>
         )}
      </div>

      <ModalForm 
        isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} 
        title={activeMenu ? "Edit Route Mapping" : "Map New Route"} isSubmitting={isSubmitting}
      >
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Menu Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Route Path (/path)</label>
                <input required type="text" value={formData.path} onChange={e => setFormData({...formData, path: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100 font-mono text-sm" />
              </div>
           </div>
           
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission Lockdown</label>
              <select value={formData.permission_id} onChange={e => setFormData({...formData, permission_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100">
                 <option value={0}>Public (No capabilities required)</option>
                 {flatPermissions.map(p => (
                    <option key={p.id} value={p.id}>[{p.module}] {p.name} - {p.description}</option>
                 ))}
              </select>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent Node</label>
                <select value={formData.parent_id} onChange={e => setFormData({...formData, parent_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100">
                   <option value={0}>-- ROOT COMPONENT --</option>
                   {flatMenus.filter(m => m.id !== activeMenu?.id).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                   ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Index</label>
                <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
              </div>
           </div>
           
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lucide Icon String</label>
              <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" placeholder="Shield" />
           </div>
        </div>
      </ModalForm>

      <ConfirmDialog isOpen={isDeleteOpen} title="Sever Node" message={`Are you sure you want to forcibly erase '${activeMenu?.name}'?`} onConfirm={handleDelete} onCancel={() => setIsDeleteOpen(false)} />
    </div>
  );
}
