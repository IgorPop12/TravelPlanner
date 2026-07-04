export default function BudgetSummary({ budget, expenses }) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={styles.item}>
          <p style={styles.label}>Planirani budžet</p>
          <p style={styles.value}>€{budget}</p>
        </div>
        <div style={styles.item}>
          <p style={styles.label}>Potrošeno</p>
          <p style={{ ...styles.value, color: '#ef4444' }}>€{totalSpent.toFixed(2)}</p>
        </div>
        <div style={styles.item}>
          <p style={styles.label}>Preostalo</p>
          <p style={{ ...styles.value, color: remaining >= 0 ? '#059669' : '#ef4444' }}>€{remaining.toFixed(2)}</p>
        </div>
      </div>
      <div style={styles.barBg}>
        <div style={{ ...styles.barFill, width: `${percentage}%`, backgroundColor: percentage > 90 ? '#ef4444' : '#4f46e5' }} />
      </div>
      <p style={styles.percent}>{percentage.toFixed(0)}% budžeta iskorišćeno</p>
    </div>
  );
}
const styles = {
  card: { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem' },
  item: { textAlign: 'center' },
  label: { color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.25rem' },
  value: { fontWeight: 'bold', fontSize: '1.1rem', margin: 0 },
  barBg: { backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  percent: { color: '#6b7280', fontSize: '0.8rem', textAlign: 'right', margin: '0.25rem 0 0' }
};