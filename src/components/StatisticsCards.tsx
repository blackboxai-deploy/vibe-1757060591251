"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FamilyStatistics } from '@/types';

interface StatisticsCardsProps {
  statistics: FamilyStatistics;
}

export default function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const getCodeBadgeColor = (code: string) => {
    const colors: { [key: string]: string } = {
      'Elderly': 'bg-purple-100 text-purple-800 border-purple-200',
      'PWD': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pregnant': 'bg-pink-100 text-pink-800 border-pink-200',
      'Lactating': 'bg-orange-100 text-orange-800 border-orange-200',
      'Infant': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Children': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'N/A': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[code] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case 'High Priority':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Priority':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Families */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Families
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {statistics.totalFamilies}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Registered families
          </p>
        </CardContent>
      </Card>

      {/* Total Members */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {statistics.totalMembers}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Individual members
          </p>
        </CardContent>
      </Card>

      {/* Special Codes Breakdown */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Special Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(statistics.codeBreakdown)
              .filter(([code, count]) => code !== 'N/A' && count > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([code, count]) => (
                <div key={code} className="flex justify-between items-center">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCodeBadgeColor(code)}`}
                  >
                    {code}
                  </Badge>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            {Object.values(statistics.codeBreakdown).every(count => count === 0 || 
              Object.keys(statistics.codeBreakdown).length === 1) && (
              <p className="text-sm text-gray-500">No special codes assigned</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Health Status */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Health Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(statistics.healthBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([health, count]) => (
                <div key={health} className="flex justify-between items-center">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getHealthBadgeColor(health)}`}
                  >
                    {health}
                  </Badge>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            {Object.values(statistics.healthBreakdown).every(count => count === 0) && (
              <p className="text-sm text-gray-500">No health data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Evacuation Sites */}
      <Card className="border-l-4 border-l-orange-500 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Evacuation Site Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(statistics.evacuationSiteBreakdown)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([site, count]) => (
                <div key={site} className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {site}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ 
                        width: `${statistics.totalFamilies > 0 ? (count / statistics.totalFamilies) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
          {Object.values(statistics.evacuationSiteBreakdown).every(count => count === 0) && (
            <p className="text-sm text-gray-500 text-center">No evacuation site data available</p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Code Breakdown */}
      <Card className="md:col-span-2 lg:col-span-4 border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Complete Demographics Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(statistics.codeBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([code, count]) => (
                <div key={code} className="text-center">
                  <Badge 
                    variant="outline" 
                    className={`text-xs mb-2 ${getCodeBadgeColor(code)}`}
                  >
                    {code}
                  </Badge>
                  <div className="text-xl font-bold">
                    {count}
                  </div>
                  <div className="text-xs text-gray-500">
                    {statistics.totalMembers > 0 
                      ? `${((count / statistics.totalMembers) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}