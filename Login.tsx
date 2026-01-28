
import React, { useState } from 'react';
import { User as UserIcon, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('ইউজারনেম বা পাসওয়ার্ড সঠিক নয়!');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-700 flex items-center justify-center p-4 font-['Hind_Siliguri']">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">সদস্য লগইন</h2>
          <p className="text-slate-500 text-sm mt-1">চলো পাল্টায় যুব কল্যাণ সমিতি ড্যাশবোর্ড</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ইউজারনেম</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon size={20} />
              </div>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="আপনার ইউজারনেম"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            লগইন করুন <LogIn size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
