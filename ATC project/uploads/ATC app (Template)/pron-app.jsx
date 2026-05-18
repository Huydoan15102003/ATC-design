const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "phase": "live",
  "current": 3,
  "micState": "scored",
  "primary": "#2563eb"
}/*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#2563eb', '#1d4ed8', '#1f6feb', '#3b6cf6'];

const CLASSES = [
  { id: 'ielts-am',   name: 'IELTS Speaking · Morning',   level: 'Intermediate', studentIds: ['nh', 'tp', 'pk'] },
  { id: 'biz-eng',    name: 'Business English · Evening', level: 'Advanced',     studentIds: ['lm', 'vq'] },
  { id: 'conv-b2',    name: 'Conversation · B2',          level: 'Intermediate', studentIds: ['dh'] },
];

const STUDENTS = [
  { id: 'nh', name: 'Nguyễn Hà Linh',   code: 'KL-1042' },
  { id: 'tp', name: 'Trần Phương Anh',  code: 'KL-1058' },
  { id: 'lm', name: 'Lê Minh Quân',     code: 'KL-1071' },
  { id: 'pk', name: 'Phạm Khánh Vy',    code: 'KL-1083' },
  { id: 'dh', name: 'Đỗ Hoàng Nam',     code: 'KL-1099' },
  { id: 'vq', name: 'Vũ Quỳnh Anh',     code: 'KL-1105' },
];

const DEFAULT_SENTENCES = [
  "The weather forecast predicted thunderstorms tomorrow afternoon.",
  "She thoroughly enjoyed the documentary about marine biology.",
  "Could you recommend a restaurant that serves authentic Vietnamese cuisine?",
  "He's been working remotely from a small coastal village in Da Nang.",
  "The committee will reconvene at three thirty on Wednesday.",
  "I'd rather walk through the old quarter than take a taxi.",
  "Pronunciation, intonation, and rhythm are equally important.",
  "",
  "",
  "",
];

// Mock scores for completed sentences
const MOCK_SCORES = [
  { overall: 88, stress: 90, intonation: 85, phoneme: 89 },
  { overall: 82, stress: 78, intonation: 84, phoneme: 84 },
];

function bandClass(n) {
  if (n >= 80) return 'good';
  if (n >= 60) return 'warn';
  return 'bad';
}
function initials(name) {
  return name.split(' ').slice(-2).map((s) => s[0]).join('').toUpperCase();
}

/* ─────────────── SIDEBAR ─────────────── */
function Sidebar() {
  const items = [
    { id: 'dash', label: 'Dashboard',              icon: IconHome },
    { id: 'up',   label: 'Upload Session',         icon: IconUpload },
    { id: 'pron', label: 'Pronunciation Assessment', icon: IconMic, active: true, badge: 'Live' },
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

/* ─────────────── LEFT PANEL ─────────────── */
function ClassPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  useEffect(() => {
    function onDoc(e) { if (!wrap.current?.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const selected = CLASSES.find((c) => c.id === value);
  return (
    <div ref={wrap} style={{ flex: 1, position: 'relative' }}>
      <div className="picker" onClick={() => setOpen((v) => !v)}>
        {selected ? (
          <>
            <span className="avatar" style={{ background: 'linear-gradient(135deg, #0f766e, #5eead4)' }}>
              <IconUsers size={12} />
            </span>
            <span style={{ fontWeight: 500 }}>{selected.name}</span>
            <span className="code">{selected.studentIds.length} students</span>
          </>
        ) : (
          <>
            <span className="empty"><IconUsers size={13} /></span>
            <span style={{ color: 'var(--muted)' }}>Choose a class…</span>
          </>
        )}
        <span className="chev"><IconChev size={14} /></span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', border: '1px solid var(--hair)', borderRadius: 10,
          padding: 6, zIndex: 20, boxShadow: 'var(--shadow-card-2)',
          maxHeight: 260, overflow: 'auto',
        }}>
          {CLASSES.map((c) => (
            <div key={c.id}
              onClick={() => { onChange(c.id); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 8px', borderRadius: 7, fontSize: 13.5,
                background: c.id === value ? 'var(--primary-tint)' : 'transparent',
                color: c.id === value ? 'var(--primary-700)' : 'var(--ink)',
              }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f766e, #5eead4)',
                color: '#fff', display: 'grid', placeItems: 'center',
              }}><IconUsers size={12} /></span>
              <div style={{ flex: 1, lineHeight: 1.25 }}>
                <div>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>{c.level} · {c.studentIds.length} students</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentPicker({ value, onChange, classId }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  useEffect(() => {
    function onDoc(e) { if (!wrap.current?.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const selected = STUDENTS.find((s) => s.id === value);
  const cls = CLASSES.find((c) => c.id === classId);
  const classStudents = cls
    ? STUDENTS.filter((s) => cls.studentIds.includes(s.id))
    : [];
  const disabled = !classId;

  return (
    <div ref={wrap} style={{ flex: 1, position: 'relative' }}>
      <div
        className="picker"
        onClick={() => !disabled && setOpen((v) => !v)}
        style={disabled ? { opacity: 0.55, cursor: 'not-allowed' } : null}
      >
        {selected ? (
          <>
            <span className="avatar">{initials(selected.name)}</span>
            <span style={{ fontWeight: 500 }}>{selected.name}</span>
            <span className="code">{selected.code}</span>
          </>
        ) : (
          <>
            <span className="empty"><IconUsers size={13} /></span>
            <span style={{ color: 'var(--muted)' }}>{disabled ? 'Select a class first' : 'Assign to student…'}</span>
          </>
        )}
        <span className="chev"><IconChev size={14} /></span>
      </div>
      {open && !disabled && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', border: '1px solid var(--hair)', borderRadius: 10,
          padding: 6, zIndex: 20, boxShadow: 'var(--shadow-card-2)',
          maxHeight: 260, overflow: 'auto',
        }}>
          {classStudents.length === 0 ? (
            <div style={{ padding: 14, fontSize: 13, color: 'var(--muted)' }}>No students in this class yet.</div>
          ) : classStudents.map((s) => (
            <div key={s.id}
              onClick={() => { onChange(s.id); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 8px', borderRadius: 7, fontSize: 13.5,
                background: s.id === value ? 'var(--primary-tint)' : 'transparent',
                color: s.id === value ? 'var(--primary-700)' : 'var(--ink)',
              }}>
              <span className="avatar" style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #6ea8ff)',
                color: '#fff', fontSize: 11, fontWeight: 600,
                display: 'grid', placeItems: 'center',
              }}>{initials(s.name)}</span>
              <span style={{ flex: 1 }}>{s.name}</span>
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: 11, color: 'var(--muted-2)',
              }}>{s.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SetupPane({ sentences, setSentences, classId, setClass, student, setStudent, currentIdx, doneCount, canStart, onStart, phase }) {
  const filled = sentences.filter((s) => s.trim()).length;

  const update = (i, v) => {
    const next = [...sentences];
    next[i] = v;
    setSentences(next);
  };
  const remove = (i) => {
    const filledCount = sentences.filter((s) => s.trim()).length;
    if (filledCount <= 1) { update(i, ''); return; }
    const next = sentences.filter((_, idx) => idx !== i);
    while (next.length < 10) next.push('');
    setSentences(next);
  };
  const add = () => {
    const i = sentences.findIndex((s) => !s.trim());
    if (i === -1) return;
    // focus that input
    setTimeout(() => {
      document.querySelector(`[data-sn="${i}"]`)?.focus();
    }, 0);
  };

  return (
    <aside className="pane-l">
      <div className="pane-head">
        <div className="eyebrow">Setup</div>
        <h1>Assessment Sentences</h1>
        <div className="sub">Add up to 10 sentences. During the 10-minute segment, the student reads each one aloud into the mic.</div>
      </div>

      <div className="assign-row">
        <span className="lbl">Class</span>
        <ClassPicker value={classId} onChange={setClass} />
      </div>
      <div className="assign-row">
        <span className="lbl">Assign to</span>
        <StudentPicker value={student} onChange={setStudent} classId={classId} />
      </div>

      <div className="sentences-head">
        <span className="title">Sentences</span>
        <span className="count"><b>{filled}</b> / 10</span>
      </div>

      <div className="sentence-list">
        {sentences.map((s, i) => {
          const isEmpty = !s.trim();
          const isCurrent = phase === 'live' && i === currentIdx;
          const isDone = phase === 'live' && i < doneCount;
          return (
            <div key={i} className={`sentence-row ${isEmpty ? 'empty' : ''} ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}>
              <span className="num">
                {isDone ? <IconCheck size={12} /> : String(i + 1).padStart(2, '0')}
              </span>
              <input
                data-sn={i}
                className="inp"
                value={s}
                onChange={(e) => update(i, e.target.value)}
                placeholder={isEmpty ? `Sentence ${i + 1}…` : ''}
                disabled={phase !== 'setup'}
              />
              <button className="del" onClick={() => remove(i)} aria-label="Remove sentence">
                <IconTrash size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="list-actions">
        <button className="btn btn-outline" onClick={add} disabled={filled >= 10 || phase !== 'setup'}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5 V 19" /><path d="M5 12 H 19" /></svg>
          Add sentence
        </button>
        <button className="btn btn-soft" disabled={phase !== 'setup'}>
          <IconSpark size={14} />
          Generate sentences
        </button>
      </div>

      <div className="start-cluster">
        <div className="hint">
          <IconInfo size={13} />
          {phase === 'setup'
            ? canStart ? 'Ready to start when the student is at the mic.' : 'Add at least 3 sentences and assign a student to begin.'
            : phase === 'live' ? 'Assessment is in progress on the right.'
            : 'Assessment complete.'}
        </div>
        {phase === 'setup' ? (
          <button className={`btn btn-primary ${!canStart ? 'disabled' : ''}`} disabled={!canStart} onClick={onStart}>
            <IconPlay size={14} />
            Start Assessment
          </button>
        ) : (
          <button className="btn btn-outline">
            <IconX size={14} />
            End session
          </button>
        )}
      </div>
    </aside>
  );
}

/* ─────────────── RIGHT PANEL ─────────────── */
function LiveEmpty() {
  return (
    <div className="live-empty">
      <div className="ill"><IconMic size={36} /></div>
      <h2>Live assessment will appear here</h2>
      <p>Build your sentence list on the left, assign a student, then hit <b style={{ color: 'var(--ink-2)' }}>Start Assessment</b>. The student will read each sentence into the mic, one at a time.</p>

      <div className="steps-mini">
        <div className="step-mini"><span className="n">1</span><span>Add sentences</span></div>
        <div className="step-mini"><span className="n">2</span><span>Assign student</span></div>
        <div className="step-mini"><span className="n">3</span><span>Start &amp; record</span></div>
      </div>
    </div>
  );
}

function LiveProgress({ total, done, current }) {
  return (
    <div className="progress-block">
      <div className="meta">
        <span className="l">{done} of {total} sentences completed</span>
        <span className="r">{Math.round((done / total) * 100)}% · ~{Math.max(1, total - done)} min remaining</span>
      </div>
      <div className="track">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`seg ${i < done ? 'done' : i === current ? 'cur' : ''}`} />
        ))}
      </div>
    </div>
  );
}

function Waveform({ recording }) {
  // 36 bars with deterministic-ish heights
  const heights = useMemo(() => Array.from({ length: 36 }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 0.71))), []);
  return (
    <div className={`wave ${recording ? 'recording' : ''}`}>
      {heights.map((h, i) => (
        <span key={i} className="b" style={{
          animationDelay: `${i * 0.04}s`,
          height: `${Math.round(h * 38) + 6}px`,
        }} />
      ))}
    </div>
  );
}

function ScorePill({ label, value }) {
  return (
    <span className={`pill ${bandClass(value)}`}>
      <span className="label">{label}</span>
      <span className="v">{value}</span>
    </span>
  );
}

function ScoreCard({ score, onNext, isLast }) {
  return (
    <div className="score-card">
      <div className="row1">
        <div>
          <div className="overall">
            <span className="n" style={{ color: bandColor(score.overall) }}>{score.overall}</span>
            <span className="d">/ 100</span>
          </div>
          <div className="verdict">
            <b>{verdictFor(score.overall)}.</b> Native benchmark comparison ready.
          </div>
        </div>
        <div className="pills">
          <ScorePill label="Stress" value={score.stress} />
          <ScorePill label="Intonation" value={score.intonation} />
          <ScorePill label="Phoneme" value={score.phoneme} />
        </div>
      </div>
      <div className="row2">
        <div className="note">
          <b>Tip:</b> word-final consonants on <i>"thunderstorms"</i> were soft — try a sharper /z/ release.
        </div>
        <div className="actions">
          <button className="btn btn-outline" style={{ height: 34, fontSize: 13 }}>
            <IconPlay size={13} /> Replay
          </button>
          <button className="btn btn-primary" style={{ height: 34, fontSize: 13 }} onClick={onNext}>
            {isLast ? 'Finish assessment' : 'Next sentence'}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 H 19" /><path d="M13 6 L 19 12 L 13 18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function bandColor(n) {
  if (n >= 80) return 'var(--success)';
  if (n >= 60) return 'var(--warn)';
  return 'var(--danger)';
}
function verdictFor(n) {
  if (n >= 85) return 'Excellent — close to native rhythm';
  if (n >= 75) return 'Solid — minor stress refinements';
  if (n >= 60) return 'Developing — intonation needs work';
  return 'Needs practice — focus on phonemes';
}

function LivePane({ student, sentences, current, micState, setMicState, onNext, onFinish, phase }) {
  const filledSentences = sentences.filter((s) => s.trim());
  const total = filledSentences.length;
  const done = Math.min(current, total);
  const stu = STUDENTS.find((s) => s.id === student);
  const currentSentence = filledSentences[current] ?? filledSentences[total - 1];

  return (
    <section className="pane-r">
      <div className="live-head">
        <div className="left">
          {stu && (
            <div className="student-chip">
              <span className="avatar">{initials(stu.name)}</span>
              <span className="name">{stu.name}</span>
              <span className="code">{stu.code}</span>
            </div>
          )}
        </div>
        <div className="session-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <IconClock size={14} />
            10:00 segment · <b style={{ color: 'var(--ink-2)' }}>6:42 left</b>
          </span>
          <span className="pill"><span className="dot" /> LIVE</span>
        </div>
      </div>

      <LiveProgress total={total} done={done} current={current} />

      <div className="live-stage">
        <div className="sentence-card">
          <div className="crumb">Sentence <b>{Math.min(current + 1, total)}</b> of {total}</div>
          <div className="text" lang="en">"{currentSentence}"</div>
          <div className="ipa">
            /ðə ˈweðər ˈfɔːrkæst prɪˈdɪktɪd ˈθʌndərˌstɔːrmz təˈmɑːroʊ ˌæftərˈnuːn/
          </div>
        </div>

        <div className="mic-stage">
          <button
            className={`mic ${micState === 'recording' ? 'recording' : 'idle'}`}
            onClick={() => setMicState(micState === 'recording' ? 'idle' : 'recording')}
            aria-label={micState === 'recording' ? 'Stop recording' : 'Start recording'}
          >
            {micState === 'recording' ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
            ) : (
              <IconMic size={32} />
            )}
          </button>
          <div className="mic-label">
            {micState === 'idle' && 'Tap to record'}
            {micState === 'recording' && <><span className="rec">● Recording</span> · tap to stop</>}
            {micState === 'scored' && 'Recording complete'}
          </div>
          {(micState === 'recording' || micState === 'scored') && (
            <Waveform recording={micState === 'recording'} />
          )}
        </div>

        {micState === 'scored' && (
          <ScoreCard
            score={MOCK_SCORES[0]}
            isLast={current >= total - 1}
            onNext={() => {
              if (current >= total - 1) onFinish();
              else onNext();
            }}
          />
        )}
      </div>
    </section>
  );
}

/* completed view */
function CompletedPane({ student, sentences }) {
  const filled = sentences.filter((s) => s.trim());
  // deterministic-ish mock scores
  const rows = filled.map((s, i) => {
    const seed = (i + 1) * 13;
    const overall = 62 + ((seed * 7) % 32);
    const stress = clamp(overall + ((seed * 3) % 12) - 6);
    const into = clamp(overall + ((seed * 5) % 14) - 7);
    const phon = clamp(overall + ((seed * 11) % 10) - 5);
    return { i, s, overall, stress, into, phon };
  });
  const avg = Math.round(rows.reduce((a, r) => a + r.overall, 0) / rows.length);
  const best = Math.max(...rows.map((r) => r.overall));
  const weakest = Math.min(...rows.map((r) => r.overall));
  const stu = STUDENTS.find((s) => s.id === student);

  return (
    <section className="pane-r">
      <div className="live-head">
        <div className="left">
          {stu && (
            <div className="student-chip">
              <span className="avatar">{initials(stu.name)}</span>
              <span className="name">{stu.name}</span>
              <span className="code">{stu.code}</span>
            </div>
          )}
        </div>
        <div className="session-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <IconClock size={14} />
            Completed at 14:38 · <b style={{ color: 'var(--ink-2)' }}>9 min 12 s</b>
          </span>
        </div>
      </div>

      <div className="complete-head">
        <div className="ico-tile"><IconCheck size={26} /></div>
        <h2>Assessment complete</h2>
        <p>All {filled.length} sentences scored against native benchmark. Review and save below.</p>
      </div>

      <div className="summary-card">
        <div className="summary-totals">
          <div>
            <div className="big">
              <span className="n" style={{ color: bandColor(avg) }}>{avg}</span>
              <span className="d">/ 100 avg</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
              {verdictFor(avg)}
            </div>
          </div>
          <div className="stat">
            <div className="k">Best</div>
            <div className="v">{best} <span style={{ fontSize: 13, color: 'var(--muted-2)', fontWeight: 500 }}>/ 100</span></div>
          </div>
          <div className="stat">
            <div className="k">Weakest</div>
            <div className="v">{weakest} <span style={{ fontSize: 13, color: 'var(--muted-2)', fontWeight: 500 }}>/ 100</span></div>
          </div>
          <div className="stat">
            <div className="k">Focus area</div>
            <div className="v" style={{ fontSize: 15 }}>Intonation</div>
          </div>
        </div>
        <table className="scores">
          <thead>
            <tr>
              <th></th>
              <th>Sentence</th>
              <th style={{ width: 80 }}>Overall</th>
              <th style={{ width: 260 }}>Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.i}>
                <td className="num">{String(r.i + 1).padStart(2, '0')}</td>
                <td className="sent">{r.s}</td>
                <td className="score"><b style={{ color: bandColor(r.overall) }}>{r.overall}</b> <span style={{ color: 'var(--muted-2)' }}>/ 100</span></td>
                <td className="pills">
                  <span style={{ display: 'inline-flex', gap: 6 }}>
                    <ScorePill label="S" value={r.stress} />
                    <ScorePill label="I" value={r.into} />
                    <ScorePill label="P" value={r.phon} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="finish-row">
        <div className="legend">
          <span className="it"><span className="sw g" /> ≥ 80</span>
          <span className="it"><span className="sw a" /> 60–79</span>
          <span className="it"><span className="sw r" /> &lt; 60</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 V 15" /><path d="M7 10 L 12 15 L 17 10" /><path d="M4 19 H 20" /></svg>
            Export PDF
          </button>
          <button className="btn btn-primary">
            <IconCheck size={14} />
            Finish &amp; Save
          </button>
        </div>
      </div>
    </section>
  );
}

function clamp(n) { return Math.max(35, Math.min(98, Math.round(n))); }

/* ─────────────── APP ─────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [phase, setPhase] = useState(t.phase);        // 'setup' | 'live' | 'complete'
  const [current, setCurrent] = useState(t.current);  // index into filledSentences
  const [micState, setMic] = useState(t.micState);    // 'idle' | 'recording' | 'scored'
  const [sentences, setSentences] = useState(DEFAULT_SENTENCES);
  const [classId, setClassId] = useState('ielts-am');
  const [student, setStudent] = useState('nh');

  // sync tweaks
  useEffect(() => { setPhase(t.phase); }, [t.phase]);
  useEffect(() => { setCurrent(t.current); }, [t.current]);
  useEffect(() => { setMic(t.micState); }, [t.micState]);

  const filledCount = sentences.filter((s) => s.trim()).length;
  const canStart = filledCount >= 3 && !!student && !!classId;

  const styleVars = {
    '--primary': t.primary,
    '--primary-600': shade(t.primary, -0.10),
    '--primary-700': shade(t.primary, -0.18),
    '--focus-ring': hexA(t.primary, 0.18),
    '--primary-tint': hexA(t.primary, 0.07),
    '--primary-tint-2': hexA(t.primary, 0.18),
  };

  return (
    <div className="app" style={styleVars}>
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div className="breadcrumb">
            <span>Teacher</span>
            <span className="sep">/</span>
            <span className="now">Pronunciation Assessment</span>
          </div>
          <div className="top-actions">
            <button className="top-btn"><IconHelp size={15} /> Help</button>
            <button className="top-btn" aria-label="Notifications" style={{ width: 34, justifyContent: 'center', padding: 0 }}>
              <IconBell size={16} />
            </button>
          </div>
        </div>

        <div className="split">
          <SetupPane
            sentences={sentences}
            setSentences={setSentences}
            classId={classId}
            setClass={(v) => { setClassId(v); const c = CLASSES.find(c => c.id === v); if (c && !c.studentIds.includes(student)) setStudent(c.studentIds[0] || null); }}
            student={student}
            setStudent={setStudent}
            currentIdx={current}
            doneCount={Math.min(current, filledCount)}
            canStart={canStart}
            onStart={() => { setPhase('live'); setTweak('phase', 'live'); setCurrent(0); setTweak('current', 0); setMic('idle'); setTweak('micState', 'idle'); }}
            phase={phase}
          />

          {phase === 'setup' && <section className="pane-r"><LiveEmpty /></section>}

          {phase === 'live' && (
            <LivePane
              student={student}
              sentences={sentences}
              current={current}
              micState={micState}
              setMicState={(v) => { setMic(v); setTweak('micState', v); }}
              onNext={() => {
                const nx = Math.min(current + 1, filledCount - 1);
                setCurrent(nx); setTweak('current', nx);
                setMic('idle'); setTweak('micState', 'idle');
              }}
              onFinish={() => { setPhase('complete'); setTweak('phase', 'complete'); }}
              phase={phase}
            />
          )}

          {phase === 'complete' && (
            <CompletedPane student={student} sentences={sentences} />
          )}
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Flow" />
        <TweakRadio
          label="Phase"
          value={t.phase}
          options={[
            { value: 'setup',    label: 'Setup' },
            { value: 'live',     label: 'Live' },
            { value: 'complete', label: 'Done' },
          ]}
          onChange={(v) => setTweak('phase', v)}
        />
        <TweakRadio
          label="Mic state"
          value={t.micState}
          options={[
            { value: 'idle',      label: 'Idle' },
            { value: 'recording', label: 'Rec' },
            { value: 'scored',    label: 'Scored' },
          ]}
          onChange={(v) => setTweak('micState', v)}
        />
        <TweakSlider
          label="Sentence #"
          value={t.current}
          min={0} max={6} step={1}
          onChange={(v) => setTweak('current', v)}
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
