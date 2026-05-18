const { useState, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#2563eb",
  "showSummary": true,
  "cardDensity": "normal"
}/*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#2563eb', '#1d4ed8', '#1f6feb', '#3b6cf6'];

const STUDENT = { name: 'Nguyễn Hà Linh', code: 'KL-1042', initials: 'HL' };

const TEACHER_GRADIENTS = {
  park: 'linear-gradient(135deg, #2563eb, #6ea8ff)',
  kim:  'linear-gradient(135deg, #0d9488, #5eead4)',
};

const SESSIONS = [
  {
    id: 's1', dateIso: '2026-05-14', dateLabel: 'May 14', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['speaking', 'pronunciation'],
    durations: { speaking: 40, pronunciation: 10 },
    scores: { speaking: 79, pronunciation: 83 },
    summary: 'Strong vocabulary and improving grammar, but verb-tense consistency needs more practice.',
  },
  {
    id: 's2', dateIso: '2026-05-07', dateLabel: 'May 7', yearLabel: '2026', dayOfWeek: 'THU',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['speaking'],
    durations: { speaking: 45 },
    scores: { speaking: 85 },
    summary: 'Excellent session — confident delivery and strong handling of follow-up questions.',
  },
  {
    id: 's3', dateIso: '2026-04-30', dateLabel: 'Apr 30', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['speaking', 'pronunciation'],
    durations: { speaking: 40, pronunciation: 10 },
    scores: { speaking: 72, pronunciation: 78 },
    summary: 'Progress on complex sentence structures; article usage remains inconsistent.',
  },
  {
    id: 's4', dateIso: '2026-04-23', dateLabel: 'Apr 23', yearLabel: '2026', dayOfWeek: 'THU',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['pronunciation'],
    durations: { pronunciation: 20 },
    scores: { pronunciation: 91 },
    summary: 'Outstanding — near-native stress and rhythm sustained across all 8 sentences.',
  },
  {
    id: 's5', dateIso: '2026-04-16', dateLabel: 'Apr 16', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['speaking', 'pronunciation'],
    durations: { speaking: 40, pronunciation: 10 },
    scores: { speaking: 68, pronunciation: 74 },
    summary: 'Developing fluency; student self-corrected 3 errors, showing strong growing awareness.',
  },
  {
    id: 's6', dateIso: '2026-04-09', dateLabel: 'Apr 9', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Kim Su Jin', initials: 'KS', id: 'kim' },
    types: ['speaking'],
    durations: { speaking: 40 },
    scores: { speaking: 55 },
    summary: 'Hesitation on new topic vocabulary; extra practice with business English recommended.',
  },
  {
    id: 's7', dateIso: '2026-04-02', dateLabel: 'Apr 2', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['speaking', 'pronunciation'],
    durations: { speaking: 40, pronunciation: 10 },
    scores: { speaking: 63, pronunciation: 70 },
    summary: 'Steady improvement; /θ/ sound pronunciation notably cleaner than the previous session.',
  },
  {
    id: 's8', dateIso: '2026-03-26', dateLabel: 'Mar 26', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Kim Su Jin', initials: 'KS', id: 'kim' },
    types: ['speaking', 'pronunciation'],
    durations: { speaking: 45, pronunciation: 15 },
    scores: { speaking: 58, pronunciation: 66 },
    summary: 'Early-stage progress; confidence building on open-ended questions is the key focus.',
  },
  {
    id: 's9', dateIso: '2026-03-19', dateLabel: 'Mar 19', yearLabel: '2026', dayOfWeek: 'WED',
    teacher: { name: 'Ms. Park Ji Yeon', initials: 'PJ', id: 'park' },
    types: ['speaking'],
    durations: { speaking: 40 },
    scores: { speaking: 61 },
    summary: 'Good foundational session — student grasped topic transitions quickly for a first attempt.',
  },
  {
    id: 's10', dateIso: '2026-03-12', dateLabel: 'Mar 12', yearLabel: '2026', dayOfWeek: 'THU',
    teacher: { name: 'Ms. Kim Su Jin', initials: 'KS', id: 'kim' },
    types: ['speaking', 'pronunciation'],
    durations: { speaking: 35, pronunciation: 10 },
    scores: { speaking: 52, pronunciation: 62 },
    summary: 'Initial assessment session — baseline established for both speaking and pronunciation.',
  },
];

const TEACHER_OPTS = [
  { value: 'all',  label: 'All teachers' },
  { value: 'park', label: 'Ms. Park Ji Yeon' },
  { value: 'kim',  label: 'Ms. Kim Su Jin' },
];

const SCORE_OPTS = [
  { value: 'all',  label: 'All scores' },
  { value: 'high', label: '≥ 80' },
  { value: 'mid',  label: '60 – 79' },
  { value: 'low',  label: '< 60' },
];

/* ── helpers ── */
function bandClass(n) {
  if (n >= 80) return 'good';
  if (n >= 60) return 'warn';
  return 'bad';
}
function avgScore(session) {
  const vals = Object.values(session.scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
function matchesScore(session, filter) {
  if (filter === 'all') return true;
  const avg = avgScore(session);
  if (filter === 'high') return avg >= 80;
  if (filter === 'mid')  return avg >= 60 && avg < 80;
  if (filter === 'low')  return avg < 60;
  return true;
}
function hexA(hex, alpha) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}
function shade(hex, amt) {
  const { r, g, b } = parseHex(hex);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + 255 * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function parseHex(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

/* ── Sidebar ── */
function Sidebar() {
  const items = [
    { id: 'reports',  label: 'My Reports',     icon: IconFile },
    { id: 'history',  label: 'Session History', icon: IconHistory, active: true },
    { id: 'progress', label: 'My Progress',     icon: IconTrend },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="mark">K</div>
        <div className="text">
          <div className="name">SpeakIQ</div>
          <div className="org">Hanoi K-Lab</div>
        </div>
      </div>
      <div className="sb-section">Student</div>
      <nav className="sb-nav">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <a key={it.id} className={`sb-item${it.active ? ' active' : ''}`}
               href={it.id === 'reports' ? 'Session%20Report.html' : undefined}>
              <span className="ico"><Icon size={17} /></span>
              <span>{it.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="avatar">{STUDENT.initials}</div>
          <div className="meta">
            <div className="name">{STUDENT.name}</div>
            <div className="role">{STUDENT.code}</div>
          </div>
          <IconChev size={14} />
        </div>
      </div>
    </aside>
  );
}

/* ── FilterBar ── */
function FilterBar({ filters, onChange, count, total }) {
  const isActive = filters.dateFrom || filters.dateTo || filters.teacher !== 'all' || filters.score !== 'all';
  const reset = () => onChange({ dateFrom: '', dateTo: '', teacher: 'all', score: 'all' });
  return (
    <div className="filter-bar">
      <span className="fl-label">Filter</span>

      <div className="fl-date-group">
        <input
          type="date" className="fl-input" value={filters.dateFrom}
          max={filters.dateTo || undefined}
          onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
        />
        <span className="fl-arrow">→</span>
        <input
          type="date" className="fl-input" value={filters.dateTo}
          min={filters.dateFrom || undefined}
          onChange={e => onChange({ ...filters, dateTo: e.target.value })}
        />
      </div>

      <div className="fl-vsep"></div>

      <select className="fl-select" value={filters.teacher}
        onChange={e => onChange({ ...filters, teacher: e.target.value })}>
        {TEACHER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <select className="fl-select" value={filters.score}
        onChange={e => onChange({ ...filters, score: e.target.value })}>
        {SCORE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {isActive && (
        <button className="fl-reset" onClick={reset}>Reset filters</button>
      )}

      <div className="fl-count">
        {count === total
          ? <><b>{total}</b> sessions</>
          : <><b>{count}</b> of {total} sessions</>
        }
      </div>
    </div>
  );
}

/* ── ScorePill ── */
function ScorePill({ kind, score }) {
  return (
    <span className={`sc-pill ${bandClass(score)}`}>
      <span className="ptype">{kind === 'speaking' ? 'Speaking' : 'Pronunciation'}</span>
      <span className="pval">{score}</span>
    </span>
  );
}

/* ── SessionCard ── */
function SessionCard({ session, compact }) {
  const durParts = [];
  if (session.types.includes('speaking'))      durParts.push(`Speaking ${session.durations.speaking} min`);
  if (session.types.includes('pronunciation')) durParts.push(`Pronunciation ${session.durations.pronunciation} min`);

  return (
    <a className="session-card" href="Session%20Report.html" role="listitem">
      <div className={`sc-main${compact ? ' compact' : ''}`}>

        {/* Date block */}
        <div className="sc-date">
          <span className="dow">{session.dayOfWeek}</span>
          <span className="d-date">{session.dateLabel}</span>
          <span className="d-yr">{session.yearLabel}</span>
        </div>

        <div className="sc-vsep"></div>

        {/* Teacher */}
        <div className="sc-teacher-info">
          <div className="sc-avatar" style={{ background: TEACHER_GRADIENTS[session.teacher.id] }}>
            {session.teacher.initials}
          </div>
          <span className="sc-tname">{session.teacher.name}</span>
        </div>

        {/* Duration */}
        <div className="sc-dur">
          {durParts.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="dur-sep">·</span>}
              <span className="dur-seg">{p}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="sc-grow"></div>

        {/* Score pills */}
        <div className="sc-scores">
          {session.scores.speaking     !== undefined && <ScorePill kind="speaking"      score={session.scores.speaking} />}
          {session.scores.pronunciation !== undefined && <ScorePill kind="pronunciation" score={session.scores.pronunciation} />}
        </div>

        {/* Chevron */}
        <div className="sc-chev"><IconChevR size={16} /></div>
      </div>

      {/* AI summary strip */}
      <div className="sc-summary">
        <span className="sum-ico"><IconSparkle size={13} /></span>
        <span>{session.summary}</span>
      </div>
    </a>
  );
}

/* ── EmptyState ── */
function EmptyState({ hasFilters }) {
  return (
    <div className="empty-state">
      <div className="es-ill">
        <IconHistory size={28} />
      </div>
      <h2>{hasFilters ? 'No sessions match your filters' : 'No sessions yet'}</h2>
      <p>
        {hasFilters
          ? 'Try adjusting or resetting your filters to see more sessions.'
          : 'Your teacher will upload your first session soon. Check back after your next lesson.'}
      </p>
      {hasFilters && (
        <button className="btn btn-outline" style={{ marginTop: 18 }}>Reset filters</button>
      )}
    </div>
  );
}

/* ── App ── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', teacher: 'all', score: 'all' });
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => SESSIONS.filter(s => {
    if (filters.dateFrom && s.dateIso < filters.dateFrom) return false;
    if (filters.dateTo   && s.dateIso > filters.dateTo)   return false;
    if (filters.teacher !== 'all' && s.teacher.id !== filters.teacher) return false;
    if (!matchesScore(s, filters.score)) return false;
    return true;
  }), [filters]);

  const isFiltersActive = !!(filters.dateFrom || filters.dateTo || filters.teacher !== 'all' || filters.score !== 'all');
  const visible   = filtered.slice(0, visibleCount);
  const hasMore   = visibleCount < filtered.length;
  const remaining = filtered.length - visibleCount;

  const handleFiltersChange = (f) => { setFilters(f); setVisibleCount(8); };

  const styleVars = {
    '--primary':      t.primary,
    '--primary-600':  shade(t.primary, -0.10),
    '--primary-700':  shade(t.primary, -0.18),
    '--focus-ring':   hexA(t.primary, 0.18),
    '--primary-tint': hexA(t.primary, 0.08),
    '--primary-tint-2': hexA(t.primary, 0.20),
  };

  return (
    <div className="app" style={styleVars}>
      <Sidebar />
      <main className="main">

        {/* Top bar */}
        <div className="topbar">
          <div className="breadcrumb">
            <span>Student</span>
            <span className="sep">/</span>
            <span className="now">Session History</span>
          </div>
          <div className="top-actions">
            <button className="top-btn"><IconHelp size={15} /> Help</button>
            <button className="top-btn" style={{ width: 34, justifyContent: 'center', padding: 0 }}>
              <IconBell size={16} />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onChange={handleFiltersChange}
          count={filtered.length}
          total={SESSIONS.length}
        />

        {/* Content */}
        <div className="sessions-page">
          <div className="page-head-row">
            <div>
              <h1>My Sessions</h1>
              {isFiltersActive && (
                <div className="head-sub">
                  Showing {filtered.length} of {SESSIONS.length} sessions
                </div>
              )}
            </div>
          </div>

          {visible.length > 0 ? (
            <>
              <div className="session-list" role="list">
                {visible.map(s => (
                  <SessionCard key={s.id} session={s} compact={t.cardDensity === 'compact'} />
                ))}
              </div>
              {hasMore && (
                <div className="load-more-row">
                  <button
                    className="btn btn-outline"
                    onClick={() => setVisibleCount(v => v + 8)}
                  >
                    Load {Math.min(8, remaining)} more session{remaining !== 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState hasFilters={isFiltersActive} />
          )}
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor
          label="Primary blue"
          value={t.primary}
          options={PRIMARY_OPTIONS}
          onChange={v => setTweak('primary', v)}
        />
        <TweakSection label="Cards" />
        <TweakToggle
          label="Show AI summary"
          value={t.showSummary}
          onChange={v => setTweak('showSummary', v)}
        />
        <TweakRadio
          label="Density"
          value={t.cardDensity}
          options={[{ value: 'normal', label: 'Normal' }, { value: 'compact', label: 'Compact' }]}
          onChange={v => setTweak('cardDensity', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
