import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UILanguage = 'en' | 'ko';

type Dictionary = {
  [key: string]: {
    en: string;
    ko: string;
  };
};

export const dictionary: Dictionary = {
  appTitle: { en: "AI Smart Invoice", ko: "AI 스마트 인보이스" },
  totalOutstanding: { en: "Total Outstanding", ko: "미수금 총액" },
  paidThisMonth: { en: "Paid this month", ko: "이번 달 입금액" },
  aiTip: { en: "AI Tip:", ko: "AI 팁:" },
  aiTipContent: { 
    en: "Sending invoices on Tuesday mornings results in 20% faster payments.", 
    ko: "화요일 오전에 인보이스를 발송하면 입금 처리가 20% 빨라집니다." 
  },
  newInvoiceGenerator: { en: "New Invoice Generator", ko: "새 인보이스 생성" },
  invoiceDetails: { en: "Invoice Details", ko: "인보이스 상세 정보" },
  clientName: { en: "Client Name", ko: "고객사명" },
  description: { en: "Description of Service", ko: "청구 내역" },
  amount: { en: "Amount", ko: "금액" },
  currency: { en: "Currency", ko: "통화" },
  dueDate: { en: "Due Date", ko: "납기일" },
  targetLanguage: { en: "Email Language", ko: "이메일 언어" },
  generateButton: { en: "Generate Invoice Email", ko: "인보이스 이메일 생성" },
  generating: { en: "Generating with Gemini...", ko: "Gemini가 생성 중..." },
  emailPreview: { en: "Email Preview", ko: "이메일 미리보기" },
  copyText: { en: "Copy Text", ko: "복사" },
  copied: { en: "Copied!", ko: "완료!" },
  monthlyRevenue: { en: "Monthly Revenue Overview", ko: "월간 매출 현황" },
  fillForm: { en: "Fill out the form and click generate", ko: "정보를 입력하고 생성 버튼을 누르세요" },
  aiWillWrite: { en: "AI will write the email for you", ko: "AI가 이메일을 작성해 드립니다" },
  placeholderClient: { en: "e.g. Acme Corp", ko: "예: (주)한국기업" },
  placeholderDesc: { en: "e.g. Q1 Web Development", ko: "예: 1분기 웹 개발비" },
  alertFill: { en: "Please fill in all required fields.", ko: "모든 필수 항목을 입력해 주세요." },
  alertFail: { en: "Failed to generate email. Please check your connection.", ko: "이메일 생성에 실패했습니다. 연결을 확인해 주세요." },
  footer: { en: "AI Smart Invoice. Powered by Google Gemini.", ko: "AI 스마트 인보이스. Google Gemini 기반 서비스." }
};

interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<UILanguage>('en');

  const t = (key: string) => {
    return dictionary[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
