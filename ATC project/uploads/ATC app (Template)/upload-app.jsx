const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "currentStep": 1,
  "fileLoaded": false,
  "primary": "#2563eb",
  "showHelper": true
}/*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#2563eb', '#1d4ed8', '#1f6feb', '#3b6cf6'];

const CLASSES = [
  { id: 'ielts-am',   name: 'IELTS Speaking · Morning',     level: 'Intermediate', studentIds: ['nh', 'tp', 'pk'] },
  { id: 'biz-eng',    name: 'Business English · Evening',   level: 'Advanced',     studentIds: ['lm', 'vq'] },
  { id: 'conv-b2',    name: 'Conversation · B2',            level: 'Intermediate', studentIds: ['dh'] },
];

const STUDENTS = [
  { id: 'nh', name: 'Nguyễn Hà Linh',   level: 'IELTS · Band 6.0',  code: 'KL-1042' },
  { id: 'tp', name: 'Trần Phương Anh',  level: 'IELTS · Band 6.5',  code: 'KL-1058' },
  { id: 'lm', name: 'Lê Minh Quân',     level: 'Business English',  code: 'KL-1071' },
  { id: 'pk', name: 'Phạm Khánh Vy',    level: 'IELTS · Band 5.5',  code: 'KL-1083' },
  { id: 'dh', name: 'Đỗ Hoàng Nam',     level: 'Conversation · B2', code: 'KL-1099' },
  { id: 'vq', name: 'Vũ Quỳnh Anh',     level: 'IELTS · Band 7.0',  code: 'KL-1105' },
];

function todayISO() {
  const d = new Date('2026-05-16T00:00:00');
  return d.toISOString().slice(0, 10);
}
function prettyDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
function initials(name) {
  return name.split(' ').slice(-2).map((s) => s[0]).join('').toUpperCase();
}

/* ─────────────── SIDEBAR ─────────────── */
function Sidebar() {
  const items = [
    { id: 'dash', label: 'Dashboard',              icon: IconHome },
    { id: 'up',   label: 'Upload Session',         icon: IconUpload, active: true },
    { id: 'pron', label: 'Pronunciation Assessment', icon: IconMic, badge: 'New' },
    { id: 'cls',  label: 'My Classes',             icon: IconUsers },
    { id: 'hist', label: 'Session History',        icon: IconHistory },
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
          <div className="avatar">SK</div>
          <div className="meta">
            <div className="name">Seo-yeon Kim</div>
            <div className="role">Senior Coach</div>
          </div>
          <IconChev size={14} />
        </div>
      </div>
    </aside>
  );
}

/* ─────────────── STEPPER ─────────────── */
function Stepper({ step, onStep, complete }) {
  const steps = [
    { n: 1, label: 'Session Info' },
    { n: 2, label: 'Upload Audio' },
    { n: 3, label: 'Review & Submit' },
  ];
  return (
    <div className="stepper" role="list">
      {steps.map((s) => {
        const state = step === s.n ? 'current' : (s.n < step ? 'done' : 'upcoming');
        return (
          <div key={s.n} className={`step ${state}`} role="listitem" onClick={() => onStep(s.n)}>
            <div className="num">
              {state === 'done' ? <IconCheck size={14} /> : s.n}
            </div>
            <div className="label">
              <span className="k">Step {s.n}</span>
              <span className="t">{s.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────── CLASS COMBOBOX ─────────────── */
function ClassSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = CLASSES.find((c) => c.id === value);

  return (
    <div className="combo" ref={wrapRef}>
      <div className={`selectish ${open ? 'focus' : ''}`} onClick={() => setOpen((v) => !v)}>
        {selected ? (
          <span className="pill-selected">
            <span className="avatar" style={{ background: 'linear-gradient(135deg, #0f766e, #5eead4)' }}>
              <IconUsers size={13} />
            </span>
            <span>{selected.name}</span>
            <span style={{ color: 'var(--muted-2)', fontSize: 12.5 }}>· {selected.studentIds.length} students</span>
          </span>
        ) : (
          <span className="placeholder">Select class</span>
        )}
        <span className="chev"><IconChev size={14} /></span>
      </div>
      {open && (
        <div className="menu">
          {CLASSES.map((c) => (
            <div
              key={c.id}
              className={`menu-item ${c.id === value ? 'selected' : ''}`}
              onClick={() => { onChange(c.id); setOpen(false); }}
            >
              <div className="avatar" style={{ background: 'linear-gradient(135deg, #0f766e, #5eead4)' }}>
                <IconUsers size={13} />
              </div>
              <div className="meta">
                <div>{c.name}</div>
                <div className="sub">{c.level} · {c.studentIds.length} students</div>
              </div>
              {c.id === value && <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}><IconCheck size={16} /></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── STUDENT COMBOBOX ─────────────── */
function StudentSelect({ value, onChange, classId }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const cls = CLASSES.find((c) => c.id === classId);
  const classStudents = cls
    ? STUDENTS.filter((s) => cls.studentIds.includes(s.id))
    : [];
  const filtered = classStudents.filter((s) =>
    !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase())
  );
  const selected = STUDENTS.find((s) => s.id === value);
  const disabled = !classId;

  return (
    <div className="combo" ref={wrapRef}>
      {open ? (
        <div className="input-wrap">
          <span className="lead-ico"><IconSearch size={16} /></span>
          <input
            autoFocus
            className="input with-icon"
            placeholder="Search by name or student code…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      ) : (
        <div
          className={`selectish ${open ? 'focus' : ''}`}
          onClick={() => !disabled && setOpen(true)}
          style={disabled ? { opacity: 0.55, cursor: 'not-allowed', background: 'var(--hair-3)' } : null}
        >
          {selected ? (
            <span className="pill-selected">
              <span className="avatar">{initials(selected.name)}</span>
              <span>{selected.name}</span>
              <span style={{ color: 'var(--muted-2)', fontSize: 12.5, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>· {selected.code}</span>
            </span>
          ) : (
            <span className="placeholder">{disabled ? 'Select a class first' : 'Select student'}</span>
          )}
          <span className="chev"><IconChev size={14} /></span>
        </div>
      )}
      {open && !disabled && (
        <div className="menu">
          {filtered.length === 0 && (
            <div style={{ padding: '14px', color: 'var(--muted)', fontSize: 13 }}>No students match "{q}"</div>
          )}
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`menu-item ${s.id === value ? 'selected' : ''}`}
              onClick={() => { onChange(s.id); setOpen(false); setQ(''); }}
            >
              <div className="avatar">{initials(s.name)}</div>
              <div className="meta">
                <div>{s.name}</div>
                <div className="sub">{s.code}</div>
              </div>
              {s.id === value && <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}><IconCheck size={16} /></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── WAVEFORM mock ─────────────── */
function Waveform() {
  const bars = useMemo(() => {
    const arr = [];
    const seed = 7;
    for (let i = 0; i < 84; i++) {
      const v = 0.18 + 0.82 * (0.5 + 0.5 * Math.sin(i * 0.6 + seed) * Math.cos(i * 0.13));
      arr.push(Math.max(0.15, Math.min(1, v)));
    }
    return arr;
  }, []);
  return (
    <div className="waveform">
      {bars.map((v, i) => (
        <span key={i} className="bar" style={{ height: `${Math.round(v * 38) + 6}px` }} />
      ))}
    </div>
  );
}

/* ─────────────── STEPS ─────────────── */
function Step1({ data, set, onNext }) {
  const valid = data.classId && data.student && data.date && data.duration;
  return (
    <>
      <div className="card">
        <div className="card-head">
          <div>
            <h2>Session details</h2>
            <div className="sub">Tell us about the lesson so the AI scorer has the right context.</div>
          </div>
          <div className="right">All fields required unless marked optional</div>
        </div>

        <div className="form-grid">
          <div className="field col-2">
            <label>Class</label>
            <ClassSelect
              value={data.classId}
              onChange={(v) => { set('classId', v); set('student', null); }}
            />
          </div>

          <div className="field col-2">
            <label htmlFor="stu">Student</label>
            <StudentSelect
              value={data.student}
              onChange={(v) => set('student', v)}
              classId={data.classId}
            />
          </div>

          <div className="field">
            <label htmlFor="date">Session date</label>
            <div className="input-wrap">
              <input
                id="date" type="date" className="input"
                value={data.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="dur">Session duration</label>
            <div className="input-wrap">
              <input
                id="dur" type="number" inputMode="numeric"
                className="input with-suffix"
                value={data.duration}
                onChange={(e) => set('duration', e.target.value)}
                min="1" max="240"
              />
              <span className="suffix">minutes</span>
            </div>
          </div>

          <div className="field col-2">
            <label htmlFor="notes">
              Notes
              <span className="opt">Optional</span>
            </label>
            <textarea
              id="notes" className="textarea"
              placeholder="Add any context for the AI scorer (topic, level, etc.)"
              value={data.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="actions-row">
          <button className="btn btn-ghost">
            <IconX size={14} />
            Cancel
          </button>
          <button
            className={`btn btn-primary ${!valid ? 'disabled' : ''}`}
            disabled={!valid}
            onClick={() => valid && onNext()}
          >
            Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12 H 19" /><path d="M13 6 L 19 12 L 13 18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function Step2({ data, set, onNext, onBack }) {
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(data.file ? 100 : 0);

  // Simulate progress when "file" toggled on
  useEffect(() => {
    if (!data.file) { setProgress(0); return; }
    let p = 0;
    setProgress(0);
    const t = setInterval(() => {
      p += Math.random() * 12 + 8;
      if (p >= 100) { p = 100; clearInterval(t); }
      setProgress(Math.round(p));
    }, 220);
    return () => clearInterval(t);
  }, [data.file]);

  function fakePick() {
    set('file', {
      name: 'session_2026-05-16_nguyen-ha-linh.m4a',
      size: '38.4 MB',
      duration: '49:12',
    });
  }
  function clearFile() {
    set('file', null);
  }

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Upload recording</h2>
          <div className="sub">Drop in the audio file you recorded during this 1-on-1 lesson.</div>
        </div>
        <div className="right">Step 2 of 3</div>
      </div>

      {!data.file ? (
        <div
          className={`dropzone ${drag ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); fakePick(); }}
          onClick={fakePick}
        >
          <div className="icon-tile"><IconCloud size={26} /></div>
          <h3>Drag your audio file here</h3>
          <div className="or">or <span className="link">browse from your computer</span></div>
          <div className="formats">
            MP3 <span className="dot" /> MP4 <span className="dot" /> M4A <span className="dot" /> WAV <span className="dot" /> max 500 MB
          </div>
        </div>
      ) : (
        <>
          <div className="file-row">
            <div className="tile"><IconAudio size={20} /></div>
            <div className="grow">
              <div className="name">{data.file.name}</div>
              <div className="meta">
                <span>{data.file.size}</span>
                <span className="sep" />
                <span>{data.file.duration} duration</span>
                <span className="sep" />
                <span>M4A · 128 kbps</span>
              </div>
            </div>
            {progress >= 100 ? (
              <div className="check"><IconCheck size={14} /></div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{progress}%</div>
            )}
            <button className="remove" aria-label="Remove file" onClick={clearFile}><IconTrash size={16} /></button>
          </div>

          {progress < 100 ? (
            <>
              <div className="progress"><div className="bar" style={{ width: `${progress}%` }} /></div>
              <div className="progress-meta">
                <span>Uploading… <b>{progress}%</b></span>
                <span>{((38.4 * progress) / 100).toFixed(1)} MB of 38.4 MB · ~{Math.max(1, Math.round((100 - progress) / 12))}s remaining</span>
              </div>
            </>
          ) : (
            <>
              <Waveform />
              <div className="progress-meta">
                <span style={{ color: 'var(--success)' }}>
                  <b style={{ color: 'var(--success)' }}>✓ Upload complete.</b> Audio quality looks good — clear voice, low background noise.
                </span>
                <button className="btn btn-ghost" style={{ height: 28, padding: '0 8px', fontSize: 12.5 }}>
                  <IconPlay size={13} /> Preview
                </button>
              </div>
            </>
          )}
        </>
      )}

      <div className="actions-row">
        <button className="btn btn-outline" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12 H 5" /><path d="M11 6 L 5 12 L 11 18" />
          </svg>
          Back
        </button>
        <button
          className={`btn btn-primary ${!(data.file && progress >= 100) ? 'disabled' : ''}`}
          disabled={!(data.file && progress >= 100)}
          onClick={() => data.file && progress >= 100 && onNext()}
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12 H 19" /><path d="M13 6 L 19 12 L 13 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Step3({ data, set, onBack, onSubmit, showHelper }) {
  const stu = STUDENTS.find((s) => s.id === data.student);
  const cls = CLASSES.find((c) => c.id === data.classId);
  return (
    <div className={showHelper ? 'cards-2col' : ''}>
      <div className="card">
        <div className="card-head">
          <div>
            <h2>Review & submit</h2>
            <div className="sub">Confirm the details below. Once submitted, our AI scorer will start processing.</div>
          </div>
          <div className="right">Step 3 of 3</div>
        </div>

        <div className="summary">
          <div className="row">
            <span className="k">Class</span>
            <span className="v">{cls ? cls.name : '—'}</span>
            {cls && <span className="v s" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{cls.level}</span>}
          </div>
          <div className="row">
            <span className="k">Student</span>
            <span className="v">{stu ? `${stu.name}` : '—'}</span>
            {stu && <span className="v s" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{stu.code}</span>}
          </div>
          <div className="row">
            <span className="k">Session date</span>
            <span className="v">{prettyDate(data.date)}</span>
          </div>
          <div className="row">
            <span className="k">Duration</span>
            <span className="v">{data.duration} minutes</span>
          </div>
          <div className="row">
            <span className="k">Coach</span>
            <span className="v">Seo-yeon Kim</span>
          </div>
          <div className="row" style={{ gridColumn: 'span 2' }}>
            <span className="k">Audio file</span>
            <span className="v">{data.file?.name || '—'}</span>
            {data.file && (
              <span className="v s" style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                {data.file.size} · {data.file.duration} · M4A · 128 kbps
              </span>
            )}
          </div>
          {data.notes && (
            <div className="row" style={{ gridColumn: 'span 2' }}>
              <span className="k">Notes</span>
              <span className="v s">{data.notes}</span>
            </div>
          )}
        </div>

        <label className="checkrow">
          <input
            type="checkbox"
            checked={data.notify}
            onChange={(e) => set('notify', e.target.checked)}
          />
          <span className="box"><IconCheck size={12} /></span>
          <span className="text">
            <span className="t">Notify student by email when report is ready</span>
            <span className="s">Sends a summary email with score band, transcript link and personalized feedback.</span>
          </span>
        </label>

        <div className="info-banner">
          <span className="ico"><IconSpark size={13} /></span>
          <div>
            <b>Estimated processing time: ~4 minutes.</b>{' '}
            <span className="light">You can leave this page — we'll surface the finished report in your dashboard and notify you in the bell tray.</span>
          </div>
        </div>

        <div className="actions-row">
          <button className="btn btn-outline" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12 H 5" /><path d="M11 6 L 5 12 L 11 18" />
            </svg>
            Back
          </button>
          <button className="btn btn-primary" onClick={onSubmit}>
            <IconSpark size={14} />
            Submit for AI Scoring
          </button>
        </div>
      </div>

      {showHelper && (
        <div className="mini-card">
          <h3>What happens next</h3>
          <p>Submitting kicks off our four-stage AI pipeline. You'll get a full report including pronunciation, fluency, grammar and a vocabulary breakdown.</p>
          <div className="pipeline">
            {[
              { n: 1, label: 'Transcribe audio',         est: '~ 40 s' },
              { n: 2, label: 'Pronunciation analysis',   est: '~ 60 s' },
              { n: 3, label: 'Fluency + grammar scoring', est: '~ 90 s' },
              { n: 4, label: 'Generate coach summary',   est: '~ 30 s' },
            ].map((s) => (
              <div className="step-mini" key={s.n}>
                <span className="dot-mini">{s.n}</span>
                <span>{s.label}</span>
                <span className="est">{s.est}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── APP ─────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [step, setStep] = useState(t.currentStep || 1);
  const [data, setData] = useState({
    classId: 'ielts-am',
    student: 'nh',
    date: todayISO(),
    duration: 50,
    notes: '',
    file: t.fileLoaded ? {
      name: 'session_2026-05-16_nguyen-ha-linh.m4a',
      size: '38.4 MB',
      duration: '49:12',
    } : null,
    notify: true,
  });

  // Sync tweak → step
  useEffect(() => { setStep(t.currentStep); }, [t.currentStep]);
  useEffect(() => {
    setData((d) => ({
      ...d,
      file: t.fileLoaded ? (d.file || {
        name: 'session_2026-05-16_nguyen-ha-linh.m4a',
        size: '38.4 MB',
        duration: '49:12',
      }) : null,
    }));
  }, [t.fileLoaded]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const styleVars = {
    '--primary': t.primary,
    '--primary-600': shade(t.primary, -0.10),
    '--primary-700': shade(t.primary, -0.18),
    '--focus-ring': hexA(t.primary, 0.18),
    '--primary-tint': hexA(t.primary, 0.07),
    '--primary-tint-2': hexA(t.primary, 0.18),
  };

  const goStep = (n) => {
    setStep(n);
    setTweak('currentStep', n);
  };

  return (
    <div className="app" style={styleVars}>
      <Sidebar />

      <main className="main">
        <div className="topbar">
          <div className="breadcrumb">
            <span>Teacher</span>
            <span className="sep">/</span>
            <span className="now">Upload Session</span>
          </div>
          <div className="top-actions">
            <button className="top-btn"><span className="ico"><IconHelp size={15} /></span> Help</button>
            <button className="top-btn" style={{ paddingLeft: 10, paddingRight: 10, width: 34, justifyContent: 'center' }} aria-label="Notifications">
              <IconBell size={16} />
            </button>
          </div>
        </div>

        <div className="content">
          <div className="page-head">
            <div className="title-block">
              <div className="eyebrow">Upload</div>
              <h1>New Session Upload</h1>
              <div className="sub">Submit a recorded 1-on-1 lesson for AI scoring. Reports typically take about 4 minutes.</div>
            </div>
            <div className="helper">
              <IconClock size={15} />
              Avg. report ready in <b style={{ marginLeft: 4, color: 'var(--ink)' }}>4 min</b>
            </div>
          </div>

          <Stepper step={step} onStep={goStep} />

          {step === 1 && <Step1 data={data} set={set} onNext={() => goStep(2)} />}
          {step === 2 && <Step2 data={data} set={set} onNext={() => goStep(3)} onBack={() => goStep(1)} />}
          {step === 3 && <Step3 data={data} set={set} onBack={() => goStep(2)} onSubmit={() => alert('Submitted for AI scoring — report ETA ~4 minutes.')} showHelper={t.showHelper} />}
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Wizard" />
        <TweakRadio
          label="Active step"
          value={t.currentStep}
          options={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
          ]}
          onChange={(v) => setTweak('currentStep', v)}
        />
        <TweakToggle
          label="Audio uploaded"
          value={t.fileLoaded}
          onChange={(v) => setTweak('fileLoaded', v)}
        />
        <TweakToggle
          label="Show pipeline helper"
          value={t.showHelper}
          onChange={(v) => setTweak('showHelper', v)}
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

/* color helpers */
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
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
