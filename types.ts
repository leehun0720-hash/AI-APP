export enum Language {
  ENGLISH = 'English',
  KOREAN = 'Korean',
  JAPANESE = 'Japanese',
  SPANISH = 'Spanish',
  FRENCH = 'French'
}

export interface InvoiceItem {
  id: string;
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  remarks: string;
}

export interface InvoiceData {
  clientName: string;
  items: InvoiceItem[];
  currency: string;
  dueDate: string;      // Payment Due Date
  deliveryDate: string; // Delivery Deadline
  language: Language;
}

export interface RevenueStat {
  month: string;
  revenue: number;
}
