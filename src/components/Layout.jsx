import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {label}
  </NavLink>
);

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              Tx
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">TxnValidator</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Data Processor</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">
            Workspace
          </p>
          <NavItem to="/" icon="⬆" label="Upload" />
          <NavItem to="/results" icon="📊" label="Validation Results" />
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800">
          <p className="text-[11px] text-slate-600">Implementation Internship</p>
          <p className="text-[10px] text-slate-700 mt-0.5">© 2024 TxnValidator</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-slate-900/50 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-semibold text-white">
              Transaction Data Validator & Processor
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload CSV files · Validate · Clean · Export
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Live
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="px-8 py-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
