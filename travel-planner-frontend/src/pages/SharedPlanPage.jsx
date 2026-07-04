import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { shareService } from '../services/shareService';

export default function SharedPlanPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [plan, setPlan] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [accessType, setAccessType] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

      const [p, d, a] = await Promise.all([
        shareService.getPlanByToken(validation.planId, token),
        shareService.getDestinationsByToken(validation.planId, token),
        shareService.getActivitiesByToken(validation.planId, token)
      ]);

      setPlan(p);
      setDestinations(d);
      setActivities(a);
    } catch {
      setError('Token nije validan ili je istekao.');
    } finally {
      setLoading(false);
    }
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
          {accessType === 'EDIT' ? '✏️ Imate pristup za uređivanje' : '👁 Pregled plana putovanja'}
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>{plan.name}</h1>
          <p style={styles.dates}>{fmt(plan.startDate)} — {fmt(plan.endDate)}</p>
          {plan.description && <p style={styles.desc}>{plan.description}</p>}
          {plan.budget > 0 && <p style={styles.budget}>Budžet: <strong>€{plan.budget}</strong></p>}
          {plan.notes && <p style={styles.notes}>📝 {plan.notes}</p>}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Destinacije ({destinations.length})</h2>
          {destinations.length === 0 ? (
            <p style={styles.empty}>Nema destinacija.</p>
          ) : (
            destinations.map(d => (
              <div key={d.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <strong>{d.name}</strong>
                  <span style={styles.tag}>📍 {d.location}</span>
                </div>
                <p style={styles.cardMeta}>{fmt(d.arrivalDate)} → {fmt(d.departureDate)}</p>
                {d.description && <p style={styles.cardDesc}>{d.description}</p>}
              </div>
            ))
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Aktivnosti ({activities.length})</h2>
          {activities.length === 0 ? (
            <p style={styles.empty}>Nema aktivnosti.</p>
          ) : (
            activities.map(a => (
              <div key={a.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <strong>{a.name}</strong>
                  <span style={styles.tag}>📅 {fmt(a.date)}</span>
                </div>
                {a.location && <p style={styles.cardMeta}>📍 {a.location}</p>}
                {a.estimatedCost > 0 && <p style={styles.cardMeta}>💰 €{a.estimatedCost}</p>}
                {a.description && <p style={styles.cardDesc}>{a.description}</p>}
              </div>
            ))
          )}
        </div>

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
  budget: { color: '#059669', margin: '0 0 0.5rem' },
  notes: { color: '#6b7280', fontSize: '0.9rem', margin: 0 },
  section: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1.1rem' },
  card: { padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
  tag: { fontSize: '0.85rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' },
  cardMeta: { color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.25rem' },
  cardDesc: { color: '#374151', fontSize: '0.85rem', margin: 0 },
  empty: { color: '#9ca3af', textAlign: 'center', padding: '1rem' }
};