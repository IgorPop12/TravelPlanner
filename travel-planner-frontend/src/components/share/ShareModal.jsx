import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { shareService } from '../../services/shareService';

export default function ShareModal({ planId, onClose }) {
  const [accessType, setAccessType] = useState('VIEW');
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await shareService.generateToken(planId, accessType);
      const url = `${import.meta.env.VITE_APP_URL}/shared-plan?token=${result.token}`;
      setShareUrl(url);
    } catch {
      alert('Greška pri generisanju tokena.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Podijeli plan</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Tip pristupa</label>
          <div style={styles.toggleRow}>
            <button
              onClick={() => setAccessType('VIEW')}
              style={{ ...styles.toggleBtn, ...(accessType === 'VIEW' ? styles.active : {}) }}
            >
              👁 Pregled
            </button>
            <button
              onClick={() => setAccessType('EDIT')}
              style={{ ...styles.toggleBtn, ...(accessType === 'EDIT' ? styles.active : {}) }}
            >
              ✏️ Uređivanje
            </button>
          </div>
          <p style={styles.hint}>
            {accessType === 'VIEW'
              ? 'Osoba može samo pregledati plan.'
              : 'Osoba može i mijenjati plan.'}
          </p>
        </div>

        <button onClick={handleGenerate} disabled={loading} style={styles.generateBtn}>
          {loading ? 'Generisanje...' : 'Generiši QR kod'}
        </button>

        {shareUrl && (
          <div style={styles.result}>
            <div style={styles.qrWrapper}>
              <QRCodeSVG value={shareUrl} size={180} />
            </div>
            <p style={styles.urlLabel}>Link za dijeljenje:</p>
            <div style={styles.urlRow}>
              <input value={shareUrl} readOnly style={styles.urlInput} />
              <button onClick={handleCopy} style={styles.copyBtn}>
                {copied ? '✓ Kopirano' : 'Kopiraj'}
              </button>
            </div>
            <p style={styles.expiry}>Token važi 7 dana.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '480px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' },
  toggleRow: { display: 'flex', gap: '0.5rem' },
  toggleBtn: { flex: 1, padding: '0.6rem', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', background: 'white', fontSize: '0.95rem' },
  active: { borderColor: '#4f46e5', color: '#4f46e5', backgroundColor: '#eef2ff' },
  hint: { color: '#6b7280', fontSize: '0.85rem', marginTop: '0.5rem' },
  generateBtn: { width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' },
  result: { borderTop: '1px solid #e5e7eb', paddingTop: '1rem' },
  qrWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '1rem' },
  urlLabel: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' },
  urlRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' },
  urlInput: { flex: 1, padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.8rem', color: '#374151' },
  copyBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' },
  expiry: { color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }
};