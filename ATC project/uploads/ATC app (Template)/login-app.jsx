const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "pattern": "kmark",
  "primary": "#2563eb",
  "navy": "#0f172a",
  "platformName": "SpeakIQ",
  "tagline": "AI-powered English coaching for every session.",
  "showFeatures": true,
  "demoState": "idle"
}/*EDITMODE-END*/;

const NAVY_OPTIONS = ['#0a1126', '#0f172a', '#11244a', '#0b1f3c'];
const PRIMARY_OPTIONS = ['#2563eb', '#1d4ed8', '#1f6feb', '#3b6cf6'];

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a18.55 18.55 0 0 1 4.21-5.04"/>
      <path d="M9.9 5.08A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.16 4.19"/>
      <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.7-3.9 2.7-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.97 10.72A5.4 5.4 0 0 1 3.67 9c0-.6.1-1.18.3-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 5.2 L4 7.5 L8.5 2.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TickIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 5.2 L4 7.5 L8.5 2.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5 L6 7.5 L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 4.5 V 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="0.9" fill="currentColor"/>
    </svg>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [remember, setRem]    = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Demo state preview from Tweaks
  useEffect(() => {
    if (t.demoState === 'loading') { setLoading(true); setError(null); }
    else if (t.demoState === 'error') {
      setLoading(false);
      setError("We couldn't sign you in with those credentials.");
    } else {
      setLoading(false); setError(null);
    }
  }, [t.demoState]);

  const emailInvalid = touched.email && email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function submit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Fake error pathway
      if (password === 'wrong') {
        setError("We couldn't sign you in with those credentials.");
      } else {
        setError(null);
      }
    }, 1400);
  }

  // Apply CSS variable overrides from tweaks
  const styleVars = {
    '--primary': t.primary,
    '--primary-600': shade(t.primary, -0.10),
    '--primary-700': shade(t.primary, -0.18),
    '--focus-ring': hexA(t.primary, 0.18),
    '--navy-1': t.navy,
  };

  return (
    <div className="shell" style={styleVars}>
      {/* ─── LEFT: Brand ─── */}
      <aside className="brand" style={{ background: t.navy }}>
        <Pattern kind={t.pattern} />
        <div className="vignette" />

        <div className="brand-top">
          <div className="logo">
            <div className="logo-mark" aria-hidden="true">K</div>
            <div className="logo-wordmark">
              Hanoi K-Lab<span className="dot">·</span>{t.platformName}
            </div>
          </div>
          <div className="brand-meta">
            <b>v 2.4</b> &nbsp; · &nbsp; Hanoi, VN
          </div>
        </div>

        <div className="brand-body">
          <div className="eyebrow">English Coaching Platform</div>
          <h2 className="platform-name">
            Speak<span className="iq">IQ</span>.
          </h2>
          <p className="tagline">{t.tagline}</p>

          {t.showFeatures && (
            <div className="feature-grid">
              {[
                'Live AI feedback during every lesson',
                'IELTS-aligned speaking rubric',
                'Teacher dashboards & progress reports',
                'For students, teachers & admins'
              ].map((txt, i) => (
                <div className="feature" key={i}>
                  <span className="tick"><TickIcon /></span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="brand-foot">
          <span className="pill">
            <span className="dot" />
            All systems operational
          </span>
          <span>© 2026 Hanoi K-Lab Education Center</span>
        </div>
      </aside>

      {/* ─── RIGHT: Form ─── */}
      <main className="form-pane">
        <div className="form-top">
          <button className="lang-switch" type="button">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1.5 8 H 14.5 M 8 1.5 C 10.5 4 10.5 12 8 14.5 M 8 1.5 C 5.5 4 5.5 12 8 14.5" stroke="currentColor" strokeWidth="1.1" fill="none"/>
            </svg>
            English (US)
            <ChevronDown />
          </button>
        </div>

        <div className="form-wrap">
          <form className="form" onSubmit={submit} noValidate>
            <h1>Welcome back</h1>
            <p className="sub">Sign in to continue to your SpeakIQ dashboard.</p>

            {error && (
              <div className="alert" role="alert">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`input ${emailInvalid ? 'error' : ''}`}
                  placeholder="you@k-lab.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                />
              </div>
              {emailInvalid && (
                <div className="field-hint"><AlertIcon /> Please enter a valid email address.</div>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input has-toggle"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-eye"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw((v) => !v)}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div className="row-between">
              <label className="checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRem(e.target.checked)} />
                <span className="box"><CheckIcon /></span>
                Keep me signed in
              </label>
              <a href="#" className="link">Forgot password?</a>
            </div>

            <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} style={{ position: 'relative' }}>
              {loading && <span className="spinner" />}
              Sign in
            </button>

            <div className="divider">or continue with</div>

            <button type="button" className="btn btn-outline">
              <GoogleIcon />
              Sign in with Google
            </button>

            <div className="form-foot">
              Don't have an account? <span className="accent">Contact your administrator.</span>
            </div>
          </form>
        </div>

        <div className="legal">
          <span>Hanoi K-Lab · Internal Platform</span>
          <span className="right">
            <a href="#">Privacy</a>
            <span className="sep" />
            <a href="#">Terms</a>
            <span className="sep" />
            <a href="#">Help</a>
          </span>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand panel" />
        <TweakSelect
          label="Pattern"
          value={t.pattern}
          options={[
            { value: 'kmark', label: 'K mark (default)' },
            { value: 'grid',  label: 'Fine grid' },
            { value: 'dots',  label: 'Dot field' },
            { value: 'arcs',  label: 'Concentric arcs' },
            { value: 'lines', label: 'Diagonal lines' },
            { value: 'solid', label: 'Solid (no pattern)' },
          ]}
          onChange={(v) => setTweak('pattern', v)}
        />
        <TweakColor
          label="Brand background"
          value={t.navy}
          options={NAVY_OPTIONS}
          onChange={(v) => setTweak('navy', v)}
        />
        <TweakToggle
          label="Show feature list"
          value={t.showFeatures}
          onChange={(v) => setTweak('showFeatures', v)}
        />
        <TweakText
          label="Platform name"
          value={t.platformName}
          onChange={(v) => setTweak('platformName', v)}
        />
        <TweakText
          label="Tagline"
          value={t.tagline}
          onChange={(v) => setTweak('tagline', v)}
        />

        <TweakSection label="Form panel" />
        <TweakColor
          label="Primary blue"
          value={t.primary}
          options={PRIMARY_OPTIONS}
          onChange={(v) => setTweak('primary', v)}
        />
        <TweakRadio
          label="Preview state"
          value={t.demoState}
          options={[
            { value: 'idle',    label: 'Idle' },
            { value: 'loading', label: 'Loading' },
            { value: 'error',   label: 'Error' },
          ]}
          onChange={(v) => setTweak('demoState', v)}
        />
      </TweaksPanel>
    </div>
  );
}

// ─── color helpers ───
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
