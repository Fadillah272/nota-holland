const INDO_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Format angka menjadi Rupiah dengan titik pemisah ribuan
 * Contoh: 12100 -> "Rp 12.100"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

/**
 * Format angka biasa dengan titik pemisah ribuan
 * Contoh: 12100 -> "12.100"
 */
export function formatNumber(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  return Math.round(amount).toLocaleString('id-ID');
}

/**
 * Format tanggal ke gaya struk thermal: "25 Okt 26 16:51:02"
 */
export function formatReceiptDate(dateTimeStr: string): string {
  if (!dateTimeStr) return '';

  const d = new Date(dateTimeStr);
  if (isNaN(d.getTime())) {
    return dateTimeStr; // fallback jika parsing gagal
  }

  const day = d.getDate().toString().padStart(2, '0');
  const month = INDO_MONTHS[d.getMonth()];
  const year2 = d.getFullYear().toString().slice(-2);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${day} ${month} ${year2} ${hours}:${minutes}:${seconds}`;
}

/**
 * Mengambil waktu saat ini dalam format input datetime-local (YYYY-MM-DDTHH:mm:ss)
 */
export function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
