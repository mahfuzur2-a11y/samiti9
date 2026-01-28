
import React from 'react';
import { Coins, Download, Printer, TrendingUp, UserPlus, AlertCircle, FileText, Percent, PieChart } from 'lucide-react';

interface ProfitViewProps {
  onBack: () => void;
  onDistribute: () => void;
}

const ProfitView: React.FC<ProfitViewProps> = ({ onBack, onDistribute }) => {
  const totalLoanCollection = 203500;
  const loanCollectionProfit = Math.round(totalLoanCollection / 11);

  const profitData = {
    admissionFees: 12500,
    savingsFines: 3200,
    loanFines: 4500,
    loanFormFees: 2100,
    loanCollectionProfit: loanCollectionProfit,
    totalProfit: 12500 + 3200 + 4500 + 2100 + loanCollectionProfit
  };

  const categories = [
    { label: 'ভর্তি ফি', amount: profitData.admissionFees, icon: <UserPlus className="text-blue-600" />, color: 'bg-blue-50', description: 'নতুন সদস্য নিবন্ধন থেকে প্রাপ্ত আয়' },
    { label: 'সঞ্চয় জরিমানা', amount: profitData.savingsFines, icon: <AlertCircle className="text-rose-600" />, color: 'bg-rose-50', description: 'বিলম্বিত সঞ্চয় জমা থেকে প্রাপ্ত জরিমানা' },
    { label: 'ঋণের জরিমানা', amount: profitData.loanFines, icon: <AlertCircle className="text-orange-600" />, color: 'bg-orange-50', description: 'ঋণের কিস্তি দেরিতে দেওয়ার জরিমানা' },
    { label: 'লোন ফরম ফি', amount: profitData.loanFormFees, icon: <FileText className="text-amber-600" />, color: 'bg-amber-50', description: 'ঋণ আবেদনের ফরম বিক্রি থেকে প্রাপ্ত আয়' },
    { label: 'ঋণ আদায়ের মুনাফা (১০%)', amount: profitData.loanCollectionProfit, icon: <Percent className="text-emerald-600" />, color: 'bg-emerald-50', description: 'সংগৃহীত ১১টি কিস্তির প্রতিটিতে অন্তর্ভুক্ত মুনাফা অংশ' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Coins className="text-amber-500" /> মুনাফা ও আয় হিসাব
          </h2>
          <p className="text-slate-500">সমিতির বিভিন্ন খাত থেকে অর্জিত মোট মুনাফা</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onDistribute}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 shadow-lg font-bold transition-all active:scale-95"
          >
            <PieChart size={18} className="mr-2" /> মুনাফা বন্টন করুন
          </button>
          <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold">
            <Printer size={18} className="mr-2" /> প্রিন্ট
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-amber-100 font-medium mb-1">সর্বমোট অর্জিত মুনাফা</p>
          <h3 className="text-5xl font-black">৳ {profitData.totalProfit.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm">
            <TrendingUp size={18} />
            <span className="text-sm font-bold">গত মাসের চেয়ে ১২% বৃদ্ধি</span>
          </div>
        </div>
        <Coins size={180} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
            </div>
            <div>
              <h4 className="text-slate-500 font-medium text-sm mb-1">{cat.label}</h4>
              <p className="text-2xl font-bold text-slate-800">৳ {cat.amount.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-2 italic">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-5 bg-slate-50/50 border-b border-slate-50">
          <h3 className="font-bold text-slate-700">খাতওয়ারি বিস্তারিত হিসাব</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">আয়ের খাত</th>
              <th className="px-6 py-4 text-right">পরিমাণ (৳)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {categories.map((cat, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-700">{cat.label}</td>
                <td className="px-6 py-4 text-right font-black text-amber-600">৳ {cat.amount.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-amber-50/30">
              <td className="px-6 py-5 text-right font-black text-slate-800 text-lg">মোট মুনাফা:</td>
              <td className="px-6 py-5 text-right font-black text-amber-600 text-xl">৳ {profitData.totalProfit.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitView;
