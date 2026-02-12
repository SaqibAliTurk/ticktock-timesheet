import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockTimesheetEntries, projectNames, workTypes } from '@/lib/mockData';
import { TimesheetEntry } from '@/types';

// In-memory store for demo purposes
let entriesStore = { ...mockTimesheetEntries };

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const entries = entriesStore[id] || [];

    return NextResponse.json({ data: entries });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();

    const newEntry: TimesheetEntry = {
      id: `e${Date.now()}`,
      timesheetId: id,
      date: body.date,
      projectName: body.projectName,
      workType: body.workType,
      description: body.description,
      hours: parseFloat(body.hours),
    };

    if (!entriesStore[id]) {
      entriesStore[id] = [];
    }

    entriesStore[id].push(newEntry);

    return NextResponse.json({ data: newEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timesheetId = params.id;
    const body = await request.json();
    const { entryId, ...updates } = body;

    if (!entriesStore[timesheetId]) {
      return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
    }

    const entryIndex = entriesStore[timesheetId].findIndex((e) => e.id === entryId);

    if (entryIndex === -1) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    entriesStore[timesheetId][entryIndex] = {
      ...entriesStore[timesheetId][entryIndex],
      ...updates,
    };

    return NextResponse.json({ data: entriesStore[timesheetId][entryIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timesheetId = params.id;
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    if (!entriesStore[timesheetId]) {
      return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
    }

    entriesStore[timesheetId] = entriesStore[timesheetId].filter(
      (e) => e.id !== entryId
    );

    return NextResponse.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
