'use client';

import React from 'react';
import { ReceiptPayment, PaymentMethod, PaperWidth } from '@/types/receipt';
import { CalculationResult } from '@/utils/calculations';
import { formatRupiah } from '@/utils/formatters';

interface PaymentFormProps {
  payment: ReceiptPayment;
  paperWidth: PaperWidth;
  calculations: CalculationResult;
  onChangePayment: (updater: (prev: ReceiptPayment) => ReceiptPayment) => void;
  onChangePaperWidth: (width: PaperWidth) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  payment,
  paperWidth,
  calculations,
  onChangePayment,
  onChangePaperWidth,
}) => {
  const handleFieldChange = (field: keyof ReceiptPayment, value: unknown) => {
    onChangePayment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const paymentMethods: PaymentMethod[] = ['Tunai', 'QRIS', 'Debit', 'Kredit', 'Transfer'];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-5">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          3. Pembayaran, Pajak & Pengaturan Cetak
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Atur metode pembayaran, kalkulasi PPN, footer, dan ukuran kertas printer
        </p>
      </div>

      {/* Ringkasan Real-Time */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50">
        <div>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
            Total Item
          </span>
          <p className="text-base font-bold text-amber-900 dark:text-amber-200">
            {calculations.totalItems} pcs
          </p>
        </div>
        <div>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
            Grand Total
          </span>
          <p className="text-base font-bold text-amber-900 dark:text-amber-200">
            {formatRupiah(calculations.grandTotal)}
          </p>
        </div>
        {payment.includeTax && (
          <>
            <div>
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                DPP
              </span>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {formatRupiah(calculations.dpp)}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                PPN ({payment.taxPercent}%)
              </span>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {formatRupiah(calculations.ppn)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* PPN Toggle & Persentase */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={payment.includeTax}
              onChange={(e) => handleFieldChange('includeTax', e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-zinc-300 dark:border-zinc-600 cursor-pointer"
            />
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Harga sudah termasuk PPN (Include Tax)
            </span>
          </label>

          {payment.includeTax && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-500">Tarif:</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={payment.taxPercent}
                onChange={(e) =>
                  handleFieldChange('taxPercent', parseFloat(e.target.value) || 0)
                }
                className="w-16 px-2 py-1 text-xs text-center font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">%</span>
            </div>
          )}
        </div>
        {payment.includeTax && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Rumus: DPP = Total / (1 + PPN%), PPN = Total - DPP (dibulatkan ke rupiah terdekat).
          </p>
        )}
      </div>

      {/* Metode Pembayaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {paymentMethods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleFieldChange('method', m)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer text-center ${
                  payment.method === m
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Jika Tunai: Input Uang Diterima & Kembalian */}
        {payment.method === 'Tunai' ? (
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Uang Diterima (Tunai)
            </label>
            <input
              type="number"
              step="1000"
              min="0"
              value={payment.cashReceived === 0 ? '' : payment.cashReceived}
              onChange={(e) =>
                handleFieldChange('cashReceived', parseFloat(e.target.value) || 0)
              }
              placeholder="Jumlah uang tunai"
              className="w-full px-3 py-1.5 text-sm font-mono font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => handleFieldChange('cashReceived', calculations.grandTotal)}
                className="px-2 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Uang Pas
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('cashReceived', 50000)}
                className="px-2 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                50.000
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('cashReceived', 100000)}
                className="px-2 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                100.000
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('cashReceived', 200000)}
                className="px-2 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                200.000
              </button>
            </div>

            {/* Kembalian */}
            <div className="mt-2 text-xs flex justify-between items-center py-1 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-mono">
              <span className="text-zinc-600 dark:text-zinc-400">Kembalian:</span>
              <span
                className={`font-bold ${
                  calculations.isUnderpaid
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {calculations.isUnderpaid
                  ? `Kurang ${formatRupiah(calculations.grandTotal - payment.cashReceived)}`
                  : formatRupiah(calculations.change)}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Informasi Pembayaran Non-Tunai
            </label>
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400">
              Transaksi tercatat sebagai pembayaran <strong className="text-zinc-900 dark:text-zinc-100">{payment.method}</strong> lunas sebesar <strong className="text-zinc-900 dark:text-zinc-100">{formatRupiah(calculations.grandTotal)}</strong>.
            </div>
          </div>
        )}
      </div>

      {/* Voucher & Footer Struk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Input Voucher
          </label>
          <input
            type="text"
            value={payment.voucher}
            onChange={(e) => handleFieldChange('voucher', e.target.value)}
            placeholder="No Voucher"
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Teks Footer Struk
          </label>
          <textarea
            rows={2}
            value={payment.footerText}
            onChange={(e) => handleFieldChange('footerText', e.target.value)}
            placeholder="Terima kasih atas kunjungan Anda"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>
      </div>

      {/* QR Code & Ukuran Kertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        {/* Opsi QR Code */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={payment.showQrCode}
              onChange={(e) => handleFieldChange('showQrCode', e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-zinc-300 dark:border-zinc-600 cursor-pointer"
            />
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Tampilkan QR Code di Bagian Bawah Struk
            </span>
          </label>

          {payment.showQrCode && (
            <div>
              <label className="block text-[11px] text-zinc-500 mb-1">
                Isi Data QR Code (default: No Struk / URL)
              </label>
              <input
                type="text"
                value={payment.qrCodeText}
                onChange={(e) => handleFieldChange('qrCodeText', e.target.value)}
                placeholder="Contoh: SL20261025-00211"
                className="w-full px-2.5 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
          )}
        </div>

        {/* Ukuran Kertas Printer Struk */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Ukuran Lebar Kertas Printer Thermal
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangePaperWidth('58mm')}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex flex-col items-center justify-center ${
                paperWidth === '58mm'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
              }`}
            >
              <span>58 mm (Standar)</span>
              <span className="text-[10px] font-normal opacity-80">Lebar cetak ~48mm</span>
            </button>

            <button
              type="button"
              onClick={() => onChangePaperWidth('80mm')}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex flex-col items-center justify-center ${
                paperWidth === '80mm'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
              }`}
            >
              <span>80 mm (Lebar)</span>
              <span className="text-[10px] font-normal opacity-80">Lebar cetak ~72mm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
