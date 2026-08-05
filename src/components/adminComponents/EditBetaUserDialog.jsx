"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateBetaUser } from '@/apiCalls/adminAPI';
import { Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const toDateInputValue = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const EditBetaUserDialog = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    userName: '',
    organizationName: '',
    betaPlan: 'PRO',
    betaEndDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        userName: user.user_name || '',
        organizationName: user.organization_name || '',
        betaPlan: user.beta_plan || 'PRO',
        betaEndDate: toDateInputValue(user.beta_end_date)
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName.trim()) {
      toast.error('User name cannot be empty');
      return;
    }
    if (!formData.organizationName.trim()) {
      toast.error('Organization name cannot be empty');
      return;
    }
    if (!formData.betaEndDate) {
      toast.error('End date is required');
      return;
    }

    try {
      setLoading(true);
      await updateBetaUser({
        userId: user.id,
        userName: formData.userName.trim(),
        organizationName: formData.organizationName.trim(),
        betaPlan: formData.betaPlan,
        betaEndDate: formData.betaEndDate
      });
      toast.success('User updated successfully');
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.error || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Beta User
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                type="email"
                value={user.email || ''}
                className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <Label htmlFor="userName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </Label>
              <Input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization Name
              </Label>
              <Input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>

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

            <div>
              <Label htmlFor="betaEndDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date
              </Label>
              <Input
                type="date"
                name="betaEndDate"
                value={formData.betaEndDate}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.userName || !formData.organizationName || !formData.betaEndDate}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBetaUserDialog;
