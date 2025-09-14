import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ExportOptions {
  filename?: string;
  format?: 'csv' | 'xlsx' | 'json';
  columns?: string[];
}

/**
 * Export data to various formats (CSV, Excel, JSON)
 */
export function exportData(
  data: any[],
  options: ExportOptions = {}
) {
  const {
    filename = `export-${format(new Date(), 'yyyy-MM-dd')}`,
    format: exportFormat = 'xlsx',
    columns
  } = options;

  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Filter columns if specified
  const filteredData = columns
    ? data.map(row => {
        const filtered: any = {};
        columns.forEach(col => {
          filtered[col] = row[col];
        });
        return filtered;
      })
    : data;

  switch (exportFormat) {
    case 'csv':
      exportToCSV(filteredData, filename);
      break;
    case 'xlsx':
      exportToExcel(filteredData, filename);
      break;
    case 'json':
      exportToJSON(filteredData, filename);
      break;
    default:
      exportToExcel(filteredData, filename);
  }
}

/**
 * Export data to CSV
 */
function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export data to Excel
 */
function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Auto-size columns
  const maxWidth = 50;
  const cols = Object.keys(data[0]).map(key => {
    const maxLength = Math.max(
      key.length,
      ...data.map(row => String(row[key] ?? '').length)
    );
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  worksheet['!cols'] = cols;

  // Generate Excel file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export data to JSON
 */
function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, 'application/json');
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Format data for export (handle dates, booleans, etc.)
 */
export function formatDataForExport(data: any[]): any[] {
  return data.map(row => {
    const formatted: any = {};
    Object.keys(row).forEach(key => {
      const value = row[key];

      // Format dates
      if (value instanceof Date || (typeof value === 'string' && isValidDate(value))) {
        formatted[key] = format(new Date(value), 'dd.MM.yyyy HH:mm', { locale: de });
      }
      // Format booleans
      else if (typeof value === 'boolean') {
        formatted[key] = value ? 'Ja' : 'Nein';
      }
      // Handle null/undefined
      else if (value === null || value === undefined) {
        formatted[key] = '';
      }
      // Keep other values as is
      else {
        formatted[key] = value;
      }
    });
    return formatted;
  });
}

/**
 * Check if a string is a valid date
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes('-');
}