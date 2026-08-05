"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { revokeBetaAccess } from '@/apiCalls/adminAPI';
import { Trash2, Clock, CheckCircle, XCircle, Filter, Pencil, Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import EditBetaUserDialog from './EditBetaUserDialog';

const BetaUserTable = ({ betaUsers, onRefresh, includeExpired, onToggleExpired }) => {
  const [loading, setLoading] = useState(false);
  const [revealedPasswordUserId, setRevealedPasswordUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const handleTogglePassword = (userId) => {
    setRevealedPasswordUserId((current) => (current === userId ? null : userId));
  };

  const handleCopyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Temporary password copied');
    } catch {
      toast.error('Failed to copy password');
    }
  };

  const handleUserUpdated = () => {
    setEditingUser(null);
    onRefresh();
  };

  const handleRevokeBetaAccess = async (userId, userName) => {
    if (!confirm(`Are you sure you want to revoke beta access for ${userName}?`)) {
      return;
    }

    try {
      setLoading(true);
      await revokeBetaAccess(userId);
      toast.success(`Beta access revoked for ${userName}`);
      onRefresh();
    } catch (error) {
      console.error('Error revoking beta access:', error);
      toast.error('Failed to revoke beta access');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'STARTER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'PRO':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ENTERPRISE':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusBadge = (user) => {
    if (user.isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <XCircle className="h-3 w-3" />
          Expired
        </span>
      );
    }

    if (user.beta_converted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle className="h-3 w-3" />
          Converted
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        <Clock className="h-3 w-3" />
        Active ({user.daysRemaining} days)
      </span>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Beta Users ({betaUsers.length})
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={includeExpired ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleExpired(!includeExpired)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {includeExpired ? 'Hide Expired' : 'Show Expired'}
          </Button>
        </div>
      </div>

      <EditBetaUserDialog
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUserUpdated={handleUserUpdated}
      />

      {betaUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No beta users found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                  User
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                  Plan
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                  Start Date
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                  End Date
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {betaUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.user_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                      {user.organization_name && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {user.organization_name}
                        </div>
                      )}
                      {user.temporary_password && (
                        <div className="mt-2 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 dark:border-amber-800/50 dark:bg-amber-900/20">
                          <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                            Temp password:
                          </span>
                          <code className="font-mono text-xs text-amber-900 dark:text-amber-100">
                            {revealedPasswordUserId === user.id ? user.temporary_password : '••••••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleTogglePassword(user.id)}
                            className="text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                            aria-label={revealedPasswordUserId === user.id ? 'Hide password' : 'Show password'}
                          >
                            {revealedPasswordUserId === user.id
                              ? <EyeOff className="h-3.5 w-3.5" />
                              : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(user.temporary_password)}
                            className="text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                            aria-label="Copy temporary password"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(user.beta_plan)}`}>
                      {user.beta_plan}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {getStatusBadge(user)}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(user.beta_start_date)}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(user.beta_end_date)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        disabled={loading}
                        aria-label={`Edit ${user.user_name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!user.isExpired && !user.beta_converted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeBetaAccess(user.id, user.user_name)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={`Revoke beta access for ${user.user_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default BetaUserTable;