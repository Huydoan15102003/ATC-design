const { useState, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#2563eb",
  "view": "grid",
  "openClass": null
}/*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#2563eb', '#1d4ed8', '#1f6feb', '#3b6cf6'];

/* local IconGrid (not in shared icon files) */
const IconGrid = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

const TEACHER = { name: 'Seo-yeon Kim', initials: 'SK', role: 'Senior Coach' };

/* ─────────────── DATA ─────────────── */
const STUDENTS = {
  nh: { id: 'nh', name: 'Nguyễn Hà Linh',  code: 'KL-1042', avg: 79, sessions: 14, lastActive: '2h ago',  level: 'IELTS · 6.0' },
  tp: { id: 'tp', name: 'Trần Phương Anh', code: 'KL-1058', avg: 84, sessions: 18, lastActive: 'Yesterday', level: 'IELTS · 6.5' },
  pk: { id: 'pk', name: 'Phạm Khánh Vy',   code: 'KL-1083', avg: 72, sessions: 9,  lastActive: '4h ago',  level: 'IELTS · 5.5' },
  lq: { id: 'lq', name: 'Lê Minh Quân',    code: 'KL-1071', avg: 88, sessions: 22, lastActive: '30m ago', level: 'Business · C1' },
  vq: { id: 'vq', name: 'Vũ Quỳnh Anh',    code: 'KL-1105', avg: 91, sessions: 19, lastActive: '1h ago',  level: 'IELTS · 7.0' },
  dh: { id: 'dh', name: 'Đỗ Hoàng Nam',    code: 'KL-1099', avg: 68, sessions: 7,  lastActive: '3d ago',  level: 'Conversation · B2' },
  bn: { id: 'bn', name: 'Bùi Đăng Khoa',   code: 'KL-1057', avg: 74, sessions: 11, lastActive: '6h ago',  level: 'IELTS · 6.0' },
  ht: { id: 'ht', name: 'Hoàng Trà My',    code: 'KL-1118', avg: 58, sessions: 4,  lastActive: '1d ago',  level: 'Conversation · B1' },
};

const CLASSES = [
  {
    id: 'ielts-am',
    name: 'IELTS Speaking · Morning',
    level: 'Intermediate',
    sched: 'Mon, Wed, Fri · 09:00',
    color: ['#2563eb', '#6ea8ff'],
    studentIds: ['nh', 'tp', 'pk'],
    lastSession: 'May 14, 2026',
    lastSessionISO: '2026-05-14',
  },
  {
    id: 'biz-eng',
    name: 'Business English · Evening',
    level: 'Advanced',
    sched: 'Tue, Thu · 19:00',
    color: ['#0f766e', '#5eead4'],
    studentIds: ['lq', 'vq'],
    lastSession: 'May 13, 2026',
    lastSessionISO: '2026-05-13',
  },
  {
    id: 'conv-b2',
    name: 'Conversation · B2',
    level: 'Intermediate',
    sched: 'Sat · 10:00',
    color: ['#7c3aed', '#c4b5fd'],
    studentIds: ['dh', 'bn'],
    lastSession: 'May 11, 2026',
    lastSessionISO: '2026-05-11',
  },
  {
    id: 'found-a2',
    name: 'Foundation · A2',
    level: 'Beginner',
    sched: 'Mon, Wed · 17:30',
    color: ['#b45309', '#fbbf24'],
    studentIds: ['ht'],
    lastSession: 'May 06, 2026',
    lastSessionISO: '2026-05-06',
  },
];

/* ── helpers ── */
function bandClass(n) {
  if (n >= 80) return 'good';
  if (n >= 60) return 'warn';
  return 'bad';
}
function classAvg(c) {
  if (c.studentIds.length === 0) return 0;
  const sum = c.studentIds.reduce((a, id) => a + (STUDENTS[id]?.avg || 0), 0);
  return Math.round(sum / c.studentIds.length);
}
function classSessions(c) {
  return c.studentIds.reduce((a, id) => a + (STUDENTS[id]?.sessions || 0), 0);
}
function hexA(hex, alpha) { const { r, g, b } = parseHex(hex); return `rgba(${r},${g},${b},${alpha})`; }
function shade(hex, amt) { const { r, g, b } = parseHex(hex); const f = (c) => Math.max(0, Math.min(255, Math.round(c + 255 * amt))); return `rgb(${f(r)},${f(g)},${f(b)})`; }
function parseHex(hex) { const h = hex.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }; }

/* ─────────────── SIDEBAR ─────────────── */
function Sidebar() {
  const items = [
    { id: 'dash', label: 'Dashboard',                 icon: IconHome },
    { id: 'up',   label: 'Upload Session',            icon: IconUpload },
    { id: 'pron', label: 'Pronunciation Assessment',  icon: IconMic },
    { id: 'cls',  label: 'My Classes',                icon: IconUsers, active: true },
    { id: 'hist', label: 'Session History',           icon: IconHistory },
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
      <div className="sb-section">Teacher</div>
      <nav className="sb-nav">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <a key={it.id} className={`sb-item ${it.active ? 'active' : ''}`}>
              <span className="ico"><Icon size={17} /></span>
              <span>{it.label}</span>
              {it.badge && <span className="sb-badge">{it.badge}</span>}
            </a>
          );
        })}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="avatar">{TEACHER.initials}</div>
          <div className="meta">
            <div className="name">{TEACHER.name}</div>
            <div className="role">{TEACHER.role}</div>
          </div>
          <IconChev size={14} />
        </div>
      </div>
    </aside>
  );
}

/* ─────────────── PAGE HEAD ─────────────── */
function PageHead({ classCount, studentCount }) {
  return (
    <div className="page-head">
      <div className="ph-left">
        <div className="ph-eyebrow">Teacher · K-Lab Center</div>
        <h1>My Classes</h1>
        <div className="ph-meta">
          <b>{classCount}</b>&nbsp;active classes
          <span className="dot">·</span>
          <b>{studentCount}</b>&nbsp;students
          <span className="dot">·</span>
          <span>Updated <b>just now</b></span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline">
          <IconExport size={14} />
          Export CSV
        </button>
        <button className="btn btn-primary">
          <IconPlus size={14} />
          New Class
        </button>
      </div>
    </div>
  );
}

/* ─────────────── TOOLBAR ─────────────── */
function Toolbar({ query, setQuery, levelFilter, setLevelFilter, view, setView }) {
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <span className="ico"><IconSearch size={15} /></span>
        <input
          type="text"
          placeholder="Search classes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        className={`filter-chip ${levelFilter !== 'all' ? 'active' : ''}`}
        onClick={() => {
          const next = levelFilter === 'all' ? 'Beginner' :
                       levelFilter === 'Beginner' ? 'Intermediate' :
                       levelFilter === 'Intermediate' ? 'Advanced' : 'all';
          setLevelFilter(next);
        }}
      >
        <IconFilter size={14} />
        Level
        <span className="val">{levelFilter === 'all' ? 'All' : levelFilter}</span>
        <IconChev size={12} className="chev" />
      </button>
      <div className="spacer" />
      <div className="view-toggle">
        <button className={`vt-btn ${view === 'grid' ? 'on' : ''}`} onClick={() => setView('grid')} aria-label="Grid view">
          <IconGrid size={14} />
        </button>
        <button className={`vt-btn ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')} aria-label="List view">
          <IconList size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────── CLASS CARD ─────────────── */
function ClassCard({ cls, onOpen }) {
  const avg = classAvg(cls);
  const sessions = classSessions(cls);
  return (
    <div className="class-card" onClick={() => onOpen(cls.id)}>
      <div className="cc-top">
        <div className="cc-mark" style={{ background: `linear-gradient(135deg, ${cls.color[0]}, ${cls.color[1]})` }}>
          <IconUsers size={20} />
        </div>
        <div className="cc-meta">
          <div className="cc-name">{cls.name}</div>
          <div className="cc-sub">
            <span>{cls.level}</span>
            <span className="dot">·</span>
            <span>{cls.sched}</span>
          </div>
        </div>
      </div>
      <div className="cc-stats">
        <div className="cc-stat">
          <div className="k">Students</div>
          <div className="v">{cls.studentIds.length}</div>
        </div>
        <div className="cc-stat">
          <div className="k">Avg score</div>
          <div className="v">
            {avg > 0 ? (
              <span className={`score-pill ${bandClass(avg)}`}>{avg}<span className="d">/100</span></span>
            ) : <span style={{ color: 'var(--muted-3)' }}>—</span>}
          </div>
        </div>
        <div className="cc-stat">
          <div className="k">Sessions</div>
          <div className="v">{sessions}</div>
        </div>
      </div>
      <div className="cc-foot">
        <span className="cc-last">
          <IconClock size={12} />
          Last session · <b>{cls.lastSession}</b>
        </span>
        <span className="cc-open">
          Open class <IconChevR size={13} />
        </span>
      </div>
    </div>
  );
}

/* ─────────────── CLASS LIST (alt view) ─────────────── */
function ClassList({ rows, onOpen }) {
  return (
    <div className="data-card">
      <table className="data classes">
        <colgroup>
          <col style={{ width: '30%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '6%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Class</th>
            <th>Level</th>
            <th>Students</th>
            <th>Avg score</th>
            <th>Schedule</th>
            <th>Last session</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((cls) => {
            const avg = classAvg(cls);
            return (
              <tr key={cls.id} className="clickable" onClick={() => onOpen(cls.id)}>
                <td>
                  <div className="ucell">
                    <div className="class-mark-sm" style={{ background: `linear-gradient(135deg, ${cls.color[0]}, ${cls.color[1]})` }}>
                      <IconUsers size={14} />
                    </div>
                    <div className="meta">
                      <div className="name">{cls.name}</div>
                      <div className="sub">{cls.sched}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`level-pill ${cls.level.toLowerCase()}`}>{cls.level}</span>
                </td>
                <td><span className="num-cell">{cls.studentIds.length}</span></td>
                <td>
                  {avg > 0 ? (
                    <span className={`score-pill ${bandClass(avg)}`}>{avg}<span className="d">/100</span></span>
                  ) : <span style={{ color: 'var(--muted-3)', fontSize: 12 }}>—</span>}
                </td>
                <td><span style={{ color: 'var(--muted)', fontSize: 12.5 }}>{cls.sched}</span></td>
                <td><span style={{ color: 'var(--muted)', fontSize: 12.5 }}>{cls.lastSession}</span></td>
                <td>
                  <span className="row-open"><IconChevR size={15} /></span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────── CLASS DETAIL DRAWER ─────────────── */
function ClassDrawer({ cls, onClose }) {
  const students = cls.studentIds.map((id) => STUDENTS[id]).filter(Boolean);
  const avg = classAvg(cls);
  const totalSessions = classSessions(cls);

  return (
    <>
      <div className="drawer-head">
        <div className="left">
          <div className="cls-avatar-lg" style={{ background: `linear-gradient(135deg, ${cls.color[0]}, ${cls.color[1]})` }}>
            <IconUsers size={22} />
          </div>
          <div className="meta">
            <div className="name">{cls.name}</div>
            <div className="sub">{cls.level} · {cls.sched}</div>
            <div className="pills">
              <span className="level-pill intermediate">{cls.level}</span>
              <span className="status-pill active">Active</span>
            </div>
          </div>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
          <IconX size={15} />
        </button>
      </div>

      <div className="drawer-body" style={{ paddingTop: 4 }}>
        <div className="stat-grid">
          <div className="stat-tile">
            <div className="lbl">Students</div>
            <div className="val">{students.length}</div>
          </div>
          <div className="stat-tile">
            <div className="lbl">Avg score</div>
            <div className={`val ${avg > 0 ? bandClass(avg) : ''}`}>{avg > 0 ? avg : '—'}</div>
          </div>
          <div className="stat-tile">
            <div className="lbl">Total sessions</div>
            <div className="val">{totalSessions}</div>
          </div>
          <div className="stat-tile">
            <div className="lbl">Last session</div>
            <div className="val" style={{ fontSize: 14 }}>{cls.lastSession}</div>
          </div>
        </div>

        <div className="drawer-sub-h">
          Students in this class
          <span className="right">{students.length} total</span>
        </div>

        <div className="cls-student-list">
          {students.length === 0 ? (
            <div className="cls-empty">
              <div className="es-ill"><IconUsers size={22} /></div>
              <div className="es-title">No students yet</div>
              <div className="es-sub">Add a student to start tracking sessions for this class.</div>
            </div>
          ) : (
            <table className="data students" style={{ marginTop: 4 }}>
              <colgroup>
                <col style={{ width: '34%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Level</th>
                  <th>Sessions</th>
                  <th>Avg score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="clickable">
                    <td>
                      <div className="ucell">
                        <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg, ${cls.color[0]}, ${cls.color[1]})` }}>
                          {s.name.split(' ').slice(-2).map(p => p[0]).join('')}
                        </div>
                        <div className="meta">
                          <div className="name">{s.name}</div>
                          <div className="sub">{s.code}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s.level}</span></td>
                    <td><span className="num-cell">{s.sessions}</span></td>
                    <td>
                      <span className={`score-pill ${bandClass(s.avg)}`}>{s.avg}<span className="d">/100</span></span>
                    </td>
                    <td><span className="row-open"><IconChevR size={14} /></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="drawer-foot">
        <button className="btn btn-outline btn-sm">
          <IconEdit size={13} /> Edit class
        </button>
        <div className="spacer" />
        <button className="btn btn-primary btn-sm">
          <IconPlus size={13} /> Add student
        </button>
      </div>
    </>
  );
}

/* ─────────────── APP ─────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [view, setView] = useState(t.view);
  const [drawerOpen, setDrawerOpen] = useState(t.openClass || null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLASSES.filter((c) =>
      (levelFilter === 'all' || c.level === levelFilter) &&
      (!q || c.name.toLowerCase().includes(q))
    );
  }, [query, levelFilter]);

  const totalStudents = CLASSES.reduce((a, c) => a + c.studentIds.length, 0);
  const openCls = drawerOpen ? CLASSES.find((c) => c.id === drawerOpen) : null;

  const open  = (id) => { setDrawerOpen(id); setTweak('openClass', id); };
  const close = ()    => { setDrawerOpen(null); setTweak('openClass', null); };

  const styleVars = {
    '--primary':       t.primary,
    '--primary-600':   shade(t.primary, -0.10),
    '--primary-700':   shade(t.primary, -0.18),
    '--focus-ring':    hexA(t.primary, 0.18),
    '--primary-tint':  hexA(t.primary, 0.07),
    '--primary-tint-2':hexA(t.primary, 0.18),
  };

  return (
    <div className="app" style={styleVars}>
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div className="breadcrumb">
            <span>Teacher</span>
            <span className="sep">/</span>
            <span className="now">My Classes</span>
          </div>
          <div className="top-actions">
            <button className="top-btn"><IconHelp size={15} /> Help</button>
            <button className="top-btn" aria-label="Notifications" style={{ width: 34, justifyContent: 'center', padding: 0 }}>
              <IconBell size={16} />
            </button>
          </div>
        </div>

        <div className="page">
          <PageHead classCount={CLASSES.length} studentCount={totalStudents} />
          <Toolbar
            query={query} setQuery={setQuery}
            levelFilter={levelFilter} setLevelFilter={setLevelFilter}
            view={view} setView={(v) => { setView(v); setTweak('view', v); }}
          />

          {view === 'grid' ? (
            <div className="class-grid">
              {rows.map((c) => <ClassCard key={c.id} cls={c} onOpen={open} />)}
            </div>
          ) : (
            <ClassList rows={rows} onOpen={open} />
          )}

          {rows.length === 0 && (
            <div className="empty-rows">
              <div className="es-ill"><IconUsers size={22} /></div>
              <div className="es-title">No classes match your filters</div>
            </div>
          )}
        </div>
      </main>

      {openCls && (
        <>
          <div className="drawer-scrim" onClick={close} />
          <aside className="drawer">
            <ClassDrawer cls={openCls} onClose={close} />
          </aside>
        </>
      )}

      <TweaksPanel>
        <TweakSection label="View" />
        <TweakRadio
          label="Layout"
          value={view}
          options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
          onChange={(v) => { setView(v); setTweak('view', v); }}
        />
        <TweakRadio
          label="Drawer"
          value={drawerOpen ? 'open' : 'closed'}
          options={[{ value: 'closed', label: 'Closed' }, { value: 'open', label: 'Open' }]}
          onChange={(v) => v === 'open' ? open('ielts-am') : close()}
        />
        <TweakSection label="Theme" />
        <TweakColor
          label="Primary blue"
          value={t.primary}
          options={PRIMARY_OPTIONS}
          onChange={(v) => setTweak('primary', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
