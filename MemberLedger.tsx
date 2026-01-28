
import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Calendar, 
  User, 
  BookOpen, 
  ChevronLeft,
  FileDown,
  History
} from 'lucide-react';
import { db } from '../db';
import { Transaction } from '../types';

interface MemberLedgerProps {
  onBack: () => void;
}

const MemberLedger: React.FC<MemberLedgerProps> = ({ onBack }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const members = db.getMembers();
  const allTransactions = db.getTransactions();

  const selectedMember = members.find(m => m.id === selectedMemberId);

  const { openingSavings, openingLoan, currentYearEntries } = useMemo(() => {
    if (!selectedMemberId) return { openingSavings: 0, openingLoan: 0, currentYearEntries: [] };
    
    const targetYear = selectedYear;
    const memberTxs = allTransactions.filter(t => t.memberId === selectedMemberId);
    
    let preSavings = 0;
    let preLoan = 0;
    
    memberTxs.forEach(t => {
      const entryYear = t.date.split('-')[0];
      if (entryYear < targetYear) {
        if (t.type === 'savings') preSavings += t.amount;
        if (t.type === 'savings_withdrawal') preSavings -= t.amount;
        if (t.type === 'loan_distribution') preLoan += t.amount;
        if (t.type === 'loan_collection') preLoan -= t.amount;
      }
    });

    const entries = memberTxs.filter(t => t.date.split('-')[0] === targetYear);
    let runningSavings = preSavings;
    let runningLoan = preLoan;

    const processed = entries.map(t => {
      if (t.type === 'savings') runningSavings += t.amount;
      if (t.type === 'savings_withdrawal') runningSavings -= t.amount;
      if (t.type === 'loan_distribution') runningLoan += t.amount;
      if (t.type === 'loan_collection') runningLoan -= t.amount;
      
      return {
        date: t.date,
        type: t.type,
        amount: t.amount,
        savingsBalance: runningSavings,
        loanBalance: runningLoan,
        remarks: t.remarks || ''
      };
    });

    return { openingSavings: preSavings, openingLoan: preLoan, currentYearEntries: processed };
  }, [selectedMemberId, selectedYear, allTransactions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-indigo-600" /> সদস্য লেজার শীট
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">সদস্য নির্বাচন করুন</label>
            <select 
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
            >
              <option value="">নির্বাচন করুন</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.id} - {m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">বছর নির্বাচন করুন</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500 outline-none font-bold"
            >
              {["2024", "2025", "2026"].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-bold">
              <Printer size={18} /> প্রিন্ট
            </button>
          </div>
        </div>
      </div>

      {selectedMember && (
        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900">চলো পাল্টায় যুব কল্যাণ সমিতি</h1>
            <p className="text-sm text-slate-600 font-bold underline">সদস্য লেজার শীট – {selectedYear}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 border-y border-slate-200 py-6 px-6">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">সদস্যের নাম:</p>
              <p className="font-black text-slate-800">{selectedMember.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">সদস্য নং:</p>
              <p className="font-black text-indigo-600">#{selectedMember.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">সঞ্চয় স্থিতি:</p>
              <p className="font-black text-emerald-600">৳ {selectedMember.totalSavings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">ঋণ স্থিতি:</p>
              <p className="font-black text-rose-600">৳ {selectedMember.totalLoan.toLocaleString()}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse border border-slate-300">
              <thead className="bg-slate-50 font-black">
                <tr>
                  <th className="border p-2">তারিখ</th>
                  <th className="border p-2">ধরণ</th>
                  <th className="border p-2">পরিমাণ</th>
                  <th className="border p-2">সঞ্চয় স্থিতি</th>
                  <th className="border p-2">ঋণ স্থিতি</th>
                  <th className="border p-2">মন্তব্য</th>
                </tr>
              </thead>
              <tbody className="text-center font-bold">
                <tr>
                  <td className="border p-2 italic">01-01-{selectedYear}</td>
                  <td colSpan={2} className="border p-2 text-right">বিগত বছরের জের (B/F):</td>
                  <td className="border p-2">৳ {openingSavings.toLocaleString()}</td>
                  <td className="border p-2">৳ {openingLoan.toLocaleString()}</td>
                  <td className="border p-2">-</td>
                </tr>
                {currentYearEntries.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{row.date}</td>
                    <td className="border p-2 capitalize">{row.type.replace('_', ' ')}</td>
                    <td className="border p-2">৳ {row.amount.toLocaleString()}</td>
                    <td className="border p-2">৳ {row.savingsBalance.toLocaleString()}</td>
                    <td className="border p-2">৳ {row.loanBalance.toLocaleString()}</td>
                    <td className="border p-2 text-left">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberLedger;
