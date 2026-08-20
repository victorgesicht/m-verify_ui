import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Smartphone, History, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-slate-950 text-slate-100 shadow-xl border-b border-slate-800">
      {/* Kenyan Flag Strip (0 margins) */}
      <div className="w-full h-1.5 flex m-0 p-0">
        <div className="h-full w-1/3 bg-black"></div>
        <div className="h-full w-1/3 bg-[#990000]"></div>
        <div className="h-full w-1/3 bg-[#006600]"></div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand/Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
                M-VERIFY<span className="h-2 w-2 rounded-full bg-[#990000] inline-block"></span>
              </span>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">
                Kenya Secure Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#verify" className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors duration-200">
              <Smartphone className="h-4 w-4" />
              <span>Verify Number</span>
            </a>
            <a href="#history" className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors duration-200">
              <History className="h-4 w-4" />
              <span>Audit Log</span>
            </a>
            <a href="#help" className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors duration-200">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </a>
          </div>

          {/* CTA & Status Badge */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              ● System Online
            </div>
            <button className="bg-[#990000] hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-red-900/30">
              New Search
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <a href="#verify" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-900 hover:text-emerald-400">
              <Smartphone className="h-5 w-5" />
              <span>Verify Number</span>
            </a>
            <a href="#history" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-900 hover:text-emerald-400">
              <History className="h-5 w-5" />
              <span>Audit Log</span>
            </a>
            <a href="#help" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-900 hover:text-emerald-400">
              <HelpCircle className="h-5 w-5" />
              <span>Support</span>
            </a>
            <div className="pt-2">
              <button className="w-full bg-[#990000] hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                New Search
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}