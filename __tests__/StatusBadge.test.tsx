import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders COMPLETED status with correct styling', () => {
    render(<StatusBadge status="COMPLETED" />);
    const badge = screen.getByText('COMPLETED');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders INCOMPLETE status with correct styling', () => {
    render(<StatusBadge status="INCOMPLETE" />);
    const badge = screen.getByText('INCOMPLETE');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders MISSING status with correct styling', () => {
    render(<StatusBadge status="MISSING" />);
    const badge = screen.getByText('MISSING');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });
});
