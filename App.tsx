
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Wallet, 
  HandCoins, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  FileText, 
  MinusCircle, 
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  Coins,
  Building2,
  BookOpen,
  PieChart,
  LogOut,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { ViewType, User } from './types';
import Login from './Login';
import DashboardGrid from './DashboardGrid';
import MemberForm from './MemberForm';
import MemberList from './MemberList';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Reports from './Reports';
import ProfitView from './ProfitView';
import MemberLedger from './MemberLedger';
import ProfitDistribution from './ProfitDistribution';
import UserManagement from './UserManagement';
import ChangePassword from './ChangePassword';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    db.init();
    const savedUser = db.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    db.setCurrentUser(user);
  };

  const handleLogout = () => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে লগআউট করতে চান?')) {
      db.setCurrentUser(null);
      setCurrentUser(null);
      setIsSidebarOpen(false);
      setCurrentView(ViewType.DASHBOARD);
    }
  };

  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
    db.setCurrentUser(updated);
    const users = db.getUsers().map(u => u.id === updated.id ? updated : u);
    db.saveUsers(users);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = currentUser.role === 'admin';

  const renderContent = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <DashboardGrid onNavigate={setCurrentView} userRole={currentUser.role} onLogout={handleLogout} />;
      case ViewType.NEW_MEMBER:
        return <MemberForm onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.MEMBER_LIST:
        return <MemberList onBack={() => setCurrentView(ViewType.DASHBOARD)} isAdmin={isAdmin} />;
      case ViewType.SAVINGS_COLLECTION:
        return <TransactionForm type="savings" label="সঞ্চয় আদায়" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.LOAN_COLLECTION:
        return <TransactionForm type="loan_collection" label="ঋণ আদায়" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.LOAN_DISTRIBUTION:
        return <TransactionForm type="loan_distribution" label="ঋণ বিতরণ" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.EXPENSE:
        return <TransactionForm type="expense" label="ব্যয় এন্ট্রি" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.SAVINGS_DUE:
        return <MemberList type="savings_due" onBack={() => setCurrentView(ViewType.DASHBOARD)} isAdmin={isAdmin} />;
      case ViewType.LOAN_DUE:
        return <MemberList type="loan_due" onBack={() => setCurrentView(ViewType.DASHBOARD)} isAdmin={isAdmin} />;
      case ViewType.SAVINGS_VIEW:
        return <TransactionList type="savings" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.LOAN_VIEW:
        return <TransactionList type="loan" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.SAVINGS_WITHDRAWAL:
        return <TransactionForm type="savings_withdrawal" label="সঞ্চয় উত্তোলন" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.BANK_DEPOSIT:
        return <TransactionForm type="bank_deposit" label="ব্যাংক জমা" onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.REPORTS:
        return <Reports onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.PROFIT:
        return <ProfitView onBack={() => setCurrentView(ViewType.DASHBOARD)} onDistribute={() => isAdmin ? setCurrentView(ViewType.PROFIT_DISTRIBUTION) : alert('শুধুমাত্র অ্যাডমিন মুনাফা বন্টন করতে পারবেন।')} />;
      case ViewType.PROFIT_DISTRIBUTION:
        return isAdmin ? <ProfitDistribution onBack={() => setCurrentView(ViewType.PROFIT)} /> : <DashboardGrid onNavigate={setCurrentView} userRole={currentUser.role} onLogout={handleLogout} />;
      case ViewType.MEMBER_LEDGER:
        return <MemberLedger onBack={() => setCurrentView(ViewType.DASHBOARD)} />;
      case ViewType.USER_MANAGEMENT:
        return isAdmin ? <UserManagement onBack={() => setCurrentView(ViewType.DASHBOARD)} /> : <DashboardGrid onNavigate={setCurrentView} userRole={currentUser.role} onLogout={handleLogout} />;
      case ViewType.CHANGE_PASSWORD:
        return <ChangePassword onBack={() => setCurrentView(ViewType.DASHBOARD)} user={currentUser} onUpdate={handleUpdateUser} />;
      default:
        return <DashboardGrid onNavigate={setCurrentView} userRole={currentUser.role} onLogout={handleLogout} />;
    }
  };

  const navItems = [
    { type: ViewType.DASHBOARD, label: 'ড্যাশবোর্ড', icon: <LayoutDashboard size={20} /> },
    { type: ViewType.NEW_MEMBER, label: 'নতুন সদস্য', icon: <UserPlus size={20} /> },
    { type: ViewType.MEMBER_LIST, label: 'সদস্য তালিকা', icon: <Users size={20} /> },
    { type: ViewType.MEMBER_LEDGER, label: 'সদস্য লেজার', icon: <BookOpen size={20} /> },
    { type: ViewType.SAVINGS_COLLECTION, label: 'সঞ্চয় আদায়', icon: <Wallet size={20} /> },
    { type: ViewType.LOAN_COLLECTION, label: 'ঋণ আদায়', icon: <HandCoins size={20} /> },
    { type: ViewType.LOAN_DISTRIBUTION, label: 'ঋণ বিতরণ', icon: <TrendingUp size={20} /> },
    { type: ViewType.EXPENSE, label: 'ব্যয়', icon: <TrendingDown size={20} /> },
    { type: ViewType.BANK_DEPOSIT, label: 'ব্যাংক জমা', icon: <Building2 size={20} /> },
    { type: ViewType.PROFIT, label: 'মুনাফা ও আয়', icon: <Coins size={20} /> },
    { type: ViewType.REPORTS, label: 'রিপোর্ট', icon: <BarChart3 size={20} /> },
  ];

  if (isAdmin) {
    navItems.push(
      { type: ViewType.PROFIT_DISTRIBUTION, label: 'মুনাফা বন্টন', icon: <PieChart size={20} /> },
      { type: ViewType.USER_MANAGEMENT, label: 'ইউজার ম্যানেজমেন্ট', icon: <ShieldCheck size={20} /> }
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-['Hind_Siliguri']">
      {/* Mobile Header */}
      <header className="md:hidden bg-emerald-700 text-white p-4 flex justify-between items-center shadow-lg z-50">
        <h1 className="text-xl font-bold">চলো পাল্টায়</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="p-1 hover:bg-emerald-600 rounded">
            <LogOut size={22} />
          </button>
          <button onClick={toggleSidebar} className="p-1">
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transition-transform duration-300 transform 
        md:translate-x-0 md:static md:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 bg-emerald-700 text-white hidden md:block">
            <h2 className="text-xl font-bold leading-tight">চলো পাল্টায় <br/> যুব কল্যাণ সমিতি</h2>
            <div className="mt-4 flex items-center gap-2 bg-emerald-800/50 p-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-black">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] opacity-70 uppercase">{currentUser.role === 'admin' ? 'অ্যাডমিন' : 'ইউজার'}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setCurrentView(item.type);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${currentView === item.type 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm ring-1 ring-emerald-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'}
                `}
              >
                <span className={`${currentView === item.type ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-100 space-y-1">
            <button 
              onClick={() => {
                setCurrentView(ViewType.CHANGE_PASSWORD);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all"
            >
              <KeyRound size={16} /> <span>পাসওয়ার্ড পরিবর্তন</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
            >
              <LogOut size={16} /> <span>লগআউট</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {currentView !== ViewType.DASHBOARD && (
            <button 
              onClick={() => setCurrentView(ViewType.DASHBOARD)}
              className="mb-6 flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors print:hidden"
            >
              <ChevronLeft size={20} className="mr-1" />
              ড্যাশবোর্ড
            </button>
          )}
          {renderContent()}
        </div>
      </main>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
