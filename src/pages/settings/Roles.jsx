import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, ArrowRight, Info, AlertTriangle, Layers } from 'lucide-react';
import roleService from '../../services/roleService';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', parent_id: '' });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await roleService.getRoles();
      setRoles(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({ name: role.name, description: role.description, parent_id: role.parent_id || '' });
    } else {
      setEditingRole(null);
      setFormData({ name: '', description: '', parent_id: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
    };

    try {
      if (editingRole) {
        await roleService.updateRole(editingRole.id, data);
      } else {
        await roleService.createRole(data);
      }
      setIsModalOpen(false);
      loadRoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this role? This will not permanently delete it.')) {
      try {
        await roleService.deleteRole(id);
        loadRoles();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  const getParentName = (id) => {
    const parent = roles.find(r => r.id === id);
    return parent ? parent.name : 'None';
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Role Management</h1>
          <p className="text-text-secondary">Define access hierarchies and permissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
        >
          <Plus className="w-5 h-5" />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <div className="bg-surface rounded-2xl border border-border p-12 flex justify-center">
               <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
             </div>
          ) : roles.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-12 text-center">
              <Shield className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
              <p className="text-text-secondary">No roles defined yet.</p>
            </div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="bg-surface rounded-2xl border border-border p-5 hover:border-accent/50 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-text-primary">{role.name}</h3>
                        {role.parent_id && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface border border-border rounded-full text-[10px] font-bold text-text-secondary uppercase">
                            <Layers className="w-3 h-3" />
                            Inherits from {getParentName(role.parent_id)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{role.description}</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-background px-2 py-1 rounded-md text-text-secondary font-mono">ID: {role.id}</span>
                        <span className="text-[10px] bg-background px-2 py-1 rounded-md text-text-secondary font-mono">REF: ROLE_{role.name.toUpperCase().replace(/\s+/g, '_')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(role)}
                      className="p-2 hover:bg-background rounded-lg text-text-secondary hover:text-accent transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(role.id)}
                      className="p-2 hover:bg-background rounded-lg text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
            <div className="flex gap-3 mb-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <h3 className="font-bold text-blue-500">Hierarchy Tips</h3>
            </div>
            <p className="text-xs text-blue-500/80 leading-relaxed">
              Roles can inherit permissions from a Parent Role. For example, a "Manager" can inherit from "Employee", automatically gaining all basic access.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
            <div className="flex gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="font-bold text-amber-500">Security Note</h3>
            </div>
            <p className="text-xs text-amber-500/80 leading-relaxed">
              Permission changes affect all users with that role immediately. Use caution when modifying root level roles in the hierarchy.
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">
                {editingRole ? 'Update Role' : 'Create New Role'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase px-1">Role Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary outline-none focus:border-accent transition-colors"
                    placeholder="e.g. Senior Manager"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase px-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary outline-none focus:border-accent transition-colors resize-none h-24"
                    placeholder="Briefly describe the responsibilities..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase px-1">Parent Role (Optional)</label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="">No Parent (Root Role)</option>
                    {roles
                      .filter(r => !editingRole || r.id !== editingRole.id) // Prevent self-parenting
                      .map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-border text-text-primary rounded-xl font-medium hover:bg-background transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                  >
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
