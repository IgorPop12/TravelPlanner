export default function DestinationCard({ destination, onDelete }) {
  const fmt = (d) => new Date(d).toLocaleDateString('sr-RS');
  return (
    <div style={styles.card}>
      <div>
        <h3 style={styles.name}>{destination.name}</h3>
        <p style={styles.location}>📍 {destination.location}</p>
        <p style={styles.dates}>{fmt(destination.arrivalDate)} — {fmt(destination.departureDate)}</p>
        {destination.description && <p style={styles.desc}>{destination.description}</p>}
      </div>
      <button onClick={() => onDelete(destination.id)} style={styles.deleteBtn}>Obriši</button>
    </div>
  );
}
const styles = {
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.75rem' },
  name: { margin: '0 0 0.25rem', fontSize: '1rem' },
  location: { color: '#6b7280', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  dates: { color: '#4f46e5', fontSize: '0.85rem', margin: '0 0 0.25rem' },
  desc: { color: '#374151', fontSize: '0.85rem', margin: 0 },
  deleteBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};