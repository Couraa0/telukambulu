// Helper to format Date into Indonesian style
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
};

// Helper to truncate text with ellipsis
export const truncateText = (text?: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate whatsapp link
export const formatWhatsAppLink = (phone?: string, text: string = ''): string => {
  if (!phone) return '#';
  // Remove spaces, dashes, and make sure it starts with country code
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

// Export to CSV helper
export const exportToCSV = (headers: string[], rows: (string | number)[][], fileName: string = 'export-data.csv'): void => {
  const content = [
    headers.join(','),
    ...rows.map(row => row.map(val => {
      // Escape double quotes and commas
      let strVal = String(val === null || val === undefined ? '' : val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        strVal = `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(','))
  ].join('\n');

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
