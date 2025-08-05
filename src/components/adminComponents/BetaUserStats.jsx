"use client";

import { Card } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, Award } from 'lucide-react';

const BetaUserStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Beta Users',
      value: stats.totalBetaUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Active Beta Users',
      value: stats.activeBetaUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Converted Users',
      value: stats.convertedUsers,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
      
      {/* Plan Distribution */}
      {Object.keys(stats.planDistribution).length > 0 && (
        <Card className="p-6 md:col-span-2 lg:col-span-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.planDistribution).map(([plan, count]) => (
              <div key={plan} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {plan}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BetaUserStats;