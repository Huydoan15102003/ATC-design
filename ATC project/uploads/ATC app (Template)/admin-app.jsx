// Admin — User Management
// Layout: Sidebar + main with topbar, page-head, tabs, data table, side drawer.

const { useState, useMemo, useEffect, useRef } = React;

/* ─────────────── TWEAK DEFAULTS ─────────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "activeTab": "teachers",
  "drawerTab": "overview",
  "drawerOpen": "linh"
}/*EDITMODE-END*/;

/* ─────────────── MOCK DATA ─────────────── */
const TEACHERS = [
  {
    id: 'park',  name: 'Ms. Park Ji Yeon',  initials: 'PJ', code: 'TCH-021',
    email: 'park.jy@klab.edu.vn',
    students: 12, sessions: 64, avg: 84, status: 'active',
    joined: 'Aug 2024', specialty: 'IELTS Speaking · Business English',
  },
  {
    id: 'thanhha', name: 'Lê Thanh Hà',     initials: 'LH', code: 'TCH-018',
    email: 'le.thanhha@klab.edu.vn',
    students: 9,  sessions: 52, avg: 79, status: 'active',
    joined: 'Mar 2024', specialty: 'Pronunciation Coach',
  },
  {
    id: 'ducminh', name: 'Nguyễn Đức Minh', initials: 'DM', code: 'TCH-014',
    email: 'duc.minh@klab.edu.vn',
    students: 14, sessions: 71, avg: 88, status: 'active',
    joined: 'Nov 2023', specialty: 'Advanced Conversation',
  },
  {
    id: 'khanhvy', name: 'Trần Khánh Vy',   initials: 'KV', code: 'TCH-026',
    email: 'tran.khanhvy@klab.edu.vn',
    students: 8,  sessions: 41, avg: 76, status: 'active',
    joined: 'Jan 2025', specialty: 'Beginner & Foundation',
  },
  {
    id: 'quocbao', name: 'Vũ Quốc Bảo',     initials: 'QB', code: 'TCH-009',
    email: 'vu.quocbao@klab.edu.vn',
    students: 11, sessions: 58, avg: 72, status: 'active',
    joined: 'Sep 2023', specialty: 'TOEIC Coaching',
  },
  {
    id: 'maiphuong', name: 'Đỗ Mai Phương', initials: 'MP', code: 'TCH-003',
    email: 'do.maiphuong@klab.edu.vn',
    students: 0,  sessions: 4,  avg: 0, status: 'inactive',
    joined: 'Jun 2023', specialty: 'Kids English (on leave)',
  },
];

const CLASSES = [
  { id: 'cls-ielts-pm',  name: 'IELTS Speaking · Afternoon', level: 'intermediate', teacher: 'park',    studentIds: ['linh', 'khoa', 'ngan'] },
  { id: 'cls-conv-adv',  name: 'Advanced Conversation',          level: 'advanced',     teacher: 'ducminh', studentIds: ['anh', 'thu'] },
  { id: 'cls-found-a2',  name: 'Foundation · A2',             level: 'beginner',     teacher: 'khanhvy', studentIds: ['mai'] },
  { id: 'cls-pron-lab',  name: 'Pronunciation Lab',              level: 'intermediate', teacher: 'thanhha', studentIds: ['son', 'long'] },
  { id: 'cls-toeic-ev',  name: 'TOEIC Prep · Evening',         level: 'intermediate', teacher: 'quocbao', studentIds: ['nam', 'huyen'] },
];

const STUDENTS = [
  { id: 'linh',    name: 'Nguyễn Hà Linh',   initials: 'HL', code: 'KL-1042',
    email: 'nguyen.halinh@gmail.com', classId: 'cls-ielts-pm',
    level: 'intermediate', sessions: 14, avg: 79, lastActive: '2h ago',  status: 'active' },
  { id: 'anh',     name: 'Phạm Minh Anh',    initials: 'MA', code: 'KL-1018',
    email: 'mainh.pham@gmail.com', classId: 'cls-conv-adv',
    level: 'advanced',     sessions: 22, avg: 88, lastActive: 'Yesterday', status: 'active' },
  { id: 'khoa',    name: 'Bùi Đăng Khoa',    initials: 'DK', code: 'KL-1057',
    email: 'buidangkhoa@outlook.com', classId: 'cls-ielts-pm',
    level: 'intermediate', sessions: 9,  avg: 74, lastActive: '4h ago',  status: 'active' },
  { id: 'mai',     name: 'Hoàng Trà My',     initials: 'TM', code: 'KL-1071',
    email: 'tramy.hoang@gmail.com', classId: 'cls-found-a2',
    level: 'beginner',     sessions: 5,  avg: 62, lastActive: '1d ago',  status: 'active' },
  { id: 'son',     name: 'Trần Văn Sơn',     initials: 'VS', code: 'KL-0996',
    email: 'tvson@klabmail.com', classId: 'cls-pron-lab',
    level: 'intermediate', sessions: 17, avg: 81, lastActive: '6h ago',  status: 'active' },
  { id: 'thu',     name: 'Lê Quỳnh Thư',     initials: 'QT', code: 'KL-1083',
    email: 'quynhthu.le@gmail.com', classId: 'cls-conv-adv',
    level: 'advanced',     sessions: 19, avg: 91, lastActive: '30m ago', status: 'active' },
  { id: 'nam',     name: 'Đinh Hoàng Nam',   initials: 'HN', code: 'KL-1029',
    email: 'dinh.hoangnam@gmail.com', classId: 'cls-toeic-ev',
    level: 'intermediate', sessions: 11, avg: 68, lastActive: '3d ago',  status: 'active' },
  { id: 'ngan',    name: 'Vũ Bảo Ngân',      initials: 'BN', code: 'KL-1064',
    email: 'baongan.vu@gmail.com', classId: 'cls-ielts-pm',
    level: 'beginner',     sessions: 3,  avg: 58, lastActive: '5h ago',  status: 'active' },
  { id: 'long',    name: 'Tạ Quốc Long',     initials: 'QL', code: 'KL-1008',
    email: 'taquoclong@gmail.com', classId: 'cls-pron-lab',
    level: 'advanced',     sessions: 24, avg: 86, lastActive: '1h ago',  status: 'active' },
  { id: 'huyen',   name: 'Phan Thu Huyền',   initials: 'TH', code: 'KL-0871',
    email: 'huyen.phan@klabmail.com', classId: 'cls-toeic-ev',
    level: 'intermediate', sessions: 7,  avg: 71, lastActive: '2w ago',  status: 'inactive' },
];

// Mock sessions per student (used in drawer)
const SESSIONS_BY_STUDENT = {
  linh:  [
    { id: 1, title: 'Session #14 · 1-on-1 Coaching', when: 'May 14, 2026 · 50 min', score: 82, band: 'good' },
    { id: 2, title: 'Session #13 · IELTS Part 2',    when: 'May 07, 2026 · 45 min', score: 76, band: 'warn' },
    { id: 3, title: 'Session #12 · Pronunciation',   when: 'Apr 30, 2026 · 35 min', score: 78, band: 'warn' },
    { id: 4, title: 'Session #11 · Free Talk',       when: 'Apr 23, 2026 · 50 min', score: 81, band: 'good' },
    { id: 5, title: 'Session #10 · Business Email',  when: 'Apr 16, 2026 · 40 min', score: 73, band: 'warn' },
  ],
  default: [
    { id: 1, title: 'Most recent session',   when: 'May 12, 2026 · 50 min', score: 80, band: 'good' },
    { id: 2, title: 'Previous session',      when: 'May 05, 2026 · 45 min', score: 75, band: 'warn' },
    { id: 3, title: 'Earlier this month',    when: 'Apr 28, 2026 · 50 min', score: 78, band: 'warn' },
    { id: 4, title: 'Foundation review',     when: 'Apr 21, 2026 · 35 min', score: 70, band: 'warn' },
  ],
};

// Mock recent sessions per teacher (drawer)
const SESSIONS_BY_TEACHER = {
  park: [
    { id: 1, title: 'Nguyễn Hà Linh · Session #14', when: 'May 14, 2026 · 50 min', score: 82, band: 'good' },
    { id: 2, title: 'Bùi Đăng Khoa · Session #9',   when: 'May 13, 2026 · 45 min', score: 74, band: 'warn' },
    { id: 3, title: 'Vũ Bảo Ngân · Session #3',     when: 'May 12, 2026 · 30 min', score: 60, band: 'warn' },
    { id: 4, title: 'Nguyễn Hà Linh · Session #13', when: 'May 07, 2026 · 45 min', score: 76, band: 'warn' },
    { id: 5, title: 'Bùi Đăng Khoa · Session #8',   when: 'May 06, 2026 · 50 min', score: 79, band: 'warn' },
  ],
  default: [
    { id: 1, title: 'Recent student session', when: 'May 12, 2026 · 45 min', score: 82, band: 'good' },
    { id: 2, title: 'Previous student session', when: 'May 09, 2026 · 50 min', score: 77, band: 'warn' },
    { id: 3, title: 'Earlier this month', when: 'May 04, 2026 · 40 min', score: 80, band: 'good' },
  ],
};

/* ─────────────── HELPERS ─────────────── */
function band(value) {
  if (value >= 80) return 'good';
  if (value >= 65) return 'warn';
  return 'bad';
}

// Deterministic avatar gradient from initials (so the same name always
// gets the same colour, but they vary across the table).
const PALETTES = [
  ['#2563eb', '#6ea8ff'],
  ['#0f766e', '#5eead4'],
  ['#7c3aed', '#c4b5fd'],
  ['#b45309', '#fbbf24'],
  ['#be123c', '#fb7185'],
  ['#1e40af', '#60a5fa'],
  ['#065f46', '#34d399'],
  ['#4338ca', '#a78bfa'],
  ['#9a3412', '#f97316'],
  ['#475569', '#94a3b8'],
];
function paletteFor(seed) {
  let n = 0;
  for (const c of String(seed)) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTES[n % PALETTES.length];
}

function Avatar({ initials, seed, size = 'md', mono = false }) {
  const [a, b] = paletteFor(seed || initials);
  const bg = mono ? 'linear-gradient(135deg, #0f172a, #334155)' : `linear-gradient(135deg, ${a}, ${b})`;
  return (
    <div className={`avatar ${size === 'lg' ? 'lg' : ''}`} style={{ background: bg }}>
      {initials}
    </div>
  );
}

/* ─────────────── SIDEBAR ─────────────── */
function Sidebar() {
  const main = [
    { id: 'dash',  label: 'Dashboard', icon: IconDashboard },
    { id: 'users', label: 'Users',     icon: IconUsers, active: true, count: TEACHERS.length + STUDENTS.length },
    { id: 'sess',  label: 'Sessions',  icon: IconHistory },
    { id: 'rep',   label: 'Reports',   icon: IconFile },
  ];
  const sys = [
    { id: 'set',   label: 'Settings',  icon: IconSettings },
    { id: 'sec',   label: 'Security',  icon: IconShield },
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
      <div className="sb-section">Admin</div>
      <nav className="sb-nav">
        {main.map((it) => {
          const Icon = it.icon;
          return (
            <a key={it.id} className={`sb-item ${it.active ? 'active' : ''}`}>
              <span className="ico"><Icon size={17} /></span>
              <span>{it.label}</span>
              {it.count != null && <span className="sb-count">{it.count}</span>}
              {it.badge && <span className="sb-badge">{it.badge}</span>}
            </a>
          );
        })}
      </nav>
      <div className="sb-section">System</div>
      <nav className="sb-nav">
        {sys.map((it) => {
          const Icon = it.icon;
          return (
            <a key={it.id} className="sb-item">
              <span className="ico"><Icon size={17} /></span>
              <span>{it.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #0f172a, #334155)' }}>AT</div>
          <div className="meta">
            <div className="name">Anh Tuấn</div>
            <div className="role">Center admin</div>
          </div>
          <IconChev size={14} />
        </div>
      </div>
    </aside>
  );
}

/* ─────────────── PAGE HEAD ─────────────── */
function PageHead({ activeTab, onInvite }) {
  const isTeachers = activeTab === 'teachers';
  return (
    <div className="page-head">
      <div className="ph-left">
        <div className="ph-eyebrow">Admin · K-Lab Center</div>
        <h1>User Management</h1>
        <div className="ph-meta">
          <b>{TEACHERS.filter((t) => t.status === 'active').length}</b>&nbsp;active teachers
          <span className="dot">·</span>
          <b>{STUDENTS.filter((s) => s.status === 'active').length}</b>&nbsp;active students
          <span className="dot">·</span>
          <span>Updated <b>2 min ago</b></span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline">
          <IconExport size={14} />
          Export CSV
        </button>
        <button className="btn btn-primary" onClick={onInvite}>
          {isTeachers ? <IconMail size={14} /> : <IconPlus size={14} />}
          {isTeachers ? 'Invite Teacher' : 'Add Student'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────── TOOLBAR ─────────────── */
function Toolbar({ activeTab, query, setQuery, levelFilter, setLevelFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <span className="ico"><IconSearch size={15} /></span>
        <input
          type="text"
          placeholder={activeTab === 'teachers' ? 'Search teachers, email…' : 'Search students, code…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {activeTab === 'students' && (
        <button
          className={`filter-chip ${levelFilter !== 'all' ? 'active' : ''}`}
          onClick={() => {
            const next = levelFilter === 'all' ? 'beginner' :
                         levelFilter === 'beginner' ? 'intermediate' :
                         levelFilter === 'intermediate' ? 'advanced' : 'all';
            setLevelFilter(next);
          }}
        >
          <IconFilter size={14} />
          Level
          <span className="val">{levelFilter === 'all' ? 'All' : levelFilter[0].toUpperCase() + levelFilter.slice(1)}</span>
          <IconChev size={12} className="chev" />
        </button>
      )}
      <button
        className={`filter-chip ${statusFilter !== 'all' ? 'active' : ''}`}
        onClick={() => {
          const next = statusFilter === 'all' ? 'active' :
                       statusFilter === 'active' ? 'inactive' : 'all';
          setStatusFilter(next);
        }}
      >
        <IconFilter size={14} />
        Status
        <span className="val">{statusFilter === 'all' ? 'All' : statusFilter[0].toUpperCase() + statusFilter.slice(1)}</span>
        <IconChev size={12} className="chev" />
      </button>
      <div className="spacer" />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.04em' }}>
        SORT BY
      </span>
      <button className="filter-chip">
        Last active
        <IconChev size={12} className="chev" />
      </button>
    </div>
  );
}

/* ─────────────── ROW MENU ─────────────── */
function RowMenu({ items, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div className="row-actions" ref={ref}>
      <button
        className={`icon-btn ${open ? 'on' : ''}`}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-label="Row actions"
      >
        <IconDots size={16} />
      </button>
      {open && (
        <div className="menu" onClick={(e) => e.stopPropagation()}>
          {items.map((it, i) => it.sep ? (
            <div key={i} className="menu-sep" />
          ) : (
            <button
              key={i}
              className={`menu-item ${it.danger ? 'danger' : ''}`}
              onClick={() => { setOpen(false); onAction(it.action); }}
            >
              {it.icon && <span className="ico">{it.icon}</span>}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── TEACHERS TABLE ─────────────── */
function TeachersTable({ rows, onOpen }) {
  return (
    <div className="data-card">
      <table className="data teachers">
        <colgroup>
          <col className="c-name" />
          <col className="c-email" />
          <col className="c-stu" />
          <col className="c-sess" />
          <col className="c-score" />
          <col className="c-status" />
          <col className="c-actions" />
        </colgroup>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Email</th>
            <th>Students</th>
            <th>Sessions / mo</th>
            <th>Avg score</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="clickable" onClick={() => onOpen(t.id)}>
              <td>
                <div className="ucell">
                  <Avatar initials={t.initials} seed={t.id} />
                  <div className="meta">
                    <div className="name">{t.name}</div>
                    <div className="sub">{t.code}</div>
                  </div>
                </div>
              </td>
              <td><div className="email-cell">{t.email}</div></td>
              <td><span className="num-cell">{t.students}</span></td>
              <td>
                <span className="num-cell">
                  {t.sessions}
                  {t.sessions > 0 && (
                    <span className={`delta ${t.sessions >= 60 ? 'up' : ''}`}>
                      {t.sessions >= 60 ? '↑' : ''}
                    </span>
                  )}
                </span>
              </td>
              <td>
                {t.avg > 0 ? (
                  <span className={`score-pill ${band(t.avg)}`}>
                    {t.avg}<span className="d">/100</span>
                  </span>
                ) : (
                  <span style={{ color: 'var(--muted-3)', fontSize: 12 }}>—</span>
                )}
              </td>
              <td><span className={`status-pill ${t.status}`}>{t.status === 'active' ? 'Active' : 'Inactive'}</span></td>
              <td onClick={(e) => e.stopPropagation()}>
                <RowMenu
                  onAction={(a) => { if (a === 'view') onOpen(t.id); }}
                  items={[
                    { label: 'View profile',   action: 'view', icon: <IconEye size={14} /> },
                    { label: 'Edit details',   action: 'edit', icon: <IconEdit size={14} /> },
                    { label: 'Send message',   action: 'msg',  icon: <IconMail size={14} /> },
                    { sep: true },
                    { label: t.status === 'active' ? 'Deactivate' : 'Reactivate',
                      action: 'toggle', icon: <IconBan size={14} />, danger: t.status === 'active' },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="data-foot">
        <div className="count-info">Showing <b>{rows.length}</b> of <b>{TEACHERS.length}</b> teachers</div>
        <div className="pager">
          <button className="pg-btn" disabled>‹</button>
          <button className="pg-btn on">1</button>
          <button className="pg-btn" disabled>›</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── STUDENTS TABLE ─────────────── */
function StudentsTable({ rows, onOpen }) {
  return (
    <div className="data-card">
      <table className="data students">
        <colgroup>
          <col className="c-name" />
          <col className="c-email" />
          <col className="c-class" />
          <col className="c-level" />
          <col className="c-score" />
          <col className="c-active" />
          <col className="c-status" />
          <col className="c-actions" />
        </colgroup>
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Class</th>
            <th>Level</th>
            <th>Avg score</th>
            <th>Last active</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const cls = CLASSES.find((c) => c.id === s.classId);
            const teacher = cls ? TEACHERS.find((t) => t.id === cls.teacher) : null;
            return (
              <tr key={s.id} className="clickable" onClick={() => onOpen(s.id)}>
                <td>
                  <div className="ucell">
                    <Avatar initials={s.initials} seed={s.id} />
                    <div className="meta">
                      <div className="name">{s.name}</div>
                      <div className="sub">{s.code}</div>
                    </div>
                  </div>
                </td>
                <td><div className="email-cell">{s.email}</div></td>
                <td>
                  <div style={{ lineHeight: 1.3, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cls?.name || '—'}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {teacher?.name.replace(/^Ms\. |^Mr\. /, '') || '—'}
                    </div>
                  </div>
                </td>
                <td><span className={`level-pill ${s.level}`}>{s.level[0].toUpperCase() + s.level.slice(1)}</span></td>
                <td>
                  <div className="score-stack">
                    <span className={`score-pill ${band(s.avg)}`} style={{ alignSelf: 'flex-start' }}>
                      {s.avg}<span className="d">/100</span>
                    </span>
                    <div className="mini-bar">
                      <div className={`fill ${band(s.avg)}`} style={{ width: `${s.avg}%` }} />
                    </div>
                  </div>
                </td>
                <td><span style={{ color: 'var(--muted)', fontSize: 12.5 }}>{s.lastActive}</span></td>
                <td><span className={`status-pill ${s.status}`}>{s.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <RowMenu
                    onAction={(a) => { if (a === 'view') onOpen(s.id); }}
                    items={[
                      { label: 'View reports', action: 'view', icon: <IconFile size={14} /> },
                      { label: 'Edit info',    action: 'edit', icon: <IconEdit size={14} /> },
                      { label: 'Reassign class', action: 'reassign', icon: <IconUsers size={14} /> },
                      { sep: true },
                      { label: s.status === 'active' ? 'Deactivate' : 'Reactivate',
                        action: 'toggle', icon: <IconBan size={14} />, danger: s.status === 'active' },
                    ]}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="data-foot">
        <div className="count-info">Showing <b>{rows.length}</b> of <b>{STUDENTS.length}</b> students</div>
        <div className="pager">
          <button className="pg-btn" disabled>‹</button>
          <button className="pg-btn on">1</button>
          <button className="pg-btn" disabled>›</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── DRAWER ─────────────── */
function StudentDrawer({ student, drawerTab, setDrawerTab, onClose }) {
  const cls = CLASSES.find((c) => c.id === student.classId);
  const teacher = cls ? TEACHERS.find((t) => t.id === cls.teacher) : null;
  const sessions = SESSIONS_BY_STUDENT[student.id] || SESSIONS_BY_STUDENT.default;
  const bestScore = Math.max(...sessions.map((s) => s.score));
  const trend = sessions.length > 1 ? sessions[0].score - sessions[sessions.length - 1].score : 0;

  return (
    <>
      <div className="drawer-head">
        <div className="left">
          <Avatar initials={student.initials} seed={student.id} size="lg" />
          <div className="meta">
            <div className="name">{student.name}</div>
            <div className="sub">{student.code} · {student.email}</div>
            <div className="pills">
              <span className={`level-pill ${student.level}`}>{student.level[0].toUpperCase() + student.level.slice(1)}</span>
              <span className={`status-pill ${student.status}`}>{student.status === 'active' ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
          <IconX size={15} />
        </button>
      </div>

      <div className="drawer-tabs">
        <button className={`drawer-tab ${drawerTab === 'overview' ? 'on' : ''}`} onClick={() => setDrawerTab('overview')}>
          Overview
        </button>
        <button className={`drawer-tab ${drawerTab === 'sessions' ? 'on' : ''}`} onClick={() => setDrawerTab('sessions')}>
          Session Reports <span className="count">{sessions.length}</span>
        </button>
      </div>

      <div className="drawer-body">
        {drawerTab === 'overview' && (
          <>
            <div className="stat-grid">
              <div className="stat-tile">
                <div className="lbl">Avg Score</div>
                <div className={`val ${band(student.avg)}`}>{student.avg}</div>
                <div className={`delta ${trend >= 0 ? 'up' : 'down'}`}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)} pts since first
                </div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Sessions</div>
                <div className="val">{student.sessions}</div>
                <div className="delta">Best: {bestScore}</div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Last Active</div>
                <div className="val" style={{ fontSize: 15 }}>{student.lastActive}</div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Joined</div>
                <div className="val" style={{ fontSize: 15 }}>Mar 2025</div>
              </div>
            </div>

            <div className="drawer-sub-h">Profile</div>
            <div className="field-group">
              <div className="field">
                <label>Full name</label>
                <input className="text-in" defaultValue={student.name} />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="text-in" defaultValue={student.email} />
              </div>
              <div className="field">
                <label>Class</label>
                <select className="select-in" defaultValue={student.classId}>
                  {CLASSES.map((c) => {
                    const t = TEACHERS.find((tt) => tt.id === c.teacher);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} — {t?.name.replace(/^Ms\. |^Mr\. /, '')}
                      </option>
                    );
                  })}
                </select>
                {teacher && (
                  <div style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 4, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '0.04em' }}>
                    Teacher: {teacher.name}
                  </div>
                )}
              </div>
              <div className="field">
                <label>Level</label>
                <select className="select-in" defaultValue={student.level}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </>
        )}

        {drawerTab === 'sessions' && (
          <>
            <div className="drawer-sub-h">
              All sessions
              <span className="right">View all reports →</span>
            </div>
            <div className="session-list">
              {sessions.map((s) => (
                <a key={s.id} className="session-item" href="Session Report.html">
                  <div>
                    <div className="title">{s.title}</div>
                    <div className="when">{s.when}</div>
                  </div>
                  <span className={`score-pill ${s.band}`}>{s.score}<span className="d">/100</span></span>
                  <span className="chev"><IconChevR size={14} /></span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="drawer-foot">
        <button className="btn btn-outline btn-sm">
          <IconExt size={13} /> Open full profile
        </button>
        <div className="spacer" />
        <button className="btn btn-soft btn-sm">Save changes</button>
      </div>
    </>
  );
}

function TeacherDrawer({ teacher, drawerTab, setDrawerTab, onClose }) {
  const assignedStudents = STUDENTS.filter((s) => {
    const c = CLASSES.find((cc) => cc.id === s.classId);
    return c?.teacher === teacher.id;
  });
  const sessions = SESSIONS_BY_TEACHER[teacher.id] || SESSIONS_BY_TEACHER.default;

  return (
    <>
      <div className="drawer-head">
        <div className="left">
          <Avatar initials={teacher.initials} seed={teacher.id} size="lg" />
          <div className="meta">
            <div className="name">{teacher.name}</div>
            <div className="sub">{teacher.code} · {teacher.email}</div>
            <div className="pills">
              <span className={`status-pill ${teacher.status}`}>{teacher.status === 'active' ? 'Active' : 'Inactive'}</span>
              <span className="level-pill intermediate">{teacher.specialty.split(' · ')[0]}</span>
            </div>
          </div>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
          <IconX size={15} />
        </button>
      </div>

      <div className="drawer-tabs">
        <button className={`drawer-tab ${drawerTab === 'overview' ? 'on' : ''}`} onClick={() => setDrawerTab('overview')}>
          Overview <span className="count">{assignedStudents.length}</span>
        </button>
        <button className={`drawer-tab ${drawerTab === 'sessions' ? 'on' : ''}`} onClick={() => setDrawerTab('sessions')}>
          Sessions <span className="count">{teacher.sessions}</span>
        </button>
      </div>

      <div className="drawer-body">
        {drawerTab === 'overview' && (
          <>
            <div className="stat-grid">
              <div className="stat-tile">
                <div className="lbl">Active Students</div>
                <div className="val">{teacher.students}</div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Sessions / mo</div>
                <div className="val">{teacher.sessions}</div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Avg Student Score</div>
                <div className={`val ${teacher.avg > 0 ? band(teacher.avg) : ''}`}>
                  {teacher.avg > 0 ? teacher.avg : '—'}
                </div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Joined</div>
                <div className="val" style={{ fontSize: 15 }}>{teacher.joined}</div>
              </div>
            </div>

            <div className="drawer-sub-h">Profile</div>
            <div className="field-group">
              <div className="field">
                <label>Full name</label>
                <input className="text-in" defaultValue={teacher.name} />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="text-in" defaultValue={teacher.email} />
              </div>
              <div className="field">
                <label>Specialty</label>
                <input className="text-in" defaultValue={teacher.specialty} />
              </div>
            </div>

            <div className="drawer-sub-h">
              Assigned Students
              <span className="right">Manage →</span>
            </div>
            {assignedStudents.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--muted-2)', padding: '8px 4px' }}>
                No students assigned yet.
              </div>
            ) : (
              <div className="mini-list">
                {assignedStudents.map((s) => (
                  <div key={s.id} className="mini-row">
                    <Avatar initials={s.initials} seed={s.id} />
                    <div className="name">{s.name}</div>
                    <span className={`score ${band(s.avg)}`}>{s.avg}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {drawerTab === 'sessions' && (
          <>
            <div className="drawer-sub-h">
              Recent uploads
              <span className="right">View all →</span>
            </div>
            <div className="session-list">
              {sessions.map((s) => (
                <a key={s.id} className="session-item" href="Session Report.html">
                  <div>
                    <div className="title">{s.title}</div>
                    <div className="when">{s.when}</div>
                  </div>
                  <span className={`score-pill ${s.band}`}>{s.score}<span className="d">/100</span></span>
                  <span className="chev"><IconChevR size={14} /></span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="drawer-foot">
        <button className="btn btn-outline btn-sm">
          <IconExt size={13} /> Open full profile
        </button>
        <div className="spacer" />
        <button className="btn btn-soft btn-sm">Save changes</button>
      </div>
    </>
  );
}

/* ─────────────── APP ─────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeTab, setActiveTab] = useState(t.activeTab);
  const [drawerTab, setDrawerTab] = useState(t.drawerTab);
  const [drawerOpen, setDrawerOpen] = useState(t.drawerOpen || null);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { setActiveTab(t.activeTab); }, [t.activeTab]);
  useEffect(() => { setDrawerTab(t.drawerTab); }, [t.drawerTab]);

  // Filtered rows
  const teacherRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEACHERS.filter((r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (!q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
    );
  }, [query, statusFilter]);

  const studentRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (levelFilter === 'all' || r.level === levelFilter) &&
      (!q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
    );
  }, [query, statusFilter, levelFilter]);

  const openDrawer = (id) => {
    setDrawerOpen(id);
    setTweak('drawerOpen', id);
  };
  const closeDrawer = () => {
    setDrawerOpen(null);
    setTweak('drawerOpen', null);
  };

  // resolve drawer subject based on which tab + open id
  const drawerSubject = useMemo(() => {
    if (!drawerOpen) return null;
    if (activeTab === 'teachers') return { kind: 'teacher', data: TEACHERS.find((x) => x.id === drawerOpen) };
    return { kind: 'student', data: STUDENTS.find((x) => x.id === drawerOpen) };
  }, [drawerOpen, activeTab]);

  // Close on Esc
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div className="breadcrumb">
            <span>Admin</span>
            <span className="sep">/</span>
            <span className="now">Users</span>
          </div>
          <div className="top-actions">
            <button className="top-btn"><IconHelp size={15} /> Help</button>
            <button className="top-btn" aria-label="Notifications" style={{ width: 34, justifyContent: 'center', padding: 0 }}>
              <IconBell size={16} />
            </button>
          </div>
        </div>

        <div className="page">
          <PageHead activeTab={activeTab} onInvite={() => {}} />

          <div className="tabs-strip" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'teachers'}
              className={`tab ${activeTab === 'teachers' ? 'on' : ''}`}
              onClick={() => { setActiveTab('teachers'); setTweak('activeTab', 'teachers'); }}
            >
              <span className="ico"><IconUsers size={16} /></span>
              Teachers
              <span className="count">{TEACHERS.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'students'}
              className={`tab ${activeTab === 'students' ? 'on' : ''}`}
              onClick={() => { setActiveTab('students'); setTweak('activeTab', 'students'); }}
            >
              <span className="ico"><IconBook size={16} /></span>
              Students
              <span className="count">{STUDENTS.length}</span>
            </button>
          </div>

          <Toolbar
            activeTab={activeTab}
            query={query} setQuery={setQuery}
            levelFilter={levelFilter} setLevelFilter={setLevelFilter}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          />

          {activeTab === 'teachers'
            ? <TeachersTable rows={teacherRows} onOpen={openDrawer} />
            : <StudentsTable rows={studentRows} onOpen={openDrawer} />}
        </div>
      </main>

      {drawerSubject?.data && (
        <>
          <div className="drawer-scrim" onClick={closeDrawer} />
          <aside className="drawer">
            {drawerSubject.kind === 'teacher'
              ? <TeacherDrawer teacher={drawerSubject.data} drawerTab={drawerTab} setDrawerTab={(v) => { setDrawerTab(v); setTweak('drawerTab', v); }} onClose={closeDrawer} />
              : <StudentDrawer student={drawerSubject.data} drawerTab={drawerTab} setDrawerTab={(v) => { setDrawerTab(v); setTweak('drawerTab', v); }} onClose={closeDrawer} />}
          </aside>
        </>
      )}

      <TweaksPanel>
        <TweakSection label="View" />
        <TweakRadio
          label="Active tab"
          value={activeTab}
          options={[
            { value: 'teachers', label: 'Teachers' },
            { value: 'students', label: 'Students' },
          ]}
          onChange={(v) => { setActiveTab(v); setTweak('activeTab', v); }}
        />
        <TweakSection label="Drawer" />
        <TweakRadio
          label="Open drawer"
          value={drawerOpen ? 'open' : 'closed'}
          options={[
            { value: 'closed', label: 'Closed' },
            { value: 'open',   label: 'Open' },
          ]}
          onChange={(v) => {
            if (v === 'closed') closeDrawer();
            else openDrawer(activeTab === 'teachers' ? 'park' : 'linh');
          }}
        />
        {drawerOpen && (
          <TweakRadio
            label="Drawer tab"
            value={drawerTab}
            options={[
              { value: 'overview', label: 'Overview' },
              { value: 'sessions', label: 'Sessions' },
            ]}
            onChange={(v) => { setDrawerTab(v); setTweak('drawerTab', v); }}
          />
        )}
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
