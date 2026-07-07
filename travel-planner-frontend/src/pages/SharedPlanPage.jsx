import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { shareService } from '../services/shareService';
import DestinationForm from '../components/destinations/DestinationForm';
import ActivityForm from '../components/activities/ActivityForm';
import DestinationCard from '../components/destinations/DestinationCard';
import ActivityCard from '../components/activities/ActivityCard';
import ChecklistPanel from '../components/checklist/ChecklistPanel';

export default function SharedPlanPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [plan, setPlan] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [accessType, setAccessType] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pregled');
  const [showDestForm, setShowDestForm] = useState(false);
  const [showActForm, setShowActForm] = useState(false);

  const TABS = ['Pregled', 'Destinacije', 'Aktivnosti', 'Checklist'];

  useEffect(() => {
    if (!token) {
      setError('Token nije pronađen.');
      setLoading(false);
      return;
    }
    loadSharedPlan();
  }, [token]);

  const loadSharedPlan = async () => {
    try {
      const validation = await shareService.validateToken(token);
      setAccessType(validation.accessType);
      setPlanId(validation.planId);

      const [p, d, a, c] = await Promise.all([
        shareService.getPlanByToken(validation.planId, token),
        shareService.getDestinationsByToken(validation.planId, token),
        shareService.getActivitiesByToken(validation.planId, token),
        shareService.getChecklistByToken(validation.planId, token)
      ]);

      setPlan(p);
      setDestinations(d);
      setActivities(a);
      setChecklist(c);
    } catch {
      setError('Token nije validan ili je istekao.');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = accessType === 'EDIT';

  const handleAddDestination = async (data) => {
    await shareService.createDestinationByToken(planId, token, data);
    setShowDestForm(false);
    loadSharedPlan();
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Obrisati destinaciju?')) return;
    await shareService.deleteDestinationByToken(planId, token, id);
    loadSharedPlan();
  };

  const handleAddActivity = async (data) => {
    await shareService.createActivityByToken(planId, token, data);
    setShowActForm(false);
    loadSharedPlan();
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Obrisati aktivnost?')) return;
    await shareService.deleteActivityByToken(planId, token, id);
    loadSharedPlan();
  };

  const handleAddChecklist = async (name) => {
    await shareService.createChecklistItemByToken(planId, token, name);
    loadSharedPlan();
  };

  const handleToggleChecklist = async (id) => {
    await shareService.toggleChecklistItemByToken(planId, token, id);
    loadSharedPlan();
  };

  if (loading) return <div style={styles.center}>Učitavanje...</div>;

  if (error) return (
    <div style={styles.center}>
      <div style={styles.errorCard}>
        <h2>Greška</h2>
        <p style={styles.errorText}>{error}</p>
      </div>
    </div>
  );

  const fmt = (d) => new Date(d).toLocaleDateString('sr-RS');

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.banner}>
          {isEdit ? '✏️ Imate pristup za uređivanje' : '👁 Pregled plana putovanja'}
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>{plan.name}</h1>
          <p style={styles.dates}>{fmt(plan.startDate)} — {fmt(plan.endDate)}</p>
          {plan.description && <p style={styles.desc}>{plan.description}</p>}
          {plan.budget > 0 && <p style={styles.budget}>Budžet: <strong>€{plan.budget}</strong></p>}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pregled */}
        {activeTab === 'Pregled' && (
          <div style={styles.section}>
            <h2>Osnovno</h2>
            <p><strong>Naziv:</strong> {plan.name}</p>
            <p><strong>Period:</strong> {fmt(plan.startDate)} — {fmt(plan.endDate)}</p>
            <p><strong>Budžet:</strong> €{plan.budget}</p>
            {plan.notes && <p><strong>Napomene:</strong> {plan.notes}</p>}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}><p style={styles.statNum}>{destinations.length}</p><p style={styles.statLabel}>Destinacije</p></div>
              <div style={styles.statCard}><p style={styles.statNum}>{activities.length}</p><p style={styles.statLabel}>Aktivnosti</p></div>
              <div style={styles.statCard}><p style={styles.statNum}>{checklist.filter(c => c.isCompleted).length}/{checklist.length}</p><p style={styles.statLabel}>Checklist</p></div>
            </div>
          </div>
        )}

        {/* Destinacije */}
        {activeTab === 'Destinacije' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Destinacije</h2>
              {isEdit && (
                <button onClick={() => setShowDestForm(true)} style={styles.addBtn}>+ Dodaj</button>
              )}
            </div>
            {isEdit && showDestForm && (
              <DestinationForm
                onSubmit={handleAddDestination}
                onCancel={() => setShowDestForm(false)}
              />
            )}
            {destinations.length === 0 ? (
              <p style={styles.empty}>Nema destinacija.</p>
            ) : (
              destinations.map(d => (
                <DestinationCard
                  key={d.id}
                  destination={d}
                  onDelete={isEdit ? handleDeleteDestination : null}
                />
              ))
            )}
          </div>
        )}

        {/* Aktivnosti */}
        {activeTab === 'Aktivnosti' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Aktivnosti</h2>
              {isEdit && (
                <button onClick={() => setShowActForm(true)} style={styles.addBtn}>+ Dodaj</button>
              )}
            </div>
            {isEdit && showActForm && (
              <ActivityForm
                onSubmit={handleAddActivity}
                onCancel={() => setShowActForm(false)}
                destinations={destinations}
              />
            )}
            {activities.length === 0 ? (
              <p style={styles.empty}>Nema aktivnosti.</p>
            ) : (
              activities.map(a => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  onDelete={isEdit ? handleDeleteActivity : null}
                />
              ))
            )}
          </div>
        )}

        {/* Checklist */}
        {activeTab === 'Checklist' && (
          isEdit ? (
            <ChecklistPanel
              items={checklist}
              onAdd={handleAddChecklist}
              onToggle={handleToggleChecklist}
              onDelete={() => {}}
            />
          ) : (
            <div style={styles.section}>
              <h2>Checklist</h2>
              {checklist.map(item => (
                <div key={item.id} style={styles.checkItem}>
                  <span style={item.isCompleted ? styles.checked : styles.unchecked}>
                    {item.isCompleted ? '✓' : '○'}
                  </span>
                  <span style={item.isCompleted ? styles.strikethrough : {}}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  errorCard: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' },
  errorText: { color: '#ef4444' },
  banner: { backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontWeight: '500', textAlign: 'center' },
  header: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
  title: { fontSize: '1.8rem', margin: '0 0 0.5rem' },
  dates: { color: '#6b7280', margin: '0 0 0.5rem' },
  desc: { color: '#374151', margin: '0 0 0.5rem' },
  budget: { color: '#059669', margin: 0 },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' },
  tab: { padding: '0.6rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderBottom: '2px solid transparent', marginBottom: '-2px' },
  activeTab: { color: '#4f46e5', borderBottom: '2px solid #4f46e5', fontWeight: 'bold' },
  section: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  addBtn: { padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  empty: { color: '#9ca3af', textAlign: 'center', padding: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' },
  statCard: { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem', textAlign: 'center' },
  statNum: { fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 0.25rem' },
  statLabel: { color: '#6b7280', fontSize: '0.85rem', margin: 0 },
  checkItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', borderBottom: '1px solid #f3f4f6' },
  checked: { color: '#4f46e5', fontWeight: 'bold' },
  unchecked: { color: '#9ca3af' },
  strikethrough: { textDecoration: 'line-through', color: '#9ca3af' }
};