import { ReceiptItem, ReceiptPayment } from '@/types/receipt';

export interface CalculationResult {
  totalItems: number;
  grandTotal: number;
  dpp: number;
  ppn: number;
  change: number;
  isUnderpaid: boolean;
}

/**
 * Menghitung total item, grand total, DPP, PPN, dan kembalian
 */
export function calculateReceiptTotals(
  items: ReceiptItem[],
  payment: ReceiptPayment
): CalculationResult {
  // Hanya hitung baris yang memiliki nama barang
  const validItems = items.filter((item) => item.name && item.name.trim() !== '');

  const totalItems = validItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
  const grandTotal = validItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

  let dpp = grandTotal;
  let ppn = 0;

  if (payment.includeTax && payment.taxPercent > 0) {
    // DPP = Total / (1 + PPN/100) dibulatkan ke rupiah terdekat
    dpp = Math.round(grandTotal / (1 + payment.taxPercent / 100));
    ppn = grandTotal - dpp;
  }

  let change = 0;
  let isUnderpaid = false;

  if (payment.method === 'Tunai') {
    const received = Number(payment.cashReceived) || 0;
    if (received < grandTotal) {
      isUnderpaid = true;
      change = 0;
    } else {
      change = received - grandTotal;
    }
  }

  return {
    totalItems,
    grandTotal,
    dpp,
    ppn,
    change,
    isUnderpaid,
  };
}
