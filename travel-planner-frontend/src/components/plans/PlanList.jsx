import PlanCard from './PlanCard';

export default function PlanList({ plans, onSelect, onDelete }) {
  if (plans.length === 0) {
    return (
      <div style={styles.empty}>
        <p>Još nemaš planova putovanja.</p>
        <p>Klikni "Novi plan" da počneš planirati!</p>
      </div>
    );
  }

  return (
    <div>
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

const styles = {
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #d1d5db' }
};