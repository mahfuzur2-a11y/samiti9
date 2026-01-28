
import { User, Member, Transaction } from './types';

const STORAGE_KEYS = {
  USERS: 'somity_users',
  MEMBERS: 'somity_members',
  TRANSACTIONS: 'somity_transactions',
  CURRENT_USER: 'somity_current_user'
};

const INITIAL_USERS: User[] = [
  { id: '1', username: 'Admin', name: 'অ্যাডমিন', role: 'admin', password: 'Samiti9999' },
  { id: '2', username: 'Roni', name: 'আবু সুফিয়ান রনি', role: 'user', password: 'Samiti9999' },
  { id: '3', username: 'Tohid', name: 'মেহেদী হাসান তৌহিদ', role: 'user', password: 'Samiti9999' },
];

const INITIAL_MEMBERS: Member[] = [
  { id: '101', name: 'আব্দুল করিম', fatherName: 'রহিম উল্লাহ', phone: '01712345678', nid: '1234567890', address: 'স্বরুপনগর, চাপাইনবাবগঞ্জ', joinDate: '2024-01-01', totalSavings: 5500, totalLoan: 6000 },
  { id: '102', name: 'রহিম উদ্দিন', fatherName: 'জসিম উদ্দিন', phone: '01822334455', nid: '0987654321', address: 'চাপাইনবাবগঞ্জ সদর', joinDate: '2024-01-10', totalSavings: 8200, totalLoan: 0 },
  { id: '103', name: 'মোঃ জামান', fatherName: 'করিম শেখ', phone: '01911223344', nid: '1122334455', address: 'রামচন্দ্রপুর, চাপাইনবাবগঞ্জ', joinDate: '2024-02-15', totalSavings: 3000, totalLoan: 4000 },
  { id: '104', name: 'নূর আলম', fatherName: 'আব্দুস সাত্তার', phone: '01700112233', nid: '5544332211', address: 'বারোঘরিয়া', joinDate: '2024-03-01', totalSavings: 12000, totalLoan: 0 },
  { id: '105', name: 'সাইফুল ইসলাম', fatherName: 'মজিবুর রহমান', phone: '01512345678', nid: '9988776655', address: 'মহারাজপুর', joinDate: '2024-03-05', totalSavings: 4500, totalLoan: 14000 },
];

export const db = {
  // Initialization
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
  },

  // Users
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Members
  getMembers: (): Member[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]'),
  saveMembers: (members: Member[]) => localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members)),
  addMember: (member: Member) => {
    const members = db.getMembers();
    members.push(member);
    db.saveMembers(members);
  },
  updateMember: (updatedMember: Member) => {
    const members = db.getMembers().map(m => m.id === updatedMember.id ? updatedMember : m);
    db.saveMembers(members);
  },
  deleteMember: (id: string) => {
    const members = db.getMembers().filter(m => m.id !== id);
    db.saveMembers(members);
  },

  // Transactions
  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]'),
  saveTransactions: (txs: Transaction[]) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs)),
  addTransaction: (tx: Transaction) => {
    const txs = db.getTransactions();
    txs.push(tx);
    db.saveTransactions(txs);

    // Update member balance based on transaction
    const members = db.getMembers();
    const memberIndex = members.findIndex(m => m.id === tx.memberId);
    if (memberIndex !== -1) {
      const m = members[memberIndex];
      switch (tx.type) {
        case 'savings':
          m.totalSavings += tx.amount;
          break;
        case 'savings_withdrawal':
          m.totalSavings -= tx.amount;
          break;
        case 'loan_distribution':
          m.totalLoan += tx.amount;
          break;
        case 'loan_collection':
          m.totalLoan -= tx.amount;
          break;
      }
      db.saveMembers(members);
    }
  }
};
