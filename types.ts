export enum Language {
  ENGLISH = 'English',
  KOREAN = 'Korean',
  JAPANESE = 'Japanese',
  SPANISH = 'Spanish',
  FRENCH = 'French'
}

export interface InvoiceData {
  clientName: string;
  itemDescription: string;
  amount: number;
  currency: string;
  dueDate: string;
  language: Language;
}

export interface RevenueStat {
  month: string;
  revenue: number;
}
