import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser, assignUserRole, removeUserRole, getUserRoles } from '../../services/users';
import { getRoles } from '../../services/roles';
import DataTable from '../../components/DataTable';
import ModalForm from '../../components/ModalForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import PermissionGuard from '../../components/PermissionGuard';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';

import PermissionGuard from '../../components/PermissionGuard';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import useUserStore from '../../store/useUserStore';

export default function Users() {
  const { profile } = useUserStore();
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  
  // Active records
  const [activeUser, setActiveUser] = useState(null);
  const [activeUserRoles, setActiveUserRoles] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({ username: '', email: '', first_name: '', last_name: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await getRoles();
      setAllRoles(response.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleOpenForm = (user = null) => {
    setError(null);
    if (user) {
      setActiveUser(user);
      setFormData({ username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name, password: '' });
    } else {
      setActiveUser(null);
      setFormData({ username: '', email: '', first_name: '', last_name: '', password: '' });
    }
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (activeUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password updates
        await updateUser(activeUser.id, payload);
      } else {
        await createUser(formData);
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteUser(activeUser.id);
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenRoles = async (user) => {
    setActiveUser(user);
    setIsRoleModalOpen(true);
    try {
      const response = await getUserRoles(user.id);
      setActiveUserRoles(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRole = async (roleId, isAssigned) => {
    try {
      if (isAssigned) {
        await removeUserRole(activeUser.id, roleId);
        setActiveUserRoles(prev => prev.filter(r => r.id !== roleId));
      } else {
        await assignUserRole(activeUser.id, roleId);
        const role = allRoles.find(r => r.id === roleId);
        if (role) setActiveUserRoles(prev => [...prev, role]);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const columns = [
    { key: 'username', title: 'Username' },
    { key: 'email', title: 'Email' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <PermissionGuard permission="users.manage">
            <button onClick={() => handleOpenForm(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
              <Edit2 size={16} />
            </button>
            <button onClick={() => handleOpenRoles(row)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors">
              <Shield size={16} />
            </button>
            {row.id !== 1 && row.id !== (profile?.id || 0) && (
              <button onClick={() => { setActiveUser(row); setIsDeleteOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <PermissionGuard permission="users.manage">
          <button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus size={16} /> Add User
          </button>
        </PermissionGuard>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <DataTable columns={columns} data={users} isLoading={isLoading} emptyState="No users registered." />
      </div>

      <ModalForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSubmitForm}
        title={activeUser ? "Edit User" : "Create User"}
        isSubmitting={isSubmitting}
      >
        {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800/50 mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password {activeUser && "(Leave blank to keep unchanged)"}</label>
            <input required={!activeUser} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      </ModalForm>

      <ModalForm
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={`Assign Roles to @${activeUser?.username}`}
        submitText="Close"
        onSubmit={(e) => setIsRoleModalOpen(false)}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {allRoles.length === 0 ? (
            <div className="text-sm text-gray-500">No roles exist in the system.</div>
          ) : (
             allRoles.map(role => {
               const isAssigned = activeUserRoles.some(ar => ar.id === role.id);
               return (
                 <label key={role.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface cursor-pointer transition-colors">
                   <input 
                     type="checkbox" 
                     className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
                     checked={isAssigned}
                     onChange={() => handleToggleRole(role.id, isAssigned)}
                   />
                   <div className="flex flex-col">
                     <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{role.name}</span>
                     {role.description && <span className="text-xs text-gray-500">{role.description}</span>}
                   </div>
                 </label>
               )
             })
          )}
        </div>
      </ModalForm>

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        title="Delete User"
        message={`Are you sure you want to permanently delete @${activeUser?.username}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
