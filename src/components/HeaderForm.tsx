'use client';

import React, { useRef } from 'react';
import { ReceiptHeader } from '@/types/receipt';
import { getCurrentDateTimeLocal } from '@/utils/formatters';
import { WindmillLogo, UploadIcon, TrashIcon } from './Icons';

interface HeaderFormProps {
  header: ReceiptHeader;
  onChange: (updater: (prev: ReceiptHeader) => ReceiptHeader) => void;
}

export const HeaderForm: React.FC<HeaderFormProps> = ({ header, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof ReceiptHeader, value: unknown) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSetCurrentTime = () => {
    handleFieldChange('dateTime', getCurrentDateTimeLocal());
  };

  const handleGenerateReceiptNo = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    handleFieldChange('receiptNo', `SL${y}${m}${d}-${rand}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Draw image into canvas to turn it into high-contrast grayscale for thermal printer
        const canvas = document.createElement('canvas');
        const maxDim = 200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          // Binarize / High contrast for thermal clarity
          const val = avg > 180 ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
        ctx.putImageData(imgData, 0, 0);

        const processedUrl = canvas.toDataURL('image/png');
        onChange((prev) => ({
          ...prev,
          logoType: 'custom',
          customLogoUrl: processedUrl,
        }));
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            1. Header Struk & Info Toko
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pengaturan identitas toko, kasir, waktu, dan logo struk
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Nama Toko */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nama Toko <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={header.storeName}
            onChange={(e) => handleFieldChange('storeName', e.target.value)}
            placeholder="Contoh: HOLLAND BAKERY CILEGON"
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        {/* Alamat & Telepon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Alamat Toko (2-3 baris)
            </label>
            <textarea
              rows={2}
              value={header.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="Contoh: Jln. Ahmad Yani no.12C&12D Sukmaj"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              No. Telepon / WhatsApp
            </label>
            <input
              type="text"
              value={header.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="Contoh: Telp.0254-390732 WA.085178493493"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Kasir, Mesin, No Struk */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Kasir (Cashier)
            </label>
            <input
              type="text"
              value={header.cashier}
              onChange={(e) => handleFieldChange('cashier', e.target.value)}
              placeholder="BENING"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Mesin (Machine)
            </label>
            <input
              type="text"
              value={header.machine}
              onChange={(e) => handleFieldChange('machine', e.target.value)}
              placeholder="U04"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                No. Struk (Receipt)
              </label>
              <button
                type="button"
                onClick={handleGenerateReceiptNo}
                className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
              >
                Acak
              </button>
            </div>
            <input
              type="text"
              value={header.receiptNo}
              onChange={(e) => handleFieldChange('receiptNo', e.target.value)}
              placeholder="SL20261025-00211"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Tanggal & Jam */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Tanggal & Jam Transaksi
            </label>
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
            >
              Gunakan Waktu Sekarang
            </button>
          </div>
          <input
            type="datetime-local"
            step="1"
            value={header.dateTime}
            onChange={(e) => handleFieldChange('dateTime', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Opsi Logo */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={header.showLogo}
                onChange={(e) => handleFieldChange('showLogo', e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-zinc-300 dark:border-zinc-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Tampilkan Logo di Struk
              </span>
            </label>
          </div>

          {header.showLogo && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleFieldChange('logoType', 'default')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  header.logoType === 'default'
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                }`}
              >
                <div className="w-4 h-4 text-black flex items-center justify-center">
                  <WindmillLogo size={16} />
                </div>
                <span>Logo Kincir Angin (Holland)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleFieldChange('logoType', 'custom');
                  if (!header.customLogoUrl) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  header.logoType === 'custom'
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                }`}
              >
                <UploadIcon size={14} />
                <span>Upload Logo Sendiri</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {header.logoType === 'custom' && header.customLogoUrl && (
                <div className="flex items-center gap-2 ml-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={header.customLogoUrl}
                    alt="Custom Logo Preview"
                    className="w-7 h-7 object-contain bg-white border border-zinc-300 rounded p-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange((prev) => ({
                        ...prev,
                        logoType: 'default',
                        customLogoUrl: null,
                      }));
                    }}
                    className="text-zinc-400 hover:text-rose-500 cursor-pointer p-0.5"
                    title="Hapus Logo Kustom"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
