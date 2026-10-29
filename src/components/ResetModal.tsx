'use client';

import React from 'react';
import { RotateCcwIcon, TrashIcon } from './Icons';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDefault: () => void;
  onClearAll: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onResetDefault,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-900 dark:text-zinc-100">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
          <RotateCcwIcon size={24} />
        </div>

        <h3 className="text-xl font-bold mb-2">Reset Data Struk</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Pilih tindakan reset yang ingin Anda lakukan. Data yang belum dicetak akan diganti.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              onResetDefault();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-medium transition cursor-pointer shadow-sm"
          >
            <RotateCcwIcon size={18} />
            <span>Pulihkan Data Contoh (Holland Bakery)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClearAll();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-medium transition border border-rose-200 dark:border-rose-800 cursor-pointer"
          >
            <TrashIcon size={18} />
            <span>Kosongkan Semua Inputan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition cursor-pointer mt-1"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
