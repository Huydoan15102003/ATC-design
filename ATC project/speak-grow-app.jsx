// Speak Grow Report — Session · Weekly · Monthly
const { useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{"reportType":"session"}/*EDITMODE-END*/;

/* ── GAUGE ── */
function Gauge({ score, label, delta, color, size = 130 }) {
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div className="gauge-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color}
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      </svg>
      <div className="gauge-inner">
        <div className="gauge-score">{score}</div>
        <div className="gauge-label">{label}</div>
        {delta && <div className="gauge-delta" style={{ color }}>↑ +{delta}</div>}
      </div>
    </div>
  );
}

/* ── MINI LINE CHART ── */
function LineChart({ points, color, w = 200, h = 44 }) {
  const vals = points.map(p => p.v);
  const min = Math.min(...vals) * 0.92, max = Math.max(...vals) * 1.04;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = vals.map(v => h - ((v - min) / (max - min)) * h * 0.85);
  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const areaD = pathD + ` L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={`lg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#lg-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ── SHARED HEADER ── */
function ReportHeader({ type }) {
  const badges = { session: 'POST-LESSON', weekly: 'WEEKLY', monthly: 'MONTHLY' };
  const dates = {
    session: 'Apr 18, 2026 · 14:00–15:00',
    weekly:  'Apr 13 – Apr 18, 2026 · 3 sessions',
    monthly: 'April 2026 · 12 sessions completed',
  };
  const levels = {
    session: 'Level: Intermediate (B1) · Session #24',
    weekly:  'Level: Intermediate (B1) · Sessions #22–24',
    monthly: 'Level: B1 → B1+ In Progress',
  };
  return (
    <div className="rpt-header">
      <div className="rpt-row1">
        <div>
          <div className="brand-name">Speak Grow Report</div>
          <div className="brand-sub">AI-Powered English Growth Analytics</div>
        </div>
        <div>
          <div className="student-name">Seoyeon Kim</div>
          <div className="student-meta">{levels[type]}</div>
        </div>
      </div>
      <div className="rpt-row2">
        <span className={`rpt-badge ${type}`}>{badges[type]}</span>
        <span className="rpt-teacher mono">Teacher: Michael Thompson</span>
        <span className={`rpt-date ${type}`}>{dates[type]}</span>
      </div>
    </div>
  );
}

/* ── SHARED PRONUNCIATION ── */
function PronSection({ cards, label, insight }) {
  return (
    <div className="pron-section">
      <div className="pron-top">
        <div>
          <div className="pron-brand">Pronunciation Training{label ? ` · ${label}` : ''}</div>
          <div className="pron-meta">{cards[0].sessions} · Voice waveform analysis</div>
        </div>
        <div className="pron-overall">
          <div className="pron-ovlbl">{cards[0].ovLabel}</div>
          <div className="pron-ovscore">
            <span className="n">{cards[0].overall}</span>
            <span className="d">/100</span>
            <span className="delta">↑ +{cards[0].delta}</span>
          </div>
        </div>
      </div>
      <div className="pron-cards">
        {cards[0].subs.map((s, i) => (
          <div className="pron-card" key={i}>
            <div className="pc-label">{s.label}</div>
            <div className="pc-val">{s.val}</div>
            <div className="pc-delta">↑+{s.delta}</div>
            <div className="pc-bar"><div className="pc-bar-fill" style={{ width: `${s.val}%` }} /></div>
            <div className="pc-note">{s.note}</div>
          </div>
        ))}
      </div>
      {insight && (
        <div className="pron-insight"><b style={{ color: 'rgba(255,255,255,0.65)' }}>
          {insight.label}:</b> {insight.text}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   SESSION REPORT
══════════════════════════════════════ */
function SessionReport() {
  const metrics = [
    { label: 'Speaking Speed', val: '94', unit: 'wpm', delta: '↑8 vs last (86)', cls: 'blue', up: true },
    { label: 'Vocab Diversity', val: '0.68', unit: 'ttr', delta: '↑0.04  142 unique', cls: 'purple', up: true },
    { label: 'Grammar Accuracy', val: '88', unit: '%', delta: '↑6%  7 err / 58 sent', cls: 'green', up: true },
    { label: 'Filler Words', val: '12', unit: '', delta: '↓5 um / like / y\'know', cls: 'amber', up: false },
  ];
  const errors = [
    { tag: 'Article', tagCls: 'art', wrong: 'went to a hospital', fix: 'the hospital', cnt: 3 },
    { tag: 'Preposition', tagCls: 'pre', wrong: 'arrived to office', fix: 'arrived at', cnt: 2 },
    { tag: 'Subj-Verb', tagCls: 'sv', wrong: 'Everyone have', fix: 'Everyone has', cnt: 1 },
    { tag: 'Self-Fix ✓', tagCls: 'sf', wrong: 'I goed', fix: 'I went', cnt: 3 },
  ];
  const vocab = [
    { w: 'sustainable', t: 'new' }, { w: 'compromise', t: 'adv' }, { w: 'substantial', t: 'adv' },
    { w: 'nevertheless', t: 'adv' }, { w: 'perspective', t: 'freq' }, { w: 'circumstances', t: 'freq' },
    { w: 'actually', t: 'freq' }, { w: 'basically', t: 'freq' }, { w: 'important', t: 'basic' },
    { w: 'think', t: 'basic' }, { w: 'good', t: 'basic' }, { w: 'make', t: 'basic' },
  ];
  const pronData = [{
    sessions: '10-min focused practice', ovLabel: 'Overall', overall: 82, delta: 4,
    subs: [
      { label: 'Phoneme\nAccuracy', val: 85, delta: 3, note: 'R/L: fair\nTH/V: good' },
      { label: 'Intonation\n& Stress', val: 78, delta: 2, note: 'Question rise\nneeds practice' },
      { label: 'Rhythm\n& Pacing', val: 80, delta: 5, note: 'Weak forms\nimproving' },
      { label: 'Fluency\n& Smoothness', val: 84, delta: 3, note: 'Minimal\nhesitation' },
    ],
  }];
  return (
    <div className="rpt-body">
      {/* HERO */}
      <div className="hero-card session">
        <Gauge score={78} label="Overall" delta={5} color="#0CB4A2" />
        <div className="hero-text">
          <h2>Today's Summary</h2>
          <p>Your grammar accuracy improved significantly today, especially with past tense usage, which was very stable. Articles (a/the) still need practice, but your total speaking output grew by 15% compared to last session — a strong sign of growing confidence.</p>
          <div className="hero-pills">
            <span className="hero-pill teal">✓ Talk time target achieved</span>
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="metric-grid">
        {metrics.map((m, i) => (
          <div key={i} className={`metric-card ${m.cls}`}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-val">{m.val}{m.unit && <span className="unit">{m.unit}</span>}</div>
            <div className={`metric-delta ${m.up ? 'up' : 'dn'}`}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* TALK TIME */}
      <div className="talk-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="sec-head" style={{ margin: 0 }}>
            <span className="bar teal" /><span>Talk Time Distribution</span>
          </div>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.06em' }}>
            40-MIN CONVERSATION · STT ANALYSIS
          </span>
        </div>
        <div className="talk-bar">
          <div className="talk-seg stu" style={{ width: '62%' }}>Student · 62%</div>
          <div className="talk-seg tch">Teacher · 38%</div>
        </div>
        <div className="talk-footer">
          <span>Target: Student ≥ 60%</span>
          <span className="talk-achieved">✓ Achieved</span>
        </div>
      </div>

      {/* GRAMMAR + VOCAB */}
      <div className="two-col" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="sec-head"><span className="bar teal" />Grammar Error Analysis</div>
          <div className="err-rows">
            {errors.map((e, i) => (
              <div key={i} className="err-row">
                <span className={`err-tag ${e.tagCls}`}>{e.tag}</span>
                <div className="err-example">
                  <span className="err-strike">{e.wrong}</span>
                  <span className="err-arrow"> → </span>
                  <span className="err-fix">{e.fix}</span>
                </div>
                <span className="err-cnt">{e.cnt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="sec-head"><span className="bar teal" />Key Vocabulary Used</div>
          <div className="vocab-pills">
            {vocab.map((v, i) => (
              <span key={i} className={`v-pill ${v.t}`}>{v.w}</span>
            ))}
          </div>
          <div className="vocab-legend">
            <span className="vleg"><span className="dot g" />New</span>
            <span className="vleg"><span className="dot p" />Advanced</span>
            <span className="vleg"><span className="dot b" />Frequent</span>
            <span className="vleg"><span className="dot x" />Basic</span>
          </div>
        </div>
      </div>

      {/* TIPS */}
      <div className="sec-head" style={{ marginTop: 20 }}><span className="bar teal" />AI-Personalized Learning Tips</div>
      <div className="tips">
        {[
          { title: 'Focus on Articles (the / a / an)', body: 'You repeatedly omit articles before specific places (the hospital, the office). Review article rules before your next session — especially with definite nouns.' },
          { title: 'Try Complex Sentence Structures', body: 'To boost your speaking complexity, try using concessive clauses like "Although…", "Even though…", or "While…" to connect your ideas.' },
        ].map((t, i) => (
          <div key={i} className="tip-card">
            <div className="tip-num">{i + 1}</div>
            <div><div className="tip-title">{t.title}</div><div className="tip-body">{t.body}</div></div>
          </div>
        ))}
      </div>

      <PronSection cards={pronData}
        insight={{ label: 'Top focus', text: 'Korean-speaker patterns detected — add vowel sounds at word endings ("book-uh" → "book"), and sharpen the /r/–/l/ distinction in words like "really" and "lately". Continue practicing rising intonation in yes/no questions.' }} />
    </div>
  );
}

/* ══════════════════════════════════════
   WEEKLY REPORT
══════════════════════════════════════ */
function WeeklyReport() {
  const days = [
    { day: 'Mon', score: 73, cls: 'active' },
    { day: 'Tue', score: null, cls: 'inactive' },
    { day: 'Wed', score: 76, cls: 'active' },
    { day: 'Thu', score: null, cls: 'inactive' },
    { day: 'Fri', score: 78, cls: 'best', star: true },
  ];
  const maxScore = 78;
  const wmetrics = [
    { name: 'Average WPM',         old: '91',   nw: '94',   pct: 94,  color: '#4F6EF5', up: true },
    { name: 'Grammar Accuracy',    old: '82%',  nw: '88%',  pct: 88,  color: '#12C88A', up: true },
    { name: 'Vocab Diversity (TTR)',old: '0.63', nw: '0.68', pct: 68,  color: '#8B5CF6', up: true },
    { name: 'Avg. Talk Time',      old: '55%',  nw: '62%',  pct: 62,  color: '#0CB4A2', up: true },
    { name: 'Filler Words / session',old:'17',  nw: '12',   pct: 12,  color: '#F59E0B', up: false },
  ];
  const werrors = [
    { type: 'Article',    thisWk: 8,  lastWk: 11, trend: 'Improving', tCls: 'imp',    tag: 'art' },
    { type: 'Preposition',thisWk: 5,  lastWk: 4,  trend: 'Watch',     tCls: 'watch',  tag: 'pre' },
    { type: 'Tense',      thisWk: 2,  lastWk: 6,  trend: 'Strong gain',tCls: 'strong', tag: 'sv' },
    { type: 'Self-Fix',   thisWk: 9,  lastWk: 5,  trend: 'Great sign', tCls: 'great',  tag: 'sf' },
  ];
  const newVocab = ['sustainable','compromise','substantial','demographics','initiative','proportion','notwithstanding','leverage','paradigm','trajectory','benchmark','consolidate','streamline','mitigate'];
  const pronData = [{
    sessions: '3 sessions', ovLabel: 'Weekly Avg', overall: 80, delta: 5,
    subs: [
      { label: 'Phoneme\nAccuracy', val: 83, delta: 4, note: 'R/L distinction improving\nTH sound stable' },
      { label: 'Intonation\n& Stress', val: 76, delta: 3, note: 'Statement falls: good\nQuestion rise: needs work' },
      { label: 'Rhythm\n& Pacing', val: 79, delta: 7, note: 'Biggest gain this week\nWeak forms emerging' },
      { label: 'Fluency\n& Smoothness', val: 82, delta: 6, note: 'Fewer mid-sentence pauses\nChunking improving' },
    ],
  }];
  return (
    <div className="rpt-body">
      {/* HERO */}
      <div className="hero-card weekly">
        <Gauge score={76} label="Weekly Avg" delta={4} color="#12C88A" />
        <div className="hero-text">
          <h2>This Week's Summary</h2>
          <p>Across 3 sessions this week, your fluency stabilized noticeably, and your grammar error rate dropped 5% compared to last week. Consistency in past tense usage showed the most visible improvement.</p>
          <div className="hero-pills">
            <span className="hero-pill green">+27% fewer errors</span>
            <span className="hero-pill green">+14 new words</span>
          </div>
        </div>
      </div>

      {/* DAILY BARS + WEEKLY METRICS */}
      <div className="two-col">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="sec-head" style={{ margin: 0 }}><span className="bar teal" />Daily Session Scores</div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>CONVERSATION · STT</span>
          </div>
          <div className="day-bars">
            {days.map((d, i) => (
              <div key={i} className="day-col">
                {d.score ? <div className="day-score">{d.score}{d.star && ' ⭐'}</div> : <div style={{ height: 18 }} />}
                <div className="day-bar-wrap">
                  <div className={`day-bar ${d.cls}`}
                    style={{ height: d.score ? `${(d.score / maxScore) * 76}px` : '8px' }} />
                </div>
                <div className="day-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="sec-head"><span className="bar teal" />Weekly Key Metrics</div>
          <div className="wmetric-rows">
            {wmetrics.map((m, i) => (
              <div key={i} className="wmetric-row">
                <div>
                  <div className="wmetric-name">{m.name}</div>
                  <div className="wmetric-bar-wrap">
                    <div className="wmetric-bar" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
                <div className="wmetric-vals">
                  <span className="wmetric-old">{m.old}</span>
                  <span style={{ color: 'var(--muted-2)' }}>→ </span>
                  <span className="wmetric-new" style={{ color: m.color }}>{m.nw}</span>
                  <span className={`wmetric-arrow ${m.up ? 'up' : 'dn'}`}>{m.up ? '▲' : '▼'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ERRORS + VOCAB */}
      <div className="two-col" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="sec-head"><span className="bar teal" />Recurring Error Patterns</div>
          <table className="werr-table">
            <thead>
              <tr>
                <th>Error Type</th><th>This Wk</th><th>Last Wk</th><th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {werrors.map((e, i) => (
                <tr key={i}>
                  <td><span className={`err-tag ${e.tag}`}>{e.type}</span></td>
                  <td>{e.thisWk}</td>
                  <td>{e.lastWk}</td>
                  <td><span className={`trend-pill ${e.tCls}`}>{e.tCls === 'imp' || e.tCls === 'strong' || e.tCls === 'great' ? '↓' : '↑'} {e.trend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="sec-head"><span className="bar teal" />New Vocabulary (+14)</div>
          <div className="vocab-pills">
            {newVocab.slice(0, 7).map((w, i) => <span key={i} className="v-pill new">{w}</span>)}
            {newVocab.slice(7).map((w, i) => <span key={i} className="v-pill adv">{w}</span>)}
          </div>
          <div className="vocab-legend" style={{ marginTop: 12 }}>
            <span className="vleg"><span className="dot g" />New word</span>
            <span className="vleg"><span className="dot p" />Advanced (B2+)</span>
          </div>
        </div>
      </div>

      {/* GOALS */}
      <div className="sec-head" style={{ marginTop: 20 }}><span className="bar teal" />Goals for Next Week</div>
      <div className="tips">
        {[
          { title: 'Focus on Prepositions (in / at / on)', body: 'Preposition errors increased slightly this week. Try memorizing 10 common verb + preposition collocations like "arrive at," "depend on," and "interested in."' },
          { title: 'Practice New Words in Sentences', body: 'Make one original sentence for each of the 14 new words learned this week. "Leverage" and "mitigate" work especially well in business contexts.' },
        ].map((t, i) => (
          <div key={i} className="tip-card weekly">
            <div className="tip-num">{i + 1}</div>
            <div><div className="tip-title">{t.title}</div><div className="tip-body">{t.body}</div></div>
          </div>
        ))}
      </div>

      <PronSection cards={pronData} label="Weekly Average"
        insight={{ label: 'Weekly insight', text: 'Rhythm and fluency showed the strongest gains — you\'re starting to group words into natural phrases instead of reading word-by-word. Continue practicing rising intonation for yes/no questions; this remains the weakest area.' }} />
    </div>
  );
}

/* ══════════════════════════════════════
   MONTHLY REPORT
══════════════════════════════════════ */
function MonthlyReport() {
  const monthCards = [
    { mon: 'Feb', score: 62, active: false },
    { mon: 'Mar', score: 68, active: false },
    { mon: 'Apr', score: 77, active: true },
  ];
  const mtrends = [
    { label: 'Speaking Speed (WPM)', val: '94', delta: '+22', color: '#4F6EF5', pts: [{ v: 72 }, { v: 80 }, { v: 88 }, { v: 94 }] },
    { label: 'Grammar Accuracy',     val: '88%', delta: '+16%', color: '#12C88A', pts: [{ v: 72 }, { v: 76 }, { v: 84 }, { v: 88 }] },
    { label: 'Vocabulary Diversity (TTR)', val: '0.68', delta: '+0.13', color: '#8B5CF6', pts: [{ v: 55 }, { v: 60 }, { v: 64 }, { v: 68 }] },
    { label: 'Cumulative New Vocab',  val: '47', delta: '+14 mk', color: '#F97316', pts: [{ v: 12 }, { v: 24 }, { v: 33 }, { v: 47 }] },
  ];
  const errBars = [
    { wk: 'Week 1', cnt: 18, color: '#EF4444' },
    { wk: 'Week 2', cnt: 14, color: '#F97316' },
    { wk: 'Week 3', cnt: 10, color: '#F59E0B' },
    { wk: 'Week 4', cnt: 7,  color: '#12C88A' },
  ];
  const maxErr = 18;
  const pronData = [{
    sessions: '12 sessions', ovLabel: 'Monthly Avg', overall: 79, delta: 12,
    subs: [
      { label: 'Phoneme\nAccuracy', val: 82, delta: 10, note: 'R/L: much improved\nTH/V: stable' },
      { label: 'Intonation\n& Stress', val: 74, delta: 8, note: 'Question rise\nweakest area' },
      { label: 'Rhythm\n& Pacing', val: 78, delta: 15, note: 'Biggest monthly\ngain' },
      { label: 'Fluency\n& Smoothness', val: 81, delta: 13, note: 'Fewer hesitations\nchunking natural' },
    ],
  }];
  return (
    <div className="rpt-body">
      {/* HERO */}
      <div className="hero-card monthly">
        <Gauge score={77} label="Monthly Avg" delta={9} color="#8B5CF6" />
        <div className="hero-text">
          <h2>April Summary</h2>
          <p>Your overall score climbed steadily throughout April. Grammar accuracy and fluency showed the biggest gains, and you're starting to use more B2-level vocabulary. A clear acceleration in your learning trajectory.</p>
          <div className="hero-pills">
            <span className="hero-pill purple">+9 vs March</span>
            <span className="hero-pill purple">47 new words</span>
            <span className="hero-pill purple">62% to B2</span>
          </div>
        </div>
      </div>

      {/* 3-MONTH COMPARE */}
      <div className="month-compare">
        {monthCards.map((m, i) => (
          <div key={i} className={`month-card${m.active ? ' active' : ''}`}>
            <div className="month-lbl">{m.mon}</div>
            <div className="month-score">{m.score}</div>
            <div className="month-sub">Avg score</div>
          </div>
        ))}
        <div className="month-card gain">
          <div className="month-lbl">Growth</div>
          <div className="month-score">+15 pts</div>
          <div className="month-sub">Over 3 months</div>
        </div>
      </div>

      {/* METRIC TRENDS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="sec-head" style={{ margin: 0 }}><span className="bar purple" />Monthly Key Metric Trends</div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>CONVERSATION · STT</span>
      </div>
      <div className="metric-charts" style={{ marginBottom: 20 }}>
        {mtrends.map((m, i) => (
          <div key={i} className="mchart-card">
            <div className="mchart-label">{m.label}</div>
            <div className="mchart-val">
              {m.val}
              <span className={`mchart-delta up`} style={{ color: m.color }}>{m.delta}</span>
            </div>
            <LineChart points={m.pts} color={m.color} w={260} h={44} />
          </div>
        ))}
      </div>

      {/* CEFR + ERROR REDUCTION */}
      <div className="two-col">
        <div className="card">
          <div className="sec-head"><span className="bar purple" />CEFR Level Progress</div>
          <div className="cefr-wrap">
            <div className="cefr-labels">
              {['A1','A2','B1','B2','C1','C2'].map(l => (
                <span key={l} className={`cefr-lbl${l === 'B1' ? ' current' : ''}`}>{l}</span>
              ))}
            </div>
            <div className="cefr-track">
              <div className="cefr-fill" style={{ width: '62%' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13, fontWeight: 600, color: '#8B5CF6' }}>62%</div>
            <div className="cefr-note">Estimated B2 arrival at current pace: <b>~2.5 months</b></div>
          </div>
        </div>
        <div className="card">
          <div className="sec-head"><span className="bar purple" />Monthly Error Reduction</div>
          <div className="err-bars">
            {errBars.map((b, i) => (
              <div key={i} className="err-bar-col">
                <div className="err-bar-val">{b.cnt}</div>
                <div className="err-bar-rect"
                  style={{ height: `${(b.cnt / maxErr) * 72}px`, background: b.color }} />
                <div className="err-bar-lbl">{b.wk}</div>
              </div>
            ))}
          </div>
          <div className="err-bar-note">Avg. errors per session · ↓61% over the month</div>
        </div>
      </div>

      {/* OVERALL ASSESSMENT */}
      <div className="sec-head" style={{ marginTop: 20 }}><span className="bar purple" />Overall Assessment & May Goals</div>
      <div className="assess-cards">
        {[
          { ico: '✓', cls: 'ok',   title: 'This Month\'s Achievements', body: 'Grammar accuracy jumped from 72% to 88%. Past tense and present perfect usage have stabilized. Speaking volume and engagement grew significantly, and improved self-correction shows rising learner autonomy.' },
          { ico: 'i', cls: 'warn', title: 'Areas for Improvement', body: 'Articles and prepositions still show recurring errors. Sentence complexity (subordinate clauses and compound sentences) remains relatively low, with a tendency toward simple sentence patterns.' },
          { ico: '→', cls: 'goal', title: 'Goals for May', body: '① Practice compound sentences using relative pronouns (who, which, that) ② Use opinion + reasoning structure in discussions ③ Actively use 20+ B2-level vocabulary ④ Reduce filler words to under 10 per session' },
        ].map((a, i) => (
          <div key={i} className="assess-card">
            <div className={`assess-ico ${a.cls}`}>{a.ico}</div>
            <div><div className="assess-title">{a.title}</div><div className="assess-body">{a.body}</div></div>
          </div>
        ))}
      </div>

      <PronSection cards={pronData} label="Monthly Average"
        insight={{ label: 'April pronunciation insight', text: 'Rhythm and fluency improved the most (+15 and +13 pts), reflecting your growing habit of phrasing words in natural chunks. Intonation on yes/no questions remains your biggest target for May — consider shadowing native audio 5 minutes daily to lock in the rising pattern.' }} />
    </div>
  );
}

/* ══════════════════════════════════════
   APP
══════════════════════════════════════ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [type, setType] = React.useState(t.reportType || 'session');

  const setReport = v => { setType(v); setTweak('reportType', v); };

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Switcher */}
      <div className="report-switcher">
        {[['session','Post-lesson'],['weekly','Weekly'],['monthly','Monthly']].map(([v, label]) => (
          <button key={v} className={`rs-btn${type === v ? ` on ${v}` : ''}`} onClick={() => setReport(v)}>
            {label}
          </button>
        ))}
      </div>

      <div className="shell">
        <ReportHeader type={type} />
        {type === 'session' && <SessionReport />}
        {type === 'weekly'  && <WeeklyReport />}
        {type === 'monthly' && <MonthlyReport />}
      </div>

      <TweaksPanel>
        <TweakSection label="Report type" />
        <TweakSelect label="Report"
          value={type}
          options={[{value:'session',label:'Post-lesson'},{value:'weekly',label:'Weekly'},{value:'monthly',label:'Monthly'}]}
          onChange={v => setReport(v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
