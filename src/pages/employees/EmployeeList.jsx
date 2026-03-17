import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import Spinner from '../../components/atoms/Spinner';
import { Users, Search, MoreHorizontal } from 'lucide-react';
import Badge from '../../components/atoms/Badge';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        // Assuming the response structure is { data: { ... } } or { data: [ ... ] }
        const usersData = res.data || [];
        setEmployees(usersData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    return (
      emp.first_name?.toLowerCase().includes(term) ||
      emp.last_name?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.username?.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 anim-fade-in">
        <p className="font-semibold">Error Loading Employees</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="anim-fade-up flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            Employee Directory
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage and view all registered users across the organization.</p>
        </div>
        
        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
            Add User
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl overflow-hidden flex-1 flex flex-col relative z-10 shadow-sm dark:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Roles</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/40 text-zinc-600 dark:text-zinc-300">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {emp.first_name ? emp.first_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {emp.first_name} {emp.last_name}
                          </span>
                          <span className="text-[11px] text-zinc-500">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">@{emp.username}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {emp.roles && emp.roles.length > 0 ? (
                          emp.roles.map((role, idx) => (
                            <Badge key={idx} variant={role.toLowerCase() === 'admin' ? 'info' : 'default'} className="text-[10px] px-1.5 py-0.5">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-600 italic">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">
                    No employees found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
