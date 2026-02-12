'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { projectNames, workTypes } from '@/lib/mockData';
import { TimesheetEntry } from '@/types';

interface AddEntryFormProps {
  timesheetId: string;
  onSuccess: () => void;
  onCancel: () => void;
  entry?: TimesheetEntry;
}

export const AddEntryForm: React.FC<AddEntryFormProps> = ({
  timesheetId,
  onSuccess,
  onCancel,
  entry,
}) => {
  const [formData, setFormData] = useState({
    projectName: entry?.projectName || projectNames[0],
    workType: entry?.workType || workTypes[0],
    description: entry?.description || '',
    hours: entry?.hours?.toString() || '4',
    date: entry?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.workType) {
      newErrors.workType = 'Work type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    const hours = parseFloat(formData.hours);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      newErrors.hours = 'Hours must be between 0 and 24';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = `/api/timesheets/${timesheetId}/entries`;
      const method = entry ? 'PUT' : 'POST';
      const body = entry
        ? { ...formData, entryId: entry.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      onSuccess();
    } catch (error) {
      setErrors({ submit: 'Failed to save entry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleHoursChange = (delta: number) => {
    const currentHours = parseFloat(formData.hours) || 0;
    const newHours = Math.max(0, Math.min(24, currentHours + delta));
    setFormData((prev) => ({ ...prev, hours: newHours.toString() }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Project *{' '}
          <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs text-gray-400 bg-gray-200 rounded-full">
            i
          </span>
        </label>
        <select
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white ${
            errors.projectName ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {projectNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {errors.projectName && (
          <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type of Work *{' '}
          <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs text-gray-400 bg-gray-200 rounded-full">
            i
          </span>
        </label>
        <select
          name="workType"
          value={formData.workType}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white ${
            errors.workType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {workTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.workType && (
          <p className="mt-1 text-sm text-red-600">{errors.workType}</p>
        )}
      </div>

      <Textarea
        label="Task description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Write text here ..."
        rows={6}
        error={errors.description}
      />
      <p className="text-xs text-gray-500">A note for extra info</p>

      <Input
        label="Date *"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hours *
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleHoursChange(-1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            −
          </button>
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            className="w-20 px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
            min="0"
            max="24"
            step="0.5"
          />
          <button
            type="button"
            onClick={() => handleHoursChange(1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>
        {errors.hours && (
          <p className="mt-1 text-sm text-red-600">{errors.hours}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-sm text-red-600">{errors.submit}</p>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {entry ? 'Update entry' : 'Add entry'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
