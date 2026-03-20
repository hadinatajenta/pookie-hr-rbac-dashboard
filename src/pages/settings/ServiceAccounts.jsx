import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getServiceAccounts, createServiceAccount, deleteServiceAccount } from '../../services/serviceAccounts';
import DataTable from '../../components/DataTable';
import ModalForm from '../../components/ModalForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import PermissionGuard from '../../components/PermissionGuard';
import { Plus, Key, Trash2, Copy, Check, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
import GuidedTour from '../../components/GuidedTour';

export default function ServiceAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const tourSteps = [
    { targetId: 'tour-generate-key', title: 'Machine Access', content: 'Generate high-entropy secret keys for specialized scripts or services. Warning: These are only shown ONCE.' }
  ];

  // New Key Modal
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getServiceAccounts();
      setAccounts(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleOpenForm = () => {
    setError(null);
    setNewKey(null);
    setFormData({ name: '', description: '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const resp = await createServiceAccount(formData);
      // Backend returns the raw API key ONLY on creation
      if (resp.data?.api_key) setNewKey(resp.data.api_key);
      toast.success(`Service account '${formData.name}' created successfully`);
      fetchAccounts();
      // Keep form open to show the token
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    setIsSubmitting(true);
    try {
      await deleteServiceAccount(activeAccount.id); // Changed to deleteServiceAccount
      toast.success(`Service account '${activeAccount.name}' revoked permanently`);
      setIsRevokeOpen(false);
      fetchAccounts();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setNewKey(null);
  }

  const columns = [
    { key: 'name', title: 'System Identifier', render: row => <div className="font-semibold">{row.name}</div> },
    { key: 'description', title: 'Description' },
    { key: 'api_key_prefix', title: 'Key Prefix', render: row => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{row.api_key_prefix}*********</code> },
    { key: 'status', title: 'Status', render: row => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
           {row.status.toUpperCase()}
        </span>
    )},
    { key: 'last_used_at', title: 'Last Seen', render: row => <span className="text-gray-500 whitespace-nowrap">{row.last_used_at ? new Date(row.last_used_at).toLocaleString() : 'Never used'}</span> },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (row) => row.status === 'active' ? (
        <div className="flex items-center gap-2">
          <PermissionGuard permission="service_accounts.manage">
            <button title="Revoke Capability" onClick={() => { setActiveAccount(row); setIsRevokeOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-1">
              <Trash2 size={16} /> <span className="text-xs">Revoke</span>
            </button>
          </PermissionGuard>
        </div>
      ) : <span className="text-gray-400 text-xs italic">Revoked</span>
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Accounts</h1>
          <button 
            onClick={() => setIsTourOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 transition-colors uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/30"
          >
            <HelpCircle size={14} /> Quick Start
          </button>
        </div>
        <PermissionGuard permission="service_accounts.manage">
          <button id="tour-generate-key" onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
            <Plus size={16} /> Generate Secret Key
          </button>
        </PermissionGuard>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <DataTable columns={columns} data={accounts} isLoading={isLoading} emptyState="No service accounts active." />
      </div>

      <ModalForm isOpen={isFormOpen} onClose={closeForm} onSubmit={handleSubmit} title="Create Service Account" isSubmitting={isSubmitting} submitText="Generate Token">
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        
        {newKey ? (
           <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                 <h3 className="text-amber-800 dark:text-amber-500 font-bold mb-2">Save this Key Now!</h3>
                 <p className="text-sm text-amber-700 dark:text-amber-400">You will never be able to see this token again after you close this window. Please copy it safely inside your system configuration.</p>
              </div>
              <div className="relative">
                 <input readOnly type="text" value={newKey} className="w-full pl-3 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm selection:bg-indigo-500/30" />
                 <button type="button" onClick={copyToClipboard} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-indigo-600 transition-colors">
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                 </button>
              </div>
           </div>
        ) : (
           <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Identifier <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400" placeholder="e.g. payment-gateway-production" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-surface text-gray-900 dark:text-gray-100 placeholder:text-gray-400" placeholder="Briefly explain the purpose of this credential..." />
            </div>
           </div>
        )}
      </ModalForm>

      <ConfirmDialog isOpen={isRevokeOpen} title="Revoke Key Access" message={`Are you absolute sure you want to revoke '${activeAccount?.name}'? Any systems using this token will instantly lose authorization payload capability.`} confirmText="Forcibly Revoke" confirmColor="bg-red-600 hover:bg-red-700" onConfirm={handleRevoke} onCancel={() => setIsRevokeOpen(false)} />

      <GuidedTour 
        isOpen={isTourOpen} 
        steps={tourSteps} 
        onClose={() => setIsTourOpen(false)} 
      />
    </div>
  );
}

