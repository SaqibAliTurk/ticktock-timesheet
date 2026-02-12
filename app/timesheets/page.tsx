'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Select } from '@/components/ui/Select';
import { Timesheet } from '@/types';

export default function TimesheetsPage() {
  const router = useRouter();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTimesheets();
  }, [filters, currentPage]);

  const fetchTimesheets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '5',
        ...(filters.status !== 'all' && { status: filters.status }),
      });

      const response = await fetch(`/api/timesheets?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }

      const data = await response.json();
      setTimesheets(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTimesheet = (id: string, status: string) => {
    if (status === 'MISSING') {
      router.push(`/timesheets/${id}?action=create`);
    } else {
      router.push(`/timesheets/${id}`);
    }
  };

  const getActionLabel = (status: string) => {
    switch (status) {
      case 'MISSING':
        return 'Create';
      case 'INCOMPLETE':
        return 'Update';
      default:
        return 'View';
    }
  };

  const getActionColor = (status: string) => {
    switch (status) {
      case 'MISSING':
        return 'text-blue-600 hover:text-blue-800';
      case 'INCOMPLETE':
        return 'text-orange-600 hover:text-orange-800';
      default:
        return 'text-blue-600 hover:text-blue-800';
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 8;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 6; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 5; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Your Timesheets
            </h1>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'incomplete', label: 'Incomplete' },
                  { value: 'missing', label: 'Missing' },
                ]}
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-48"
              />

              <Select
                options={[
                  { value: 'all', label: 'All Time' },
                  { value: 'this-month', label: 'This Month' },
                  { value: 'last-month', label: 'Last Month' },
                ]}
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
                className="w-48"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Week # ↓
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Date ↓
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Status ↓
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </td>
                    </tr>
                  ) : timesheets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No timesheets found
                      </td>
                    </tr>
                  ) : (
                    timesheets.map((timesheet) => (
                      <tr key={timesheet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {timesheet.weekNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {timesheet.dateRange}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={timesheet.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              handleViewTimesheet(timesheet.id, timesheet.status)
                            }
                            className={`font-medium ${getActionColor(
                              timesheet.status
                            )}`}
                          >
                            {getActionLabel(timesheet.status)}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">5 per page</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {renderPagination().map((page, index) =>
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ⋯
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <p className="text-center text-sm text-gray-500">
              © 2024 tentwenty. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
