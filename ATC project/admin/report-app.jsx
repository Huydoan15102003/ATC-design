const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#2563eb",
  "band": "current",
  "activeTab": "speaking",
  "transcriptMode": "full",
  "grammarOpen": true
} /*EDITMODE-END*/;

const PRIMARY_OPTIONS = ['#2563eb', '#1d4ed8', '#1f6feb', '#3b6cf6'];

/* ─────────────── MOCK DATA ─────────────── */
const SESSION = {
  date: 'May 14, 2026',
  duration: '50 min',
  teacher: 'Ms. Park Ji Yeon',
  teacherInitials: 'PJ'
};

const STUDENT = {
  name: 'Nguyễn Hà Linh',
  code: 'KL-1042',
  initials: 'HL'
};

const SPEAKING_METRICS = {
  label: 'Speaking Session',
  cards: [
  { key: 'sp-overall', label: 'Overall', value: 79, verdict: 'Close to top tier', featured: true },
  { key: 'fluency', label: 'Fluency', value: 82, verdict: 'Confident pacing' },
  { key: 'grammar', label: 'Grammar', value: 74, verdict: 'Tense slips to refine' },
  { key: 'vocabulary', label: 'Vocabulary', value: 81, verdict: 'Good range' }]

};

const PRONUNCIATION_METRICS = {
  label: 'Pronunciation',
  cards: [
  { key: 'pr-overall', label: 'Overall', value: 83, verdict: 'Near native rhythm', featured: true },
  { key: 'stress', label: 'Stress', value: 85, verdict: 'Natural emphasis' },
  { key: 'intonation', label: 'Intonation', value: 82, verdict: 'Mostly clear melody' },
  { key: 'phoneme', label: 'Phoneme', value: 82, verdict: 'A few sound refinements' }]

};

const PRON_SENTENCES = [
{
  sentence: "The weather in Hanoi is quite humid in summer.",
  base: 88, stress: 90, intonation: 86, phoneme: 88,
  feedback: ["Excellent stress pattern.", "Watch the /θ/ sound in “the” and “weather” — try touching the tongue tip to the upper teeth."]
},
{
  sentence: "I usually take the bus to work because it's cheaper.",
  base: 81, stress: 84, intonation: 80, phoneme: 79,
  feedback: ["Clear intonation overall.", "Try linking “because it's” more smoothly — sounds like /bɪˈkɒz ɪts/."]
},
{
  sentence: "She has been studying English for three years.",
  base: 76, stress: 78, intonation: 74, phoneme: 76,
  feedback: ["Good rhythm on “studying English”.", "Stress “three years” a bit more strongly — the duration is the key info here."]
},
{
  sentence: "Could you please pass me the salt?",
  base: 92, stress: 94, intonation: 93, phoneme: 89,
  feedback: ["Excellent — natural rising tone for a polite request."]
},
{
  sentence: "We should arrive at the airport two hours early.",
  base: 85, stress: 86, intonation: 84, phoneme: 84,
  feedback: ["Word stress on “airport” was clear.", "Slight under-aspiration on the /h/ in “hours” — push more air."]
},
{
  sentence: "The documentary about climate change was eye-opening.",
  base: 71, stress: 73, intonation: 68, phoneme: 72,
  feedback: ["Long sentence — take a small breath after “climate change”.", "“Eye-opening” needs a stronger pause and the primary stress on “eye”."]
},
{
  sentence: "He suggested that we meet at the new café downtown.",
  base: 79, stress: 78, intonation: 81, phoneme: 78,
  feedback: ["Good rhythm.", "Softer /dʒ/ on “suggested” recommended — currently a touch too sharp."]
},
{
  sentence: "I'd rather walk than take a taxi in this traffic.",
  base: 84, stress: 86, intonation: 84, phoneme: 82,
  feedback: ["Natural and confident — keep the contraction “I'd”."]
},
{
  sentence: "My sister works as a software engineer in Singapore.",
  base: 86, stress: 88, intonation: 84, phoneme: 86,
  feedback: ["Clean phonemes throughout.", "Vary the intonation slightly on “in Singapore” to avoid a flat ending."]
},
{
  sentence: "The presentation went better than I expected.",
  base: 88, stress: 90, intonation: 89, phoneme: 85,
  feedback: ["Strong finish.", "The /t/ in “expected” could be a touch sharper — release the stop fully."]
}];


// Transcript turns. `text` is an array of strings + {type, text, note} highlight objects.
const TRANSCRIPT = [
{ who: 'teacher', time: '00:42', text: ["How was your weekend, Hà Linh? Did you do anything fun?"] },
{ who: 'student', time: '00:51', text: [
  "It was really nice, thank you. ",
  { type: 'good', text: "I went to Hạ Long Bay with my family", note: { k: 'Good past tense', body: "Correct use of simple past — clear and natural." } },
  " on Saturday."]
},
{ who: 'teacher', time: '01:08', text: ["Oh, lovely. What did you do there?"] },
{ who: 'student', time: '01:13', text: [
  "We took a boat tour around the islands and ",
  { type: 'warn', text: "visit", note: { k: 'Tense slip', body: "Try “visited” — once you start in past tense, keep the chain going." } },
  " some caves. The weather was perfect — sunny but not too hot."]
},
{ who: 'teacher', time: '01:34', text: ["Sounds amazing. Have you been to Hạ Long before?"] },
{ who: 'student', time: '01:40', text: [
  "Yes, this was my second time. The first time ",
  { type: 'warn', text: "I went was", note: { k: 'Word order', body: "More natural: “the first time I went, I was a child”." } },
  " when I was a child, so I don't remember much. This trip ",
  { type: 'good', text: "was much more memorable", note: { k: 'Strong phrasing', body: "Great comparative — “much more” adds nice emphasis." } },
  "."]
}];


const GRAMMAR_NOTES = [
{
  pattern: "Past-tense consistency",
  example: <>When narrating past events, keep all verbs in the past form. <span className="strike">“We took a boat tour and visit some caves.”</span> → <span className="fix">“…and visited some caves.”</span></>
},
{
  pattern: "Compound-noun word order",
  example: <>For time references, try <code>“the first time I went, I was a child”</code> rather than “the first time I went was when I was a child.” It sounds more natural.</>
},
{
  pattern: "Comparative emphasis — “much more”",
  example: <>Good use of <code>“much more memorable”</code>. For variety, also try <code>“far more”</code> or <code>“a lot more”</code> in casual speech.</>
}];


/* ─────────────── HELPERS ─────────────── */
function bandClass(n) {
  if (n >= 80) return 'good';
  if (n >= 60) return 'warn';
  return 'bad';
}
function bandColor(n) {
  if (n >= 80) return 'var(--success)';
  if (n >= 60) return 'var(--warn)';
  return 'var(--danger)';
}
function bandTextColor(n) {
  if (n >= 80) return 'var(--success-2)';
  if (n >= 60) return 'var(--warn-2)';
  return 'var(--danger)';
}
function verdictWord(n) {
  if (n >= 85) return 'Strong';
  if (n >= 75) return 'Solid';
  if (n >= 60) return 'Developing';
  return 'Needs work';
}
function clamp(n) {return Math.max(28, Math.min(98, Math.round(n)));}

// Shift all scores by the chosen band (so we can preview green / amber / red runs)
function applyBand(value, band) {
  if (band === 'strong') return clamp(value + 10);
  if (band === 'weak') return clamp(value - 25);
  return value;
}

/* ─────────────── SIDEBAR (Student role) ─────────────── */
function Sidebar() {
  const items = [
  { id: 'reports', label: 'My Reports', icon: IconFile, active: true, badge: 'New' },
  { id: 'history', label: 'Session History', icon: IconHistory },
  { id: 'progress', label: 'My Progress', icon: IconTrend }];

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
            <a key={it.id} className={`sb-item ${it.active ? 'active' : ''}`}>
              <span className="ico"><Icon size={17} /></span>
              <span>{it.label}</span>
              {it.badge && <span className="sb-badge">{it.badge}</span>}
            </a>);

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
    </aside>);

}

/* ─────────────── PAGE HEAD ─────────────── */
function PageHead() {
  return (
    <div className="page-head">
      <div className="ph-left">
        <div className="ph-eyebrow">Session · 1-on-1 Coaching</div>
        <h1>Session Report</h1>
        <div className="ph-meta">
          <b>{SESSION.date}</b>
          <span className="dot">·</span>
          <span>{SESSION.duration}</span>
          <span className="dot">·</span>
          <span>Teacher: <b>{SESSION.teacher}</b></span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline">
          <IconPlay2 size={14} />
          Play recording
        </button>
        <button className="btn btn-outline">
          <IconDownload size={14} />
          Download PDF
        </button>
      </div>
    </div>);

}

/* ─────────────── INLINE SCORE ROW (top of each tab panel) ─────────────── */
function InlineScoreRow({ cards, band }) {
  const items = cards.map((m) => ({ ...m, value: applyBand(m.value, band) }));
  const lead = items.find((c) => c.featured) || items[0];
  const rest = items.filter((c) => c !== lead);
  return (
    <div className="score-row" role="group" aria-label="Scores">
      <span className="item lead">
        <span className="k">{lead.label}</span>
        <span className="v" style={{ color: bandTextColor(lead.value) }}>{lead.value}</span>
        <span className="d">/100</span>
      </span>
      {rest.map((m) =>
      <React.Fragment key={m.key}>
          <span className="sep"></span>
          <span className="item">
            <span className="k">{m.label}</span>
            <span className="v" style={{ color: bandTextColor(m.value) }}>{m.value}</span>
          </span>
        </React.Fragment>
      )}
    </div>);

}

/* ─────────────── SECTION 1 — METRIC GROUPS ─────────────── */
function MetricCard({ m }) {
  const cls = bandClass(m.value);
  const fillColor = bandColor(m.value);
  return (
    <div className={`metric ${m.featured ? 'primary' : ''}`}>
      <div className="m-eyebrow">
        <span>{m.label}</span>
        <span className={`verdict ${cls}`}>{verdictWord(m.value)}</span>
      </div>
      <div className="m-num">
        <span className="n" style={{ color: bandTextColor(m.value) }}>{m.value}</span>
        <span className="d">/ 100</span>
      </div>
      <div className="m-bar">
        <div className="fill" style={{ width: `${m.value}%`, background: fillColor }} />
      </div>
      <div className="m-label">{m.verdict}</div>
    </div>);

}

function MetricGroup({ group, band }) {
  const cards = group.cards.map((m) => {
    const value = applyBand(m.value, band);
    let verdict = m.verdict;
    if (band === 'strong') verdict = value >= 90 ? 'Near native' : 'Strong work';
    if (band === 'weak') verdict = value < 60 ? 'Needs practice' : 'Developing';
    return { ...m, value, verdict };
  });
  const overall = cards.find((c) => c.featured) || cards[0];
  return (
    <div className="metric-group">
      <div className="group-head">
        <span className="label">{group.label}</span>
        <span className="gh-summary">
          AVG <b style={{ color: bandTextColor(overall.value) }}>{overall.value}</b> / 100
        </span>
      </div>
      <div className="cards">
        {cards.map((m) => <MetricCard key={m.key} m={m} />)}
      </div>
    </div>);

}

function MetricsSection({ band }) {
  return (
    <section className="section">
      <div className="section-head">
        <div className="left">
          <span className="eyebrow">01 — Scores</span>
          <h2>Session Performance</h2>
        </div>
      </div>
      <div className="metrics-split">
        <MetricGroup group={SPEAKING_METRICS} band={band} />
        <MetricGroup group={PRONUNCIATION_METRICS} band={band} />
      </div>
    </section>);

}

/* ─────────────── SECTION 2 — SPEAKING RATIO ─────────────── */
function SpeakingRatioCard({ band }) {
  // Slight ratio shifts for the band variants so the recommendation pill stays meaningful
  let student = 58;
  if (band === 'strong') student = 62;
  if (band === 'weak') student = 38;
  const teacher = 100 - student;
  const inRange = student >= 55 && student <= 65;
  return (
    <div className="ratio-card">
      <div className="ratio-bar">
        <div className="seg student" style={{ width: `${student}%` }}>
          <span className="who">YOU</span>{student}%
        </div>
        <div className="seg teacher" style={{ width: `${teacher}%` }}>
          <span className="who">TEACHER</span>{teacher}%
        </div>
      </div>
      <div className="ratio-note">
        <span className={`pill-check ${inRange ? '' : 'bad'}`}>
          <IconCheck size={12} />
          {inRange ? 'In target zone' : 'Aim to talk more next time'}
        </span>
        <span className="target">
          Recommended student speaking ratio · <b>55–65%</b>
        </span>
      </div>
    </div>);

}

/* ─────────────── SECTION 3 — PRONUNCIATION ─────────────── */
function PronRow({ row, idx, defaultOpen, band }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const overall = applyBand(row.base, band);
  const stress = applyBand(row.stress, band);
  const intonation = applyBand(row.intonation, band);
  const phoneme = applyBand(row.phoneme, band);
  return (
    <div className={`pron-row ${open ? 'open' : ''}`}>
      <div className="pr-head" onClick={() => setOpen((v) => !v)}>
        <span className="pr-num">{String(idx + 1).padStart(2, '0')}</span>
        <span className="pr-sent">“{row.sentence}”</span>
        <span className={`pr-score ${bandClass(overall)}`}>
          {overall}<span className="d">/100</span>
        </span>
        <span className="pr-chev"><IconChevR size={15} /></span>
      </div>
      {open &&
      <div className="pr-body">
          <div className="pr-feedback">
            <span className="lead">
              <IconSparkle size={11} />
              AI feedback
            </span>
            {row.feedback.map((p, i) =>
          <span key={i}>{i > 0 ? ' ' : ''}{p}</span>
          )}
          </div>
          <div className="pr-subs">
            <span className={`sub-pill ${bandClass(stress)}`}>
              <span className="label">Stress</span><span className="v">{stress}</span>
            </span>
            <span className={`sub-pill ${bandClass(intonation)}`}>
              <span className="label">Intonation</span><span className="v">{intonation}</span>
            </span>
            <span className={`sub-pill ${bandClass(phoneme)}`}>
              <span className="label">Phoneme</span><span className="v">{phoneme}</span>
            </span>
          </div>
        </div>
      }
    </div>);

}

function PronunciationPanel({ band }) {
  return (
    <div className="tab-panel">
      <InlineScoreRow cards={PRONUNCIATION_METRICS.cards} band={band} />
      <div className="panel-sub">
        <span className="t">
          <span className="lbl">Per-sentence breakdown</span>
        </span>
        <span className="meta">10 SENTENCES</span>
      </div>
      <div className="pron-list">
        {PRON_SENTENCES.map((row, i) =>
        <PronRow
          key={i}
          row={row}
          idx={i}
          defaultOpen={i < 2}
          band={band} />

        )}
      </div>
    </div>);

}

/* ─────────────── SECTION 4 — TRANSCRIPT ─────────────── */
function TurnText({ parts, mode }) {
  // mode: 'full' shows everything; 'highlights' shows only the highlighted spans (with thin connectors)
  if (mode === 'highlights') {
    const highlights = parts.filter((p) => typeof p === 'object');
    if (highlights.length === 0) {
      return <span style={{ color: 'var(--muted-2)', fontStyle: 'italic' }}>— no highlights —</span>;
    }
    return (
      <>
        {highlights.map((p, i) =>
        <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--muted-3)', margin: '0 6px' }}>…</span>}
            <span className={`hl ${p.type}`}>
              {p.text}
              <span className="tip">
                <span className="k">{p.note.k}</span>
                {p.note.body}
              </span>
            </span>
          </React.Fragment>
        )}
      </>);

  }
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === 'string') return <React.Fragment key={i}>{p}</React.Fragment>;
        return (
          <span key={i} className={`hl ${p.type}`}>
            {p.text}
            <span className="tip">
              <span className="k">{p.note.k}</span>
              {p.note.body}
            </span>
          </span>);

      })}
    </>);

}

function TranscriptCard({ mode, setMode }) {
  return (
    <>
      <div className="panel-sub">
        <span className="t"><span className="lbl">Transcript</span></span>
        <div className="transcript-tools">
          <div className="segmented">
            <button className={mode === 'full' ? 'on' : ''} onClick={() => setMode('full')}>
              Full transcript
            </button>
            <button className={mode === 'highlights' ? 'on' : ''} onClick={() => setMode('highlights')}>
              Highlights only
            </button>
          </div>
        </div>
      </div>
      <div className="transcript">
        <div className="turns">
          {TRANSCRIPT.map((t, i) =>
          <div key={i} className={`turn ${t.who}`}>
              <div className="who">
                {t.who === 'teacher' ? SESSION.teacher : 'You'}
                <span className="time">{t.time}</span>
              </div>
              <div className="bubble">
                <TurnText parts={t.text} mode={mode} />
              </div>
            </div>
          )}
        </div>
        <div className="transcript-foot">
          <div className="left">
            <span>Hover highlights for tips</span>
            <span className="legend">
              <span className="it"><span className="sw g" /> good</span>
              <span className="it"><span className="sw a" /> minor</span>
              <span className="it"><span className="sw r" /> error</span>
            </span>
          </div>
          <button className="btn btn-ghost" style={{ height: 30, fontSize: 12.5 }}>
            <IconChevD size={12} />
            Show 24 more turns
          </button>
        </div>
      </div>
    </>);

}

function SpeakingPanel({ mode, setMode, grammarOpen, setGrammarOpen, band }) {
  return (
    <div className="tab-panel">
      <InlineScoreRow cards={SPEAKING_METRICS.cards} band={band} />

      <div>
        <div className="panel-sub">
          <span className="t"><span className="lbl">Talk time</span></span>
        </div>
        <SpeakingRatioCard band={band} />
      </div>

      <TranscriptCard mode={mode} setMode={setMode} />
      <div style={{ marginTop: 10 }}>
        <div className="panel-sub">
          <span className="t"><span className="lbl">Grammar Notes</span></span>
        </div>
        <GrammarCard open={grammarOpen} setOpen={setGrammarOpen} />
      </div>
    </div>);

}

/* grammar notes */
function GrammarCard({ open, setOpen }) {
  return (
    <div className={`grammar-card ${open ? 'open' : ''}`} style={{ marginTop: 0 }}>
      <div className="grammar-head" onClick={() => setOpen(!open)}>
        <div className="ico-tile"><IconLightbulb size={17} /></div>
        <div>
          <div className="title">Patterns to review</div>
          <div className="sub">3 grammar notes from this session</div>
        </div>
        <div className="meta">
          <span className="count">{GRAMMAR_NOTES.length} ITEMS</span>
          <span className="chev"><IconChevD size={15} /></span>
        </div>
      </div>
      {open &&
      <div className="grammar-body">
          <ul>
            {GRAMMAR_NOTES.map((n, i) =>
          <li key={i}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="pattern">{n.pattern}</div>
                  <div className="example">{n.example}</div>
                </div>
              </li>
          )}
          </ul>
        </div>
      }
    </div>);

}

/* ─────────────── APP ─────────────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [activeTab, setActiveTab] = useState(t.activeTab);
  const [transcriptMode, setTranscriptMode] = useState(t.transcriptMode);
  const [grammarOpen, setGrammarOpen] = useState(t.grammarOpen);

  useEffect(() => {setActiveTab(t.activeTab);}, [t.activeTab]);
  useEffect(() => {setTranscriptMode(t.transcriptMode);}, [t.transcriptMode]);
  useEffect(() => {setGrammarOpen(t.grammarOpen);}, [t.grammarOpen]);

  // pronunciation average for tab badge
  const pronAvg = useMemo(() => {
    const s = PRON_SENTENCES.map((r) => applyBand(r.base, t.band));
    return Math.round(s.reduce((a, b) => a + b, 0) / s.length);
  }, [t.band]);

  const styleVars = {
    '--primary': t.primary,
    '--primary-600': shade(t.primary, -0.10),
    '--primary-700': shade(t.primary, -0.18),
    '--focus-ring': hexA(t.primary, 0.18),
    '--primary-tint': hexA(t.primary, 0.08),
    '--primary-tint-2': hexA(t.primary, 0.20)
  };

  return (
    <div className="app" style={styleVars}>
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div className="breadcrumb">
            <span>My Reports</span>
            <span className="sep">/</span>
            <span className="now">{SESSION.date}</span>
          </div>
          <div className="top-actions">
            <button className="top-btn"><IconHelp size={15} /> Help</button>
            <button className="top-btn" aria-label="Notifications" style={{ width: 34, justifyContent: 'center', padding: 0 }}>
              <IconBell size={16} />
            </button>
          </div>
        </div>

        <div className="page">
          <PageHead />
          <div className="tabs-strip" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'speaking'}
              className={`tab ${activeTab === 'speaking' ? 'on' : ''}`}
              onClick={() => {setActiveTab('speaking');setTweak('activeTab', 'speaking');}}>
              
              <span className="ico"><IconMessage size={16} /></span>
              Speaking Session
              <span className="count">{TRANSCRIPT.length} TURNS</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'pronunciation'}
              className={`tab ${activeTab === 'pronunciation' ? 'on' : ''}`}
              onClick={() => {setActiveTab('pronunciation');setTweak('activeTab', 'pronunciation');}}>
              
              <span className="ico"><IconMic size={16} /></span>
              Pronunciation Assessment
              <span className="count">10 · AVG {pronAvg}</span>
            </button>
          </div>

          {activeTab === 'speaking' &&
          <SpeakingPanel
            mode={transcriptMode}
            setMode={(v) => {setTranscriptMode(v);setTweak('transcriptMode', v);}}
            grammarOpen={grammarOpen}
            setGrammarOpen={(v) => {setGrammarOpen(v);setTweak('grammarOpen', v);}}
            band={t.band} />

          }
          {activeTab === 'pronunciation' &&
          <PronunciationPanel band={t.band} />
          }

          <div className="report-foot">
            <div className="copy">
              <b>Keep practicing.</b> Your next session is scheduled for <b>May 21</b>. Review your grammar notes above before then.
            </div>
            <div className="actions">
              <button className="btn btn-outline">
                <IconDownload size={14} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor
          label="Primary blue"
          value={t.primary}
          options={PRIMARY_OPTIONS}
          onChange={(v) => setTweak('primary', v)} />
        
        <TweakSection label="View" />
        <TweakRadio
          label="Active tab"
          value={t.activeTab}
          options={[
          { value: 'speaking', label: 'Speaking' },
          { value: 'pronunciation', label: 'Pronunciation' }]
          }
          onChange={(v) => setTweak('activeTab', v)} />
        
        <TweakSection label="Preview state" />
        <TweakRadio
          label="Score band"
          value={t.band}
          options={[
          { value: 'strong', label: 'Strong' },
          { value: 'current', label: 'Current' },
          { value: 'weak', label: 'Weak' }]
          }
          onChange={(v) => setTweak('band', v)} />
        
        <TweakRadio
          label="Transcript"
          value={t.transcriptMode}
          options={[
          { value: 'full', label: 'Full' },
          { value: 'highlights', label: 'Highlights' }]
          }
          onChange={(v) => setTweak('transcriptMode', v)} />
        
        <TweakToggle
          label="Grammar Notes expanded"
          value={t.grammarOpen}
          onChange={(v) => setTweak('grammarOpen', v)} />
        
      </TweaksPanel>
    </div>);

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
    b: parseInt(h.slice(4, 6), 16)
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);