import { useState } from 'react';

export default function PlanForm({ onSubmit, onCancel, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.startDate?.slice(0, 10) || '');
  const [endDate, setEndDate] = useState(initialData?.endDate?.slice(0, 10) || '');
  const [budget, setBudget] = useState(initialData?.budget || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(endDate) < new Date(startDate)) {
      setError('Krajnji datum ne može biti prije početnog datuma.');
      return;
    }
    if (budget < 0) {
      setError('Budžet ne može biti negativan.');
      return;
    }

    try {
      await onSubmit({ name, description, startDate, endDate, budget: parseFloat(budget), notes });
    } catch (err) {
      setError(err.message || 'Greška pri čuvanju.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{initialData ? 'Uredi plan' : 'Novi plan putovanja'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Naziv *</label>
            <input value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Opis</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={styles.input} rows={3} />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label>Početni datum *</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.field}>
              <label>Krajnji datum *</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={styles.input} />
            </div>
          </div>
          <div style={styles.field}>
            <label>Budžet (€)</label>
            <input type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Napomene</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={styles.input} rows={2} />
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>Otkaži</button>
            <button type="submit" style={styles.submitBtn}>Sačuvaj</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' },
  field: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { padding: '0.6rem 1.2rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { padding: '0.6rem 1.2rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '1rem' }
};