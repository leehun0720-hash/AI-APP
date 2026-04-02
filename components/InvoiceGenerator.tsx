import React, { useState } from 'react';
import { InvoiceData, InvoiceItem, Language } from '../types';
import { generateInvoiceEmail } from '../services/geminiService';
import { Loader2, Send, Copy, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InvoiceGenerator: React.FC = () => {
  const { t } = useLanguage();
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const [formData, setFormData] = useState<InvoiceData>({
    clientName: '',
    items: [{
      id: generateId(),
      name: '',
      spec: '',
      quantity: 1,
      unitPrice: 0,
      remarks: ''
    }],
    currency: 'USD',
    dueDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    language: Language.ENGLISH
  });
  
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const newItem = { ...item, [field]: value };
          // Ensure number fields are numbers
          if (field === 'quantity' || field === 'unitPrice') {
             newItem[field] = parseFloat(value as string) || 0;
          }
          return newItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: generateId(),
        name: '',
        spec: '',
        quantity: 1,
        unitPrice: 0,
        remarks: ''
      }]
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleGenerate = async () => {
    if (!formData.clientName || formData.items.some(i => !i.name)) {
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
             <Send size={20} />
          </span>
          {t('invoiceDetails')}
        </h2>
        
        <div className="space-y-6 flex-grow">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('deliveryDate')}</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
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
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-semibold text-slate-800">{t('itemsTitle')}</h3>
               <button onClick={addItem} className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-700">
                  <Plus size={16} className="mr-1" /> {t('addItem')}
               </button>
            </div>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                  <div className="grid grid-cols-12 gap-3">
                    {/* Row 1: Name and Spec */}
                    <div className="col-span-7">
                        <label className="text-xs text-slate-500 block mb-1">{t('productName')}</label>
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                            placeholder={t('productName')}
                        />
                    </div>
                    <div className="col-span-5">
                        <label className="text-xs text-slate-500 block mb-1">{t('spec')}</label>
                        <input
                            type="text"
                            value={item.spec}
                            onChange={(e) => handleItemChange(item.id, 'spec', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* Row 2: Qty, Unit Price, Total */}
                    <div className="col-span-3">
                        <label className="text-xs text-slate-500 block mb-1">{t('quantity')}</label>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="col-span-4">
                        <label className="text-xs text-slate-500 block mb-1">{t('unitPrice')}</label>
                        <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                        />
                    </div>
                     <div className="col-span-5">
                        <label className="text-xs text-slate-500 block mb-1">{t('total')}</label>
                        <div className="w-full px-2 py-1.5 text-sm bg-slate-100 text-slate-600 rounded border border-transparent font-medium text-right">
                           {(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                    </div>

                    {/* Row 3: Remarks */}
                    <div className="col-span-12">
                        <label className="text-xs text-slate-500 block mb-1">{t('remarks')}</label>
                        <input
                            type="text"
                            value={item.remarks}
                            onChange={(e) => handleItemChange(item.id, 'remarks', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                            placeholder={t('remarks')}
                        />
                    </div>
                  </div>
                  
                  {formData.items.length > 1 && (
                     <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 bg-white text-rose-500 p-1 rounded-full shadow-sm border border-slate-200 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                     >
                        <Trash2 size={14} />
                     </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end items-center text-slate-800 font-bold">
               <span className="mr-2 text-sm font-normal text-slate-500">{t('totalAmount')}:</span>
               <span className="text-xl">{formData.currency} {calculateTotal().toLocaleString()}</span>
            </div>
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

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
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
