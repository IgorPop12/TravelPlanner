import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { travelPlanService } from '../services/travelPlanService';
import DestinationForm from '../components/destinations/DestinationForm';
import DestinationCard from '../components/destinations/DestinationCard';
import ActivityForm from '../components/activities/ActivityForm';
import ActivityCard from '../components/activities/ActivityCard';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import BudgetSummary from '../components/expenses/BudgetSummary';
import ChecklistPanel from '../components/checklist/ChecklistPanel';
import PlanForm from '../components/plans/PlanForm';
import { destinationService } from '../services/destinationService';
import { activityService } from '../services/activityService';
import { expenseService } from '../services/expenseService';
import { checklistService } from '../services/checklistService';
import ShareModal from '../components/share/ShareModal';
import { pdfService } from '../services/pdfService';

const TABS = ['Pregled', 'Destinacije', 'Aktivnosti', 'Troškovi', 'Checklist'];

export default function PlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [activeTab, setActiveTab] = useState('Pregled');
  const [showEditPlan, setShowEditPlan] = useState(false);
  const [showDestForm, setShowDestForm] = useState(false);
  const [showActForm, setShowActForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    loadAll();
  }, [id]);

  const loadAll = async () => {
    try {
      const [p, d, a, e, c] = await Promise.all([
        travelPlanService.getById(id),
        destinationService.getAll(id),
        activityService.getAll(id),
        expenseService.getAll(id),
        checklistService.getAll(id)
      ]);
      setPlan(p);
      setDestinations(d);
      setActivities(a);
      setExpenses(e);
      setChecklist(c);
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (data) => {
    await travelPlanService.update(id, data);
    setShowEditPlan(false);
    loadAll();
  };

  const handleAddDestination = async (data) => {
    await destinationService.create(id, data);
    setShowDestForm(false);
    loadAll();
  };

  const handleDeleteDestination = async (destId) => {
    if (!window.confirm('Obrisati destinaciju?')) return;
    await destinationService.delete(id, destId);
    loadAll();
  };

  const handleAddActivity = async (data) => {
    await activityService.create(id, data);
    setShowActForm(false);
    loadAll();
  };

  const handleDeleteActivity = async (actId) => {
    if (!window.confirm('Obrisati aktivnost?')) return;
    await activityService.delete(id, actId);
    loadAll();
  };

  const handleAddExpense = async (data) => {
    await expenseService.create(id, data);
    setShowExpForm(false);
    loadAll();
  };

  const handleDeleteExpense = async (expId) => {
    if (!window.confirm('Obrisati trošak?')) return;
    await expenseService.delete(id, expId);
    loadAll();
  };

  const handleToggleChecklist = async (itemId) => {
    await checklistService.toggle(id, itemId);
    loadAll();
  };

  const handleAddChecklist = async (name) => {
    await checklistService.create(id, name);
    loadAll();
  };

  const handleDeleteChecklist = async (itemId) => {
    await checklistService.delete(id, itemId);
    loadAll();
  };

  if (loading) return <div style={{ padding: '2rem' }}>Učitavanje...</div>;
  if (!plan) return null;

  const formatDate = (d) => new Date(d).toLocaleDateString('sr-RS');

  return (
    <div>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Nazad</button>
            <h1 style={styles.title}>{plan.name}</h1>
            <p style={styles.dates}>{formatDate(plan.startDate)} — {formatDate(plan.endDate)}</p>
          </div>
          <button onClick={() => setShowEditPlan(true)} style={styles.editBtn}>Uredi plan</button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => pdfService.generatePlanReport(plan, destinations, activities, expenses, checklist)}
              style={styles.pdfBtn}
            >
              PDF izvještaj
            </button>
            <button onClick={() => setShowShare(true)} style={styles.shareBtn}>🔗 Podijeli</button>
            <button onClick={() => setShowEditPlan(true)} style={styles.editBtn}>Uredi plan</button>
          </div>
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
            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <h3>Osnovno</h3>
                <p><strong>Naziv:</strong> {plan.name}</p>
                <p><strong>Opis:</strong> {plan.description || '—'}</p>
                <p><strong>Budžet:</strong> €{plan.budget}</p>
                <p><strong>Napomene:</strong> {plan.notes || '—'}</p>
              </div>
              <div style={styles.infoCard}>
                <h3>Statistike</h3>
                <p><strong>Destinacije:</strong> {destinations.length}</p>
                <p><strong>Aktivnosti:</strong> {activities.length}</p>
                <p><strong>Troškovi:</strong> {expenses.length}</p>
                <p><strong>Checklist:</strong> {checklist.filter(c => c.isCompleted).length}/{checklist.length} završeno</p>
              </div>
            </div>
          </div>
        )}

        {/* Destinacije */}
        {activeTab === 'Destinacije' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Destinacije</h2>
              <button onClick={() => setShowDestForm(true)} style={styles.addBtn}>+ Dodaj</button>
            </div>
            {showDestForm && (
              <DestinationForm onSubmit={handleAddDestination} onCancel={() => setShowDestForm(false)} />
            )}
            {destinations.length === 0 ? (
              <p style={styles.empty}>Još nema destinacija.</p>
            ) : (
              destinations.map(d => (
                <DestinationCard key={d.id} destination={d} onDelete={handleDeleteDestination} />
              ))
            )}
          </div>
        )}

        {/* Aktivnosti */}
        {activeTab === 'Aktivnosti' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Aktivnosti</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                  style={styles.editBtn}
                >
                  {viewMode === 'list' ? 'Kalendar' : 'Lista'}
                </button>
                <button onClick={() => setShowActForm(true)} style={styles.addBtn}>+ Dodaj</button>
              </div>
            </div>
            {showActForm && (
              <ActivityForm onSubmit={handleAddActivity} onCancel={() => setShowActForm(false)} destinations={destinations} />
            )}
            {viewMode === 'calendar' ? (
              <CalendarView activities={activities} />
            ) : (
              activities.length === 0 ? (
                <p style={styles.empty}>Još nema aktivnosti.</p>
              ) : (
                activities.map(a => (
                  <ActivityCard key={a.id} activity={a} onDelete={handleDeleteActivity} />
                ))
              )
            )}
          </div>
        )}

        {/* Troškovi */}
        {activeTab === 'Troškovi' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Troškovi</h2>
              <button onClick={() => setShowExpForm(true)} style={styles.addBtn}>+ Dodaj</button>
            </div>
            <BudgetSummary planId={id} budget={plan.budget} expenses={expenses} />
            {showExpForm && (
              <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setShowExpForm(false)} />
            )}
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        )}

        {/* Checklist */}
        {activeTab === 'Checklist' && (
          <ChecklistPanel
            items={checklist}
            onAdd={handleAddChecklist}
            onToggle={handleToggleChecklist}
            onDelete={handleDeleteChecklist}
          />
        )}
      </div>

      {showEditPlan && (
        <PlanForm initialData={plan} onSubmit={handleUpdatePlan} onCancel={() => setShowEditPlan(false)} />
      )}
      {showShare && (
        <ShareModal planId={id} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', marginBottom: '0.5rem', padding: 0 },
  title: { margin: '0 0 0.25rem', fontSize: '1.8rem' },
  dates: { color: '#6b7280', margin: 0 },
  editBtn: { padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0' },
  tab: { padding: '0.6rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderBottom: '2px solid transparent', marginBottom: '-2px' },
  activeTab: { color: '#4f46e5', borderBottom: '2px solid #4f46e5', fontWeight: 'bold' },
  section: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  addBtn: { padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  infoCard: { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem' },
  empty: { color: '#6b7280', textAlign: 'center', padding: '2rem' },
  shareBtn: { padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  pdfBtn: { padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};