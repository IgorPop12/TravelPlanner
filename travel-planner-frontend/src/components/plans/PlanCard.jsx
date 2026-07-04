export default function PlanCard({ plan, onSelect, onDelete }) {
  const formatDate = (d) => new Date(d).toLocaleDateString('sr-RS');

  return (
    <div style={styles.card}>
      <div style={styles.info} onClick={() => onSelect(plan.id)}>
        <h3 style={styles.title}>{plan.name}</h3>
        <p style={styles.dates}>{formatDate(plan.startDate)} — {formatDate(plan.endDate)}</p>
        {plan.description && <p style={styles.desc}>{plan.description}</p>}
        <p style={styles.budget}>Budžet: <strong>€{plan.budget}</strong></p>
      </div>
      <div style={styles.actions}>
        <button onClick={() => onSelect(plan.id)} style={styles.viewBtn}>Otvori</button>
        <button onClick={() => onDelete(plan.id)} style={styles.deleteBtn}>Obriši</button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  info: { cursor: 'pointer', flex: 1 },
  title: { margin: '0 0 0.25rem', fontSize: '1.1rem' },
  dates: { color: '#6b7280', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  desc: { color: '#374151', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  budget: { color: '#059669', fontSize: '0.9rem', margin: 0 },
  actions: { display: 'flex', gap: '0.5rem', marginLeft: '1rem' },
  viewBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};