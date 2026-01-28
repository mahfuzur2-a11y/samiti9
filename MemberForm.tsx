
import React, { useState } from 'react';
import { Member } from '../types';

interface MemberFormProps {
  onBack: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    fatherName: '',
    phone: '',
    nid: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0],
    initialSavings: '',
    admissionFee: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newMember: Member = {
      id: formData.id || (100 + db.getMembers().length + 1).toString(),
      name: formData.name,
      fatherName: formData.fatherName,
      phone: formData.phone,
      nid: formData.nid,
      address: formData.address,
      joinDate: formData.joinDate,
      totalSavings: parseFloat(formData.initialSavings) || 0,
      totalLoan: 0
    };

    setTimeout(() => {
      db.addMember(newMember);
      
      // If there's an initial savings, record it as a transaction
      if (parseFloat(formData.initialSavings) > 0) {
        db.addTransaction({
          id: `INIT-${Date.now()}`,
          memberId: newMember.id,
          memberName: newMember.name,
          date: formData.joinDate,
          amount: parseFloat(formData.initialSavings),
          type: 'savings',
          remarks: 'প্রাথমিক সঞ্চয়'
        });
      }

      setLoading(false);
      setSuccess(true);
      setFormData({
        id: '',
        name: '',
        fatherName: '',
        phone: '',
        nid: '',
        address: '',
        joinDate: new Date().toISOString().split('T')[0],
        initialSavings: '',
        admissionFee: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">নতুন সদস্য নিবন্ধন</h2>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center">
          <span className="font-medium">সদস্য সফলভাবে নিবন্ধিত হয়েছে! (ভর্তি ফি আয়ের খাতে জমা হয়েছে)</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">সদস্যের নাম</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="সদস্যের পূর্ণ নাম লিখুন"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">পিতার নাম</label>
            <input 
              required
              type="text" 
              value={formData.fatherName}
              onChange={e => setFormData({...formData, fatherName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="পিতার নাম লিখুন"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">মোবাইল নম্বর</label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="০১৭১১-XXXXXX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">এনআইডি (NID) নম্বর</label>
            <input 
              type="text" 
              value={formData.nid}
              onChange={e => setFormData({...formData, nid: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="জাতীয় পরিচয়পত্র নম্বর"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">সদস্য আইডি (ঐচ্ছিক)</label>
            <input 
              type="text" 
              value={formData.id}
              onChange={e => setFormData({...formData, id: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="ফাঁকা রাখলে অটো জেনারেট হবে"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">যোগদানের তারিখ</label>
            <input 
              type="date" 
              value={formData.joinDate}
              onChange={e => setFormData({...formData, joinDate: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">ঠিকানা</label>
            <textarea 
              rows={2}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">প্রাথমিক সঞ্চয় (ঐচ্ছিক)</label>
            <input 
              type="number" 
              value={formData.initialSavings}
              onChange={e => setFormData({...formData, initialSavings: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="৳ 0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-emerald-700">ভর্তি ফি</label>
            <input 
              required
              type="number" 
              value={formData.admissionFee}
              onChange={e => setFormData({...formData, admissionFee: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-emerald-200 bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-emerald-900"
              placeholder="৳ 0.00"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="button"
            onClick={onBack}
            className="mr-4 px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold transition-all"
          >
            বাতিল
          </button>
          <button 
            disabled={loading}
            type="submit"
            className="px-8 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all"
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'সদস্য যুক্ত করুন'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
