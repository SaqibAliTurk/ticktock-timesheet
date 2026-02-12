'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900">ticktock</h1>
            <nav className="flex gap-6">
              <button
                onClick={() => router.push('/timesheets')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Timesheets
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {session?.user && (
              <>
                <span className="text-gray-700">{session.user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
