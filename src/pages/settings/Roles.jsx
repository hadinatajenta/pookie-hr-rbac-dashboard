import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoles, createRole, updateRole, deleteRole } from '../../services/roles';
import DataTable from '../../components/DataTable';
import ModalForm from '../../components/ModalForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import PermissionGuard from '../../components/PermissionGuard';
import { Plus, Edit2, Trash2, Shield, Settings2 } from 'lucide-react';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleOpenForm = (role = null) => {
    setError(null);
    setActiveRole(role);
    if (role) setFormData({ name: role.name, description: role.description });
    else setFormData({ name: '', description: '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (activeRole) await updateRole(activeRole.id, formData);
      else await createRole(formData);
      setIsFormOpen(false);
      fetchRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteRole(activeRole.id);
      setIsDeleteOpen(false);
      fetchRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', title: 'Role Name', sortable: true, render: (row) => <div className="font-semibold">{row.name}</div> },
    { key: 'description', title: 'Description' },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <PermissionGuard permission="roles.manage">
            <button title="Edit Capabilities" onClick={() => navigate(`/roles/${row.id}`)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors">
              <Settings2 size={16} />
            </button>
            <button title="Edit Definition" onClick={() => handleOpenForm(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
              <Edit2 size={16} />
            </button>
            {row.id !== 1 && (
              <button title="Delete Hierarchy" onClick={() => { setActiveRole(row); setIsDeleteOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </PermissionGuard>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Roles</h1>
        <PermissionGuard permission="roles.manage">
          <button onClick={() => handleOpenForm()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm">
            <Plus size={16} /> Create Role
          </button>
        </PermissionGuard>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <DataTable columns={columns} data={roles} isLoading={isLoading} emptyState="No roles created." />
      </div>

      <ModalForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={activeRole ? "Edit Role Profile" : "Create Empty Role Profile"} isSubmitting={isSubmitting}>
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Identifier Group</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Definition Payload</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog isOpen={isDeleteOpen} title="Sever Node" message={`Are you sure you want to forcibly erase '${activeRole?.name}'?`} onConfirm={handleDelete} onCancel={() => setIsDeleteOpen(false)} />
    </div>
  );
}
