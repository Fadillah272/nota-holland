'use client';

import React, { useState, useMemo } from 'react';
import { ReceiptData, ReceiptHeader, ReceiptItem, ReceiptPayment, PaperWidth } from '@/types/receipt';
import { DEFAULT_RECEIPT_DATA, EMPTY_RECEIPT_DATA } from '@/utils/defaultData';
import { calculateReceiptTotals } from '@/utils/calculations';
import { Navbar } from '@/components/Navbar';
import { HeaderForm } from '@/components/HeaderForm';
import { ItemsForm } from '@/components/ItemsForm';
import { PaymentForm } from '@/components/PaymentForm';
import { ReceiptPreview } from '@/components/ReceiptPreview';
import { ResetModal } from '@/components/ResetModal';

export default function HomePage() {
  const [receiptData, setReceiptData] = useState<ReceiptData>(DEFAULT_RECEIPT_DATA);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Perhitungan dinamis real-time
  const calculations = useMemo(() => {
    return calculateReceiptTotals(receiptData.items, receiptData.payment);
  }, [receiptData.items, receiptData.payment]);

  // Handler update bagian Header
  const handleUpdateHeader = (updater: (prev: ReceiptHeader) => ReceiptHeader) => {
    setReceiptData((prev) => ({
      ...prev,
      header: updater(prev.header),
    }));
  };

  // Handler update daftar Barang
  const handleUpdateItems = (updater: (prev: ReceiptItem[]) => ReceiptItem[]) => {
    setReceiptData((prev) => ({
      ...prev,
      items: updater(prev.items),
    }));
  };

  // Handler update Pembayaran & Pajak
  const handleUpdatePayment = (updater: (prev: ReceiptPayment) => ReceiptPayment) => {
    setReceiptData((prev) => ({
      ...prev,
      payment: updater(prev.payment),
    }));
  };

  // Handler ubah ukuran kertas
  const handleChangePaperWidth = (paperWidth: PaperWidth) => {
    setReceiptData((prev) => ({
      ...prev,
      paperWidth,
    }));
  };

  // Reset ke data default demo (Holland Bakery)
  const handleResetToDefault = () => {
    setReceiptData({
      ...DEFAULT_RECEIPT_DATA,
      header: {
        ...DEFAULT_RECEIPT_DATA.header,
        dateTime: new Date().toISOString().slice(0, 19),
      },
    });
  };

  // Kosongkan seluruh form
  const handleClearAll = () => {
    setReceiptData({
      ...EMPTY_RECEIPT_DATA,
      header: {
        ...EMPTY_RECEIPT_DATA.header,
        dateTime: new Date().toISOString().slice(0, 19),
      },
    });
  };

  // Cetak struk via browser print dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Top Navbar */}
      <Navbar
        paperWidth={receiptData.paperWidth}
        onChangePaperWidth={handleChangePaperWidth}
        onOpenReset={() => setIsResetModalOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main 2-Column Responsive Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Form Input Data (Lebar 7 dari 12 kolom pada desktop) */}
          <div className="lg:col-span-7 space-y-6 no-print">
            <HeaderForm
              header={receiptData.header}
              onChange={handleUpdateHeader}
            />

            <ItemsForm
              items={receiptData.items}
              onChange={handleUpdateItems}
            />

            <PaymentForm
              payment={receiptData.payment}
              paperWidth={receiptData.paperWidth}
              calculations={calculations}
              onChangePayment={handleUpdatePayment}
              onChangePaperWidth={handleChangePaperWidth}
            />
          </div>

          {/* Kolom Kanan: Preview Struk Live & Tombol Cetak (Lebar 5 dari 12 kolom pada desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-xs shadow-xs flex flex-col items-center">
              <div className="w-full text-center pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 no-print">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Pratinjau Struk Kasir
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Perubahan formulir ter-update otomatis secara real-time
                </p>
              </div>

              {/* Komponen Preview Struk */}
              <ReceiptPreview
                data={receiptData}
                calculations={calculations}
                onPrint={handlePrint}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Website (Hanya Tampil di Layar) */}
      <footer className="no-print mt-auto py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          Receipt Generator &bull; Dirancang khusus untuk printer struk thermal 58mm &amp; 80mm
        </p>
      </footer>

      {/* Modal Dialog Konfirmasi Reset */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onResetDefault={handleResetToDefault}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
