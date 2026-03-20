import React, { useState, useEffect, useCallback } from 'react';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../services/permissions';
import DataTable from '../../components/DataTable';
import ModalForm from '../../components/ModalForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import PermissionGuard from '../../components/PermissionGuard';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activePerm, setActivePerm] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '', module: '', action: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPermissions();
      setPermissions(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleOpenForm = (perm = null) => {
    setError(null);
    setActivePerm(perm);
    if (perm) {
      setFormData({ name: perm.name, description: perm.description, module: perm.module || '', action: perm.action || '' });
    } else {
      setFormData({ name: '', description: '', module: '', action: '' });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (activePerm) {
        await updatePermission(activePerm.id, formData);
      } else {
        await createPermission(formData);
      }
      setIsFormOpen(false);
      fetchPermissions();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deletePermission(activePerm.id);
      setIsDeleteOpen(false);
      fetchPermissions();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'description', title: 'Description' },
    { key: 'module', title: 'Module' },
    { key: 'action', title: 'Action' },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <PermissionGuard permission="permissions.manage">
            <button onClick={() => handleOpenForm(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
              <Edit2 size={16} />
            </button>
            <button onClick={() => { setActivePerm(row); setIsDeleteOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
              <Trash2 size={16} />
            </button>
          </PermissionGuard>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
        <PermissionGuard permission="permissions.manage">
          <button onClick={() => handleOpenForm()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm">
            <Plus size={16} /> New Permission
          </button>
        </PermissionGuard>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <DataTable columns={columns} data={permissions} isLoading={isLoading} emptyState="No permissions defined." />
      </div>

      <ModalForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSubmit}
        title={activePerm ? "Edit Permission" : "Create Permission"}
        isSubmitting={isSubmitting}
      >
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission Code (e.g. users.manage)</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module Group</label>
              <input type="text" value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400" placeholder="users" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Context</label>
              <input type="text" value={formData.action} onChange={e => setFormData({...formData, action: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400" placeholder="manage" />
            </div>
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        title="Delete Permission"
        message={`Are you sure you want to completely destroy capability '${activePerm?.name}'? This may break active roles.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
