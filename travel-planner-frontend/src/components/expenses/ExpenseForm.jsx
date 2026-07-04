import { useState } from 'react';

const CATEGORIES = ['transport', 'accommodation', 'food', 'tickets', 'shopping', 'other'];
const CATEGORY_LABELS = { transport: 'Prevoz', accommodation: 'Smještaj', food: 'Hrana', tickets: 'Ulaznice', shopping: 'Kupovina', other: 'Ostalo' };

export default function ExpenseForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount < 0) { setError('Iznos ne može biti negativan.'); return; }
    try {
      await onSubmit({ name, category, amount: parseFloat(amount), date, description });
    } catch (err) {
      setError(err.message || 'Greška.');
    }
  };

  return (
    <div style={styles.form}>
      <h3>Novi trošak</h3>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Naziv *" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
        <div style={styles.row}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
          <input type="number" min="0" placeholder="Iznos (€) *" value={amount} onChange={e => setAmount(e.target.value)} required style={styles.input} />
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={styles.input} />
        <textarea placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} style={styles.input} rows={2} />
        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>Otkaži</button>
          <button type="submit" style={styles.submitBtn}>Dodaj</button>
        </div>
      </form>
    </div>
  );
}
const styles = {
  form: { backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' },
  error: { color: 'red', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '0.95rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' },
  cancelBtn: { padding: '0.4rem 0.8rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  submitBtn: { padding: '0.4rem 0.8rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};