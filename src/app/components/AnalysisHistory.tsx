import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Trash2, History, Loader2 } from 'lucide-react';
import { fetchAnalysisHistory, deleteAnalysis, DBAnalysis } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  version?: number; // increments externally after a new save to trigger reload
}

const ISSUE_LABEL: Record<string, string> = {
  acne: 'Acne',
  dark_spots: 'Dark Spots',
  wrinkles: 'Wrinkles',
  redness: 'Redness',
  large_pores: 'Large Pores',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Draw an analysis result card onto a canvas and trigger a PNG download
async function downloadWithDetails(item: DBAnalysis, accessToken: string | null) {
  if (!item.image) return;

  try {
    // Fetch the stored image as a blob so canvas isn't CORS-tainted
    const headers: Record<string, string> = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(item.image, { headers });
    if (!res.ok) throw new Error('fetch failed');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = blobUrl;
    });

    const W = img.naturalWidth || 800;
    const H = img.naturalHeight || 600;
    const PANEL = Math.round(W * 0.22); // details panel height ≈ 22% of image width

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H + PANEL;
    const ctx = canvas.getContext('2d')!;

    // Draw photo
    ctx.drawImage(img, 0, 0, W, H);
    URL.revokeObjectURL(blobUrl);

    // Dark panel background
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, H, W, PANEL);

    // Pink accent line at top of panel
    ctx.fillStyle = '#FFB3D9';
    ctx.fillRect(0, H, W, 3);

    const PAD = Math.round(W * 0.035);
    const LINE = Math.round(PANEL * 0.28);

    // Skin type + confidence
    ctx.fillStyle = '#FFB3D9';
    ctx.font = `bold ${Math.round(W * 0.038)}px Arial, sans-serif`;
    ctx.fillText(
      `${cap(item.skin_type)} Skin — ${Math.round(item.skin_type_confidence * 100)}% confidence`,
      PAD, H + LINE
    );

    // Scores row
    ctx.fillStyle = '#C0C0C0';
    ctx.font = `${Math.round(W * 0.027)}px Arial, sans-serif`;
    const scores = [
      `Acne ${Math.round(item.score_acne * 100)}%`,
      `Dark Spots ${Math.round(item.score_dark_spots * 100)}%`,
      `Wrinkles ${Math.round(item.score_wrinkles * 100)}%`,
      `Redness ${Math.round(item.score_redness * 100)}%`,
      `Large Pores ${Math.round(item.score_large_pores * 100)}%`,
    ].join('  ·  ');
    ctx.fillText(scores, PAD, H + LINE * 1.95);

    // Detected issues
    const issues = item.detected_issues.length
      ? `Detected: ${item.detected_issues.map((i) => ISSUE_LABEL[i] ?? i).join(', ')}`
      : 'No issues detected';
    ctx.fillStyle = '#F0F0F0';
    ctx.font = `${Math.round(W * 0.027)}px Arial, sans-serif`;
    ctx.fillText(issues, PAD, H + LINE * 2.85);

    // Branding + date
    ctx.fillStyle = '#666';
    ctx.font = `${Math.round(W * 0.023)}px Arial, sans-serif`;
    ctx.fillText(`DermaStation AI  ·  ${formatDate(item.created_at)}`, PAD, H + PANEL - Math.round(PANEL * 0.12));

    // Trigger download
    const link = document.createElement('a');
    link.download = `dermastation-${item.skin_type}-${item.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch {
    // Fallback: open the raw image in a new tab
    window.open(item.image, '_blank');
  }
}

export function AnalysisHistory({ open, onClose, version = 0 }: Props) {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<DBAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await fetchAnalysisHistory(accessToken);
      setItems(data);
    } catch (_) {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Reload whenever the drawer is opened OR a new save completes (version bumps)
  useEffect(() => {
    if (open) load();
  }, [open, version, load]);

  async function handleDelete(id: number) {
    if (!accessToken) return;
    setDeletingId(id);
    try {
      await deleteAnalysis(id, accessToken);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{ background: 'rgba(13,13,13,0.98)', borderLeft: '1px solid rgba(255,179,217,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,179,217,0.15)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,179,217,0.15)' }}>
                  <History className="w-4 h-4" style={{ color: '#FFB3D9' }} />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-sm">Analysis History</h2>
                  <p className="text-xs text-gray-500">{items.length} saved {items.length === 1 ? 'analysis' : 'analyses'}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-foreground transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#FFB3D9' }} />
                  <p className="text-sm text-gray-500">Loading history…</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,179,217,0.1)' }}>
                    <History className="w-6 h-6" style={{ color: '#FFB3D9' }} />
                  </div>
                  <p className="text-sm font-medium text-foreground">No analyses yet</p>
                  <p className="text-xs text-gray-500 text-center">Run a skin analysis and it will appear here automatically.</p>
                </div>
              ) : (
                items.map((item) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    accessToken={accessToken}
                    deleting={deletingId === item.id}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function HistoryCard({
  item, accessToken, deleting, onDelete,
}: {
  item: DBAnalysis;
  accessToken: string | null;
  deleting: boolean;
  onDelete: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const skinTypeColor = { oily: '#FFB3D9', dry: '#FFC9E3', normal: '#FFAAD5' }[item.skin_type] ?? '#FFB3D9';

  async function handleDownload() {
    setDownloading(true);
    await downloadWithDetails(item, accessToken);
    setDownloading(false);
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,179,217,0.15)', background: 'rgba(22,22,22,0.9)' }}
    >
      {/* Photo */}
      <div className="relative w-full h-44 bg-black/40">
        {item.image ? (
          <img src={item.image} alt="skin analysis" className="w-full h-full object-cover" crossOrigin="anonymous" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <History className="w-8 h-8 text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <p className="font-bold text-white text-base capitalize">{item.skin_type} Skin</p>
          <p className="text-xs text-gray-300">{Math.round(item.skin_type_confidence * 100)}% confidence</p>
        </div>
        <p className="absolute bottom-3 right-3 text-xs text-gray-300">{formatDate(item.created_at)}</p>

        {/* Buttons */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {item.image && (
            <button onClick={handleDownload} disabled={downloading} title="Download with analysis details"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-60"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              {downloading
                ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                : <Download className="w-3.5 h-3.5 text-white" />}
            </button>
          )}
          <button onClick={onDelete} disabled={deleting} title="Delete"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
            style={{ background: 'rgba(255,107,157,0.25)', backdropFilter: 'blur(8px)' }}
          >
            {deleting
              ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              : <Trash2 className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
      </div>

      {/* Scores */}
      <div className="px-3 py-2" style={{ borderTop: '1px solid rgba(255,179,217,0.1)' }}>
        <div className="grid grid-cols-3 gap-1 mb-2">
          {[
            { label: 'Dry', val: item.prob_dry },
            { label: 'Normal', val: item.prob_normal },
            { label: 'Oily', val: item.prob_oily },
          ].map(({ label, val }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round(val * 100)}%`, background: '#FFB3D9' }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{Math.round(val * 100)}%</p>
            </div>
          ))}
        </div>

        {/* Detected issues */}
        {item.detected_issues.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[10px] text-gray-500 self-center mr-0.5">Detected:</span>
            {item.detected_issues.map((issue) => (
              <span key={issue} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: `${skinTypeColor}18`, color: skinTypeColor, border: `1px solid ${skinTypeColor}30` }}>
                {ISSUE_LABEL[issue] ?? issue}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gray-600 pt-1">No issues detected</p>
        )}
      </div>
    </motion.div>
  );
}
