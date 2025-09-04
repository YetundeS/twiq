"use client";

import "@/styles/platformStyles.css";
import { useState, useEffect } from 'react';
import { getDashboardStats, getBetaUsers } from '@/apiCalls/adminAPI';
import BetaUserStats from '@/components/adminComponents/BetaUserStats';
import BetaUserTable from '@/components/adminComponents/BetaUserTable';
import AddBetaUserDialog from '@/components/adminComponents/AddBetaUserDialog';
import SystemLogs from '@/components/adminComponents/SystemLogs';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Home, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [betaUsers, setBetaUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(false);
  const [activeTab, setActiveTab] = useState('beta-users');
  
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Only fetch beta user data if we're on the beta users tab
      if (activeTab === 'beta-users') {
        const [statsData, usersData] = await Promise.all([
          getDashboardStats(),
          getBetaUsers(includeExpired)
        ]);
        setStats(statsData);
        setBetaUsers(usersData.betaUsers);
      } else {
        const statsData = await getDashboardStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [includeExpired, activeTab]);

  const handleAddBetaUser = () => {
    setShowAddDialog(true);
  };

  const handleBetaUserAdded = () => {
    fetchData(); // Refresh data
    setShowAddDialog(false);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleGoToDashboard = () => {
    const slug = params.slug;
    router.push(`/platform/${slug}`);
  };

  if (loading) {
    return (
      <div className="page_content">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="page_content">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Manage beta users and view platform statistics
            </p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Go to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Refresh
            </Button>
            {activeTab === 'beta-users' && (
              <Button
                onClick={handleAddBetaUser}
                className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add Beta User</span>
                <span className="sm:hidden">Add User</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('beta-users')}
              className={`py-2 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'beta-users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Beta Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('system-logs')}
              className={`py-2 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'system-logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                System Logs
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'beta-users' && (
          <>
            {/* Stats */}
            {stats && <BetaUserStats stats={stats} />}

            {/* Beta Users Table */}
            <BetaUserTable 
              betaUsers={betaUsers}
              onRefresh={fetchData}
              includeExpired={includeExpired}
              onToggleExpired={setIncludeExpired}
            />

            {/* Add Beta User Dialog */}
            {showAddDialog && (
              <AddBetaUserDialog
                isOpen={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onUserAdded={handleBetaUserAdded}
              />
            )}
          </>
        )}

        {activeTab === 'system-logs' && (
          <div className="mt-6">
            <SystemLogs />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
