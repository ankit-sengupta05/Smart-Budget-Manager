import {
  collection, addDoc, getDocs, query,
  where, orderBy, deleteDoc, doc, writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COL = 'transactions';

export async function saveTransaction(userId, tx) {
  return addDoc(collection(db, COL), { ...tx, userId, createdAt: new Date() });
}

export async function saveTransactions(userId, txList) {
  const batch = writeBatch(db);
  txList.forEach(tx => {
    const ref = doc(collection(db, COL));
    batch.set(ref, { ...tx, userId, createdAt: new Date() });
  });
  return batch.commit();
}

export async function getTransactions(userId) {
  try {
    const q = query(
      collection(db, COL),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
  } catch (e) {
    console.log('getTransactions error:', e.message);
    return [];
  }
}

export async function deleteTransaction(docId) {
  return deleteDoc(doc(db, COL, docId));
}

export function summarizeByCategory(transactions) {
  const summary = {};
  transactions.forEach(tx => {
    if (tx.category && tx.amount) {
      summary[tx.category] = (summary[tx.category] || 0) + tx.amount;
    }
  });
  return Object.entries(summary)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}

export function monthlyTotals(transactions) {
  const map = {};
  transactions.forEach(tx => {
    const key = tx.date ? tx.date.substring(0, 7) : 'Unknown';
    map[key] = (map[key] || 0) + tx.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}
