import { useState } from 'react';

export default function DestinationForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(departureDate) < new Date(arrivalDate)) {
      setError('Datum odlaska ne može biti prije dolaska.');
      return;
    }
    try {
      await onSubmit({ name, location, arrivalDate, departureDate, description });
    } catch (err) {
      setError(err.message || 'Greška.');
    }
  };

  return (
    <div style={styles.form}>
      <h3>Nova destinacija</h3>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Naziv *" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
        <input placeholder="Lokacija *" value={location} onChange={e => setLocation(e.target.value)} required style={styles.input} />
        <div style={styles.row}>
          <input type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} required style={styles.input} />
          <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required style={styles.input} />
        </div>
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