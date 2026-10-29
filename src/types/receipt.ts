export interface ReceiptItem {
  id: string;
  code: string;
  name: string;
  price: number;
  qty: number;
}

export interface ReceiptHeader {
  storeName: string;
  address: string;
  phone: string;
  cashier: string;
  machine: string;
  receiptNo: string;
  dateTime: string;
  showLogo: boolean;
  logoType: 'default' | 'custom';
  customLogoUrl: string | null;
}

export type PaymentMethod = 'Tunai' | 'QRIS' | 'Debit' | 'Kredit' | 'Transfer';

export interface ReceiptPayment {
  method: PaymentMethod;
  includeTax: boolean;
  taxPercent: number;
  cashReceived: number;
  voucher: string;
  footerText: string;
  showQrCode: boolean;
  qrCodeText: string;
}

export type PaperWidth = '58mm' | '80mm';

export interface ReceiptData {
  header: ReceiptHeader;
  items: ReceiptItem[];
  payment: ReceiptPayment;
  paperWidth: PaperWidth;
}
