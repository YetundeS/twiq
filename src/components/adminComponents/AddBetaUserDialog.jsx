"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { grantBetaAccess, getAllUsers } from '@/apiCalls/adminAPI';
import { Search, Calendar, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

const AddBetaUserDialog = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    userEmail: '',
    betaPlan: 'PRO',
    startDate: new Date().toISOString().split('T')[0],
    durationDays: 90
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.organization_name && user.organization_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
      setShowUserDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowUserDropdown(false);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.users.filter(user => !user.is_beta_user)); // Exclude existing beta users
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userEmail) {
      toast.error('Please select a user');
      return;
    }

    try {
      setLoading(true);
      await grantBetaAccess(formData);
      toast.success('Beta access granted successfully');
      onUserAdded();
    } catch (error) {
      console.error('Error granting beta access:', error);
      toast.error(error.error || 'Failed to grant beta access');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setFormData({ ...formData, userEmail: user.email });
    setSearchTerm(`${user.user_name} (${user.email})`);
    setShowUserDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getDurationOptions = () => [
    { value: 30, label: '30 days (1 month)' },
    { value: 60, label: '60 days (2 months)' },
    { value: 90, label: '90 days (3 months)' },
    { value: 180, label: '180 days (6 months)' },
    { value: 365, label: '365 days (1 year)' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Grant Beta Access
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Selection */}
            <div className="relative">
              <Label htmlFor="userSearch" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select User
              </Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* User Dropdown */}
              {showUserDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredUsers.slice(0, 10).map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.user_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan Selection */}
            <div>
              <Label htmlFor="betaPlan" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Award className="inline h-4 w-4 mr-1" />
                Beta Plan
              </Label>
              <select
                name="betaPlan"
                value={formData.betaPlan}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="STARTER">Starter Plan</option>
                <option value="PRO">Pro Plan</option>
                <option value="ENTERPRISE">Enterprise Plan</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date
              </Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="durationDays" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock className="inline h-4 w-4 mr-1" />
                Duration
              </Label>
              <select
                name="durationDays"
                value={formData.durationDays}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {getDurationOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}\n              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.userEmail}
              >
                {loading ? 'Granting...' : 'Grant Beta Access'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBetaUserDialog;