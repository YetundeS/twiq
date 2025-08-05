"use client";

import "@/styles/platformStyles.css";
import { useState, useEffect } from 'react';
import { getDashboardStats, getBetaUsers } from '@/apiCalls/adminAPI';
import BetaUserStats from '@/components/adminComponents/BetaUserStats';
import BetaUserTable from '@/components/adminComponents/BetaUserTable';
import AddBetaUserDialog from '@/components/adminComponents/AddBetaUserDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [betaUsers, setBetaUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        getDashboardStats(),
        getBetaUsers(includeExpired)
      ]);
      setStats(statsData);
      setBetaUsers(usersData.betaUsers);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [includeExpired]);

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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage beta users and view platform statistics
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={handleAddBetaUser}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Beta User
            </Button>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Admin;
