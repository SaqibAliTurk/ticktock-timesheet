import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockTimesheets } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredTimesheets = [...mockTimesheets];

    if (status && status !== 'all') {
      filteredTimesheets = filteredTimesheets.filter(
        (t) => t.status === status.toUpperCase()
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTimesheets = filteredTimesheets.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedTimesheets,
      pagination: {
        page,
        limit,
        total: filteredTimesheets.length,
        totalPages: Math.ceil(filteredTimesheets.length / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch timesheets' },
      { status: 500 }
    );
  }
}
