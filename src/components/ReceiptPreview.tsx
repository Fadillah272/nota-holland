'use client';

import React from 'react';
import { ReceiptData } from '@/types/receipt';
import { CalculationResult } from '@/utils/calculations';
import { formatRupiah, formatReceiptDate } from '@/utils/formatters';
import { QRCodeView } from './QRCodeView';
import { WindmillLogo, PrinterIcon } from './Icons';

interface ReceiptPreviewProps {
  data: ReceiptData;
  calculations: CalculationResult;
  onPrint: () => void;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  data,
  calculations,
  onPrint,
}) => {
  const { header, items, payment, paperWidth } = data;
  const is58mm = paperWidth === '58mm';

  // Filter items: only display those that have a non-empty name
  const validItems = items.filter((item) => item.name && item.name.trim() !== '');

  // Formatted date
  const displayDate = formatReceiptDate(header.dateTime);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Tombol Cetak di Atas Preview (khusus layar) */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 no-print">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Mode Kertas: <strong className="text-zinc-800 dark:text-zinc-200">{paperWidth}</strong>
        </div>
        <button
          type="button"
          onClick={onPrint}
          id="btn-print-receipt"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <PrinterIcon size={18} />
          <span>Cetak Struk Sekarang</span>
        </button>
      </div>

      {/* Dynamic @page CSS rule for thermal paper */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: auto;
              margin: 0mm;
            }
          `,
        }}
      />

      {/* Kontainer Kertas Struk */}
      <div
        id="thermal-receipt"
        className={`bg-white text-black p-4 sm:p-5 transition-all duration-300 font-mono select-text ${
          is58mm ? 'paper-58mm' : 'paper-80mm'
        } ${
          is58mm
            ? 'w-full max-w-[320px] text-[11px] leading-[1.3]'
            : 'w-full max-w-[420px] text-[12px] leading-[1.35]'
        }`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* 1. LOGO */}
        {header.showLogo && (
          <div className="flex justify-center mb-2 receipt-logo">
            {header.logoType === 'custom' && header.customLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={header.customLogoUrl}
                alt="Logo Toko"
                className="max-h-16 max-w-[140px] object-contain filter grayscale contrast-200"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center text-black">
                <WindmillLogo size={58} />
              </div>
            )}
          </div>
        )}

        {/* 2. IDENTITAS TOKO */}
        <div className="text-center mb-1">
          <h1 className="font-bold text-[13px] sm:text-[14px] uppercase tracking-wide">
            {header.storeName || 'NAMA TOKO'}
          </h1>
          {header.address && (
            <p className="whitespace-pre-line text-[10px] sm:text-[11px] mt-0.5 opacity-90">
              {header.address}
            </p>
          )}
          {header.phone && (
            <p className="text-[10px] sm:text-[11px] mt-0.5 opacity-90">
              {header.phone}
            </p>
          )}
        </div>

        {/* 3. GARIS PEMISAH */}
        <div className="receipt-dash-line my-1.5 border-b border-dashed border-black/70 w-full" />

        {/* 4. INFO KASIR & STRUK */}
        <div className="text-[10.5px] sm:text-[11px] space-y-0.5">
          <div className="flex">
            <span className="w-20 inline-block">Cashier</span>
            <span>: {header.cashier || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-20 inline-block">Machine</span>
            <span>: {header.machine || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-20 inline-block">Receipt</span>
            <span className="font-bold">: {header.receiptNo || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-20 inline-block">Date</span>
            <span>: {displayDate || '-'}</span>
          </div>
        </div>

        {/* 5. GARIS PEMISAH */}
        <div className="receipt-dash-line my-1.5 border-b border-dashed border-black/70 w-full" />

        {/* 6. DAFTAR BARANG (2 BARIS PER BARIS BARANG) */}
        <div className="space-y-1.5 my-1">
          {validItems.length === 0 ? (
            <div className="text-center py-2 text-zinc-400 italic text-[11px]">
              (Belum ada barang diinput)
            </div>
          ) : (
            validItems.map((item) => {
              const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);
              const displayName = item.code ? `${item.code}-${item.name}` : item.name;

              return (
                <div key={item.id} className="item-row text-[11px]">
                  {/* Baris 1: Kode-Nama Barang */}
                  <div className="font-semibold break-words leading-tight">
                    {displayName}
                  </div>
                  {/* Baris 2: Harga Satuan, Qty, Total */}
                  <div className="flex justify-between items-center text-[10.5px] pl-1 pt-0.5">
                    <span className="w-24 text-left">{formatRupiah(item.price)}</span>
                    <span className="text-center flex-1 font-semibold">x{item.qty}</span>
                    <span className="w-24 text-right font-medium">{formatRupiah(itemTotal)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 7. GARIS PEMISAH */}
        <div className="receipt-dash-line my-1.5 border-b border-dashed border-black/70 w-full" />

        {/* 8. TOTAL ITEM */}
        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="pl-6 font-medium">Total Item</span>
          <span className="font-bold">{calculations.totalItems}</span>
        </div>

        {/* 9. DPP & PPN (JIKA DIAKTIFKAN) */}
        {payment.includeTax && (
          <div className="space-y-0.5 text-[11px] pt-0.5">
            <div className="flex justify-between items-center">
              <span>DPP</span>
              <span>{formatRupiah(calculations.dpp)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>PPN {payment.taxPercent}%</span>
              <span>{formatRupiah(calculations.ppn)}</span>
            </div>
          </div>
        )}

        {/* 10. GRAND TOTAL */}
        <div className="flex justify-between items-baseline pt-1.5 pb-1 border-t border-dashed border-black/40 mt-1">
          <span className="font-bold text-[13px] sm:text-[14px]">Total.</span>
          <span className="font-bold text-[14px] sm:text-[15px]">
            {formatRupiah(calculations.grandTotal)}
          </span>
        </div>

        {/* 11. PAYMENT INFO */}
        <div className="pt-1 text-[11px]">
          <div className="text-center mb-0.5 font-medium">Payment :</div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{payment.method}</span>
            <span>{formatRupiah(calculations.grandTotal)}</span>
          </div>

          {/* Jika Tunai, tampilkan Uang Diterima & Kembalian */}
          {payment.method === 'Tunai' && (
            <div className="space-y-0.5 pt-0.5 text-[10.5px]">
              <div className="flex justify-between items-center">
                <span>Bayar</span>
                <span>{formatRupiah(payment.cashReceived)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kembali</span>
                <span className="font-semibold">{formatRupiah(calculations.change)}</span>
              </div>
            </div>
          )}

          {/* 12. VOUCHER */}
          <div className="flex justify-between items-center pt-0.5 text-[10.5px]">
            <span>{payment.voucher || 'No Voucher'}</span>
            <span>00</span>
          </div>
        </div>

        {/* 13. QR CODE */}
        {payment.showQrCode && (
          <div className="flex flex-col items-center justify-center my-2.5 pt-1">
            <QRCodeView
              value={payment.qrCodeText || header.receiptNo || 'RECEIPT'}
              size={is58mm ? 90 : 110}
            />
          </div>
        )}

        {/* 14. FOOTER TEXT */}
        {payment.footerText && (
          <div className="text-center text-[10px] mt-2 whitespace-pre-line leading-snug">
            {payment.footerText}
          </div>
        )}
      </div>

      {/* Petunjuk Cetak Thermal */}
      <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 max-w-[420px] w-full no-print shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 mb-2">
          <span>⚠️ Setelan Dialog Cetak Agar Tidak Mengecil / Tulisan Ant:</span>
        </div>
        <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
          <li>
            <strong>Ukuran Kertas (Paper size)</strong>: Klik <em>Setelan lainnya (More settings)</em>, ubah dari <strong>A4</strong> ke ukuran <strong>58mm</strong> (atau <em>58 x 210 mm / Roll Paper 58mm</em>). <span className="text-red-600 dark:text-red-400 font-semibold">(PENTING: Jangan biarkan A4!)</span>
          </li>
          <li>
            <strong>Skala (Scale)</strong>: Pilih <strong>Default</strong> atau <strong>100%</strong> (jangan pilih &quot;Sesuaikan dengan area cetak&quot;).
          </li>
          <li>
            <strong>Margin</strong>: Pilih <strong>None / Tidak Ada</strong> (jangan default).
          </li>
          <li>
            <strong>Header & Footer</strong>: <strong>Hilangkan centang</strong> agar tanggal &amp; link URL browser tidak ikut tercetak.
          </li>
        </ol>
      </div>
    </div>
  );
};
