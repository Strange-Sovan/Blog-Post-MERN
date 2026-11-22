import React from 'react';
import { MdComment, MdConstruction } from 'react-icons/md';

export const AdminComments: React.FC = () => {
  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30">
            <MdComment size={20} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Administration</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Comment Moderation</h1>
        <p className="mt-2 text-muted-foreground">Monitor and moderate all community comments across the platform.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/30">
          <MdConstruction size={40} />
        </span>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Coming Soon</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Comment management with filtering, deletion, and moderation actions will be available in the next release.
          </p>
        </div>
      </div>
    </div>
  );
};
