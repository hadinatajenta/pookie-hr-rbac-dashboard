import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';
import { Layout, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Folder, File, ExternalLink, Save, X } from 'lucide-react';
import Spinner from '../../components/atoms/Spinner';

export default function Menus() {
  const [menuTree, setMenuTree] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    path: '', 
    icon: '', 
    component: '', 
    parent_id: null,
    sort_order: 0,
    permission: ''
  });

  useEffect(() => {
    fetchMenuTree();
  }, []);

  const fetchMenuTree = async () => {
    setIsLoading(true);
    try {
      const res = await menuService.getMenuTree();
      setMenuTree(res.data || []);
      // Expand all nodes by default for a better editor experience
      const allIds = new Set();
      const collectIds = (nodes) => {
        nodes.forEach(node => {
          if (node.children?.length > 0) {
            allIds.add(node.id);
            collectIds(node.children);
          }
        });
      };
      collectIds(res.data || []);
      setExpandedNodes(allIds);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu tree');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNode = (id) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedNodes(next);
  };

  const handleOpenModal = (node = null, parentId = null) => {
    if (node) {
      setEditingNode(node);
      setFormData({
        name: node.name,
        path: node.path,
        icon: node.icon,
        component: node.component,
        parent_id: node.parent_id,
        sort_order: node.sort_order,
        permission: node.permission
      });
    } else {
      setEditingNode(null);
      setFormData({
        name: '',
        path: '',
        icon: '',
        component: '',
        parent_id: parentId,
        sort_order: 0,
        permission: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, we'd call create/update endpoints. 
    // For this prototype/extension, we'll demonstrate the UI and state handling.
    alert('Menu update saved locally (simulated). Requires backend implementation for full persistence.');
    setIsModalOpen(false);
  };

  const renderNode = (node) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="ml-6 border-l border-zinc-200 dark:border-zinc-800/60 pl-4 py-1">
        <div className="group flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button onClick={() => toggleNode(node.id)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <div className="w-3.5" />
            )}
            
            {hasChildren ? (
              <Folder size={16} className="text-indigo-500" />
            ) : (
              <File size={16} className="text-zinc-400" />
            )}
            
            <div>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">{node.name}</span>
              <span className="text-[10px] text-zinc-500 ml-2 font-mono">{node.path}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => handleOpenModal(null, node.id)} className="p-1 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400" title="Add Child">
              <Plus size={14} />
            </button>
            <button onClick={() => handleOpenModal(node)} className="p-1 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400" title="Edit">
              <Edit2 size={14} />
            </button>
            <button className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400" title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">
            {node.children.sort((a, b) => a.sort_order - b.sort_order).map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="anim-fade-up flex flex-col h-full p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layout className="text-indigo-600 dark:text-indigo-400" size={24} />
            Menu Configurations
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage the application's navigation hierarchy and path mappings.
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
        >
          <Plus size={18} /> Add Root Menu
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-6 overflow-y-auto shadow-sm">
        <div className="-ml-6">
          {menuTree.sort((a, b) => a.sort_order - b.sort_order).map(node => renderNode(node))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl anim-fade-up overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <h3 className="font-bold text-zinc-900 dark:text-white">
                {editingNode ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Item Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none" placeholder="e.g. Dashboard" />
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Route Path</label>
                <input required value={formData.path} onChange={e => setFormData({...formData, path: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none" placeholder="/dashboard" />
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Icon Tag</label>
                <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none" placeholder="Layout" />
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sort Order</label>
                <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Required Permission</label>
                <input value={formData.permission} onChange={e => setFormData({...formData, permission: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none" placeholder="dashboard:read" />
              </div>
              <div className="col-span-2 pt-4 flex gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
