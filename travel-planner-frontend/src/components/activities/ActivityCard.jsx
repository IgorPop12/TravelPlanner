const STATUS_COLORS = { planned: '#6b7280', reserved: '#2563eb', completed: '#059669', cancelled: '#ef4444' };
const STATUS_LABELS = { planned: 'Planirano', reserved: 'Rezervisano', completed: 'Završeno', cancelled: 'Otkazano' };

export default function ActivityCard({ activity, onDelete }) {
  const fmt = (d) => new Date(d).toLocaleDateString('sr-RS');
  return (
    <div style={styles.card}>
      <div>
        <div style={styles.top}>
          <h3 style={styles.name}>{activity.name}</h3>
          <span style={{ ...styles.status, color: STATUS_COLORS[activity.status] }}>
            {STATUS_LABELS[activity.status]}
          </span>
        </div>
        <p style={styles.meta}>📅 {fmt(activity.date)} {activity.time && `• ${activity.time.slice(0, 5)}`}</p>
        {activity.location && <p style={styles.meta}>📍 {activity.location}</p>}
        {activity.estimatedCost > 0 && <p style={styles.cost}>Trošak: €{activity.estimatedCost}</p>}
        {activity.description && <p style={styles.desc}>{activity.description}</p>}
      </div>
      <button onClick={() => onDelete(activity.id)} style={styles.deleteBtn}>Obriši</button>
    </div>
  );
}
const styles = {
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.75rem' },
  top: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' },
  name: { margin: 0, fontSize: '1rem' },
  status: { fontSize: '0.8rem', fontWeight: 'bold' },
  meta: { color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.2rem' },
  cost: { color: '#059669', fontSize: '0.85rem', margin: '0 0 0.2rem' },
  desc: { color: '#374151', fontSize: '0.85rem', margin: 0 },
  deleteBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flexShrink: 0 }
};