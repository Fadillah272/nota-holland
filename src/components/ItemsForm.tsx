'use client';

import React from 'react';
import { ReceiptItem } from '@/types/receipt';
import { formatRupiah } from '@/utils/formatters';
import { PlusIcon, TrashIcon } from './Icons';

interface ItemsFormProps {
  items: ReceiptItem[];
  onChange: (updater: (prev: ReceiptItem[]) => ReceiptItem[]) => void;
}

export const ItemsForm: React.FC<ItemsFormProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: '',
      name: '',
      price: 0,
      qty: 1,
    };
    onChange((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onChange((prev) => {
      if (prev.length <= 1) {
        // Jika hanya 1, kosongkan daripada menghapus baris
        return [
          {
            id: `item-${Date.now()}`,
            code: '',
            name: '',
            price: 0,
            qty: 1,
          },
        ];
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleUpdateItem = (
    id: string,
    field: keyof ReceiptItem,
    value: string | number
  ) => {
    onChange((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === 'price') {
          const num = typeof value === 'number' ? value : parseFloat(value) || 0;
          return { ...item, price: Math.max(0, num) };
        }
        if (field === 'qty') {
          const num = typeof value === 'number' ? value : parseInt(value, 10) || 1;
          return { ...item, qty: Math.max(1, num) };
        }
        return { ...item, [field]: value };
      })
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            2. Daftar Barang / Menu
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tambahkan produk atau item belanja. Baris dengan nama kosong akan diabaikan pada struk.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <PlusIcon size={15} />
          <span>Tambah Barang</span>
        </button>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[540px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-2 px-2 w-20">Kode</th>
              <th className="py-2 px-2">Nama Barang</th>
              <th className="py-2 px-2 w-28 text-right">Harga (Rp)</th>
              <th className="py-2 px-2 w-18 text-center">Qty</th>
              <th className="py-2 px-2 w-28 text-right">Total</th>
              <th className="py-2 px-2 w-10 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {items.map((item, index) => {
              const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);

              return (
                <tr key={item.id} className="group hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40">
                  {/* Kode Barang */}
                  <td className="py-2 px-2 align-middle">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleUpdateItem(item.id, 'code', e.target.value)}
                      placeholder="Contoh: 2004"
                      className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </td>

                  {/* Nama Barang */}
                  <td className="py-2 px-2 align-middle">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      placeholder={`Nama barang ${index + 1}`}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </td>

                  {/* Harga Satuan */}
                  <td className="py-2 px-2 align-middle">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.price === 0 ? '0' : item.price}
                      onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-right font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </td>

                  {/* Qty */}
                  <td className="py-2 px-2 align-middle">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-center font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </td>

                  {/* Total Baris */}
                  <td className="py-2 px-2 align-middle text-right">
                    <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                      {formatRupiah(itemTotal)}
                    </span>
                  </td>

                  {/* Tombol Hapus */}
                  <td className="py-2 px-2 align-middle text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Hapus baris"
                      className="p-1 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <span>Tips: Harga Rp 0 diperbolehkan (seperti kantong kresek / paperbag promo).</span>
        <button
          type="button"
          onClick={handleAddItem}
          className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
        >
          <PlusIcon size={13} />
          <span>Tambah Baris Baru</span>
        </button>
      </div>
    </div>
  );
};
