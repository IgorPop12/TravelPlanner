const CATEGORY_LABELS = { transport: 'Prevoz', accommodation: 'Smještaj', food: 'Hrana', tickets: 'Ulaznice', shopping: 'Kupovina', other: 'Ostalo' };

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) return <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>Još nema troškova.</p>;

  return (
    <div>
      {expenses.map(e => (
        <div key={e.id} style={styles.row}>
          <div>
            <span style={styles.name}>{e.name}</span>
            <span style={styles.category}>{CATEGORY_LABELS[e.category] || e.category}</span>
          </div>
          <div style={styles.right}>
            <span style={styles.amount}>€{e.amount}</span>
            <button onClick={() => onDelete(e.id)} style={styles.deleteBtn}>Obriši</button>
          </div>
        </div>
      ))}
    </div>
  );
}
const styles = {
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem' },
  name: { fontWeight: '500', marginRight: '0.5rem' },
  category: { fontSize: '0.8rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' },
  right: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  amount: { color: '#059669', fontWeight: 'bold' },
  deleteBtn: { padding: '0.3rem 0.6rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
};