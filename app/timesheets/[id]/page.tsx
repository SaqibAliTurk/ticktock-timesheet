'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Modal } from '@/components/ui/Modal';
import { AddEntryForm } from '@/components/forms/AddEntryForm';
import { Button } from '@/components/ui/Button';
import { TimesheetEntry } from '@/types';
import { format } from 'date-fns';

export default function TimesheetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const timesheetId = params.id as string;

  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | undefined>();
  const [totalHours, setTotalHours] = useState(0);
  const [weeklyHours] = useState(40);

  useEffect(() => {
    fetchEntries();
    // Auto-open modal if action=create in URL
    if (searchParams.get('action') === 'create') {
      setIsModalOpen(true);
    }
  }, [timesheetId, searchParams]);

  useEffect(() => {
    const total = entries.reduce((sum, entry) => sum + entry.hours, 0);
    setTotalHours(total);
  }, [entries]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/timesheets/${timesheetId}/entries`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = () => {
    setEditingEntry(undefined);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(
        `/api/timesheets/${timesheetId}/entries?entryId=${entryId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete entry');
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEntry(undefined);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchEntries();
  };

  const groupEntriesByDate = () => {
    const grouped: Record<string, TimesheetEntry[]> = {};
    entries.forEach((entry) => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = [];
      }
      grouped[entry.date].push(entry);
    });
    return grouped;
  };

  const groupedEntries = groupEntriesByDate();
  const dates = Object.keys(groupedEntries).sort();

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr + 'T00:00:00'), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  const progressPercentage = Math.min(100, (totalHours / weeklyHours) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  This week&apos;s timesheet
                </h1>
                <p className="text-sm text-gray-500 mt-1">21 - 26 January, 2024</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {totalHours}/{weeklyHours} hrs
                  </div>
                  <div className="text-xs text-gray-400">{progressPercentage.toFixed(0)}%</div>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Entries */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : dates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No entries yet</p>
                <Button onClick={handleAddEntry}>Add your first entry</Button>
              </div>
            ) : (
              <div className="space-y-8">
                {dates.map((date) => (
                  <div key={date}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      {formatDate(date)}
                    </h3>
                    <div className="space-y-3">
                      {groupedEntries[date].map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {entry.projectName}
                            </div>
                            {entry.description && (
                              <div className="text-sm text-gray-500 mt-1">
                                {entry.description}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                              {entry.hours} hrs
                            </div>
                            <div className="text-sm text-blue-600">
                              {entry.workType}
                            </div>
                            <div className="relative group">
                              <button className="text-gray-400 hover:text-gray-600 p-1">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </button>
                              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                                <button
                                  onClick={() => handleEditEntry(entry)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleAddEntry}
                        className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">+</span>
                        Add new task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add button for empty state or additional entries */}
            {!isLoading && dates.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleAddEntry}
                  className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span>
                  Add new task
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingEntry ? 'Edit Entry' : 'Add New Entry'}
      >
        <AddEntryForm
          timesheetId={timesheetId}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
          entry={editingEntry}
        />
      </Modal>
    </div>
  );
}
