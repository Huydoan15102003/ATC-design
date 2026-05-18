// Hanoi K-Lab — User Management app
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "activeTab": "students",
  "drawerOpen": "linh",
  "drawerTab": "overview"
}/*EDITMODE-END*/;

/* ── DATA ── */
const TEACHERS = [
  { id:'park',      name:'Ms. Park Ji Yeon', initials:'PJ', code:'TCH-021', email:'park.jy@klab.edu.vn',      students:12, sessions:64, avg:84, status:'active',   joined:'Aug 2024' },
  { id:'thanhha',   name:'Lê Thanh Hà',      initials:'LH', code:'TCH-018', email:'le.thanhha@klab.edu.vn',   students:9,  sessions:52, avg:79, status:'active',   joined:'Mar 2024' },
  { id:'ducminh',   name:'Nguyễn Đức Minh',  initials:'DM', code:'TCH-014', email:'duc.minh@klab.edu.vn',     students:14, sessions:71, avg:88, status:'active',   joined:'Nov 2023' },
  { id:'khanhvy',   name:'Trần Khánh Vy',    initials:'KV', code:'TCH-026', email:'tran.khanhvy@klab.edu.vn', students:8,  sessions:41, avg:76, status:'active',   joined:'Jan 2025' },
  { id:'quocbao',   name:'Vũ Quốc Bảo',      initials:'QB', code:'TCH-009', email:'vu.quocbao@klab.edu.vn',   students:11, sessions:58, avg:72, status:'active',   joined:'Sep 2023' },
  { id:'maiphuong', name:'Đỗ Mai Phương',    initials:'MP', code:'TCH-003', email:'do.maiphuong@klab.edu.vn', students:0,  sessions:4,  avg:0,  status:'inactive', joined:'Jun 2023' },
];

const STUDENTS = [
  { id:'linh',  name:'Nguyễn Hà Linh',  initials:'HL', code:'KL-1042', email:'nguyen.halinh@gmail.com',  teacher:'park',      level:'intermediate', sessions:14, avg:79, lastActive:'2h ago',    status:'active',   joined:'Jan 2025' },
  { id:'anh',   name:'Phạm Minh Anh',   initials:'MA', code:'KL-1018', email:'mainh.pham@gmail.com',     teacher:'ducminh',   level:'advanced',     sessions:22, avg:88, lastActive:'Yesterday', status:'active',   joined:'Sep 2024' },
  { id:'khoa',  name:'Bùi Đăng Khoa',   initials:'DK', code:'KL-1057', email:'buidangkhoa@outlook.com',  teacher:'park',      level:'intermediate', sessions:9,  avg:74, lastActive:'4h ago',    status:'active',   joined:'Feb 2025' },
  { id:'my',    name:'Hoàng Trà My',    initials:'TM', code:'KL-1071', email:'tramy.hoang@gmail.com',    teacher:'khanhvy',   level:'beginner',     sessions:5,  avg:62, lastActive:'1d ago',    status:'active',   joined:'Mar 2025' },
  { id:'son',   name:'Trần Văn Sơn',    initials:'VS', code:'KL-0996', email:'tvson@klabmail.com',       teacher:'thanhha',   level:'intermediate', sessions:17, avg:81, lastActive:'6h ago',    status:'active',   joined:'Oct 2024' },
  { id:'thu',   name:'Lê Quỳnh Thư',    initials:'QT', code:'KL-1083', email:'quynhthu.le@gmail.com',    teacher:'ducminh',   level:'advanced',     sessions:19, avg:91, lastActive:'30m ago',   status:'active',   joined:'Aug 2024' },
  { id:'nam',   name:'Đinh Hoàng Nam',  initials:'HN', code:'KL-1029', email:'dinh.hoangnam@gmail.com',  teacher:'quocbao',   level:'intermediate', sessions:11, avg:68, lastActive:'3d ago',    status:'active',   joined:'Nov 2024' },
  { id:'ngan',  name:'Vũ Bảo Ngân',     initials:'BN', code:'KL-1064', email:'baongan.vu@gmail.com',     teacher:'park',      level:'beginner',     sessions:3,  avg:58, lastActive:'5h ago',    status:'active',   joined:'Apr 2025' },
  { id:'long',  name:'Tạ Quốc Long',    initials:'QL', code:'KL-1008', email:'taquoclong@gmail.com',     teacher:'thanhha',   level:'advanced',     sessions:24, avg:86, lastActive:'1h ago',    status:'active',   joined:'Jul 2024' },
  { id:'huyen', name:'Phan Thu Huyền',  initials:'TH', code:'KL-0871', email:'huyen.phan@klabmail.com',  teacher:'quocbao',   level:'intermediate', sessions:7,  avg:71, lastActive:'2w ago',    status:'inactive', joined:'May 2024' },
];

const SESSIONS_BY_STUDENT = {
  linh: [
    { id:1, title:'Session #14 · 1-on-1 coaching', date:'May 14, 2026', teacher:'Ms. Park Ji Yeon', duration:'50 min', score:82, band:'green' },
    { id:2, title:'Session #13 · IELTS part 2',    date:'May 7, 2026',  teacher:'Ms. Park Ji Yeon', duration:'45 min', score:76, band:'amber' },
    { id:3, title:'Session #12 · Pronunciation',   date:'Apr 30, 2026', teacher:'Ms. Park Ji Yeon', duration:'35 min', score:78, band:'amber' },
    { id:4, title:'Session #11 · Free talk',       date:'Apr 23, 2026', teacher:'Ms. Park Ji Yeon', duration:'50 min', score:81, band:'green' },
    { id:5, title:'Session #10 · Business email',  date:'Apr 16, 2026', teacher:'Ms. Park Ji Yeon', duration:'40 min', score:73, band:'amber' },
    { id:6, title:'Session #9 · News discussion',  date:'Apr 9, 2026',  teacher:'Ms. Park Ji Yeon', duration:'50 min', score:71, band:'amber' },
  ],
  default: [
    { id:1, title:'Most recent session',  date:'May 12, 2026', teacher:'Assigned teacher', duration:'50 min', score:80, band:'green' },
    { id:2, title:'Previous session',     date:'May 5, 2026',  teacher:'Assigned teacher', duration:'45 min', score:75, band:'amber' },
    { id:3, title:'Foundation review',    date:'Apr 28, 2026', teacher:'Assigned teacher', duration:'50 min', score:70, band:'amber' },
    { id:4, title:'Speaking practice',    date:'Apr 21, 2026', teacher:'Assigned teacher', duration:'35 min', score:77, band:'amber' },
    { id:5, title:'Vocabulary building',  date:'Apr 14, 2026', teacher:'Assigned teacher', duration:'50 min', score:68, band:'amber' },
  ],
};

/* ── HELPERS ── */
function scoreBand(v) { return v >= 80 ? 'green' : v >= 60 ? 'amber' : 'red'; }
function levelClass(l) { return l === 'advanced' ? 'green' : l === 'intermediate' ? 'blue' : 'amber'; }
function levelLabel(l) { return l.charAt(0).toUpperCase() + l.slice(1); }

const AV_COLS = [
  ['#1352CC','#5B87F0'],['#0F766E','#2DD4BF'],['#7C3AED','#A78BFA'],
  ['#B45309','#F59E0B'],['#BE123C','#F43F5E'],['#1D4ED8','#93C5FD'],
  ['#065F46','#34D399'],['#6D28D9','#8B5CF6'],['#9A3412','#FB923C'],
];
function paletteFor(s) {
  let n = 0;
  for (const c of String(s)) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return AV_COLS[n % AV_COLS.length];
}
function Avatar({ initials, seed, lg }) {
  const [a, b] = paletteFor(seed || initials);
  return <div className={`avatar${lg ? ' lg' : ''}`} style={{ background:`linear-gradient(135deg,${a},${b})` }}>{initials}</div>;
}

/* ── ICONS ── */
const Svg = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const IcoGrid     = ({s=16}) => <Svg size={s}><rect x="1.5" y="1.5" width="5" height="5" rx="1"/><rect x="9.5" y="1.5" width="5" height="5" rx="1"/><rect x="1.5" y="9.5" width="5" height="5" rx="1"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/></Svg>;
const IcoUsers    = ({s=16}) => <Svg size={s}><path d="M11 13v-1a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v1"/><circle cx="6.5" cy="5.5" r="2.5"/><path d="M14 13v-1a3 3 0 0 0-2-2.83"/><path d="M10.5 3a2.5 2.5 0 0 1 0 4.95"/></Svg>;
const IcoCalendar = ({s=16}) => <Svg size={s}><rect x="1.5" y="2.5" width="13" height="12" rx="1.5"/><path d="M1.5 6.5h13M5 1.5v2M11 1.5v2"/></Svg>;
const IcoFile     = ({s=16}) => <Svg size={s}><path d="M9 1.5H3.5A1.5 1.5 0 0 0 2 3v10a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 14 13V6.5L9 1.5z"/><path d="M9 1.5V6.5H14"/></Svg>;
const IcoSettings = ({s=16}) => <Svg size={s}><circle cx="8" cy="8" r="2.5"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1 1M11.9 11.9l1 1M3.1 12.9l1-1M11.9 4.1l1-1"/></Svg>;
const IcoShield   = ({s=16}) => <Svg size={s}><path d="M8 1.5L2 4v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6V4L8 1.5z"/></Svg>;
const IcoSearch   = ({s=16}) => <Svg size={s}><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></Svg>;
const IcoFilter   = ({s=16}) => <Svg size={s}><path d="M2 4h12M4 8h8M6 12h4"/></Svg>;
const IcoChev     = ({s=16}) => <Svg size={s}><path d="M6 4l4 4-4 4"/></Svg>;
const IcoChevD    = ({s=16}) => <Svg size={s}><path d="M4 6l4 4 4-4"/></Svg>;
const IcoDots     = ({s=16}) => <Svg size={s}><circle cx="4" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/></Svg>;
const IcoX        = ({s=16}) => <Svg size={s}><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></Svg>;
const IcoPlus     = ({s=16}) => <Svg size={s}><path d="M8 2v12M2 8h12"/></Svg>;
const IcoMail     = ({s=16}) => <Svg size={s}><rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><path d="M1.5 5l6.5 4.5L14.5 5"/></Svg>;
const IcoBan      = ({s=16}) => <Svg size={s}><circle cx="8" cy="8" r="6"/><path d="M4.5 4.5l7 7"/></Svg>;
const IcoEye      = ({s=16}) => <Svg size={s}><path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="8" cy="8" r="2"/></Svg>;
const IcoEdit     = ({s=16}) => <Svg size={s}><path d="M11 2.5l2.5 2.5-8 8-3 .5.5-3 8-8z"/></Svg>;
const IcoBell     = ({s=16}) => <Svg size={s}><path d="M8 1.5a5 5 0 0 1 5 5v3l1.5 2h-13L3 9.5v-3a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></Svg>;
const IcoHelp     = ({s=16}) => <Svg size={s}><circle cx="8" cy="8" r="6.5"/><path d="M6 6.5a2 2 0 0 1 4 .5c0 1.5-2 2-2 3.5"/><circle cx="8" cy="12" r=".75" fill="currentColor" stroke="none"/></Svg>;

/* ── ROW MENU ── */
function RowMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);
  return (
    <div className="row-acts" ref={ref}>
      <button className={`icon-btn${open ? ' on' : ''}`}
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}>
        <IcoDots s={15} />
      </button>
      {open && (
        <div className="menu" onClick={e => e.stopPropagation()}>
          {items.map((it, i) => it.sep
            ? <div key={i} className="menu-sep" />
            : (
              <button key={i} className={`menu-item${it.danger ? ' danger' : ''}`}
                onClick={() => { setOpen(false); it.action?.(); }}>
                {it.icon && <span className="ico">{it.icon}</span>}
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ── SIDEBAR ── */
function Sidebar({ activeTab }) {
  const adminNav = [
    { id:'dash',    label:'Dashboard', icon:<IcoGrid /> },
    { id:'users',   label:'Users',     icon:<IcoUsers />, active:true, count: TEACHERS.length + STUDENTS.length },
    { id:'sessions',label:'Sessions',  icon:<IcoCalendar /> },
    { id:'reports', label:'Reports',   icon:<IcoFile /> },
  ];
  const sysNav = [
    { id:'settings', label:'Settings', icon:<IcoSettings /> },
    { id:'security', label:'Security', icon:<IcoShield /> },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="mark">K</div>
        <div>
          <div className="name">Hanoi K-Lab</div>
          <div className="org">Admin portal</div>
        </div>
      </div>
      <div className="sb-section">Admin</div>
      <nav className="sb-nav">
        {adminNav.map(it => (
          <a key={it.id} className={`sb-item${it.active ? ' active' : ''}`}>
            <span className="ico">{it.icon}</span>
            {it.label}
            {it.count != null && <span className="sb-count">{it.count}</span>}
          </a>
        ))}
      </nav>
      <div className="sb-section">System</div>
      <nav className="sb-nav">
        {sysNav.map(it => (
          <a key={it.id} className="sb-item">
            <span className="ico">{it.icon}</span>
            {it.label}
          </a>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="av">AT</div>
          <div>
            <div className="name">Anh Tuấn</div>
            <div className="role">Center admin</div>
          </div>
          <span className="chev"><IcoChevD s={14} /></span>
        </div>
      </div>
    </aside>
  );
}

/* ── STUDENTS TABLE ── */
function StudentsTable({ rows, openId, onOpen }) {
  return (
    <div className="data-card">
      <table className="data students">
        <colgroup>
          <col className="c-name"/><col className="c-email"/><col className="c-teach"/>
          <col className="c-level"/><col className="c-sess"/><col className="c-score"/>
          <col className="c-acts"/>
        </colgroup>
        <thead>
          <tr>
            <th>Student</th><th>Email</th><th>Assigned teacher</th>
            <th>Level</th><th>Sessions</th><th>Avg score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(s => {
            const teacher = TEACHERS.find(t => t.id === s.teacher);
            const band = scoreBand(s.avg);
            return (
              <tr key={s.id} className={openId === s.id ? 'selected' : ''} onClick={() => onOpen(s.id)}>
                <td>
                  <div className="ucell">
                    <Avatar initials={s.initials} seed={s.id} />
                    <div className="meta">
                      <div className="uname">{s.name}</div>
                      <div className="ucode">{s.code}</div>
                    </div>
                  </div>
                </td>
                <td><div className="email-cell">{s.email}</div></td>
                <td><span style={{fontSize:13,color:'var(--ink-2)'}}>{teacher?.name}</span></td>
                <td><span className={`badge ${levelClass(s.level)}`}>{levelLabel(s.level)}</span></td>
                <td><span style={{fontSize:13.5,color:'var(--ink-2)'}}>{s.sessions}</span></td>
                <td>
                  <div className="score-cell">
                    <div className="score-row-in">
                      <span className="score-val">{s.avg}</span>
                      <div className="mini-bar"><div className={`fill ${band}`} style={{width:`${s.avg}%`}}/></div>
                      <span className={`score-pill ${band}`}>{s.avg}<span className="d">/100</span></span>
                    </div>
                  </div>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <RowMenu items={[
                    { label:'View reports', icon:<IcoEye s={13}/>, action:() => onOpen(s.id) },
                    { label:'Edit',         icon:<IcoEdit s={13}/> },
                    { sep:true },
                    { label:'Deactivate',   icon:<IcoBan s={13}/>, danger:true },
                  ]}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="tbl-foot">
        <span>Showing <b>{rows.length}</b> of <b>{STUDENTS.length}</b> students</span>
        <div className="pager">
          <button className="pg-btn" disabled>‹</button>
          <button className="pg-btn on">1</button>
          <button className="pg-btn" disabled>›</button>
        </div>
      </div>
    </div>
  );
}

/* ── TEACHERS TABLE ── */
function TeachersTable({ rows, onOpen }) {
  return (
    <div className="data-card">
      <table className="data teachers">
        <colgroup>
          <col className="c-name"/><col className="c-email"/><col className="c-stu"/>
          <col className="c-sess"/><col className="c-score"/>
          <col className="c-acts"/>
        </colgroup>
        <thead>
          <tr>
            <th>Teacher</th><th>Email</th><th>Active students</th>
            <th>Sessions this month</th><th>Avg student score</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(t => {
            const band = t.avg > 0 ? scoreBand(t.avg) : 'gray';
            return (
              <tr key={t.id} onClick={() => onOpen && onOpen(t.id)}>
                <td>
                  <div className="ucell">
                    <Avatar initials={t.initials} seed={t.id} />
                    <div className="meta">
                      <div className="uname">{t.name}</div>
                      <div className="ucode">{t.code}</div>
                    </div>
                  </div>
                </td>
                <td><div className="email-cell">{t.email}</div></td>
                <td><span style={{fontSize:13.5,color:'var(--ink-2)'}}>{t.students}</span></td>
                <td><span style={{fontSize:13.5,color:'var(--ink-2)'}}>{t.sessions}</span></td>
                <td>
                  {t.avg > 0
                    ? <span className={`score-pill ${band}`}>{t.avg}<span className="d">/100</span></span>
                    : <span style={{color:'var(--muted-2)',fontSize:13}}>—</span>}
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <RowMenu items={[
                    { label:'View profile', icon:<IcoEye s={13}/> },
                    { label:'Edit',         icon:<IcoEdit s={13}/> },
                    { label:'Send invite',  icon:<IcoMail s={13}/> },
                    { sep:true },
                    { label:'Deactivate',   icon:<IcoBan s={13}/>, danger:true },
                  ]}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="tbl-foot">
        <span>Showing <b>{rows.length}</b> of <b>{TEACHERS.length}</b> teachers</span>
        <div className="pager">
          <button className="pg-btn" disabled>‹</button>
          <button className="pg-btn on">1</button>
          <button className="pg-btn" disabled>›</button>
        </div>
      </div>
    </div>
  );
}

/* ── STUDENT DRAWER ── */
function StudentDrawer({ student, drawerTab, setDrawerTab, onClose }) {
  const teacher = TEACHERS.find(t => t.id === student.teacher);
  const sessions = SESSIONS_BY_STUDENT[student.id] || SESSIONS_BY_STUDENT.default;
  const band = scoreBand(student.avg);

  return (
    <>
      <div className="drawer-head">
        <div className="left">
          <Avatar initials={student.initials} seed={student.id} lg />
          <div className="meta">
            <div className="dname">{student.name}</div>
            <div className="dsub">{student.code} · {student.email}</div>
            <div className="dpills">
              <span className={`badge ${levelClass(student.level)}`}>{levelLabel(student.level)}</span>
              <span className={`badge ${student.status === 'active' ? 'green' : 'gray'}`}>
                {student.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <button className="drawer-close" onClick={onClose}><IcoX s={14}/></button>
      </div>

      <div className="drawer-tabs">
        {[
          { id:'overview',  label:'Overview' },
          { id:'sessions',  label:'Session reports', count: sessions.length },
        ].map(tab => (
          <button key={tab.id} className={`drawer-tab${drawerTab === tab.id ? ' on' : ''}`}
            onClick={() => setDrawerTab(tab.id)}>
            {tab.label}
            {tab.count != null && <span className="cnt">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="drawer-body">
        {drawerTab === 'overview' && (
          <>
            <div className="stat-grid">
              <div className="stat-tile">
                <div className="slbl">Avg score</div>
                <div className={`sval ${band}`}>{student.avg}</div>
                <div className="ssub">out of 100</div>
              </div>
              <div className="stat-tile">
                <div className="slbl">Total sessions</div>
                <div className="sval">{student.sessions}</div>
                <div className="ssub">completed</div>
              </div>
              <div className="stat-tile">
                <div className="slbl">Last active</div>
                <div className="sval" style={{fontSize:15}}>{student.lastActive}</div>
              </div>
              <div className="stat-tile">
                <div className="slbl">Joined</div>
                <div className="sval" style={{fontSize:15}}>{student.joined}</div>
              </div>
            </div>

            <div className="drawer-sh">Profile</div>
            <div className="field-group">
              <div className="field">
                <label>Full name</label>
                <input className="text-in" defaultValue={student.name} />
              </div>
              <div className="field">
                <label>Email address</label>
                <input className="text-in" defaultValue={student.email} />
              </div>
              <div className="field">
                <label>Assigned teacher</label>
                <select className="select-in" defaultValue={student.teacher}>
                  {TEACHERS.filter(t => t.status === 'active').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Level</label>
                <select className="select-in" defaultValue={student.level}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="field">
                <label>Enrolled</label>
                <input className="text-in" defaultValue={student.joined} readOnly style={{color:'var(--muted-2)'}} />
              </div>
            </div>
          </>
        )}

        {drawerTab === 'sessions' && (
          <>
            <div className="drawer-sh">
              All session reports
              <span className="act">View all →</span>
            </div>
            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="ico-tile"><IcoFile s={20}/></div>
                <div className="t">No sessions yet</div>
                <div>This student hasn't completed any sessions.</div>
              </div>
            ) : (
              <div className="session-list">
                {sessions.map(s => (
                  <a key={s.id} className="session-card">
                    <div>
                      <div className="sc-title">{s.title}</div>
                      <div className="sc-meta">{s.date} · {s.teacher} · {s.duration}</div>
                    </div>
                    <span className={`score-pill ${s.band}`}>{s.score}<span className="d">/100</span></span>
                    <span className="sc-chev"><IcoChev s={14}/></span>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="drawer-foot">
        <button className="danger-link">Deactivate account</button>
        <div className="spacer" />
        <button className="btn btn-outline btn-sm">Cancel</button>
        <button className="btn btn-primary btn-sm">Save changes</button>
      </div>
    </>
  );
}

/* ── APP ── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeTab,  setActiveTab]  = useState(t.activeTab);
  const [drawerOpen, setDrawerOpen] = useState(t.drawerOpen || null);
  const [drawerTab,  setDrawerTab]  = useState(t.drawerTab);
  const [query,      setQuery]      = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter,setStatusFilter]= useState('all');

  useEffect(() => { setActiveTab(t.activeTab); }, [t.activeTab]);
  useEffect(() => { setDrawerTab(t.drawerTab); }, [t.drawerTab]);
  useEffect(() => { if (t.drawerOpen !== undefined) setDrawerOpen(t.drawerOpen); }, [t.drawerOpen]);

  const studentRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter(s =>
      (statusFilter === 'all' || s.status === statusFilter) &&
      (levelFilter  === 'all' || s.level  === levelFilter) &&
      (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
    );
  }, [query, statusFilter, levelFilter]);

  const teacherRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEACHERS.filter(t =>
      (statusFilter === 'all' || t.status === statusFilter) &&
      (!q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
    );
  }, [query, statusFilter]);

  const openDrawer = id => { setDrawerOpen(id); setTweak('drawerOpen', id); };
  const closeDrawer = () => { setDrawerOpen(null); setTweak('drawerOpen', null); };

  const drawerStudent = drawerOpen ? STUDENTS.find(s => s.id === drawerOpen) : null;

  // Close on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const fn = e => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [drawerOpen]);

  const isStudents = activeTab === 'students';

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="breadcrumb">
            <span>Admin</span>
            <span className="sep">/</span>
            <span className="now">Users</span>
          </div>
          <div className="top-right">
            <button className="top-icon-btn" title="Help"><IcoHelp s={16}/></button>
            <button className="top-icon-btn" title="Notifications"><IcoBell s={16}/></button>
          </div>
        </div>

        <div className="page">
          {/* Page head */}
          <div className="page-head">
            <div>
              <h1>User management</h1>
              <div className="meta">
                <b>{TEACHERS.filter(t => t.status === 'active').length}</b>&nbsp;active teachers
                <span className="dot">·</span>
                <b>{STUDENTS.filter(s => s.status === 'active').length}</b>&nbsp;active students
                <span className="dot">·</span>
                Updated <b>2 min ago</b>
              </div>
            </div>
            <button className={`btn btn-primary`} style={{gap:6}}>
              {isStudents ? <IcoPlus s={14}/> : <IcoMail s={14}/>}
              {isStudents ? 'Add student' : 'Invite teacher'}
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs-strip">
            {[
              { id:'students', label:'Students', count: STUDENTS.length },
              { id:'teachers', label:'Teachers', count: TEACHERS.length },
            ].map(tab => (
              <button key={tab.id}
                className={`tab${activeTab === tab.id ? ' on' : ''}`}
                onClick={() => { setActiveTab(tab.id); setTweak('activeTab', tab.id); setQuery(''); setLevelFilter('all'); setStatusFilter('all'); }}>
                {tab.label}
                <span className="cnt">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-wrap">
              <span className="ico"><IcoSearch s={14}/></span>
              <input
                type="text"
                placeholder={isStudents ? 'Search students…' : 'Search teachers…'}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            {isStudents && (
              <button
                className={`chip-btn${levelFilter !== 'all' ? ' active' : ''}`}
                onClick={() => setLevelFilter(levelFilter === 'all' ? 'beginner' : levelFilter === 'beginner' ? 'intermediate' : levelFilter === 'intermediate' ? 'advanced' : 'all')}>
                <IcoFilter s={13}/>
                Level
                <span className="val">{levelFilter === 'all' ? 'All' : levelLabel(levelFilter)}</span>
                <IcoChevD s={12}/>
              </button>
            )}
            <button
              className={`chip-btn${statusFilter !== 'all' ? ' active' : ''}`}
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'active' : statusFilter === 'active' ? 'inactive' : 'all')}>
              <IcoFilter s={13}/>
              Status
              <span className="val">{statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
              <IcoChevD s={12}/>
            </button>
          </div>

          {/* Table */}
          {isStudents
            ? <StudentsTable rows={studentRows} openId={drawerOpen} onOpen={openDrawer} />
            : <TeachersTable rows={teacherRows} onOpen={openDrawer} />}
        </div>
      </main>

      {/* Drawer */}
      {drawerStudent && (
        <>
          <div className="drawer-scrim" onClick={closeDrawer} />
          <aside className="drawer">
            <StudentDrawer
              student={drawerStudent}
              drawerTab={drawerTab}
              setDrawerTab={v => { setDrawerTab(v); setTweak('drawerTab', v); }}
              onClose={closeDrawer}
            />
          </aside>
        </>
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Table" />
        <TweakRadio
          label="Active tab"
          value={activeTab}
          options={[{value:'students',label:'Students'},{value:'teachers',label:'Teachers'}]}
          onChange={v => { setActiveTab(v); setTweak('activeTab', v); }}
        />
        <TweakSection label="Drawer" />
        <TweakRadio
          label="Drawer"
          value={drawerOpen ? 'open' : 'closed'}
          options={[{value:'closed',label:'Closed'},{value:'open',label:'Open'}]}
          onChange={v => v === 'closed' ? closeDrawer() : openDrawer('linh')}
        />
        {drawerOpen && (
          <TweakRadio
            label="Drawer tab"
            value={drawerTab}
            options={[{value:'overview',label:'Overview'},{value:'sessions',label:'Sessions'}]}
            onChange={v => { setDrawerTab(v); setTweak('drawerTab', v); }}
          />
        )}
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
