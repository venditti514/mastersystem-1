"use client";

import { Bell, Search, User } from "lucide-react";

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900"
    >
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            placeholder="Buscar operações, DI, fornecedores..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:bg-slate-800 dark:focus:ring-slate-600"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
            <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">CFO</p>
          </div>
        </button>
      </div>
    </header>
  );
}
