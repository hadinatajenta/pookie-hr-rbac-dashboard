import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import AppLayout from './components/layout/AppLayout';
import PagePlaceholder from './components/PagePlaceholder';
import EmployeeList from './pages/employees/EmployeeList';
import useUserStore from './store/useUserStore';
import { useEffect } from 'react';

export default function App() {
  const theme = useUserStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            {/* Index redirects to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Unauthorized Route */}
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Dashboard Route */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Top-Level Parent Routes (Optional if they have their own landing pages, else redirect to child or show placeholder) */}
            <Route path="employees" element={<PagePlaceholder title="Employees" />} />
            <Route path="attendance" element={<PagePlaceholder title="Attendance" />} />
            <Route path="payroll" element={<PagePlaceholder title="Payroll" />} />
            <Route path="recruitment" element={<PagePlaceholder title="Recruitment" />} />
            <Route path="performance" element={<PagePlaceholder title="Performance" />} />
            <Route path="projects" element={<PagePlaceholder title="Projects" />} />
            <Route path="reports" element={<PagePlaceholder title="Reports" />} />
            <Route path="settings" element={<PagePlaceholder title="Settings" />} />

            {/* Employees Sub-routes */}
            <Route path="employees/list" element={<EmployeeList />} />
            <Route path="employees/roles" element={<PagePlaceholder title="Employee Roles" />} />
            <Route path="employees/departments" element={<PagePlaceholder title="Departments" />} />

            {/* Attendance Sub-routes */}
            <Route path="attendance/checkin" element={<PagePlaceholder title="Check-in/Check-out" />} />
            <Route path="attendance/records" element={<PagePlaceholder title="Attendance Records" />} />
            <Route path="attendance/leave" element={<PagePlaceholder title="Leave Requests" />} />

            {/* Payroll Sub-routes */}
            <Route path="payroll/salary" element={<PagePlaceholder title="Salary Configurations" />} />
            <Route path="payroll/payslips" element={<PagePlaceholder title="Payslips" />} />
            <Route path="payroll/reimbursements" element={<PagePlaceholder title="Reimbursements" />} />

            {/* Recruitment Sub-routes */}
            <Route path="recruitment/jobs" element={<PagePlaceholder title="Job Postings" />} />
            <Route path="recruitment/candidates" element={<PagePlaceholder title="Candidates" />} />
            <Route path="recruitment/interviews" element={<PagePlaceholder title="Interviews" />} />

            {/* Performance Sub-routes */}
            <Route path="performance/goals" element={<PagePlaceholder title="Performance Goals" />} />
            <Route path="performance/reviews" element={<PagePlaceholder title="Performance Reviews" />} />

            {/* Projects Sub-routes */}
            <Route path="projects/list" element={<PagePlaceholder title="Project List" />} />
            <Route path="projects/tasks" element={<PagePlaceholder title="Tasks" />} />

            {/* Reports Sub-routes */}
            <Route path="reports/hr" element={<PagePlaceholder title="HR Reports" />} />
            <Route path="reports/payroll" element={<PagePlaceholder title="Payroll Reports" />} />

            {/* Settings Sub-routes */}
            <Route path="settings/users" element={<PagePlaceholder title="User Management" />} />
            <Route path="settings/roles" element={<PagePlaceholder title="Role Management" />} />
            <Route path="settings/permissions" element={<PagePlaceholder title="Permission Setup" />} />
            <Route path="settings/menus" element={<PagePlaceholder title="Menu Configurations" />} />

            {/* Any unrecognized sub-route under / redirects to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          {/* Global catch-all redirects to root which is caught by PrivateRoute */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
