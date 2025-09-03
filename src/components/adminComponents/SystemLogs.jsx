"use client";

import { cleanupOldLogs, getLogStats, getSystemLogs } from '@/apiCalls/adminAPI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Info,
  RefreshCw,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    level: 'all',
    source: 'all',
    search: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Fetch logs with current filters
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const [logsData, statsData] = await Promise.all([
        getSystemLogs(filters),
        getLogStats()
      ]);
      setLogs(logsData.logs);
      setPagination(logsData.pagination);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle cleanup
  const handleCleanup = async () => {
    try {
      const result = await cleanupOldLogs();
      toast.success(`Cleanup completed: ${result.deletedCount} logs deleted`);
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      toast.error('Failed to cleanup logs');
    }
  };

  // Export logs to CSV
  const handleExport = () => {
    if (!logs.length) {
      toast.error('No logs to export');
      return;
    }

    const csvContent = [
      // Headers
      'Timestamp,Level,Source,Message,Metadata',
      // Data rows
      ...logs.map(log => {
        const timestamp = new Date(log.created_at).toISOString();
        const metadata = JSON.stringify(log.metadata || {}).replace(/"/g, '""');
        return `"${timestamp}","${log.level}","${log.source}","${log.message.replace(/"/g, '""')}","${metadata}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Logs exported successfully');
  };

  // Get badge variant for log level
  const getLevelBadge = (level) => {
    const config = {
      error: { variant: 'destructive', icon: AlertCircle },
      warn: { variant: 'default', icon: AlertTriangle },
      info: { variant: 'secondary', icon: Info },
      debug: { variant: 'outline', icon: Bug }
    };
    
    const { variant, icon: Icon } = config[level] || config.info;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {level.toUpperCase()}
      </Badge>
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get source display name
  const getSourceDisplayName = (source) => {
    const sourceNames = {
      stripe: 'Stripe',
      auth: 'Authentication',
      chat: 'Chat System',
      vector_store: 'Vector Store',
      admin: 'Admin Panel',
      system: 'System',
      security: 'Security',
      database: 'Database'
    };
    return sourceNames[source] || source?.toUpperCase() || 'Unknown';
  };

  // Log detail modal
  const LogDetailModal = ({ log, onClose }) => {
    if (!log) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-semibold">Log Details</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Timestamp</label>
                  <p className="text-sm">{formatTimestamp(log.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Level</label>
                  <div className="mt-1">{getLevelBadge(log.level)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Source</label>
                  <p className="text-sm">{getSourceDisplayName(log.source)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-sm font-mono">{log.id}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded">{log.message}</p>
              </div>
              
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Metadata</label>
                  <pre className="text-xs mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
              
              {log.stack_trace && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Stack Trace</label>
                  <pre className="text-xs mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded overflow-x-auto">
                    {log.stack_trace}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Errors (24h)</p>
              <p className="text-2xl font-bold text-red-600">{stats.errors?.last24h || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Errors (7d)</p>
              <p className="text-2xl font-bold text-orange-600">{stats.errors?.last7d || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Logs</p>
              <p className="text-2xl font-bold text-blue-600">{pagination.total || 0}</p>
            </div>
            <Info className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Top Source</p>
              <p className="text-sm font-medium">
                {stats.topSources?.[0]?.source ? getSourceDisplayName(stats.topSources[0].source) : 'N/A'}
              </p>
            </div>
            <Bug className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!logs.length}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanup}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Cleanup Old
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option className='text-black' value="all">All Levels</option>
                <option className='text-black' value="error">Errors</option>
                <option className='text-black' value="warn">Warnings</option>
                <option className='text-black' value="info">Info</option>
                <option className='text-black' value="debug">Debug</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Source</label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option className='text-black' value="all">All Sources</option>
                <option className='text-black' value="stripe">Stripe</option>
                <option className='text-black' value="auth">Authentication</option>
                <option className='text-black' value="chat">Chat System</option>
                <option className='text-black' value="vector_store">Vector Store</option>
                <option className='text-black' value="admin">Admin Panel</option>
                <option className='text-black' value="system">System</option>
                <option className='text-black' value="security">Security</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search messages..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Limit</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                <option className='text-black' value="25">25 per page</option>
                <option className='text-black' value="50">50 per page</option>
                <option className='text-black' value="100">100 per page</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Time</th>
                <th className="p-3 text-left text-sm font-medium">Level</th>
                <th className="p-3 text-left text-sm font-medium">Source</th>
                <th className="p-3 text-left text-sm font-medium">Message</th>
                <th className="p-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No logs found matching your filters
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 text-sm">
                      {formatTimestamp(log.created_at)}
                    </td>
                    <td className="p-3">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="p-3 text-sm">
                      {getSourceDisplayName(log.source)}
                    </td>
                    <td className="p-3 text-sm max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      <LogDetailModal 
        log={selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />
    </div>
  );
};

export default SystemLogs;