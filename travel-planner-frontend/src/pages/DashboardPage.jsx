import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PlanList from '../components/plans/PlanList';
import PlanForm from '../components/plans/PlanForm';
import { travelPlanService } from '../services/travelPlanService';

export default function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await travelPlanService.getAll();
      setPlans(data);
    } catch {
      setError('Greška pri učitavanju planova.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    await travelPlanService.create(formData);
    setShowForm(false);
    loadPlans();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati plan?')) return;
    await travelPlanService.delete(id);
    loadPlans();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Moji planovi putovanja</h1>
          <button onClick={() => setShowForm(true)} style={styles.button}>
            + Novi plan
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {showForm && (
          <PlanForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <PlanList
            plans={plans}
            onDelete={handleDelete}
            onSelect={(id) => navigate(`/plans/${id}`)}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  button: { padding: '0.6rem 1.2rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  error: { color: 'red' }
};