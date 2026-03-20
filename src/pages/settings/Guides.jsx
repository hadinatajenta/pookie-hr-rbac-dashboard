import React from 'react';
import { UserPlus, ShieldPlus, LayoutTemplate, ArrowRight, CheckCircle2 } from 'lucide-react';

const GuideStep = ({ icon: Icon, title, description, color }) => (
  <div className="flex gap-4 p-6 bg-white dark:bg-[#1a1b1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
      <Icon className="text-white" size={24} />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function Guides() {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Administrative <span className="text-indigo-600 dark:text-indigo-400">Mastery</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn how to orchestrate the Pookie Auth system from blank state to a fully permissioned environment.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">1</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Provisioning Identity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GuideStep 
              icon={UserPlus} 
              color="bg-blue-600"
              title="Add System Users"
              description="Navigate to the Users module. Every staff member needs a unique identity. Ensure you use corporate emails for traceability."
            />
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl opacity-50">
               <div className="text-center">
                 <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                   <ArrowRight size={20} className="text-gray-400" />
                 </div>
                 <p className="text-xs text-gray-500">Next: Assign Capabilities</p>
               </div>
            </div>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">2</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Role Orchestration</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <GuideStep 
              icon={ShieldPlus} 
              color="bg-indigo-600"
              title="Create & Assign Roles"
              description="Roles are collections of permissions. Instead of assigning individual rights to users, you assign them a Role (e.g., 'Finance Manager')."
            />
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
               <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <CheckCircle2 size={12} /> PRO TIP
               </h4>
               <p className="text-xs text-indigo-700 dark:text-indigo-300">
                 Go to the <strong>Roles</strong> page, create a new role, then click the settings icon to map specific API actions (e.g. users.write, menus.read).
               </p>
            </div>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-6">
             <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">3</span>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu Visibility Flow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GuideStep 
              icon={LayoutTemplate} 
              color="bg-rose-600"
              title="Navigation Mapping"
              description="The system automatically shows/hides menus based on role permissions. If a user has 'menus.read', they can see the navigation items assigned to their role."
            />
             <div className="p-6 bg-gray-900 rounded-2xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform">
                  <LayoutTemplate size={80} />
               </div>
               <h4 className="text-sm font-bold mb-2">The Cycle is Complete</h4>
               <p className="text-[11px] text-gray-400 leading-relaxed">
                 Once a role is created and mapped to a menu path, any user assigned that role will instantly see the new navigation item upon their next refresh.
               </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 p-8 bg-indigo-600 rounded-3xl text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
        <p className="text-indigo-100 mb-6">Head over to the Users module to begin provisioning your team.</p>
        <button 
          onClick={() => window.location.href = '/users'}
          className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl"
        >
          Go to User Management
        </button>
      </div>
    </div>
  );
}
