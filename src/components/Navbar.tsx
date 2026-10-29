'use client';

import React from 'react';
import { PaperWidth } from '@/types/receipt';
import { PrinterIcon, RotateCcwIcon, BakeryIcon } from './Icons';

interface NavbarProps {
  paperWidth: PaperWidth;
  onChangePaperWidth: (width: PaperWidth) => void;
  onOpenReset: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  paperWidth,
  onChangePaperWidth,
  onOpenReset,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <BakeryIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                Receipt Generator
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Bakery Edition
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Pembuat & Pencetak Struk Thermal Toko Roti
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Paper Width Selector Switch */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onChangePaperWidth('58mm')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                paperWidth === '58mm'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              58mm
            </button>
            <button
              type="button"
              onClick={() => onChangePaperWidth('80mm')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                paperWidth === '80mm'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              80mm
            </button>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onOpenReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition cursor-pointer"
            title="Reset Data Struk"
          >
            <RotateCcwIcon size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm hover:shadow transition cursor-pointer"
          >
            <PrinterIcon size={16} />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </header>
  );
};
