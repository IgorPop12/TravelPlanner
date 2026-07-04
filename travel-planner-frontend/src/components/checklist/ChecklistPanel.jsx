import { useState } from 'react';

export default function ChecklistPanel({ items, onAdd, onToggle, onDelete }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await onAdd(newItem.trim());
    setNewItem('');
  };

  const completed = items.filter(i => i.isCompleted).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Checklist</h2>
        <span style={styles.progress}>{completed}/{items.length} završeno</span>
      </div>

      <form onSubmit={handleAdd} style={styles.addForm}>
        <input
          placeholder="Dodaj stavku (pasoš, karta, ...)"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>Dodaj</button>
      </form>

      {items.length === 0 ? (
        <p style={styles.empty}>Checklist je prazan.</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} style={styles.item}>
              <div style={styles.left} onClick={() => onToggle(item.id)}>
                <span style={{ ...styles.checkbox, ...(item.isCompleted ? styles.checked : {}) }}>
                  {item.isCompleted ? '✓' : ''}
                </span>
                <span style={{ ...styles.itemName, ...(item.isCompleted ? styles.strikethrough : {}) }}>
                  {item.name}
                </span>
              </div>
              <button onClick={() => onDelete(item.id)} style={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const styles = {
  container: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  progress: { color: '#4f46e5', fontWeight: 'bold' },
  addForm: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  input: { flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.95rem' },
  addBtn: { padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  empty: { color: '#6b7280', textAlign: 'center', padding: '1rem' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', borderBottom: '1px solid #f3f4f6' },
  left: { display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 },
  checkbox: { width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 },
  checked: { backgroundColor: '#4f46e5', borderColor: '#4f46e5', color: 'white' },
  itemName: { fontSize: '0.95rem' },
  strikethrough: { textDecoration: 'line-through', color: '#9ca3af' },
  deleteBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.25rem' }
};