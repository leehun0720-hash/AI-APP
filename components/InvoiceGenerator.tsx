import React, { useState } from 'react';
import { InvoiceData, Language } from '../types';
import { generateInvoiceEmail } from '../services/geminiService';
import { Loader2, Send, Copy, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InvoiceGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<InvoiceData>({
    clientName: '',
    itemDescription: '',
    amount: 0,
    currency: 'USD',
    dueDate: new Date().toISOString().split('T')[0],
    language: Language.ENGLISH
  });
  
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.clientName || !formData.itemDescription || !formData.amount) {
      alert(t('alertFill'));
      return;
    }

    setLoading(true);
    setGeneratedEmail('');
    try {
      const email = await generateInvoiceEmail(formData);
      setGeneratedEmail(email);
    } catch (error) {
      alert(t('alertFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
             <Send size={20} />
          </span>
          {t('invoiceDetails')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('clientName')}</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder={t('placeholderClient')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')}</label>
            <input
              type="text"
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleInputChange}
              placeholder={t('placeholderDesc')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('amount')}</label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('currency')}</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="KRW">KRW (₩)</option>
                <option value="EUR">EUR (€)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('dueDate')}</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('targetLanguage')}</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {Object.values(Language).map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {t('generating')}
              </>
            ) : (
              <>
                {t('generateButton')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">{t('emailPreview')}</h2>
          {generatedEmail && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? t('copied') : t('copyText')}
            </button>
          )}
        </div>
        
        <div className="flex-grow bg-slate-50 rounded-lg p-6 border border-slate-200 overflow-auto">
            {generatedEmail ? (
                <div className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">
                    {generatedEmail}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <Send size={24} className="opacity-20" />
                    </div>
                    <p>{t('fillForm')}</p>
                    <p className="text-xs mt-2">{t('aiWillWrite')}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;