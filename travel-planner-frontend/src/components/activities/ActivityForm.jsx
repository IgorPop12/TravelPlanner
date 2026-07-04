import { useState } from 'react';

export default function ActivityForm({ onSubmit, onCancel, destinations }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [status, setStatus] = useState('planned');
  const [destinationId, setDestinationId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        name, date, time: time || null,
        location, description,
        estimatedCost: parseFloat(estimatedCost) || 0,
        status,
        destinationId: destinationId || null
      });
    } catch (err) {
      setError(err.message || 'Greška.');
    }
  };

  return (
    <div style={styles.form}>
      <h3>Nova aktivnost</h3>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Naziv *" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
        <div style={styles.row}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={styles.input} />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={styles.input} />
        </div>
        <input placeholder="Lokacija" value={location} onChange={e => setLocation(e.target.value)} style={styles.input} />
        <input type="number" min="0" placeholder="Procijenjeni trošak (€)" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} style={styles.input} />
        <select value={status} onChange={e => setStatus(e.target.value)} style={styles.input}>
          <option value="planned">Planirano</option>
          <option value="reserved">Rezervisano</option>
          <option value="completed">Završeno</option>
          <option value="cancelled">Otkazano</option>
        </select>
        {destinations.length > 0 && (
          <select value={destinationId} onChange={e => setDestinationId(e.target.value)} style={styles.input}>
            <option value="">— Odaberi destinaciju (opcionalno) —</option>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        )}
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